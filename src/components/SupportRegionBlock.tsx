import { UnlockButton } from "@/components/UnlockButton";
import { REGION_SUPPORT_PRICE_IDS } from "@/lib/pricing-ids";

const TIERS = [
  {
    key: "supporter" as const,
    label: "Supporter",
    price: "$5",
    perks: ["Supporter badge", "Favorite region alerts", "Recognition on the region page"],
  },
  {
    key: "backer" as const,
    label: "Regional Backer",
    price: "$10",
    perks: ["Everything in Supporter", "Discounted vibe requests", "Early access to new features"],
    highlight: true,
  },
  {
    key: "patron" as const,
    label: "Signal Patron",
    price: "$25",
    perks: ["Everything in Backer", "Priority vibe requests", "Direct line to local vibers"],
  },
];

type Props = { regionName: string };

export function SupportRegionBlock({ regionName }: Props) {
  return (
    <div className="rounded-3xl border border-border bg-surface p-8 md:p-10">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">Support a Region</p>
      <h3 className="mt-3 text-3xl font-extrabold tracking-tighter md:text-4xl">
        Help keep {regionName} live.
      </h3>
      <p className="mt-3 max-w-xl text-foreground/60">
        Your monthly support goes to the local vibers capturing fresh signals from {regionName}, beaches,
        food spots, sunsets, nightlife, and adventure areas.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {TIERS.map((t) => (
          <div
            key={t.key}
            className={`relative flex flex-col rounded-2xl border p-6 ${
              t.highlight ? "border-primary/40 bg-primary/5" : "border-border bg-background"
            }`}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">{t.label}</p>
            <p className="mt-2 flex items-baseline gap-1 text-4xl font-extrabold tracking-tighter">
              {t.price}
              <span className="text-sm font-medium text-foreground/50">/mo</span>
            </p>
            <ul className="my-6 flex-1 space-y-2 text-sm">
              {t.perks.map((p) => (
                <li key={p} className="flex items-start gap-2 text-foreground/80">
                  <span className="text-signal">+</span>
                  {p}
                </li>
              ))}
            </ul>
            <UnlockButton
              priceId={REGION_SUPPORT_PRICE_IDS[t.key]}
              reason={`Support ${regionName}`}
              className={`mt-auto w-full rounded-xl py-3 text-sm font-bold transition-colors disabled:opacity-60 ${
                t.highlight
                  ? "bg-primary text-primary-foreground hover:brightness-110"
                  : "border border-border bg-surface hover:bg-surface-2"
              }`}
            >
              Support {regionName}
            </UnlockButton>
          </div>
        ))}
      </div>
    </div>
  );
}
