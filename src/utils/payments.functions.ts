import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { type StripeEnv, createStripeClient } from "@/lib/stripe.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import {
  SHAKA_VALUE_CENTS,
  isShakaRedeemable,
  isShakaFullUnlockable,
} from "@/lib/shaka-redemption";

let _admin: ReturnType<typeof createClient<Database>> | null = null;
function admin() {
  if (!_admin) {
    _admin = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return _admin;
}

const DAY_PASS_TO_REGION: Record<string, string> = {
  boracay_day: "boracay",
  rio_day: "rio",
  hood_river_day: "hood-river",
};

async function resolveOrCreateCustomer(
  stripe: ReturnType<typeof createStripeClient>,
  options: { email?: string; userId?: string }
): Promise<string> {
  if (options.userId && !/^[a-zA-Z0-9_-]+$/.test(options.userId)) {
    throw new Error("Invalid userId");
  }
  if (options.userId) {
    const found = await stripe.customers.search({
      query: `metadata['userId']:'${options.userId}'`,
      limit: 1,
    });
    if (found.data.length) return found.data[0].id;
  }
  if (options.email) {
    const existing = await stripe.customers.list({ email: options.email, limit: 1 });
    if (existing.data.length) {
      const customer = existing.data[0];
      if (options.userId && customer.metadata?.userId !== options.userId) {
        await stripe.customers.update(customer.id, {
          metadata: { ...customer.metadata, userId: options.userId },
        });
      }
      return customer.id;
    }
  }
  const created = await stripe.customers.create({
    ...(options.email && { email: options.email }),
    ...(options.userId && { metadata: { userId: options.userId } }),
  });
  return created.id;
}

export const createCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      priceId: string;
      quantity?: number;
      customerEmail?: string;
      userId?: string;
      returnUrl: string;
      environment: StripeEnv;
      regionSlug?: string;
      shakasToRedeem?: number;
    }) => {
      if (!/^[a-zA-Z0-9_-]+$/.test(data.priceId)) throw new Error("Invalid priceId");
      if (data.shakasToRedeem !== undefined) {
        if (!Number.isInteger(data.shakasToRedeem) || data.shakasToRedeem < 0) {
          throw new Error("Invalid shakasToRedeem");
        }
        if (data.shakasToRedeem > 0 && !data.userId) {
          throw new Error("Must be signed in to redeem Shakas");
        }
        if (data.shakasToRedeem > 0 && !isShakaRedeemable(data.priceId)) {
          throw new Error("Shakas can't be applied to this purchase");
        }
      }
      return data;
    }
  )
  .handler(async ({ data }) => {
    const stripe = createStripeClient(data.environment);

    const prices = await stripe.prices.list({ lookup_keys: [data.priceId] });
    if (!prices.data.length) throw new Error("Price not found");
    const stripePrice = prices.data[0];
    const isRecurring = stripePrice.type === "recurring";

    // Validate Shaka redemption against actual price + wallet balance
    let shakasToRedeem = data.shakasToRedeem ?? 0;
    if (shakasToRedeem > 0 && data.userId) {
      const priceCents = stripePrice.unit_amount ?? 0;
      const maxByPrice = Math.floor(priceCents / SHAKA_VALUE_CENTS);

      const { data: wallet } = await admin()
        .from("shaka_wallets")
        .select("balance")
        .eq("user_id", data.userId)
        .maybeSingle();
      const balance = wallet?.balance ?? 0;

      shakasToRedeem = Math.min(shakasToRedeem, maxByPrice, balance);
      if (shakasToRedeem <= 0) throw new Error("No Shakas available to redeem");
    }

    const customerId =
      data.customerEmail || data.userId
        ? await resolveOrCreateCustomer(stripe, {
            email: data.customerEmail,
            userId: data.userId,
          })
        : undefined;

    const sessionMetadata: Record<string, string> = {};
    if (data.userId) sessionMetadata.userId = data.userId;
    if (data.regionSlug) sessionMetadata.regionSlug = data.regionSlug;
    sessionMetadata.priceId = data.priceId;
    if (shakasToRedeem > 0) sessionMetadata.shakasRedeemed = String(shakasToRedeem);

    // One-off coupon for this session if redeeming Shakas
    let couponId: string | undefined;
    if (shakasToRedeem > 0) {
      const coupon = await stripe.coupons.create({
        amount_off: shakasToRedeem * SHAKA_VALUE_CENTS,
        currency: stripePrice.currency,
        duration: "once",
        max_redemptions: 1,
        name: `${shakasToRedeem} Shakas`,
        metadata: { userId: data.userId!, shakas: String(shakasToRedeem) },
      });
      couponId = coupon.id;
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: stripePrice.id, quantity: data.quantity || 1 }],
      mode: isRecurring ? "subscription" : "payment",
      ui_mode: "embedded_page",
      return_url: data.returnUrl,
      ...(customerId && { customer: customerId }),
      metadata: sessionMetadata,
      ...(isRecurring &&
        data.userId && { subscription_data: { metadata: { userId: data.userId } } }),
      ...(couponId && { discounts: [{ coupon: couponId }] }),
      // Full compliance handling, Stripe handles tax, fraud, disputes, and support
      // for buyers in ~80 supported countries.
      managed_payments: { enabled: true },
    } as any);

    return session.client_secret;
  });

// Pay fully with Shakas — skips Stripe entirely. One-time purchases only
// (day passes, Vibe Requests). Debits the wallet and grants access atomically.
export const unlockOneTimeWithShakas = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (data: { priceId: string; environment: StripeEnv; regionSlug?: string }) => {
      if (!/^[a-zA-Z0-9_-]+$/.test(data.priceId)) throw new Error("Invalid priceId");
      if (!isShakaFullUnlockable(data.priceId)) {
        throw new Error("This purchase can't be fully unlocked with Shakas");
      }
      return data;
    }
  )
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const stripe = createStripeClient(data.environment);
    const prices = await stripe.prices.list({ lookup_keys: [data.priceId] });
    if (!prices.data.length) throw new Error("Price not found");
    const priceCents = prices.data[0].unit_amount ?? 0;
    const shakaCost = Math.ceil(priceCents / SHAKA_VALUE_CENTS);
    if (shakaCost <= 0) throw new Error("Invalid price");

    const externalId = `shaka_unlock_${userId}_${data.priceId}_${Date.now()}`;

    const { error: redeemErr } = await admin().rpc("unlock_with_shakas", {
      p_user: userId,
      p_amount: shakaCost,
      p_price_id: data.priceId,
      p_external_id: externalId,
    });
    if (redeemErr) throw new Error(redeemErr.message);

    // Grant access. Day passes -> region_access for 24h.
    const regionSlug = data.regionSlug || DAY_PASS_TO_REGION[data.priceId];
    if (regionSlug) {
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      const { error } = await admin().from("region_access").insert({
        user_id: userId,
        region_slug: regionSlug,
        price_id: data.priceId,
        paddle_transaction_id: externalId,
        expires_at: expiresAt,
        environment: data.environment,
      });
      if (error) throw new Error(error.message);
    }

    return { ok: true, shakasSpent: shakaCost };
  });

export const createPortalSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { returnUrl?: string; environment: StripeEnv }) => data)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const stripe = createStripeClient(data.environment);

    // 1. Prefer a customer id we already saved from a subscription.
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("paddle_customer_id")
      .eq("user_id", userId)
      .eq("environment", data.environment)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    let customerId = sub?.paddle_customer_id as string | undefined;

    // 2. Fall back to Stripe customer search by userId metadata
    //    (covers one-time buyers like Founding Members & day passes).
    if (!customerId && /^[a-zA-Z0-9_-]+$/.test(userId)) {
      const found = await stripe.customers.search({
        query: `metadata['userId']:'${userId}'`,
        limit: 1,
      });
      if (found.data.length) customerId = found.data[0].id;
    }

    if (!customerId) throw new Error("No billing customer found");

    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      ...(data.returnUrl && { return_url: data.returnUrl }),
    });
    return portal.url;
  });
