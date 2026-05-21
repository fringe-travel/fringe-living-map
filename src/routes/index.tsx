import { createFileRoute } from "@tanstack/react-router";
import { LivingGlobe } from "@/components/LivingGlobe";
import { UnlockButton } from "@/components/UnlockButton";
import { FOUNDING_MEMBER_PRICE_ID } from "@/lib/pricing-ids";
import { PartnerDiscountTeaser } from "@/components/PartnerDiscountTeaser";
import { ShakasTicker } from "@/components/ShakasTicker";

const GLOSSARY_TERMS = [
  { term: "Vibe", def: "A real-time human signal from a place." },
  { term: "Viber", def: "A person who shares what is happening where they are." },
  { term: "Living Globe", def: "The global map of live vibes." },
  { term: "Fresh Signal", def: "A recent vibe that helps people understand what is happening now." },
  { term: "Adventure Feed", def: "A stream of fresh vibes from places you follow." },
  { term: "Regions", def: "Clusters of vibes around meaningful places." },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FRiNGE — Support the vibers who keep the Living Map alive." },
      {
        name: "description",
        content:
          "FRiNGE is powered by people, not cameras. Real vibers on the ground capture what places feel like right now. Support the humans keeping the Living Map alive.",
      },
      { property: "og:title", content: "FRiNGE — The Living Map, powered by people." },
      {
        property: "og:description",
        content: "Behind every vibe is a human. Support the vibers who keep the Living Map alive.",
      },
      { property: "og:url", content: "https://fringe-living-map.lovable.app/" },
    ],
    links: [
      { rel: "canonical", href: "https://fringe-living-map.lovable.app/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: GLOSSARY_TERMS.map((t) => ({
            "@type": "Question",
            name: t.term,
            acceptedAnswer: { "@type": "Answer", text: t.def },
          })),
        }),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div>
      <LivingGlobe />

      {/* Hero copy + dual CTA */}
      <section className="border-t border-border bg-background px-6 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
            Powered by people, not cameras
          </p>
          <h1 className="mt-4 text-balance text-4xl font-extrabold tracking-tighter text-foreground md:text-6xl lg:text-7xl">
            Support the vibers who keep the Living Map alive.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-foreground/70 md:text-lg">
            FRiNGE is built by real people showing what places feel like right now —
            locals, travelers, surfers, kiters, food lovers, sunset chasers. Your
            support helps the humans on the ground keep showing up.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#living-globe"
              onClick={(e) => {
                if (typeof window === "undefined") return;
                const el = document.getElementById("living-globe");
                if (!el) return;
                e.preventDefault();
                el.scrollIntoView({ behavior: "smooth" });
                const supportsNative = typeof el.requestFullscreen === "function";
                if (supportsNative) {
                  el.requestFullscreen().catch(() => {
                    window.dispatchEvent(new CustomEvent("fringe:request-fullscreen"));
                  });
                } else {
                  window.dispatchEvent(new CustomEvent("fringe:request-fullscreen"));
                }
              }}
              className="inline-flex w-full items-center justify-center rounded-full bg-foreground px-7 py-3.5 text-sm font-bold text-background transition-transform hover:scale-105 sm:w-auto"
            >
              Open the Living Map
            </a>
            <a
              href="/pricing"
              className="inline-flex w-full items-center justify-center rounded-full border border-border bg-surface px-7 py-3.5 text-sm font-bold text-foreground transition-colors hover:bg-surface-2 sm:w-auto"
            >
              Support the Vibers
            </a>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/60">
              <span className="inline-flex items-center gap-2 rounded-full border border-signal/40 bg-signal/5 px-3 py-1.5">
                <span className="relative inline-flex size-1.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-signal opacity-70" />
                  <span className="relative size-1.5 rounded-full bg-signal" />
                </span>
                <span className="text-foreground">23</span> vibers active now
              </span>
              <span className="text-foreground/40">·</span>
              <span>54 fresh signals this hour</span>
            </div>
            <ShakasTicker />
          </div>
      </section>

      <BehindEveryVibe />
      <WhatMakesDifferent />
      <PartnerDiscountTeaser />
      <FoundingMemberSection />
      <Glossary />
    </div>
  );
}

/* ───────── Behind Every Vibe Is a Human ───────── */
function BehindEveryVibe() {
  const moments = [
    { who: "A local", does: "walking down to the beach." },
    { who: "A surfer", does: "checking the break before dawn." },
    { who: "A traveler", does: "sharing the sunset as it happens." },
    { who: "A friend", does: "stepping into a cafe to show the energy." },
    { who: "A kiter", does: "calling the wind from the water." },
    { who: "A viber", does: "capturing the moment before it disappears." },
  ];

  return (
    <section className="border-t border-border bg-background px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
          Behind every vibe is a human
        </p>
        <h2 className="mt-4 max-w-3xl text-balance text-4xl font-extrabold tracking-tighter md:text-5xl">
          Every dot on the map starts with someone showing up.
        </h2>
        <p className="mt-5 max-w-2xl text-foreground/70">
          FRiNGE is not powered by cameras. It is powered by people. Someone has
          to go there. Someone has to look around. Someone has to show the
          moment before it disappears. That person is the viber.
        </p>

        <ul className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-2">
          {moments.map((m) => (
            <li key={m.who} className="flex items-baseline gap-3 bg-background p-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
                +
              </span>
              <p className="text-foreground/85">
                <span className="font-bold text-foreground">{m.who}</span>{" "}
                <span className="text-foreground/70">{m.does}</span>
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a
            href="/pricing"
            className="inline-flex w-full items-center justify-center rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground transition-all hover:brightness-110 sm:w-auto"
          >
            Support the Vibers
          </a>
          <a
            href="/signal-regions"
            className="inline-flex w-full items-center justify-center rounded-full border border-border bg-surface px-7 py-3.5 text-sm font-bold text-foreground transition-colors hover:bg-surface-2 sm:w-auto"
          >
            Fund a Region
          </a>
        </div>
      </div>
    </section>
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

/* ───────── Founding Member Section ───────── */
function FoundingMemberSection() {
  const includes = [
    "Founding Member badge and number",
    "Early access to the Living Globe",
    "Early access to Boracay, Rio, and Hood River",
    "First access to Shakas — tip any viber, any region",
    "Private founder updates",
    "Vote on future regions",
    "Invite codes for friends",
  ];

  return (
    <section className="border-t border-border bg-background px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-3xl border border-primary/40 bg-gradient-to-br from-primary/10 via-background to-sunset/5 p-8 md:p-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sunset">
            Founding Members · Limited to 2,000
          </p>
          <h2 className="mt-3 text-balance text-4xl font-extrabold tracking-tighter md:text-5xl">
            Become one of the first 2,000.
          </h2>
          <p className="mt-5 max-w-2xl text-foreground/70">
            FRiNGE is building the Living Globe, fresh vibes from real people in
            real places around the world. Founding Members help shape the
            community from the beginning and keep Founder status on their
            profile, forever.
          </p>

          <div className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="text-5xl font-extrabold tracking-tighter">$200</span>
            <span className="text-sm text-foreground/60">one-time</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">
              · Limited to 2,000 members
            </span>
          </div>

          <ul className="mt-8 grid gap-2 text-sm text-foreground/80 md:grid-cols-2">
            {includes.map((line) => (
              <li key={line} className="flex gap-3">
                <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <UnlockButton
              priceId={FOUNDING_MEMBER_PRICE_ID}
              reason="Claim your Founding Member Pass"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-bold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-60 sm:w-auto"
            >
              Claim Founding Member Pass
            </UnlockButton>
          </div>

          <p className="mt-8 max-w-2xl text-[11px] leading-relaxed text-foreground/50">
            This is a community membership, not an investment. No equity, tokens,
            profit share, revenue share, resale rights, or financial return.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ───────── Glossary ───────── */
function Glossary() {
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
          {GLOSSARY_TERMS.map((t) => (
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
