// Map region slug -> Paddle external price IDs (created via batch_create_product)
const REGION_PRICES: Record<string, { day: string; month: string }> = {
  boracay: { day: "boracay_day", month: "boracay_month" },
  rio: { day: "rio_day", month: "rio_month" },
  "hood-river": { day: "hood_river_day", month: "hood_river_month" },
};

export function getRegionPriceIds(slug: string) {
  return REGION_PRICES[slug];
}

export const GLOBAL_MONTH_PRICE_ID = "global_month";
