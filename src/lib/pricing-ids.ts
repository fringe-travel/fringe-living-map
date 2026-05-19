// Map region slug -> Paddle external price IDs (legacy region passes, kept for back-compat).
const REGION_PRICES: Record<string, { day: string; month: string }> = {
  boracay: { day: "boracay_day", month: "boracay_month" },
  rio: { day: "rio_day", month: "rio_month" },
  "hood-river": { day: "hood_river_day", month: "hood_river_month" },
};

export function getRegionPriceIds(slug: string) {
  return REGION_PRICES[slug];
}

export const GLOBAL_MONTH_PRICE_ID = "global_month";

// ── New launch monetization ─────────────────────────────────────────────────
// Shaka tipping, fixed $2/Shaka headline, sold in packs that top up a wallet.
// Buyers send Shakas one tap at a time from their balance, no Stripe fee per tip.
export const SHAKA_PACKS = [
  { priceId: "shaka_pack_5", shakas: 5, priceCents: 1000, label: "5 Shakas", tagline: "$2.00 each" },
  { priceId: "shaka_pack_15", shakas: 15, priceCents: 2500, label: "15 Shakas", tagline: "$1.67 each" },
  { priceId: "shaka_pack_50", shakas: 50, priceCents: 7500, label: "50 Shakas", tagline: "$1.50 each, best value" },
] as const;

export type ShakaPack = (typeof SHAKA_PACKS)[number];

// Legacy export, no longer the single tip price. Kept so old imports don't break.
export const SHAKA_PRICE_ID = SHAKA_PACKS[0].priceId;

// Founding Member Pass, one-time $100, limited to first 2,000
export const FOUNDING_MEMBER_PRICE_ID = "founding_member_pass";

// Request a Vibe, ask for a fresh signal from a spot
export const VIBE_REQUEST_PRICE_IDS = {
  basic: "vibe_request_basic",
  priority: "vibe_request_priority",
  custom: "vibe_request_custom",
} as const;

// Support a Region, monthly community support
export const REGION_SUPPORT_PRICE_IDS = {
  supporter: "region_support_supporter",
  backer: "region_support_backer",
  patron: "region_support_patron",
} as const;
