import { createFileRoute, Link } from "@tanstack/react-router";
import { LivingGlobe } from "@/components/LivingGlobe";
import { UnlockButton } from "@/components/UnlockButton";
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
          "A giant, always-rotating Living Globe of fresh vibes from real people on the ground around the world.",
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
    <div>
      <LivingGlobe />
      <section className="border-t border-border bg-background px-6 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-balance text-4xl font-extrabold tracking-tighter text-foreground md:text-6xl lg:text-7xl">
            Real vibes. Real places. Right now.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-foreground/70 md:text-lg">
            A giant, always-rotating globe of fresh signals from real people on the ground.
          </p>
        </div>
      </section>
      <WhatMakesDifferent />
      <Glossary />
      <FourCTAs />
    </div>
  );
}

/* ───────── What makes FRiNGE different ───────── */
function WhatMakesDifferent() {
  return (
    <section className="border-t border-border bg-surface/40 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
          What makes FRiNGE different
        </p>
        <h2 className="mt-4 max-w-4xl text-balance text-4xl font-extrabold tracking-tighter md:text-6xl">
          Social media shows what people want you to see. FRiNGE shows what is actually happening.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-border bg-background p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">
              Social feeds
            </p>
            <ul className="mt-4 space-y-2 text-foreground/70">
              <li>· Curated highlights & filters</li>
              <li>· Posted hours, days, weeks later</li>
              <li>· Optimised for engagement</li>
              <li>· You're the product</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-signal/40 bg-signal/5 p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
              FRiNGE
            </p>
            <ul className="mt-4 space-y-2 text-foreground">
              <li>· Real, unedited human signal</li>
              <li>· Captured now, from the ground</li>
              <li>· Optimised for what's actually happening</li>
              <li>· The viber gets paid, not the algorithm</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── Glossary ───────── */
function Glossary() {
  const terms = [
    { term: "Vibe", def: "A real-time human signal from a place." },
    { term: "Viber", def: "A person who shares what is happening where they are." },
    { term: "Living Globe", def: "The global map of live vibes." },
    { term: "Fresh Signal", def: "A recent vibe that helps people understand what is happening now." },
    { term: "Adventure Feed", def: "A stream of fresh vibes from places you follow." },
    { term: "Regions", def: "Clusters of vibes around meaningful places." },
  ];
  return (
    <section className="border-t border-border bg-background px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
          The Language of FRiNGE
        </p>
        <h2 className="mt-4 max-w-3xl text-balance text-4xl font-extrabold tracking-tighter md:text-5xl">
          A few words you'll see around the globe.
        </h2>
        <dl className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {terms.map((t) => (
            <div key={t.term} className="bg-background p-7">
              <dt className="text-lg font-extrabold tracking-tight text-foreground">{t.term}</dt>
              <dd className="mt-2 text-sm text-foreground/60">{t.def}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ───────── Four CTAs Band ───────── */
function FourCTAs() {
  return (
    <section className="border-t border-border bg-background py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 max-w-2xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
            Power the Living Globe
          </p>
          <h2 className="mt-3 text-balance text-4xl font-extrabold tracking-tighter md:text-5xl">
            Pure signal stays pure when the community powers it.
          </h2>
        </div>
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
