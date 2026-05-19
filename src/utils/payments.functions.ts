import { createServerFn } from "@tanstack/react-start";
import { type StripeEnv, createStripeClient } from "@/lib/stripe.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

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
    }) => {
      if (!/^[a-zA-Z0-9_-]+$/.test(data.priceId)) throw new Error("Invalid priceId");
      return data;
    }
  )
  .handler(async ({ data }) => {
    const stripe = createStripeClient(data.environment);

    const prices = await stripe.prices.list({ lookup_keys: [data.priceId] });
    if (!prices.data.length) throw new Error("Price not found");
    const stripePrice = prices.data[0];
    const isRecurring = stripePrice.type === "recurring";

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

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: stripePrice.id, quantity: data.quantity || 1 }],
      mode: isRecurring ? "subscription" : "payment",
      ui_mode: "embedded_page",
      return_url: data.returnUrl,
      ...(customerId && { customer: customerId }),
      metadata: sessionMetadata,
      ...(isRecurring &&
        data.userId && { subscription_data: { metadata: { userId: data.userId } } }),
      // Full compliance handling, Stripe handles tax, fraud, disputes, and support
      // for buyers in ~80 supported countries.
      managed_payments: { enabled: true },
    } as any);

    return session.client_secret;
  });

export const createPortalSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { returnUrl?: string; environment: StripeEnv }) => data)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: sub, error: subError } = await supabase
      .from("subscriptions")
      .select("paddle_customer_id")
      .eq("user_id", userId)
      .eq("environment", data.environment)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (subError || !sub?.paddle_customer_id) throw new Error("No billing customer found");

    const stripe = createStripeClient(data.environment);
    const portal = await stripe.billingPortal.sessions.create({
      customer: sub.paddle_customer_id,
      ...(data.returnUrl && { return_url: data.returnUrl }),
    });
    return portal.url;
  });
