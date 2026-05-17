import { createFileRoute, Link } from "@tanstack/react-router";
import { UnlockButton } from "@/components/UnlockButton";
import { GLOBAL_MONTH_PRICE_ID } from "@/lib/pricing-ids";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — FRiNGE" },
      { name: "description", content: "Free Preview, Region Pass from $1.99/day, or Global Pass at $9.99/month." },
      { property: "og:title", content: "Pricing — FRiNGE" },
      { property: "og:description", content: "Choose how you want to explore the signal layer of the real world." },
    ],
  }),
  component: Page,
});

const tiers = [
  {
    name: "Free Preview",
    price: "$0",
    blurb: "Good for discovering regions.",
    features: ["View public vibes", "Preview signal regions", "See limited map activity", "Browse available places"],
    cta: "Start exploring",
  },
  {
    name: "Region Pass",
    price: "$1.99",
    unit: "/day",
    blurb: "Best for travelers and locals checking one place.",
    features: ["Unlock one signal region", "Full Now Map access", "Fresh vibes", "Active spots", "Recent replays", "Local updates"],
    cta: "Choose a region",
    highlight: true,
  },
  {
    name: "Global Pass",
    price: "$9.99",
    unit: "/month",
    blurb: "Best for nomads and explorers following multiple places.",
    features: ["Unlock all signal regions", "Access every Now Map", "Save favorite spots", "Follow active places", "Early access to new regions"],
    cta: "Unlock all regions",
  },
];

function Page() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Pricing</p>
      <h1 className="mt-3 max-w-3xl text-balance text-5xl font-extrabold tracking-tighter md:text-6xl">
        Choose how you want to explore.
      </h1>

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`relative flex flex-col rounded-3xl border p-8 ${
              t.highlight ? "border-primary/40 bg-primary/5" : "border-border bg-surface"
            }`}
          >
            {t.highlight && (
              <span className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground">
                Most popular
              </span>
            )}
            <h3 className="text-lg font-bold">{t.name}</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-5xl font-extrabold tracking-tighter">{t.price}</span>
              {t.unit && <span className="text-foreground/50">{t.unit}</span>}
            </div>
            <p className="mt-3 text-sm text-foreground/60">{t.blurb}</p>
            <ul className="my-8 space-y-3 text-sm">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-foreground/80">
                  <span className="text-primary">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            {t.name === "Global Pass" ? (
              <UnlockButton
                priceId={GLOBAL_MONTH_PRICE_ID}
                reason="Unlock the Global Pass"
                className="mt-auto block w-full rounded-xl border border-border bg-background py-3.5 text-center text-sm font-bold hover:bg-surface-2 disabled:opacity-60"
              >
                {t.cta}
              </UnlockButton>
            ) : (
              <Link
                to="/signal-regions"
                className={`mt-auto block rounded-xl py-3.5 text-center text-sm font-bold transition-colors ${
                  t.highlight
                    ? "bg-primary text-primary-foreground hover:brightness-110"
                    : "border border-border bg-background hover:bg-surface-2"
                }`}
              >
                {t.cta}
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
