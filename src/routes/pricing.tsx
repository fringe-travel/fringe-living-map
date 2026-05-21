import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { UnlockButton } from "@/components/UnlockButton";
import { ShakaPacksDialog } from "@/components/ShakaPacksDialog";
import { FOUNDING_MEMBER_PRICE_ID, FRINGE_MEMBERSHIP_PRICE_ID, SHAKA_PACKS } from "@/lib/pricing-ids";

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
  const [shakasOpen, setShakasOpen] = useState(false);
  const entryPack = SHAKA_PACKS[0];
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      {/* Hero */}
      <header className="max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
          Support the human signal
        </p>
        <h1 className="mt-3 text-balance text-5xl font-extrabold tracking-tighter md:text-6xl">
          Behind every vibe is a human. Help keep them showing up.
        </h1>
        <p className="mt-5 text-pretty text-lg text-foreground/60">
          The Living Map is free for everyone. Membership funds the vibers on
          the ground — the locals, surfers, travelers, and friends who walk to
          the beach, check the wind, and show the sunset before it disappears.
          Members also unlock real discounts from FRiNGE Partners in every region.
        </p>
        <Link
          to="/partners"
          className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-primary hover:underline"
        >
          See our partners →
        </Link>
      </header>

      {/* Two tiers */}
      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Membership */}
        <div className="flex flex-col rounded-3xl border border-border bg-surface/30 p-8 md:p-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
            Support the Vibers
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-5xl font-extrabold tracking-tighter">$20</span>
            <span className="text-sm text-foreground/50">/ month</span>
          </div>
          <p className="mt-4 text-foreground/70">
            Keep real people showing up in real places. Unlock partner discounts
            worldwide on top. Cancel anytime.
          </p>
          <ul className="mt-6 grid gap-3 text-sm text-foreground/80">
            {[
              "Funds the vibers keeping the Living Map alive.",
              "Member discounts at every FRiNGE Partner — codes revealed inline.",
              "New regions and new local vibers added every month.",
              "No ads, no algorithm — your $20 backs the humans, not the feed.",
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
            reason="Support the Vibers"
            className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-8 py-4 text-base font-bold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-60"
          >
            Support the Vibers · $20/mo
          </UnlockButton>
        </div>

        {/* Founding Member */}
        <div className="flex flex-col overflow-hidden rounded-3xl border border-primary/40 bg-gradient-to-br from-primary/10 via-background to-sunset/10 p-8 md:p-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sunset">
            Founding Supporter Pass · 2,000 seats
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-5xl font-extrabold tracking-tighter">$200</span>
            <span className="text-sm text-foreground/50">one-time</span>
          </div>
          <p className="mt-4 text-foreground/70">
            A one-time pass for the first 2,000 people backing the human
            network. Permanent Founding status, a seat on the Founding Wall,
            and the perks below.
          </p>

          <div className="mt-5 rounded-2xl border border-sunset/30 bg-background/60 p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sunset">
              How it fits with Membership
            </p>
            <p className="mt-2 text-sm text-foreground/70">
              The <span className="font-bold text-foreground">$200 Founding Pass</span> is
              for <span className="font-bold text-foreground">status, Shakas, and a seat in the first 2,000</span>.
              The <span className="font-bold text-foreground">$20/mo Membership</span> is
              what <span className="font-bold text-foreground">actually funds the vibers</span> on the ground and unlocks partner discounts. They're different jobs — Founding Members usually do both.
            </p>
          </div>

          <ul className="mt-6 grid gap-3 text-sm text-foreground/80">
            {[
              "Permanent Founding Member badge — you helped start this.",
              "5 welcome Shakas to send straight to vibers on day one.",
              "First access to Shakas, Vibe Requests, and new programs.",
              "Direct line to the team. Your feedback shapes what ships next.",
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
            reason="Claim your Founding Supporter Pass"
            className="inline-flex w-full items-center justify-center rounded-xl bg-foreground px-8 py-4 text-base font-bold text-background transition-all hover:brightness-110 disabled:opacity-60"
          >
            Claim Founding Pass · $200
          </UnlockButton>
          <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">
            Once they're gone, they're gone
          </p>
        </div>

        {/* Shakas — per-viber tipping */}
        <div className="flex flex-col rounded-3xl border border-sunset/40 bg-gradient-to-br from-sunset/10 via-background to-primary/5 p-8 md:p-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sunset">
            🤙 Tip a Viber
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-5xl font-extrabold tracking-tighter">$2</span>
            <span className="text-sm text-foreground/50">/ Shaka · from $10</span>
          </div>
          <p className="mt-4 text-foreground/70">
            Saw a drop that made your day? Send a Shaka straight to the human
            who posted it. One wallet, every region, every viber.
          </p>
          <ul className="mt-6 grid gap-3 text-sm text-foreground/80">
            {[
              "100% of every Shaka goes to the viber.",
              "Buy in packs — 5, 15, or 50. The bigger the pack, the cheaper per Shaka.",
              "Use anywhere on the map — no region locks, no expiry.",
              "Stacks on top of Membership — or use Shakas on their own.",
            ].map((line) => (
              <li key={line} className="flex gap-3">
                <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-sunset" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex-1" />
          <button
            onClick={() => setShakasOpen(true)}
            className="inline-flex w-full items-center justify-center rounded-xl bg-sunset px-8 py-4 text-base font-bold text-primary-foreground transition-all hover:brightness-110"
          >
            Buy Shakas · from ${(entryPack.priceCents / 100).toFixed(0)}
          </button>
          <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">
            Pay-as-you-go · no subscription
          </p>
        </div>
      </div>

      <ShakaPacksDialog open={shakasOpen} onClose={() => setShakasOpen(false)} />


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
            $2,000 — fund the human network and own a piece of FRiNGE.
          </p>
          <p className="mt-1 text-sm text-foreground/60">
            Founding Member status plus equity. By application only.
          </p>
        </div>
        <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.18em] text-sunset">
          Request an intro →
        </span>
      </Link>

      {/* What members get, in plain English */}
      <div className="mt-20">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
          Where your $20 goes
        </p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tighter md:text-4xl">
          Straight to the people keeping the map alive.
        </h2>


        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "📡 Better Signals",
              body: "Your $20 funds the vibers capturing real, in-the-moment vibes from every region on the Globe.",
            },
            {
              title: "🤝 Partner Discounts",
              body: "Member codes from kite schools, surf shops, cafes, co-works, and event organizers in every region.",
            },
            {
              title: "🤙 Shakas, on top",
              body: "Want to thank a specific viber? Send Shakas straight to them — one wallet, every region, every person.",
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
