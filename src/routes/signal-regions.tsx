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
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Signal Regions</p>
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

      <div className="mt-16 rounded-3xl border border-dashed border-foreground/20 bg-surface/40 p-8 md:p-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
              More regions coming online
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tighter md:text-4xl">
              Don't see your spot yet?
            </h2>
            <p className="mt-4 text-foreground/60">
              New signal regions go live as vibers on the ground join the network. Request a region
              and we'll prioritize it as soon as we have a local capturing real signal there.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:admin@fringe.travel?subject=Request%20a%20new%20Signal%20Region&body=Region%2Fspot%3A%20%0AWhy%20it%20matters%3A%20"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-105"
            >
              Request a Region
            </a>
            <a
              href="/vibers"
              className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-5 py-3 text-sm font-bold text-foreground hover:bg-surface"
            >
              Become a Viber
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
