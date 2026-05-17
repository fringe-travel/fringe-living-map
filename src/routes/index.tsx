import { createFileRoute, Link } from "@tanstack/react-router";
import { SignalMapMockup } from "@/components/SignalMapMockup";
import { RegionCard } from "@/components/RegionCard";
import { UnlockButton } from "@/components/UnlockButton";
import { regions } from "@/lib/regions";
import { getRegionPriceIds, GLOBAL_MONTH_PRICE_ID } from "@/lib/pricing-ids";
import lockedBg from "@/assets/locked-bg.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FRiNGE — See what's happening there right now." },
      {
        name: "description",
        content:
          "A signal map of real places, powered by people on the ground. Unlock real-time vibes from beaches, cities, and adventure spots worldwide.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <Marketplace />
      <WhyItMatters />
      <HowItWorks />
      <NowMapFeatures />
      <SeeFeelGoBanner />
      <LockedConversion />
      <Pricing />
      <VibersBusinesses />
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
              Signal feed active
            </span>
          </div>

          <h1 className="text-balance text-5xl font-extrabold leading-[0.95] tracking-tighter md:text-6xl lg:text-7xl">
            See what's happening <span className="italic text-primary">there</span> right now.
          </h1>

          <p className="mt-7 max-w-[52ch] text-pretty text-lg text-foreground/60 md:text-xl">
            FRiNGE is a signal map of real places, powered by people on the ground.
            Unlock real-time vibes from beaches, cities, events, and adventure
            spots around the world.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              to="/signal-regions"
              className="rounded-xl bg-foreground px-7 py-4 text-base font-bold text-background transition-colors hover:bg-primary"
            >
              Explore Signal Regions
            </Link>
            <Link
              to="/vibers"
              className="rounded-xl border border-border bg-surface px-7 py-4 text-base font-bold transition-colors hover:bg-surface-2"
            >
              Become a Viber
            </Link>
          </div>

          <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/40">
            Google Maps shows what exists.{" "}
            <span className="text-sunset">FRiNGE shows what's happening now.</span>
          </p>
        </div>

        <div className="lg:col-span-5">
          <SignalMapMockup />
        </div>
      </div>
    </section>
  );
}

/* ───────── Marketplace ───────── */
function Marketplace() {
  return (
    <section className="border-t border-border bg-surface/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          tag="World — Signal Marketplace"
          title="Unlock real-time access to places around the world."
          subtitle="Choose a region and see fresh vibes, active spots, and what's actually happening right now."
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

/* ───────── Why It Matters ───────── */
function WhyItMatters() {
  const cols = [
    {
      tag: "Old way",
      title: "Search. Guess. Hope.",
      items: ["Old reviews", "Edited posts", "Weather that misses the vibe", "Group chats with scattered info"],
      tone: "muted" as const,
    },
    {
      tag: "FRiNGE way",
      title: "Open. See. Go.",
      items: ["Fresh vibes", "Real people on the ground", "Active map pins", "Signal region access"],
      tone: "primary" as const,
    },
    {
      tag: "Result",
      title: "Better decisions.",
      items: ["Know before you go", "Find active spots", "Avoid dead areas", "Discover what's happening now"],
      tone: "sunset" as const,
    },
  ];

  return (
    <section className="border-t border-border py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          tag="Why this matters"
          title="Stop guessing from stale information."
          subtitle="People make real-world decisions using old reviews, edited posts, weather apps, and group chats. None of those answer the simple question — what does it feel like there right now?"
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {cols.map((c) => (
            <div
              key={c.tag}
              className={`rounded-3xl border p-8 ${
                c.tone === "primary"
                  ? "border-primary/30 bg-primary/5"
                  : c.tone === "sunset"
                  ? "border-sunset/25 bg-sunset/5"
                  : "border-border bg-surface"
              }`}
            >
              <p
                className={`font-mono text-[10px] uppercase tracking-[0.2em] ${
                  c.tone === "primary"
                    ? "text-primary"
                    : c.tone === "sunset"
                    ? "text-sunset"
                    : "text-foreground/40"
                }`}
              >
                {c.tag}
              </p>
              <h3 className="mt-3 text-2xl font-bold tracking-tight">{c.title}</h3>
              <ul className="mt-6 space-y-3 text-sm text-foreground/70">
                {c.items.map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className={c.tone === "muted" ? "text-foreground/30" : c.tone === "primary" ? "text-primary" : "text-sunset"}>
                      {c.tone === "muted" ? "—" : "+"}
                    </span>
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── How It Works ───────── */
function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Vibers tune in",
      body: "People on the ground share short real-time vibes from beaches, cities, events, and adventure spots.",
    },
    {
      n: "02",
      title: "FRiNGE maps the moment",
      body: "The system automatically associates each vibe with nearby spots, zones, and regions.",
    },
    {
      n: "03",
      title: "Users unlock the region",
      body: "Pay to access the signal map, fresh vibes, active spots, and recent replays for that place.",
    },
  ];

  return (
    <section className="border-t border-border bg-surface/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader tag="How it works" title="How FRiNGE turns places into signal regions." />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="rounded-3xl border border-border bg-background p-8">
              <p className="font-mono text-5xl font-bold tracking-tighter text-primary">{s.n}</p>
              <h3 className="mt-6 text-xl font-bold">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/60">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Now Map Features ───────── */
function NowMapFeatures() {
  const feats = [
    { title: "Signal pins", body: "See which spots have fresh activity." },
    { title: "Auto-location association", body: "Vibes connect automatically to the right spot, zone, and region." },
    { title: "Freshness indicators", body: "Know if a vibe is 2 minutes, 30 minutes, or a day old." },
    { title: "Locked premium spots", body: "Free users preview. Paid users unlock the full region." },
    { title: "Replay layer", body: "See recent moments even after the fresh vibe ends." },
    { title: "Spot intelligence", body: "Know if a place is active, quiet, crowded, windy, fun, or dead." },
  ];
  return (
    <section className="border-t border-border py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          tag="Now Map"
          title="The map is on."
          subtitle="The FRiNGE Now Map shows where real activity is happening — not just where places exist."
        />
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {feats.map((f, i) => (
            <div key={f.title} className="bg-background p-8 transition-colors hover:bg-surface">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                Feature {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-foreground/60">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── See It. Feel It. Go. Banner ───────── */
function SeeFeelGoBanner() {
  return (
    <section className="border-t border-border">
      <div className="relative overflow-hidden bg-gradient-to-br from-background via-surface to-background">
        <div className="absolute inset-0 radial-glow opacity-60" />
        <div className="absolute -right-32 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <h2 className="text-balance text-6xl font-extrabold leading-[0.9] tracking-tighter md:text-8xl lg:text-9xl">
            <span className="block text-foreground">SEE IT.</span>
            <span className="block text-primary">FEEL IT.</span>
            <span className="block text-foreground">GO.</span>
          </h2>
          <p className="mt-8 max-w-xl text-pretty text-base text-foreground/60 md:text-lg">
            Real moments from real locals — Boracay, Rio, Hood River and beyond.
            See what's happening.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {regions.map((r) => (
              <Link
                key={r.slug}
                to="/regions/$slug"
                params={{ slug: r.slug }}
                className="rounded-xl border border-border bg-surface/80 px-5 py-3 text-sm font-bold backdrop-blur transition-colors hover:border-primary/50 hover:bg-surface-2"
              >
                {r.name.replace(" Signal", "")}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── Locked Conversion ───────── */
function LockedConversion() {
  return (
    <section className="relative border-t border-border py-32">
      <div className="absolute inset-0 radial-glow opacity-70" />
      <div className="relative mx-auto max-w-5xl px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-surface shadow-2xl">
          <div className="pointer-events-none absolute inset-0 z-0 scale-110 opacity-20 blur-2xl">
            <img src={lockedBg} alt="" className="h-full w-full object-cover" loading="lazy" />
          </div>
          <div className="relative z-10 px-8 py-16 text-center md:px-16">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-sunset/15 px-4 py-1.5">
              <span className="size-1.5 animate-pulse rounded-full bg-sunset" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-sunset">
                Spot active now
              </span>
            </div>
            <h2 className="mx-auto max-w-2xl text-balance text-4xl font-extrabold tracking-tighter md:text-5xl">
              This spot is active right now.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-pretty text-foreground/60">
              Unlock Boracay Signal to see fresh vibes, active spots, and real-time updates
              from people on the ground.
            </p>

            <ul className="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-3 text-left text-sm sm:grid-cols-3">
              {[
                "Full Now Map access",
                "All fresh vibes",
                "Recent replays",
                "Active spot alerts",
                "Local discovery feed",
                "Real-time intel",
              ].map((x) => (
                <li key={x} className="flex items-center gap-2 rounded-xl border border-border bg-background/40 px-3 py-2.5">
                  <span className="text-primary">✓</span>
                  <span className="text-foreground/80">{x}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <UnlockButton
                priceId={getRegionPriceIds("boracay")!.day}
                reason="Unlock Boracay Signal"
                className="rounded-xl bg-primary px-8 py-4 text-sm font-black uppercase tracking-[0.15em] text-primary-foreground transition-transform hover:scale-105 disabled:opacity-60"
              >
                Unlock for $1.99 today
              </UnlockButton>
              <UnlockButton
                priceId={getRegionPriceIds("boracay")!.month}
                reason="Monthly access to Boracay Signal"
                className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/50 transition-colors hover:text-foreground disabled:opacity-60"
              >
                Monthly access — $4.99/mo →
              </UnlockButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── Pricing ───────── */
function Pricing() {
  return (
    <section className="border-t border-border bg-surface/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          tag="Pricing"
          title="Choose how you want to explore."
          subtitle="The FRiNGE layer works for everyone, from casual browsers to serious explorers."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <PriceCard
            name="Free Preview"
            price="$0"
            blurb="Good for discovering regions."
            features={[
              "View public vibes",
              "Preview signal regions",
              "See limited map activity",
              "Browse available places",
            ]}
            cta="Start exploring"
            ctaTo="/signal-regions"
          />
          <PriceCard
            name="Region Pass"
            price="$1.99"
            unit="/day"
            blurb="For travelers and locals checking one place."
            features={[
              "Unlock one signal region",
              "Full Now Map access",
              "Fresh vibes & active spots",
              "Recent replays",
            ]}
            cta="Choose a region"
            ctaTo="/signal-regions"
            highlight
          />
          <PriceCard
            name="Global Pass"
            price="$9.99"
            unit="/month"
            blurb="For nomads and explorers following multiple zones."
            features={[
              "Unlock all signal regions",
              "Access every Now Map",
              "Save favorite spots",
              "Early access to new regions",
            ]}
            cta="Unlock all regions"
            ctaPriceId={GLOBAL_MONTH_PRICE_ID}
            ctaReason="Unlock the Global Pass"
          />
        </div>
      </div>
    </section>
  );
}

function PriceCard({
  name, price, unit, blurb, features, cta, ctaTo, ctaPriceId, ctaReason, highlight,
}: {
  name: string; price: string; unit?: string; blurb: string;
  features: string[]; cta: string;
  ctaTo?: "/signal-regions";
  ctaPriceId?: string;
  ctaReason?: string;
  highlight?: boolean;
}) {
  const ctaClass = `mt-auto block w-full rounded-xl py-3.5 text-center text-sm font-bold transition-colors ${
    highlight
      ? "bg-primary text-primary-foreground hover:brightness-110"
      : "border border-border bg-surface hover:bg-surface-2"
  }`;
  return (
    <div
      className={`relative flex flex-col rounded-3xl border p-8 ${
        highlight ? "border-primary/40 bg-primary/5" : "border-border bg-background"
      }`}
    >
      {highlight && (
        <span className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground">
          Most popular
        </span>
      )}
      <h3 className="text-lg font-bold">{name}</h3>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-5xl font-extrabold tracking-tighter">{price}</span>
        {unit && <span className="text-foreground/50">{unit}</span>}
      </div>
      <p className="mt-3 text-sm text-foreground/60">{blurb}</p>
      <ul className="my-8 space-y-3 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-foreground/80">
            <span className="text-primary">✓</span>
            {f}
          </li>
        ))}
      </ul>
      {ctaPriceId ? (
        <UnlockButton priceId={ctaPriceId} reason={ctaReason} className={`${ctaClass} disabled:opacity-60`}>
          {cta}
        </UnlockButton>
      ) : (
        <Link to={ctaTo!} className={ctaClass}>
          {cta}
        </Link>
      )}
    </div>
  );
}

/* ───────── Vibers + Businesses ───────── */
function VibersBusinesses() {
  return (
    <section className="border-t border-border py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-surface p-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">For Vibers</p>
          <h3 className="mt-3 text-3xl font-bold tracking-tight">Tune in. FRiNGE maps the moment.</h3>
          <p className="mt-4 text-foreground/60">
            When you share a vibe, FRiNGE automatically connects it to the right place.
            Build status in your region, help people discover where to go, and earn through
            tips, rewards, or sponsored coverage.
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-2 text-sm text-foreground/70">
            {["No manual tagging", "Auto spot association", "Show up on the signal map", "Earn through coverage"].map((x) => (
              <li key={x} className="flex items-center gap-2"><span className="text-primary">+</span>{x}</li>
            ))}
          </ul>
          <Link to="/vibers" className="mt-8 inline-flex rounded-xl bg-foreground px-6 py-3 text-sm font-bold text-background hover:bg-primary transition-colors">
            Become a Viber
          </Link>
        </div>

        <div className="rounded-3xl border border-border bg-surface p-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sunset">For Businesses</p>
          <h3 className="mt-3 text-3xl font-bold tracking-tight">Be discovered when people are deciding where to go.</h3>
          <p className="mt-4 text-foreground/60">
            FRiNGE puts your business inside real-time activity moments. Sponsor a spot,
            drop a real-time offer, or power coverage across an entire region.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-foreground/70">
            <li className="flex items-center gap-2"><span className="text-sunset">→</span>Sponsored Spot — appear near relevant active signal</li>
            <li className="flex items-center gap-2"><span className="text-sunset">→</span>Signal Drop — time-limited offer during an active moment</li>
            <li className="flex items-center gap-2"><span className="text-sunset">→</span>Region Sponsor — power coverage for an entire region</li>
          </ul>
          <Link to="/businesses" className="mt-8 inline-flex rounded-xl bg-sunset px-6 py-3 text-sm font-bold text-primary-foreground hover:brightness-110 transition-all">
            Explore business options
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ───────── Section Header ───────── */
function SectionHeader({ tag, title, subtitle }: { tag: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-14 max-w-3xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">{tag}</p>
      <h2 className="mt-3 text-balance text-4xl font-extrabold tracking-tighter md:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 text-pretty text-lg text-foreground/60">{subtitle}</p>}
    </div>
  );
}
