import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/businesses")({
  head: () => ({
    meta: [
      { title: "For Businesses — FRiNGE" },
      { name: "description", content: "Be discovered when people nearby are deciding where to go. Sponsor a spot, run a live drop, power a region." },
      { property: "og:title", content: "For Businesses — FRiNGE" },
      { property: "og:description", content: "Appear inside real-time activity moments." },
    ],
  }),
  component: Page,
});

const options = [
  {
    name: "Sponsored Spot",
    body: "Your business appears near relevant live activity.",
    good: ["Beach bars", "Restaurants", "Kite schools", "Surf shops", "Tour operators", "Hostels"],
    cta: "Sponsor a spot",
  },
  {
    name: "Live Drop",
    body: "Launch a time-limited offer during an active moment.",
    good: ["Show this vibe today and get a free drink with lunch."],
    cta: "Run a live drop",
  },
  {
    name: "Region Sponsor",
    body: "Power live coverage across an entire region.",
    good: ["Boracay Live powered by [Brand]."],
    cta: "Sponsor a region",
  },
];

function Page() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sunset">For Businesses</p>
      <h1 className="mt-3 max-w-4xl text-balance text-5xl font-extrabold tracking-tighter md:text-6xl">
        Be discovered when people nearby are deciding where to go.
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-foreground/60">
        FRiNGE helps businesses appear inside real-time activity moments — when
        people are choosing what to do next.
      </p>

      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
        {options.map((o) => (
          <div key={o.name} className="flex flex-col rounded-3xl border border-border bg-surface p-8">
            <h3 className="text-2xl font-bold tracking-tight">{o.name}</h3>
            <p className="mt-3 text-foreground/60">{o.body}</p>
            <ul className="mt-6 space-y-2 text-sm text-foreground/70">
              {o.good.map((g) => (
                <li key={g} className="flex items-start gap-2">
                  <span className="text-sunset">→</span>
                  <span>{g}</span>
                </li>
              ))}
            </ul>
            <Link to="/" className="mt-auto inline-flex w-fit rounded-xl bg-foreground px-5 py-3 pt-3.5 text-sm font-bold text-background transition-colors hover:bg-sunset">
              {o.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
