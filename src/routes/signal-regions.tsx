import { createFileRoute } from "@tanstack/react-router";
import { RegionCard } from "@/components/RegionCard";
import { regions } from "@/lib/regions";

export const Route = createFileRoute("/signal-regions")({
  head: () => ({
    meta: [
      { title: "Signal Regions, FRiNGE" },
      { name: "description", content: "Browse every signal region. Unlock real-time access to places around the world." },
      { property: "og:title", content: "Signal Regions, FRiNGE" },
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
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
              Coming online soon
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tighter md:text-4xl">
              Next signal regions
            </h2>
            <p className="mt-4 text-foreground/60">
              New regions go live as vibers on the ground join the network. These are next up, request
              one to push it to the top of the queue.
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

        <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Shonan-Enoshima", country: "Japan" },
            { name: "Tarifa", country: "Spain" },
            { name: "Nazaré", country: "Portugal" },
            { name: "Cabarete", country: "Dominican Republic" },
            { name: "Cape Town", country: "South Africa" },
            { name: "Byron Bay", country: "Australia" },
            { name: "Maui", country: "Hawaii" },
            { name: "Lofoten", country: "Norway" },
            { name: "Cumbuco", country: "Brazil" },
          ].map((r) => (
            <li
              key={r.name}
              className="flex items-center justify-between rounded-2xl border border-border bg-background/60 px-4 py-3"
            >
              <div>
                <p className="text-sm font-bold text-foreground">{r.name}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">
                  {r.country}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-signal/40 bg-signal/10 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-signal">
                <span className="size-1.5 rounded-full bg-signal" />
                Soon
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
