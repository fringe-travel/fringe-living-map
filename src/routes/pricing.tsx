import { createFileRoute, Link } from "@tanstack/react-router";
import { UnlockButton } from "@/components/UnlockButton";
import { FOUNDING_MEMBER_PRICE_ID, FRINGE_MEMBERSHIP_PRICE_ID } from "@/lib/pricing-ids";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "FRiNGE Membership, Partner discounts around the world." },
      {
        name: "description",
        content:
          "FRiNGE Membership unlocks partner discounts worldwide for $20/mo. Founding Members get permanent status and 5 welcome Shakas, $200 one-time, limited to 2,000.",
      },
      { property: "og:title", content: "FRiNGE Membership & Founding Members" },
      {
        property: "og:description",
        content:
          "Become a Member for partner discounts. Or claim a Founding Member Pass — 2,000 seats, $200 one-time.",
      },
      { property: "og:url", content: "https://fringe-living-map.lovable.app/pricing" },
    ],
    links: [{ rel: "canonical", href: "https://fringe-living-map.lovable.app/pricing" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: [
            {
              "@type": "Product",
              name: "FRiNGE Membership",
              description:
                "Monthly membership that unlocks partner discounts from kite schools, cafes, surf shops, and co-works worldwide.",
              offers: {
                "@type": "Offer",
                price: "20",
                priceCurrency: "USD",
                url: "https://fringe-living-map.lovable.app/pricing",
              },
            },
            {
              "@type": "Product",
              name: "FRiNGE Founding Member Pass",
              description:
                "One-time community membership granting permanent Founding Member status, 5 welcome Shakas, and priority on new programs. Limited to 2,000.",
              offers: {
                "@type": "Offer",
                price: "200",
                priceCurrency: "USD",
                availability: "https://schema.org/LimitedAvailability",
                url: "https://fringe-living-map.lovable.app/pricing",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      {/* Hero */}
      <header className="max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
          Membership · Partner Discounts
        </p>
        <h1 className="mt-3 text-balance text-5xl font-extrabold tracking-tighter md:text-6xl">
          The Living Globe is free. Membership opens doors.
        </h1>
        <p className="mt-5 text-pretty text-lg text-foreground/60">
          Anyone can sign up and use FRiNGE. Members unlock ongoing discounts from
          partners on the ground — kite schools, cafes, surf shops, co-works — the
          places vibers actually go.
        </p>
        <Link
          to="/partners"
          className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-primary hover:underline"
        >
          See our partners →
        </Link>
      </header>

      {/* Two tiers */}
      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {/* Membership */}
        <div className="flex flex-col rounded-3xl border border-border bg-surface/30 p-8 md:p-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
            FRiNGE Membership
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-5xl font-extrabold tracking-tighter">$20</span>
            <span className="text-sm text-foreground/50">/ month</span>
          </div>
          <p className="mt-4 text-foreground/70">
            Unlock partner discounts worldwide. Cancel anytime.
          </p>
          <ul className="mt-6 grid gap-3 text-sm text-foreground/80">
            {[
              "Member discounts at every FRiNGE Partner.",
              "Codes revealed inline on partner pages.",
              "Supports the people keeping signals honest.",
              "New partners added every month.",
            ].map((line) => (
              <li key={line} className="flex gap-3">
                <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex-1" />
          <UnlockButton
            priceId={FRINGE_MEMBERSHIP_PRICE_ID}
            reason="Subscribe to FRiNGE Membership"
            className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-8 py-4 text-base font-bold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-60"
          >
            Become a Member · $20/mo
          </UnlockButton>
        </div>

        {/* Founding Member */}
        <div className="flex flex-col overflow-hidden rounded-3xl border border-primary/40 bg-gradient-to-br from-primary/10 via-background to-sunset/10 p-8 md:p-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sunset">
            Founding Member Pass · 2,000 seats
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-5xl font-extrabold tracking-tighter">$200</span>
            <span className="text-sm text-foreground/50">one-time</span>
          </div>
          <p className="mt-4 text-foreground/70">
            A one-time community pass. Founding Member status, perks, and a permanent
            place on the wall. Not a subscription, not a free membership — Founding
            Members still subscribe for partner discounts.
          </p>
          <ul className="mt-6 grid gap-3 text-sm text-foreground/80">
            {[
              "Permanent Founding Member badge on your profile.",
              "5 welcome Shakas to send to vibers on day one.",
              "First access to Vibe Requests, Region Support, and new programs.",
              "Direct line to the team. Your feedback shapes what ships first.",
              "Your name on the Founding Wall when the Globe goes wide.",
            ].map((line) => (
              <li key={line} className="flex gap-3">
                <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-sunset" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex-1" />
          <UnlockButton
            priceId={FOUNDING_MEMBER_PRICE_ID}
            reason="Claim your Founding Member Pass"
            className="inline-flex w-full items-center justify-center rounded-xl bg-foreground px-8 py-4 text-base font-bold text-background transition-all hover:brightness-110 disabled:opacity-60"
          >
            Claim Founding Member Pass · $200
          </UnlockButton>
          <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">
            Once they're gone, they're gone
          </p>
        </div>
      </div>

      {/* Founding Investor Circle teaser */}
      <Link
        to="/invest"
        className="mt-6 flex flex-col items-start gap-3 rounded-2xl border border-dashed border-sunset/40 bg-surface/20 p-6 transition-colors hover:border-sunset/70 hover:bg-surface/40 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sunset">
            Founding Investor Circle · 100 seats
          </p>
          <p className="mt-2 text-base font-semibold tracking-tight md:text-lg">
            $2,000 — Founding Member status + equity in FRiNGE.
          </p>
          <p className="mt-1 text-sm text-foreground/60">
            Goes beyond the Founding Pass. By application only.
          </p>
        </div>
        <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.18em] text-sunset">
          Request an intro →
        </span>
      </Link>

      {/* What members get, in plain English */}
      <div className="mt-20">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
          Why membership exists
        </p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tighter md:text-4xl">
          Your $20 backs the people on the ground.
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "🤝 Partner Discounts",
              body: "Member codes from kite schools, surf shops, cafes, co-works, and event organizers in every region.",
            },
            {
              title: "📡 Better Signals",
              body: "Membership funds the vibers capturing real, in-the-moment vibes from every region on the Globe.",
            },
            {
              title: "🌎 New Regions",
              body: "Membership helps us light up new regions, with new local partners in each.",
            },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-surface/30 p-6">
              <h3 className="text-lg font-bold tracking-tight">{f.title}</h3>
              <p className="mt-2 text-sm text-foreground/60">{f.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 border-t border-border pt-8 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/40">
          No paywalls on the Globe. Just real ways to back the people, regions, and signals you care about.
        </p>
      </div>
    </section>
  );
}
