import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/investors")({
  head: () => ({
    meta: [
      { title: "FRiNGE Investors · Private investor pathway" },
      {
        name: "description",
        content:
          "Information for accredited investors interested in backing FRiNGE. Not an offer to sell securities. Request info to learn more.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
          Private · By invitation
        </p>
        <h1 className="mt-3 text-balance text-4xl font-extrabold tracking-tighter md:text-5xl">
          Investor pathway
        </h1>
        <p className="mt-5 text-pretty text-lg text-foreground/60">
          A small allocation of FRiNGE is being opened to a limited group of
          accredited investors via a standard SAFE. This page is informational.
          It is not an offer to sell, or a solicitation of an offer to buy,
          any securities.
        </p>
      </header>

      <div className="mt-12 space-y-8">
        <Block label="Structure">
          Direct investment in FRiNGE on a post-money SAFE. Terms, valuation
          cap, and discount are shared under NDA with qualified, accredited
          investors only. Founding Member benefits are included as a courtesy,
          not as the investment itself.
        </Block>

        <Block label="Eligibility">
          Open to accredited investors as defined under applicable securities
          regulations in your jurisdiction. We will ask for verification
          before any documentation is shared.
        </Block>

        <Block label="What you receive">
          A signed SAFE entitling you to equity in FRiNGE on a future priced
          round, subject to its terms. Founding Member status on the platform
          is included for your account, but is not the security being
          offered.
        </Block>

        <Block label="What this is not">
          Not a membership purchase. Not a presale. Not a guarantee of return.
          Startup investing is high-risk and may result in loss of the entire
          amount invested.
        </Block>
      </div>

      <div className="mt-12 rounded-3xl border border-primary/40 bg-gradient-to-br from-primary/10 via-background to-sunset/5 p-8">
        <h2 className="text-2xl font-extrabold tracking-tighter">
          Request information
        </h2>
        <p className="mt-2 text-sm text-foreground/60">
          Send a short note about yourself and your accreditation status.
          We respond within a few business days. No checkout, no commitment.
        </p>
        <a
          href="mailto:investors@fringe.app?subject=FRiNGE%20investor%20inquiry&body=Name%3A%0AJurisdiction%3A%0AAccreditation%20status%3A%0ANotes%3A%0A"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:brightness-110"
        >
          Email investors@fringe.app
        </a>
      </div>

      <p className="mt-12 border-t border-border pt-8 text-xs leading-relaxed text-foreground/50">
        <strong className="text-foreground/70">Important disclosures.</strong>{" "}
        The information on this page is provided for general informational
        purposes only and does not constitute an offer to sell, or a
        solicitation of an offer to buy, any securities. Any such offer will
        be made only to verified accredited investors through formal
        subscription documentation, and acceptance by FRiNGE. Investing in
        early-stage companies is speculative, illiquid, and may result in the
        total loss of invested capital. Past performance is not indicative of
        future results.
      </p>
    </section>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/30 p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
        {label}
      </p>
      <p className="mt-3 text-foreground/80">{children}</p>
    </div>
  );
}
