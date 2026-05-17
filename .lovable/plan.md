
# FRiNGE Redesign Plan

A complete repositioning of the site around the "Living Globe" of real-time human signals, with community-driven monetization replacing the current paywall model.

## New product vocabulary (used everywhere)

- **Vibe** — a real-time human signal from a place
- **Viber** — a person sharing what's happening where they are
- **Living Globe** — the global map of live vibes
- **Fresh Signal** — a recent vibe
- **Adventure Feed** — stream of fresh vibes from followed places
- **Regions** — clusters of vibes around meaningful places

Replace existing "Unlock", "Monthly access", "Region Pass", "Global Pass" language across all pages.

## Homepage structure (rewrite `src/routes/index.tsx`)

1. **Globe Hero**
   - Headline: "Discover adventure through real people around the world."
   - Sub: "Fresh vibes captured by people on the ground — no uploads, no edits, no filters."
   - Buttons: `Explore the Globe`, `Capture a Vibe`
   - Micro line: "Real people. Real places. Fresh signals."
   - Keep existing globe/signal visual; relabel pulses as Fresh Signals.

2. **Featured Regions strip** — Boracay, Rio, Hood River as the three Living Globe access points. Each card shows: fresh signals today, featured spots, 3 recent vibes (mins ago), and soft actions: `Explore Region`, `Request a Vibe`, `Support Region`.

3. **"What makes FRiNGE different" comparison section**
   - Headline: "Social media shows what people want you to see. FRiNGE shows what is actually happening."
   - 4-column comparison: Instagram/TikTok • Google Maps • Weather apps • FRiNGE
   - Closer line: "FRiNGE is not another content app. It is a real-time window into the physical world."

4. **Adventure Feed preview** — repurpose existing signal cards as Fresh Signals with viber name + minutes ago. Each card gets a `Send a Shaka` action and `Request Similar`.

5. **Mission section**
   - "No uploads. No edits. No filters. Only delete."
   - "You can remove a moment, but you can't manufacture one."

6. **Monetization statement** (lower on page)
   - "FRiNGE is powered by the people who capture the world as it is. Support vibers, request fresh signals, or help keep a region active. Businesses and communities can partner with FRiNGE to support real-world discovery without controlling the vibe."

7. **Four-CTA footer band**: Send a Shaka • Request a Vibe • Support a Region • Partner Here

## Region pages (rewrite `src/routes/regions.$slug.tsx`)

Replace "Unlock" gating with:
- Region header with fresh signal count, active spots, last updated
- Recent vibes feed (existing `previewFeed` data, relabeled), each card: `View`, `Send Shaka`, `Request Similar`
- **Request a Vibe** block — examples ("Capture Station 1 sunset", "Check the crowd at D'Mall"), pricing: $1 basic / $3 priority / $5 custom
- **Support [Region]** block — $5 Supporter / $10 Regional Backer / $25 Signal Patron, with perks list
- **Partner Here** block — Spot Supporter $100–300/mo, Region Supporter $500–1,500/mo, Adventure Partner $2,500+/mo, with the trust line: "Partners support the signal. They do not control what people capture."
- Empty-spot CTA pattern: "No fresh signal from {spot} yet today. → Request a Vibe"
- Region footer: "Help keep {region} fresh." → `Support {region}`, `Partner Here`

## Pricing page (rewrite `src/routes/pricing.tsx`)

Replace tiers with the four launch CTAs as explained sections:
1. Send a Shaka — support a viber
2. Request a Vibe — $1 / $3 / $5 tiers
3. Support a Region — $5 / $10 / $25 monthly
4. Partner Here — Spot / Region / Adventure tiers

Note at top: subscriptions come later; today FRiNGE is community-supported.

## Components

- New `src/components/ShakaButton.tsx` — wraps `UnlockButton` with shaka emoji + "Send a Shaka" copy, uses a `shaka_tip` price.
- New `src/components/RequestVibeButton.tsx` — opens checkout for `vibe_request_basic|priority|custom`.
- New `src/components/SupportRegionCard.tsx` — three-tier support block per region.
- New `src/components/PartnerHereCard.tsx` — three-tier partner block (links to mailto for now).
- New `src/components/ComparisonSection.tsx` — the 4-column "What makes FRiNGE different".
- Update `src/components/RegionCard.tsx` to show fresh signals + 3 recent vibes + soft actions (Explore / Request / Support) — drop the Unlock button.
- Update `src/components/SiteNav.tsx` and `SiteFooter.tsx` for new vocabulary.

## Payments (Paddle)

Create a new product catalog matching the launch monetization. Keep existing region/global products in place but they're no longer surfaced in UI.

New products (one-time unless noted):
- `shaka_tip` — $3 one-time (single Send-a-Shaka default amount)
- `vibe_request_basic` — $1
- `vibe_request_priority` — $3
- `vibe_request_custom` — $5
- `support_region_supporter` — $5/month subscription
- `support_region_backer` — $10/month subscription
- `support_region_patron` — $25/month subscription

Partner tiers handled via `mailto:admin@fringe.travel` for now (high-touch sales, not self-serve).

Update `src/lib/pricing-ids.ts` to export these new IDs alongside region/global (kept for backward compat). All new buttons reuse the existing `UnlockButton` → Paddle flow (rename internally or just relabel — keep the component, just change copy where used).

## Removed / deprecated

- "Unlock" copy everywhere → replaced with Support / Request / Shaka
- Per-region day/month paywall framing on `RegionCard`
- "Region Pass" and "Global Pass" tiers from pricing page
- Locked-content gating on region pages (content was already preview-only; we keep showing it openly)

## Files to touch

- rewrite: `src/routes/index.tsx`, `src/routes/regions.$slug.tsx`, `src/routes/pricing.tsx`
- update: `src/components/RegionCard.tsx`, `src/components/SiteNav.tsx`, `src/components/SiteFooter.tsx`, `src/lib/pricing-ids.ts`
- new: `src/components/ShakaButton.tsx`, `RequestVibeButton.tsx`, `SupportRegionCard.tsx`, `PartnerHereCard.tsx`, `ComparisonSection.tsx`
- payments: create 7 new products via `payments--batch_create_product`

## Out of scope for this pass

- Backend logic to actually route Shakas to vibers (treat as a tip pool for now)
- Vibe request fulfillment flow (capture intent + payment; fulfillment is manual)
- Subscription gating logic changes (no features are gated anymore on the new homepage)
- Premium "FRiNGE Explorer / Global" tiers — deferred per your Phase 5 note
