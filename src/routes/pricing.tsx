import { createFileRoute } from "@tanstack/react-router";
import { ShakaButton } from "@/components/ShakaButton";
import { RequestVibeBlock } from "@/components/RequestVibeBlock";
import { SupportRegionBlock } from "@/components/SupportRegionBlock";
import { PartnerHereBlock } from "@/components/PartnerHereBlock";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Support FRiNGE — Keep the Living Globe alive." },
      {
        name: "description",
        content:
          "Tip a viber, request a fresh signal, support a region, or partner as a local business. Four community-driven ways to power FRiNGE.",
      },
      { property: "og:title", content: "Support FRiNGE" },
      {
        property: "og:description",
        content: "FRiNGE is powered by the people who capture the world as it is.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <section className="mx-auto max-w-7xl space-y-16 px-6 py-24">
      <header className="max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Support FRiNGE</p>
        <h1 className="mt-3 text-balance text-5xl font-extrabold tracking-tighter md:text-6xl">
          Four ways to power the Living Globe.
        </h1>
        <p className="mt-5 text-pretty text-lg text-foreground/60">
          FRiNGE is powered by the people who capture the world as it is. No subscriptions to watch
          fake content — just real ways to support the people, regions, and signals you care about.
        </p>
      </header>

      {/* Send a Shaka */}
      <div className="rounded-3xl border border-sunset/30 bg-sunset/5 p-8 md:p-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sunset">Send a Shaka</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tighter md:text-4xl">
          Tip a viber for a real moment. 🤙
        </h2>
        <p className="mt-3 max-w-2xl text-foreground/60">
          A small $3 thank-you goes straight to the person who captured a real-world signal. No
          algorithm, no edits — just a human you appreciate.
        </p>
        <div className="mt-6">
          <ShakaButton className="inline-flex items-center gap-2 rounded-xl bg-sunset px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-60">
            🤙 Send a Shaka — $3
          </ShakaButton>
        </div>
      </div>

      {/* Request a Vibe */}
      <RequestVibeBlock
        regionName="any live region"
        examples={[
          "Capture Station 1 sunset",
          "Check the wind at Bulabog",
          "Show the swell at Barra",
          "Check the line at pFriem",
        ]}
      />

      {/* Support a Region */}
      <SupportRegionBlock regionName="your favorite region" />

      {/* Partner Here */}
      <PartnerHereBlock />

      <p className="border-t border-border pt-12 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/40">
        Premium memberships for power users are coming later — once the globe feels magical to
        everyone first.
      </p>
    </section>
  );
}
