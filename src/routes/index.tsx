import { createFileRoute, Link } from "@tanstack/react-router";
import { SignalMapMockup } from "@/components/SignalMapMockup";
import { RegionCard } from "@/components/RegionCard";
import { ShakaButton } from "@/components/ShakaButton";
import { ComparisonSection } from "@/components/ComparisonSection";
import { UnlockButton } from "@/components/UnlockButton";
import { regions } from "@/lib/regions";
import {
  REGION_SUPPORT_PRICE_IDS,
  VIBE_REQUEST_PRICE_IDS,
} from "@/lib/pricing-ids";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FRiNGE — The Living Globe of real-time vibes." },
      {
        name: "description",
        content:
          "Discover adventure through real people around the world. Fresh vibes captured by people on the ground — no uploads, no edits, no filters.",
      },
      { property: "og:title", content: "FRiNGE — The Living Globe" },
      {
        property: "og:description",
        content: "A real-time window into the physical world.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedRegions />
      <ComparisonSection />
      <AdventureFeed />
      <Mission />
      <FourCTAs />
      <SupportStatement />
    </>
  );
}

/* ───────── Hero ───────── */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 radial-glow" />
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 pb-24 pt-20 lg:grid-cols-12 lg:pt-28">
        <div className="lg:col-span-7">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1">
            <span className="relative inline-flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-70" />
              <span className="relative size-2 rounded-full bg-primary" />
            </span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              The Living Globe · Signal feed active
            </span>
          </div>

          <h1 className="text-balance text-5xl font-extrabold leading-[0.95] tracking-tighter md:text-6xl lg:text-7xl">
            Discover adventure through <span className="italic text-primary">real people</span> around the world.
          </h1>

          <p className="mt-7 max-w-[52ch] text-pretty text-lg text-foreground/60 md:text-xl">
            Fresh vibes captured by people on the ground — no uploads, no edits, no filters.
            A live signal layer for the places you care about.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              to="/signal-regions"
              className="rounded-xl bg-foreground px-7 py-4 text-base font-bold text-background transition-colors hover:bg-primary"
            >
              Explore the Globe
            </Link>
            <Link
              to="/vibers"
              className="rounded-xl border border-border bg-surface px-7 py-4 text-base font-bold transition-colors hover:bg-surface-2"
            >
              Capture a Vibe
            </Link>
          </div>

          <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/40">
            Real people. <span className="text-foreground/70">Real places.</span>{" "}
            <span className="text-sunset">Fresh signals.</span>
          </p>
        </div>

        <div className="lg:col-span-5">
          <SignalMapMockup />
        </div>
      </div>
    </section>
  );
}

/* ───────── Featured Regions ───────── */
function FeaturedRegions() {
  return (
    <section className="border-t border-border bg-surface/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          tag="Featured Regions"
          title="Three first windows into the Living Globe."
          subtitle="Each region is kept live by people on the ground. Explore, request a fresh signal, or help keep it alive."
        />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {regions.map((r) => (
            <RegionCard key={r.slug} region={r} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Adventure Feed Preview ───────── */
function AdventureFeed() {
  // Flatten recent vibes across regions, sort by freshness, take top 6.
  const feed = regions
    .flatMap((r) =>
      r.previewFeed.map((d) => ({
        ...d,
        region: r.name.replace(" Signal", ""),
        slug: r.slug,
      })),
    )
    .sort((a, b) => a.minutesAgo - b.minutesAgo)
    .slice(0, 6);

  return (
    <section className="border-t border-border py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          tag="Adventure Feed"
          title="A stream of fresh vibes from real places."
          subtitle="Every card is a real moment captured by a viber on the ground. Send a Shaka to support them or ask for a similar fresh signal."
        />
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {feed.map((d, i) => (
            <li
              key={i}
              className="flex flex-col rounded-3xl border border-border bg-surface p-6"
            >
              <div className="flex items-center justify-between">
                <Link
                  to="/regions/$slug"
                  params={{ slug: d.slug }}
                  className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary hover:underline"
                >
                  {d.region} · {d.spot}
                </Link>
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/40">
                  {d.minutesAgo}m ago
                </span>
              </div>
              <p className="mt-3 text-base font-medium text-foreground/90">{d.vibe}</p>
              <p className="mt-2 text-xs text-foreground/50">Captured by @{d.by}</p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <ShakaButton viberName={d.by} />
                <UnlockButton
                  priceId={VIBE_REQUEST_PRICE_IDS.basic}
                  reason={`Request a similar vibe from ${d.region}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground/70 transition-colors hover:bg-surface-2 disabled:opacity-60"
                >
                  Request similar
                </UnlockButton>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────── Mission ───────── */
function Mission() {
  return (
    <section className="border-t border-border bg-surface/30 py-32">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">The Mission</p>
        <h2 className="mt-6 text-balance text-5xl font-extrabold leading-[1] tracking-tighter md:text-7xl">
          <span className="block">No uploads.</span>
          <span className="block">No edits.</span>
          <span className="block">No filters.</span>
          <span className="block text-primary">Only delete.</span>
        </h2>
        <p className="mx-auto mt-10 max-w-xl text-pretty text-lg text-foreground/60">
          You can remove a moment, but you can't manufacture one. That's what keeps the signal pure.
        </p>
      </div>
    </section>
  );
}

/* ───────── Four CTAs Band ───────── */
function FourCTAs() {
  return (
    <section className="border-t border-border py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          tag="Four ways to support the Living Globe"
          title="Pure signal stays pure when the community powers it."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <CTA
            tag="Send a Shaka"
            title="Tip a viber"
            body="Support a real person for capturing a real moment."
            tone="sunset"
            actionLabel="🤙 Try it"
            href="/pricing"
          />
          <CTA
            tag="Request a Vibe"
            title="Ask for a fresh signal"
            body="Pay $1–$5 to have a local viber capture exactly what you want to see."
            tone="primary"
            actionLabel="Open a request"
            priceId={VIBE_REQUEST_PRICE_IDS.basic}
            reason="Request a fresh vibe"
          />
          <CTA
            tag="Support a Region"
            title="Keep Boracay, Rio, or Hood River live"
            body="$5–$25/month goes to the local vibers covering the region."
            tone="signal"
            actionLabel="Become a Supporter"
            priceId={REGION_SUPPORT_PRICE_IDS.supporter}
            reason="Support a region"
          />
          <CTA
            tag="Partner Here"
            title="For local businesses"
            body="Help fund coverage in your community. Partners support the signal — they do not control the vibe."
            tone="muted"
            actionLabel="Get in touch"
            href="mailto:admin@fringe.travel?subject=Partner%20with%20FRiNGE"
            external
          />
        </div>
      </div>
    </section>
  );
}

function CTA({
  tag,
  title,
  body,
  tone,
  actionLabel,
  href,
  external,
  priceId,
  reason,
}: {
  tag: string;
  title: string;
  body: string;
  tone: "primary" | "sunset" | "signal" | "muted";
  actionLabel: string;
  href?: string;
  external?: boolean;
  priceId?: string;
  reason?: string;
}) {
  const toneClasses = {
    primary: "border-primary/30 bg-primary/5",
    sunset: "border-sunset/30 bg-sunset/5",
    signal: "border-signal/30 bg-signal/5",
    muted: "border-border bg-surface",
  }[tone];
  const tagToneClasses = {
    primary: "text-primary",
    sunset: "text-sunset",
    signal: "text-signal",
    muted: "text-foreground/50",
  }[tone];

  return (
    <div className={`flex flex-col rounded-3xl border p-7 ${toneClasses}`}>
      <p className={`font-mono text-[10px] uppercase tracking-[0.2em] ${tagToneClasses}`}>{tag}</p>
      <h3 className="mt-3 text-xl font-bold tracking-tight">{title}</h3>
      <p className="mt-3 flex-1 text-sm text-foreground/70">{body}</p>

      {priceId ? (
        <UnlockButton
          priceId={priceId}
          reason={reason}
          className="mt-6 w-full rounded-xl bg-foreground py-3 text-center text-sm font-bold text-background transition-colors hover:bg-primary disabled:opacity-60"
        >
          {actionLabel}
        </UnlockButton>
      ) : external ? (
        <a
          href={href}
          className="mt-6 w-full rounded-xl bg-foreground py-3 text-center text-sm font-bold text-background transition-colors hover:bg-primary"
        >
          {actionLabel}
        </a>
      ) : (
        <Link
          to={href as "/pricing"}
          className="mt-6 w-full rounded-xl bg-foreground py-3 text-center text-sm font-bold text-background transition-colors hover:bg-primary"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

/* ───────── Support Statement ───────── */
function SupportStatement() {
  return (
    <section className="border-t border-border bg-surface/30 py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
          How FRiNGE stays alive
        </p>
        <p className="mt-6 text-pretty text-xl font-medium leading-relaxed text-foreground/80 md:text-2xl">
          FRiNGE is powered by the people who capture the world as it is.
          Support vibers, request fresh signals, or help keep a region active.
          Businesses and communities can partner with FRiNGE to support real-world
          discovery — without controlling the vibe.
        </p>
      </div>
    </section>
  );
}

/* ───────── Section Header ───────── */
function SectionHeader({
  tag,
  title,
  subtitle,
}: {
  tag: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-14 max-w-3xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">{tag}</p>
      <h2 className="mt-3 text-balance text-4xl font-extrabold tracking-tighter md:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 text-pretty text-lg text-foreground/60">{subtitle}</p>}
    </div>
  );
}
