import { createFileRoute } from "@tanstack/react-router";
import { RegionCard } from "@/components/RegionCard";
import { regions } from "@/lib/regions";

export const Route = createFileRoute("/signal-regions")({
  head: () => ({
    meta: [
      { title: "Signal Regions — FRiNGE" },
      { name: "description", content: "Browse every signal region. Unlock real-time access to places around the world." },
      { property: "og:title", content: "Signal Regions — FRiNGE" },
      { property: "og:description", content: "Browse and unlock real-time access to places around the world." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Marketplace</p>
      <h1 className="mt-3 max-w-3xl text-balance text-5xl font-extrabold tracking-tighter md:text-6xl">
        Every signal region, on one map.
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-foreground/60">
        Choose a region and unlock fresh vibes, active spots, and the the signal from people already there.
      </p>

      <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {regions.map((r) => (
          <RegionCard key={r.slug} region={r} />
        ))}
      </div>
    </section>
  );
}
