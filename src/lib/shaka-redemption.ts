// Shared rules for spending Shakas against a purchase.
// Imported by both the server (validation, coupon amount, webhook crediting)
// and the client (slider math, eligibility check).

export const SHAKA_VALUE_CENTS = 25; // 1 Shaka = $0.25 of credit

// Price IDs that accept Shakas. Founding Member is excluded — it's the entry
// point that earns Shakas. Shaka packs are excluded — can't pay for Shakas
// with Shakas.
export const SHAKA_REDEEMABLE_PRICE_IDS = new Set<string>([
  // Region day passes
  "boracay_day",
  "rio_day",
  "hood_river_day",
  // Region monthly passes
  "boracay_month",
  "rio_month",
  "hood_river_month",
  // Global
  "global_month",
  // Vibe requests
  "vibe_request_basic",
  "vibe_request_priority",
  "vibe_request_custom",
]);

// Only one-time purchases can be fully unlocked with Shakas (no Stripe).
// Subscriptions must always go through Stripe so the recurring charge exists.
export const SHAKA_FULL_UNLOCK_PRICE_IDS = new Set<string>([
  "boracay_day",
  "rio_day",
  "hood_river_day",
  "vibe_request_basic",
  "vibe_request_priority",
  "vibe_request_custom",
]);

export function isShakaRedeemable(priceId: string): boolean {
  return SHAKA_REDEEMABLE_PRICE_IDS.has(priceId);
}

export function isShakaFullUnlockable(priceId: string): boolean {
  return SHAKA_FULL_UNLOCK_PRICE_IDS.has(priceId);
}

/** Max Shakas usable against a given price (cents), capped to balance. */
export function maxRedeemable(priceCents: number, balance: number): number {
  const byPrice = Math.floor(priceCents / SHAKA_VALUE_CENTS);
  return Math.max(0, Math.min(byPrice, balance));
}

export function shakasToDollars(shakas: number): number {
  return (shakas * SHAKA_VALUE_CENTS) / 100;
}
