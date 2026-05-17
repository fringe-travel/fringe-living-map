import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getRegion, type SignalDrop } from "@/lib/regions";
import { SignalMapMockup } from "@/components/SignalMapMockup";

export const Route = createFileRoute("/regions/$slug")({
  loader: ({ params }) => {
    const region = getRegion(params.slug);
    if (!region) throw notFound();
    return { region };
  },
  head: ({ loaderData }) => {
    const r = loaderData?.region;
    const title = r ? `${r.name} Pass — FRiNGE` : "Region — FRiNGE";
    const desc = r ? r.description : "Signal region pass on FRiNGE.";
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
            <Link to="/signal-regions" className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40 hover:text-primary">
              ← All signal regions
            </Link>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
              {region.country} · Signal Region Pass
            </p>
            <h1 className="mt-3 text-balance text-5xl font-extrabold tracking-tighter md:text-6xl">
              See what's happening in {region.name.replace(" Signal", "")} right now.
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
            <SignalMapMockup />
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

      {/* Now Preview — live feed teaser */}
      <section className="border-b border-border py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-signal align-middle" />
                Now preview · last hour
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tighter md:text-4xl">
                What's happening in {region.name.replace(" Signal", "")} right now.
              </h2>
              <p className="mt-3 max-w-xl text-foreground/60">
                A taste of the signal. See the latest two drops free — unlock the pass to read every vibe, watch replays, and tune the full Now Map.
              </p>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40">
              {region.previewFeed.length} drops in feed
            </div>
          </div>

          <div className="relative mt-10">
            <ul className="divide-y divide-border overflow-hidden rounded-3xl border border-border bg-background">
              {region.previewFeed.map((d: SignalDrop, i: number) => {
                const locked = i >= 2;
                return (
                  <li key={i} className="relative grid grid-cols-[auto_1fr_auto] items-center gap-5 p-5 md:p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface font-mono text-[10px] uppercase tracking-[0.15em] text-primary">
                      {d.tag.slice(0, 3)}
                    </div>
                    <div className={locked ? "select-none blur-[6px] [filter:blur(6px)]" : ""}>
                      <p className="text-xs font-mono uppercase tracking-[0.18em] text-foreground/40">
                        {d.spot} · @{d.by}
                      </p>
                      <p className="mt-1 text-base font-medium text-foreground/90">{d.vibe}</p>
                    </div>
                    <div className="text-right font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">
                      {d.minutesAgo}m ago
                    </div>
                    {locked && (
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full border border-border bg-surface px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/60">
                        Locked
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Fade + CTA over locked items */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 rounded-b-3xl bg-gradient-to-t from-background via-background/90 to-transparent" />
            <div className="absolute inset-x-0 bottom-6 flex flex-col items-center gap-3 px-6 text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                {region.previewFeed.length - 2} more drops behind the pass
              </p>
              <button className="pointer-events-auto rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-105">
                Unlock the full feed — ${region.pricePerDay} today
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular spots */}
      <section className="border-b border-border bg-surface/30 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Popular spots</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tighter md:text-4xl">
            The places people are vibing right now.
          </h2>
          <div className="mt-10 flex flex-wrap gap-3">
            {region.spots.map((s: string) => (
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
            Full real-time access to {region.name.replace(" Signal", "")}.
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
            {[
              "Fresh fresh vibes",
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
