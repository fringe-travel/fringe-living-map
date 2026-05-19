## What's broken today

1. `AuthProvider` is never mounted, so `useAuth()` is permanently `{ user: null }`. Every checkout fires without a `userId` → webhook can't link the purchase → entitlement never unlocks.
2. Most products referenced in code don't exist in Stripe (vibe requests, region support tiers, region monthly passes, global pass). Clicking those buttons throws "Price not found".
3. No UI sells the region day pass even though `useRegionAccess` checks for one.
4. `useRegionAccess` and `has_region_access` key entitlement off `product_id`, which the webhook stores as Stripe's internal `prod_xxx` — different in sandbox vs live, so even after products exist, gating would silently break after publish.
5. No `/account` page, no Stripe Customer Portal, so users can't cancel or update card.
6. Email signup uses Google OAuth via Lovable Cloud, but Google provider hasn't been confirmed enabled on Supabase.

## Plan

### 1. Create missing Stripe products
One-time:
- `vibe_request_basic` $1, `vibe_request_priority` $3, `vibe_request_custom` $5

Monthly recurring (digital service tax code):
- `region_support_supporter` $5, `region_support_backer` $10, `region_support_patron` $25 (no access grant, supporter perks only)
- `boracay_pass` $5/mo, `rio_pass` $5/mo, `hood_river_pass` $5/mo (region monthly access)
- `global_pass` $20/mo (all regions)

All tagged with tax code `txcd_10000000` so end-to-end compliance handling (Stripe Tax + filing + fraud + disputes) works.

### 2. Mount `AuthProvider`
Wrap `<Outlet />` in `__root.tsx` inside `<AuthProvider>` (inside the QueryClientProvider).

### 3. Confirm Google OAuth is enabled
Call `configure_social_auth` for Google so the AuthDialog button works.

### 4. Gate region pages with a "Get access" CTA
On each `/regions/$slug`, when `useRegionAccess(slug).hasAccess === false`, show an inline gate above the "Recent vibes" feed with three buttons:
- 24-hour pass — $3 (`<slug>_day`)
- Region monthly — $5/mo (`<slug>_pass`)
- Global pass — $20/mo (`global_pass`)

When `hasAccess === true`, show a small "Access active · expires …" badge instead.

### 5. Fix entitlement to use `price_id`, not `product_id`
- Update `useRegionAccess` to match on `price_id === 'global_pass'` and `price_id === '<slug>_pass'`.
- Migrate `has_region_access` SQL function to do the same.
- This makes entitlement stable across sandbox → live.

### 6. Add `/account` page + Stripe Customer Portal
- New server fn `createPortalSession` (protected by `requireSupabaseAuth`) that loads the latest `stripe_customer_id` for this user/env and returns `billingPortal.sessions.create({ customer, return_url }).url`.
- Wire `attachSupabaseAuth` into `src/start.ts` `functionMiddleware` so the Supabase access token is attached.
- `/account` route shows email, active subscriptions (with renewal date / cancel-at-period-end banner), active day passes, and a "Manage billing" button that opens the portal URL in a new tab.
- Add an "Account" link in `SiteNav` when signed in.

### 7. Webhook polish
- Keep `paddle_*` column names (table compatibility) but ensure subscription rows record `price_id` from `lookup_key` (already correct).
- Continue inserting `region_access` rows for known day-pass priceIds (already correct).
- No new event types needed.

### 8. Test-mode banner
Add `<PaymentTestModeBanner />` at the top of the layout so the preview clearly shows test mode.

## Test plan (in preview)

1. **Sign up flow** — Open the site → click any "Request" / "Support" / "Get pass" button → `AuthDialog` opens → create account with email/password → dialog closes → embedded Stripe checkout opens automatically.
2. **Successful payment** — Use card `4242 4242 4242 4242`, any future expiry, any CVC, any ZIP. Checkout completes → return page shows "You're in 🤙".
3. **One-time purchase (day pass)** — Buy `boracay_day` → navigate to `/regions/boracay` → access badge appears within ~2 seconds (realtime subscription on `region_access`).
4. **Subscription** — Buy `global_pass` → all three region pages show access immediately.
5. **Decline** — Use `4000 0000 0000 0002` to confirm error UX inside the checkout iframe.
6. **3D-Secure** — Use `4000 0025 0000 3155`, complete the challenge, verify access still unlocks.
7. **Account page** — `/account` shows active subscription → "Manage billing" opens Stripe portal in new tab → cancel-at-period-end → returns → `/account` shows the cancellation banner; access remains until `current_period_end`.
8. **Shaka tip + Vibe requests** — Buy each tier; no entitlement is granted (intentional) but a successful return page confirms payment.

## Technical notes

- Server functions: `createPortalSession` lives in `src/utils/payments.functions.ts`, uses `requireSupabaseAuth` middleware; portal URLs are short-lived so generated per click.
- `attachSupabaseAuth` must be added to `functionMiddleware` in `src/start.ts` or the portal call returns 401.
- Realtime channels already watch `subscriptions` and `region_access` per user, so the gate flips without a page refresh.
- Tax codes are required for managed_payments eligibility on all products — set at creation time for the new products; existing four (Shaka + day passes) already have `txcd_10000000`.
- The `subscriptions.product_id` column will still receive `prod_xxx` from Stripe — we just stop reading from it. No schema change needed.