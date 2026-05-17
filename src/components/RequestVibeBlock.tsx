import { UnlockButton } from "@/components/UnlockButton";
import { VIBE_REQUEST_PRICE_IDS } from "@/lib/pricing-ids";

type Tier = {
  key: "basic" | "priority" | "custom";
  label: string;
  price: string;
  blurb: string;
};

const TIERS: Tier[] = [
  { key: "basic", label: "Basic request", price: "$1", blurb: "Any nearby viber can capture it." },
  { key: "priority", label: "Priority request", price: "$3", blurb: "Bumped to the top of the viber feed." },
  { key: "custom", label: "Custom request", price: "$5", blurb: "Specific spot, angle, or moment." },
];

type Props = {
  regionName: string;
  examples?: string[];
};

export function RequestVibeBlock({ regionName, examples = [] }: Props) {
  return (
    <div className="rounded-3xl border border-primary/30 bg-primary/5 p-8 md:p-10">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Request a Vibe</p>
      <h3 className="mt-3 text-3xl font-extrabold tracking-tighter md:text-4xl">
        Ask a local viber to capture {regionName} right now.
      </h3>
      <p className="mt-3 max-w-xl text-foreground/60">
        Turn curiosity into a fresh signal. A nearby viber gets paid to capture exactly what you want to see.
      </p>

      {examples.length > 0 && (
        <ul className="mt-6 grid gap-2 text-sm text-foreground/70 sm:grid-cols-2">
          {examples.map((ex) => (
            <li key={ex} className="flex items-start gap-2">
              <span className="text-primary">→</span>
              {ex}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {TIERS.map((t) => (
          <div key={t.key} className="flex flex-col rounded-2xl border border-border bg-background p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">{t.label}</p>
            <p className="mt-2 text-4xl font-extrabold tracking-tighter">{t.price}</p>
            <p className="mt-2 text-sm text-foreground/60">{t.blurb}</p>
            <UnlockButton
              priceId={VIBE_REQUEST_PRICE_IDS[t.key]}
              reason={`Request a vibe from ${regionName}`}
              className="mt-6 w-full rounded-xl bg-foreground py-3 text-sm font-bold text-background transition-colors hover:bg-primary disabled:opacity-60"
            >
              Request
            </UnlockButton>
          </div>
        ))}
      </div>
    </div>
  );
}
