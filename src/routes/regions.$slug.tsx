import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getRegion } from "@/lib/regions";
import { LiveMapMockup } from "@/components/LiveMapMockup";

export const Route = createFileRoute("/regions/$slug")({
  loader: ({ params }) => {
    const region = getRegion(params.slug);
    if (!region) throw notFound();
    return { region };
  },
  head: ({ loaderData }) => {
    const r = loaderData?.region;
    const title = r ? `${r.name} Pass — FRiNGE` : "Region — FRiNGE";
    const desc = r ? r.description : "Live region pass on FRiNGE.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(r ? [{ property: "og:image", content: r.image }] : []),
      ],
    };
  },
  component: Page,
});

function Page() {
  const { region } = Route.useLoaderData();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 radial-glow" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Link to="/live-regions" className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40 hover:text-primary">
              ← All live regions
            </Link>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
              {region.country} · Live Region Pass
            </p>
            <h1 className="mt-3 text-balance text-5xl font-extrabold tracking-tighter md:text-6xl">
              See what's happening in {region.name.replace(" Live", "")} right now.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-foreground/60">{region.description}</p>

            <div className="mt-9 flex flex-wrap gap-3">
              <button className="rounded-xl bg-primary px-7 py-4 text-base font-bold text-primary-foreground transition-transform hover:scale-105">
                Unlock {region.name} — ${region.pricePerDay} today
              </button>
              <button className="rounded-xl border border-border bg-surface px-7 py-4 text-base font-bold hover:bg-surface-2">
                Monthly access — ${region.pricePerMonth}/mo
              </button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <LiveMapMockup />
          </div>
        </div>
      </section>

      {/* Today's activity */}
      <section className="border-b border-border bg-surface/30 py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-3">
          <Stat big={String(region.freshVibes)} label="Fresh vibes today" />
          <Stat big={String(region.activeSpots)} label="Active spots right now" />
          <Stat big={`${region.lastUpdatedMin}m`} label="Since last vibe" highlight />
        </div>
      </section>

      {/* Popular spots */}
      <section className="border-b border-border py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Popular spots</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tighter md:text-4xl">
            The places people are vibing right now.
          </h2>
          <div className="mt-10 flex flex-wrap gap-3">
            {region.spots.map((s) => (
              <span key={s} className="rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-medium text-foreground/80">
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* What you unlock */}
      <section className="border-b border-border bg-surface/30 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">What you unlock</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tighter md:text-4xl">
            Full real-time access to {region.name.replace(" Live", "")}.
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
            {[
              "Fresh live vibes",
              "Active spot map",
              "Recent replays",
              "Local food and nightlife activity",
              "Beach and sunset conditions",
              "Real-time discovery feed",
            ].map((x) => (
              <div key={x} className="bg-background p-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">+</span>
                <p className="mt-2 font-bold">{x}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-balance text-4xl font-extrabold tracking-tighter md:text-5xl">
            Unlock {region.name}.
          </h2>
          <p className="mt-4 text-foreground/60">
            One pass. Full Now Map. Fresh vibes. Real-time intel.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button className="rounded-xl bg-primary px-8 py-4 text-sm font-black uppercase tracking-[0.15em] text-primary-foreground transition-transform hover:scale-105">
              Unlock for ${region.pricePerDay} today
            </button>
            <button className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/50 hover:text-foreground">
              Get monthly access — ${region.pricePerMonth}/mo →
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ big, label, highlight }: { big: string; label: string; highlight?: boolean }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-8">
      <p className={`text-5xl font-extrabold tracking-tighter ${highlight ? "text-primary" : ""}`}>{big}</p>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">{label}</p>
    </div>
  );
}
