import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { type StripeEnv, verifyWebhook, createStripeClient } from "@/lib/stripe.server";
import type { Database } from "@/integrations/supabase/types";

let _supabase: ReturnType<typeof createClient<Database>> | null = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return _supabase;
}

// Map day-pass price IDs -> region slug
const DAY_PASS_TO_REGION: Record<string, string> = {
  boracay_day: "boracay",
  rio_day: "rio",
  hood_river_day: "hood-river",
};

async function handleCheckoutCompleted(session: any, env: StripeEnv) {
  // Subscriptions are handled via customer.subscription.* events.
  if (session.mode !== "payment") return;

  const userId = session.metadata?.userId;
  if (!userId) {
    console.warn("checkout.session.completed: no userId in metadata");
    return;
  }

  // Resolve the human-readable priceId. Prefer metadata, fall back to expanding line items.
  let priceLookup: string | undefined = session.metadata?.priceId;
  if (!priceLookup) {
    const stripe = createStripeClient(env);
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      limit: 1,
      expand: ["data.price"],
    });
    const price = lineItems.data[0]?.price as any;
    priceLookup = price?.lookup_key || price?.metadata?.lovable_external_id || price?.id;
  }
  if (!priceLookup) {
    console.warn("checkout.session.completed: cannot resolve price lookup key");
    return;
  }

  const regionSlug = session.metadata?.regionSlug || DAY_PASS_TO_REGION[priceLookup];
  if (!regionSlug) {
    // Could be a Shaka tip or another non-region purchase — nothing to record.
    console.log("checkout.session.completed: non-region purchase", priceLookup);
    return;
  }

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  await getSupabase().from("region_access").upsert(
    {
      user_id: userId,
      region_slug: regionSlug,
      price_id: priceLookup,
      paddle_transaction_id: session.id, // column name kept for back-compat; now stores Stripe session id
      expires_at: expiresAt,
      environment: env,
    },
    { onConflict: "paddle_transaction_id" }
  );
}

async function handleSubscriptionUpsert(subscription: any, env: StripeEnv) {
  const userId = subscription.metadata?.userId;
  if (!userId) {
    console.error("subscription event: no userId in metadata");
    return;
  }
  const item = subscription.items?.data?.[0];
  const priceId =
    item?.price?.lookup_key ||
    item?.price?.metadata?.lovable_external_id ||
    item?.price?.id;
  const productId = item?.price?.product;
  const periodStart = item?.current_period_start ?? subscription.current_period_start;
  const periodEnd = item?.current_period_end ?? subscription.current_period_end;

  await getSupabase().from("subscriptions").upsert(
    {
      user_id: userId,
      paddle_subscription_id: subscription.id, // stores Stripe subscription id
      paddle_customer_id: subscription.customer, // stores Stripe customer id
      product_id: productId,
      price_id: priceId,
      status: subscription.status,
      current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
      current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      cancel_at_period_end: subscription.cancel_at_period_end || false,
      environment: env,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "paddle_subscription_id" }
  );
}

async function handleSubscriptionDeleted(subscription: any, env: StripeEnv) {
  await getSupabase()
    .from("subscriptions")
    .update({ status: "canceled", updated_at: new Date().toISOString() })
    .eq("paddle_subscription_id", subscription.id)
    .eq("environment", env);
}

async function handleWebhook(req: Request, env: StripeEnv) {
  const event = await verifyWebhook(req, env);
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object, env);
      break;
    case "customer.subscription.created":
    case "customer.subscription.updated":
      await handleSubscriptionUpsert(event.data.object, env);
      break;
    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(event.data.object, env);
      break;
    default:
      console.log("Unhandled event:", event.type);
  }
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawEnv = new URL(request.url).searchParams.get("env");
        if (rawEnv !== "sandbox" && rawEnv !== "live") {
          console.error("Webhook: invalid env query param:", rawEnv);
          return Response.json({ received: true, ignored: "invalid env" });
        }
        try {
          await handleWebhook(request, rawEnv as StripeEnv);
          return Response.json({ received: true });
        } catch (e) {
          console.error("Webhook error:", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});
