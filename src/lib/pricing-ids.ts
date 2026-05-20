
// ── FRiNGE Membership ──────────────────────────────────────────────────────
// Single paid tier. Unlocks partner discounts worldwide and supports the
// people keeping signals honest.
export const FRINGE_MEMBERSHIP_PRICE_ID = "fringe_membership_monthly";

// ── Founding Member Pass ────────────────────────────────────────────────────
// One-time $200, limited to first 2,000. Status + 5 welcome Shakas + priority
// on everything we ship. NOT a free membership — Founding Members still
// subscribe to FRiNGE Membership for partner discounts.
export const FOUNDING_MEMBER_PRICE_ID = "founding_member_pass_200";

// ── Shakas ─────────────────────────────────────────────────────────────────
export const SHAKA_PACKS = [
  { priceId: "shaka_pack_5", shakas: 5, priceCents: 1000, label: "5 Shakas", tagline: "$2.00 each" },
  { priceId: "shaka_pack_15", shakas: 15, priceCents: 2500, label: "15 Shakas", tagline: "$1.67 each" },
  { priceId: "shaka_pack_50", shakas: 50, priceCents: 7500, label: "50 Shakas", tagline: "$1.50 each, best value" },
] as const;

export type ShakaPack = (typeof SHAKA_PACKS)[number];
export const SHAKA_PRICE_ID = SHAKA_PACKS[0].priceId;

// ── Vibe Requests ──────────────────────────────────────────────────────────
export const VIBE_REQUEST_PRICE_IDS = {
  basic: "vibe_request_basic",
  priority: "vibe_request_priority",
  custom: "vibe_request_custom",
} as const;

// ── Region Support ─────────────────────────────────────────────────────────
export const REGION_SUPPORT_PRICE_IDS = {
  supporter: "region_support_supporter",
  backer: "region_support_backer",
  patron: "region_support_patron",
} as const;
