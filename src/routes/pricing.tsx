import { createFileRoute } from "@tanstack/react-router";
import { UnlockButton } from "@/components/UnlockButton";
import { FOUNDING_MEMBER_PRICE_ID } from "@/lib/pricing-ids";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "FRiNGE Founding Members — Claim your place on the Living Globe." },
      {
        name: "description",
        content:
          "Become one of the first 2,000 FRiNGE Founding Members. One-time $100. First access to Shakas, Vibe Requests, Region Support, and Partner Regions as they launch.",
      },
      { property: "og:title", content: "FRiNGE Founding Members" },
      {
        property: "og:description",
        content:
          "2,000 seats. $100 one-time. Power the Living Globe before anyone else.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      {/* Hero */}
      <header className="max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
          Founding Members · Limited to 2,000
        </p>
        <h1 className="mt-3 text-balance text-5xl font-extrabold tracking-tighter md:text-6xl">
          Power the Living Globe before anyone else.
        </h1>
        <p className="mt-5 text-pretty text-lg text-foreground/60">
          FRiNGE is built by the people who capture the world as it is. Founding
          Members fund that mission — and get first access to everything we build
          for the community.
        </p>
      </header>

      {/* The offer card */}
      <div className="mt-12 overflow-hidden rounded-3xl border border-primary/40 bg-gradient-to-br from-primary/10 via-background to-sunset/5 p-8 md:p-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sunset">
              FRiNGE Founding Member Pass
            </p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-6xl font-extrabold tracking-tighter">$100</span>
              <span className="text-sm text-foreground/50">one-time · lifetime</span>
            </div>
            <p className="mt-4 text-foreground/70">
              A single, honest offer. No subscription. No tiers. You're in for life.
            </p>
          </div>

          <ul className="grid flex-1 gap-3 text-sm text-foreground/80">
            {[
              "Permanent Founding Member badge on your profile.",
              "First access to Shakas, Vibe Requests, and Region Support as each launches.",
              "Priority invites to Partner Regions and new viber programs.",
              "Direct line to the team — your feedback shapes what ships first.",
              "Your name on the Founding Wall when the Globe goes wide.",
            ].map((line) => (
              <li key={line} className="flex gap-3">
                <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <UnlockButton
            priceId={FOUNDING_MEMBER_PRICE_ID}
            reason="Claim your Founding Member Pass"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-bold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-60 sm:w-auto"
          >
            Claim Founding Member Pass — $100
          </UnlockButton>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">
            Only 2,000 seats · Once they're gone, they're gone
          </p>
        </div>
      </div>

      {/* Roadmap */}
      <div className="mt-20">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
          Coming first to Founding Members
        </p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tighter md:text-4xl">
          What your pass unlocks as we ship.
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            {
              title: "🤙 Shakas",
              body: "Send a small thank-you straight to a viber who captured a real-world signal.",
            },
            {
              title: "📡 Vibe Requests",
              body: "Ask for a fresh signal from a specific spot — surf, wind, crowd, sunset.",
            },
            {
              title: "🌎 Region Support",
              body: "Back the people on the ground keeping your favorite region honest.",
            },
            {
              title: "🤝 Partner Regions",
              body: "Local businesses and brands sponsoring the Globe — first dibs go to Founders.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-surface/30 p-6"
            >
              <h3 className="text-lg font-bold tracking-tight">{f.title}</h3>
              <p className="mt-2 text-sm text-foreground/60">{f.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 border-t border-border pt-8 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/40">
          No subscriptions to watch fake content — just real ways to back the
          people, regions, and signals you care about.
        </p>
      </div>
    </section>
  );
}
