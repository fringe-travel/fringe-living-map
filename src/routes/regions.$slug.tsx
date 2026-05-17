import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getRegion, type SignalDrop } from "@/lib/regions";
import { RegionMap } from "@/components/RegionMap";
import { ShakaButton } from "@/components/ShakaButton";
import { RequestVibeBlock } from "@/components/RequestVibeBlock";
import { SupportRegionBlock } from "@/components/SupportRegionBlock";

import { UnlockButton } from "@/components/UnlockButton";
import { VIBE_REQUEST_PRICE_IDS } from "@/lib/pricing-ids";

export const Route = createFileRoute("/regions/$slug")({
  loader: ({ params }) => {
    const region = getRegion(params.slug);
    if (!region) throw notFound();
    return { region };
  },
  head: ({ loaderData }) => {
    const r = loaderData?.region;
    const shortName = r ? r.name.replace(" Signal", "") : "Region";
    const title = r ? `${shortName} — Live on FRiNGE` : "Region — FRiNGE";
    const desc = r ? r.description : "A live region on FRiNGE.";
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
  const shortName = region.name.replace(" Signal", "");

  const requestExamples =
    region.slug === "boracay"
      ? [
          "Capture the Station 1 sunset right now",
          "Check the crowd at D'Mall",
          "Show the wind at Bulabog",
          "Capture the beach energy near Station 2",
        ]
      : region.slug === "rio"
      ? [
          "Show the Arpoador sunset clap",
          "Check the swell at Barra",
          "Capture the samba near Ipanema Posto 9",
          "Show the line at Lapa right now",
        ]
      : [
          "Check the wind at The Hook",
          "Show what's launching at Event Site",
          "Capture sunset at the Spit",
          "Check the line at pFriem",
        ];

  return (
    <>
      {/* Map header */}
      <section className="relative border-b border-border">
        <RegionMap slug={region.slug} spots={region.spots} label={shortName} />
        <div className="absolute left-4 bottom-4 z-10">
          <Link
            to="/signal-regions"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/80 backdrop-blur-md hover:text-primary"
          >
            ← The Living Globe
          </Link>
        </div>
      </section>

      {/* Intro */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
            {region.country} · Live Region
          </p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
            <p className="max-w-2xl text-foreground/60">{region.description}</p>
            <div className="flex flex-wrap gap-3">
              <UnlockButton
                priceId={VIBE_REQUEST_PRICE_IDS.basic}
                reason={`Request a vibe from ${shortName}`}
                className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-105 disabled:opacity-60"
              >
                Request a Vibe
              </UnlockButton>
              <a
                href="#support"
                className="rounded-xl border border-border bg-surface px-6 py-3 text-sm font-bold hover:bg-surface-2"
              >
                Support {shortName}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Live stats */}
      <section className="border-b border-border bg-surface/30 py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-3">
          <Stat big={String(region.freshVibes)} label="Fresh signals today" />
          <Stat big={String(region.activeSpots)} label="Active spots right now" highlight />
          <Stat big={`${region.lastUpdatedMin}m`} label="Since last vibe" />
        </div>
      </section>

      {/* Recent vibes feed */}
      <section className="border-b border-border py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-signal align-middle" />
                Recent vibes · {shortName}
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tighter md:text-4xl">
                Fresh signals from people on the ground.
              </h2>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40">
              {region.previewFeed.length} drops · last hour
            </div>
          </div>

          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {[...region.previewFeed]
              .sort((a, b) => a.minutesAgo - b.minutesAgo)
              .map((d: SignalDrop, i: number) => (
                <li
                  key={i}
                  className="flex flex-col overflow-hidden rounded-3xl border border-border bg-background"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-surface-2">
                    <video
                      src="/fringe-app-preview.mp4"
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-signal/40 bg-background/70 px-2.5 py-1 backdrop-blur-md">
                      <span className="relative inline-flex size-1.5">
                        <span className="absolute inset-0 animate-ping rounded-full bg-signal opacity-70" />
                        <span className="relative size-1.5 rounded-full bg-signal" />
                      </span>
                      <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-signal">
                        Live drop
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col p-6">
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">
                        {d.spot} · @{d.by}
                      </p>
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                        {d.minutesAgo}m ago
                      </span>
                    </div>
                    <p className="mt-3 text-base font-medium text-foreground/90">{d.vibe}</p>
                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      <ShakaButton viberName={d.by} />
                      <UnlockButton
                        priceId={VIBE_REQUEST_PRICE_IDS.basic}
                        reason={`Request a vibe similar to @${d.by}'s drop`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-bold text-foreground/70 transition-colors hover:bg-surface-2 disabled:opacity-60"
                      >
                        Request similar
                      </UnlockButton>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </section>

      {/* Popular spots — with empty-spot CTAs */}
      <section className="border-b border-border bg-surface/30 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Popular spots</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tighter md:text-4xl">
            The places people are vibing right now.
          </h2>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {region.spots.map((s: string) => {
              const hasFresh = region.previewFeed.some((d: SignalDrop) => d.spot.includes(s));
              return (
                <div
                  key={s}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background p-4"
                >
                  <div>
                    <p className="font-bold">{s}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/40">
                      {hasFresh ? "Fresh signal in feed" : "No fresh signal yet"}
                    </p>
                  </div>
                  {!hasFresh && (
                    <UnlockButton
                      priceId={VIBE_REQUEST_PRICE_IDS.basic}
                      reason={`Request a vibe from ${s}`}
                      className="rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary/20 disabled:opacity-60"
                    >
                      Request
                    </UnlockButton>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Request a Vibe */}
      <section className="border-b border-border py-20">
        <div className="mx-auto max-w-7xl px-6">
          <RequestVibeBlock regionName={shortName} examples={requestExamples} />
        </div>
      </section>

      {/* Support */}
      <section id="support" className="border-b border-border bg-surface/30 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SupportRegionBlock regionName={shortName} />
        </div>
      </section>

      {/* Footer line */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-balance text-4xl font-extrabold tracking-tighter md:text-5xl">
            Help keep {shortName} fresh.
          </h2>
          <p className="mt-4 text-foreground/60">
            Support local vibers capturing real signals from beaches, food spots, sunsets,
            nightlife, and adventure areas.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#support"
              className="rounded-xl bg-primary px-8 py-4 text-sm font-black uppercase tracking-[0.15em] text-primary-foreground transition-transform hover:scale-105"
            >
              Support {shortName}
            </a>
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
