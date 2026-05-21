import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getRegion, DEMO_VIBER_USER_ID, type SignalDrop } from "@/lib/regions";
import { RegionMap } from "@/components/RegionMap";
import { ShakaButton } from "@/components/ShakaButton";
import { UnlockButton } from "@/components/UnlockButton";
import { FRINGE_MEMBERSHIP_PRICE_ID } from "@/lib/pricing-ids";
import { ViberAvatar } from "@/components/ViberAvatar";
import { getViber, viberStoryOrFallback } from "@/lib/vibers";

export const Route = createFileRoute("/regions/$slug")({
  loader: ({ params }) => {
    const region = getRegion(params.slug);
    if (!region) throw notFound();
    return { region };
  },
  head: ({ loaderData, params }) => {
    const r = loaderData?.region;
    const shortName = r ? r.name.replace(" Signal", "") : "Region";
    const title = r ? `${shortName}, Live on FRiNGE` : "Region, FRiNGE";
    const desc = r ? r.description : "A live region on FRiNGE.";
    const url = `https://fringe-living-map.lovable.app/regions/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        ...(r ? [{ property: "og:image", content: r.image }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: r
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ItemList",
                name: `${shortName} fresh vibes`,
                itemListElement: r.previewFeed.map((v, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  name: `${v.spot} · ${v.vibe}`,
                })),
              }),
            },
          ]
        : [],
    };
  },
  component: Page,
});

function Page() {
  const { region } = Route.useLoaderData();
  const shortName = region.name.replace(" Signal", "");

  return (
    <>
      {/* Map header */}
      <section className="relative border-b border-border">
        <RegionMap slug={region.slug} spots={region.spots} label={shortName} video={region.video} feed={region.previewFeed} />
        <div className="absolute left-4 bottom-4 z-10">
          <Link
            to="/signal-regions"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/80 backdrop-blur-md hover:text-primary"
          >
            ← The Living Globe
          </Link>
        </div>
      </section>

      {/* Featured viber chip — every region has a face */}
      <RegionViberChip regionName={shortName} feed={region.previewFeed} />

      {/* Live stats */}
      <section className="border-b border-border bg-surface/30 py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-3">
          <Stat big={String(region.freshVibes)} label="Fresh signals today" />
          <Stat big={String(region.activeSpots)} label="Active spots right now" highlight />
          <Stat big={`${region.lastUpdatedMin}m`} label="Since last vibe" />
        </div>
      </section>

      <KeepRegionAlive slug={region.slug} regionName={shortName} feed={region.previewFeed} />

      <SponsorRegionCTA slug={region.slug} regionName={shortName} />




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
                  className="flex flex-row overflow-hidden rounded-3xl border border-border bg-background"
                >
                  <div className="relative aspect-[9/16] w-40 shrink-0 overflow-hidden bg-surface-2 sm:w-48">
                    <video
                      src="/fringe-app-preview.mp4"
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <ViberAvatar handle={d.by} size={24} />
                        <p className="truncate font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">
                          {d.spot} · @{d.by}
                        </p>
                      </div>
                      <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                        {d.minutesAgo}m ago
                      </span>
                    </div>
                    <p className="mt-3 text-base font-medium text-foreground/90">{d.vibe}</p>
                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      <ShakaButton viberName={d.by} viberUserId={DEMO_VIBER_USER_ID} />
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </section>

      {/* Popular spots */}
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
                </div>
              );
            })}
          </div>
        </div>
      </section>



    </>
  );
}

const SPONSOR_URLS: Record<string, string> = {
  rio: "https://fringe.travel/sponsor/rio",
  "hood-river": "https://fringe.travel/sponsor/hood-river",
  boracay: "https://fringe.travel/sponsor/boracay",
};

function SponsorRegionCTA({ slug, regionName }: { slug: string; regionName: string }) {
  const url = SPONSOR_URLS[slug];
  if (!url) return null;
  return (
    <section className="border-b border-border py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-border bg-surface p-8 md:flex-row md:items-center md:p-10">
          <div className="max-w-xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">For Brands</p>
            <h3 className="mt-3 text-3xl font-extrabold tracking-tighter md:text-4xl">
              Sponsor {regionName}.
            </h3>
            <p className="mt-3 text-foreground/60">
              Put your brand in front of every traveler tuning into {regionName}. Local placement,
              real signal, real eyes on the ground.
            </p>
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-xl bg-primary px-7 py-4 font-bold text-primary-foreground transition-transform hover:scale-105"
          >
            Sponsor this region →
          </a>
        </div>
      </div>
    </section>
  );
}

function KeepRegionAlive({
  slug: _slug,
  regionName,
  feed,
}: {
  slug: string;
  regionName: string;
  feed: SignalDrop[];
}) {
  // Pick the most recent viber as the named face of the region.
  const featured = [...feed].sort((a, b) => a.minutesAgo - b.minutesAgo)[0];
  const viberHandle = featured?.by ?? "the locals";
  const viberProfile = getViber(viberHandle);
  const viberName = viberProfile?.name ?? `@${viberHandle}`;
  const viberStory = viberStoryOrFallback(viberHandle, regionName);

  return (
    <section className="border-b border-border py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="overflow-hidden rounded-3xl border border-primary/40 bg-gradient-to-br from-primary/10 via-background to-sunset/10 p-8 md:p-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
            Behind every vibe is a human
          </p>
          <h3 className="mt-3 text-balance text-3xl font-extrabold tracking-tighter md:text-5xl">
            Keep {regionName} alive on the map.
          </h3>

          {/* Featured viber — real face, real story, real clip */}
          <div className="mt-6 flex flex-col gap-5 rounded-2xl border border-border bg-background/60 p-5 backdrop-blur-sm sm:flex-row sm:items-stretch">
            <div className="relative aspect-[9/16] w-full shrink-0 overflow-hidden rounded-xl bg-surface-2 sm:w-40">
              <video
                src={viberProfile?.clip ?? "/fringe-app-preview.mp4"}
                poster={viberProfile?.photo}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-background/80 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-signal backdrop-blur-sm">
                <span className="size-1.5 animate-pulse rounded-full bg-signal" />
                Live from {regionName}
              </div>
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start gap-3">
                <ViberAvatar handle={viberHandle} size={48} />
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-signal">
                    Meet your viber in {regionName}
                  </p>
                  <p className="mt-1.5 text-lg font-bold tracking-tight">
                    {viberName}{" "}
                    <span className="font-mono text-xs font-normal text-foreground/50">
                      @{viberHandle}
                    </span>
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm text-foreground/70">{viberStory}</p>
            </div>
          </div>


          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {/* Membership — the one sub that funds every region */}
            <div className="flex flex-col rounded-2xl border border-primary/30 bg-background p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                One membership, every region
              </p>
              <p className="mt-3 flex items-baseline gap-1 text-4xl font-extrabold tracking-tighter">
                $20
                <span className="text-sm font-medium text-foreground/50">/mo</span>
              </p>
              <p className="mt-3 text-sm text-foreground/70">
                Back the vibers in {regionName} and every region on the Globe.
                Unlocks partner discounts worldwide. Cancel anytime.
              </p>
              <div className="mt-5 flex-1" />
              <UnlockButton
                priceId={FRINGE_MEMBERSHIP_PRICE_ID}
                reason={`Support the vibers in ${regionName}`}
                className="w-full rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:brightness-110 disabled:opacity-60"
              >
                Become a Member · $20/mo
              </UnlockButton>
            </div>

            {/* Shakas — per-viber, per-moment tipping */}
            <div className="flex flex-col rounded-2xl border border-sunset/30 bg-background p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sunset">
                Tip the people on the ground
              </p>
              <p className="mt-3 flex items-baseline gap-1 text-4xl font-extrabold tracking-tighter">
                🤙
                <span className="ml-2 text-base font-medium text-foreground/60">
                  Send Shakas
                </span>
              </p>
              <p className="mt-3 text-sm text-foreground/70">
                Send a Shaka straight to{" "}
                <span className="font-bold text-foreground">@{viberHandle}</span>{" "}
                or any viber whose drop made your day. One wallet, every region,
                every viber.
              </p>
              <div className="mt-5 flex-1" />
              <ShakaButton
                viberName={`@${viberHandle}`}
                viberUserId={DEMO_VIBER_USER_ID}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-sunset/40 bg-sunset/10 px-6 py-3 text-sm font-bold text-sunset transition-colors hover:bg-sunset/20"
              >
                🤙 Send a Shaka to @{viberHandle}
              </ShakaButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}




function RegionViberChip({ regionName, feed }: { regionName: string; feed: SignalDrop[] }) {
  const featured = [...feed].sort((a, b) => a.minutesAgo - b.minutesAgo)[0];
  if (!featured) return null;
  const handle = featured.by;
  const profile = getViber(handle);
  const name = profile?.name ?? `@${handle}`;
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-6 py-5">
        <ViberAvatar handle={handle} size={40} />
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
            Your viber in {regionName}
          </p>
          <p className="mt-0.5 truncate text-sm text-foreground/80">
            <span className="font-bold text-foreground">{name}</span>{" "}
            <span className="text-foreground/50">@{handle}</span>
            {profile?.story ? <span className="text-foreground/60"> · {profile.story}</span> : null}
          </p>
        </div>
        <ShakaButton
          viberName={`@${handle}`}
          viberUserId={DEMO_VIBER_USER_ID}
          className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-sunset/40 bg-sunset/10 px-4 py-2 text-xs font-bold text-sunset transition-colors hover:bg-sunset/20"
        >
          🤙 Send Shaka
        </ShakaButton>
      </div>
    </section>
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
