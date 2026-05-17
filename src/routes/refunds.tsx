import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/refunds")({
  head: () => ({
    meta: [
      { title: "Refund Policy — FRiNGE" },
      { name: "description", content: "FRiNGE's 30-day refund policy and how to request a refund through Paddle." },
      { property: "og:title", content: "Refund Policy — FRiNGE" },
      { property: "og:description", content: "FRiNGE's 30-day refund policy and how to request a refund through Paddle." },
    ],
    links: [{ rel: "canonical", href: "/refunds" }],
  }),
  component: RefundsPage,
});

function RefundsPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">Legal</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tighter">Refund Policy</h1>
      <p className="mt-2 text-sm text-foreground/50">Last updated: May 17, 2026</p>

      <Section title="30-day money-back guarantee">
        FRiNGE, Inc. offers a <strong>30-day money-back guarantee</strong> on all
        purchases — day passes, monthly region subscriptions, and the Global Pass. If
        you're not satisfied with your purchase, you may request a full refund within
        30 days of the order date.
      </Section>

      <Section title="How to request a refund">
        Our order process is conducted by our online reseller{" "}
        <strong>Paddle.com</strong>. Paddle is the Merchant of Record for all our
        orders and handles refunds on our behalf. To request a refund:
        <ul>
          <li>
            Visit <a href="https://paddle.net" target="_blank" rel="noopener noreferrer">paddle.net</a>{" "}
            and look up your order using the email address you used at checkout, or
          </li>
          <li>
            Email us at <a href="mailto:support@fringe.example">support@fringe.example</a> and we'll
            help coordinate with Paddle.
          </li>
        </ul>
        Refunds are typically processed within 5–10 business days and returned to the
        original payment method.
      </Section>

      <Section title="Subscription cancellations">
        You can cancel a monthly Region Pass or Global Pass at any time from your
        account. Cancellation stops the next renewal — you'll keep access through the
        end of the current billing period. Cancellation alone is not a refund request;
        if you also want a refund for the most recent charge, follow the steps above.
      </Section>

      <Section title="Day passes">
        Day passes grant 24 hours of access from the time of purchase. They are
        eligible for the 30-day money-back guarantee on the same terms above.
      </Section>

      <Section title="Plan changes & upgrades">
        Upgrading from a Region Pass to the Global Pass is pro-rated against the
        unused portion of your current period. Downgrades take effect at the next
        renewal.
      </Section>

      <Section title="Contact">
        Questions? Email{" "}
        <a href="mailto:support@fringe.example">support@fringe.example</a>. For
        anything billing-related, Paddle's support team can be reached at{" "}
        <a href="https://paddle.net" target="_blank" rel="noopener noreferrer">paddle.net</a>.
      </Section>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-foreground/75 [&_a]:text-primary [&_a]:underline [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
        {children}
      </div>
    </section>
  );
}
