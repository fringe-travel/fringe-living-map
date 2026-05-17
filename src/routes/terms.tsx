import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — FRiNGE" },
      { name: "description", content: "Terms and conditions governing use of the FRiNGE Signal Network." },
      { property: "og:title", content: "Terms of Service — FRiNGE" },
      { property: "og:description", content: "Terms and conditions governing use of the FRiNGE Signal Network." },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 prose-fringe">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">Legal</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tighter">Terms of Service</h1>
      <p className="mt-2 text-sm text-foreground/50">Last updated: May 17, 2026</p>

      <Section title="1. Who you're contracting with">
        These Terms of Service ("Terms") are a binding agreement between you and
        <strong> FRiNGE, Inc.</strong> ("FRiNGE", "we", "us"), the operator of the FRiNGE
        Signal Network and related websites, products, and services (the "Service").
        By creating an account, purchasing a pass, or otherwise using the Service, you
        agree to these Terms.
      </Section>

      <Section title="2. Eligibility & accounts">
        You must be of legal age in your jurisdiction (or have authority to bind the
        organization you represent) to use the Service. You are responsible for the
        accuracy of the information on your account and for keeping your credentials
        confidential. You are responsible for all activity under your account.
      </Section>

      <Section title="3. The Service">
        FRiNGE provides real-time "signal" data about places — including activity
        levels, vibes, and what's happening now — sourced from people on the ground
        and aggregated data. Access to live signal data is gated by region passes
        (24-hour day passes), monthly region subscriptions, or a Global Pass.
      </Section>

      <Section title="4. Acceptable use">
        You agree not to misuse the Service. You will not:
        <ul>
          <li>use the Service for unlawful, fraudulent, or deceptive purposes;</li>
          <li>send spam or harass other users or contributors;</li>
          <li>infringe anyone's intellectual property or privacy rights;</li>
          <li>interfere with the Service's security, including probing, scanning, scraping, or distributing malware;</li>
          <li>resell, redistribute, or republish signal data without our written consent;</li>
          <li>reverse engineer, decompile, or circumvent any technical limitations.</li>
        </ul>
      </Section>

      <Section title="5. Intellectual property">
        FRiNGE and its licensors retain all right, title, and interest in the Service,
        including the software, signal data, design, branding, and documentation. We
        grant you a limited, non-exclusive, non-transferable, revocable license to use
        the Service for personal or internal business use within the pass or
        subscription you purchased.
      </Section>

      <Section title="6. User content">
        If you contribute signals, photos, comments, or other content, you grant FRiNGE
        a worldwide, non-exclusive, royalty-free license to host, store, reproduce,
        modify, and display that content solely to operate and improve the Service. You
        represent that you have the rights necessary to grant this license.
      </Section>

      <Section title="7. Payments, subscriptions, and refunds">
        Our order process is conducted by our online reseller{" "}
        <strong>Paddle.com</strong>. Paddle.com is the Merchant of Record for all our
        orders. Paddle provides all customer service inquiries and handles returns.
        Payment, billing, taxes, currency, cancellation, and refund mechanics are
        governed by{" "}
        <a href="https://www.paddle.com/legal/checkout-buyer-terms" target="_blank" rel="noopener noreferrer">
          Paddle's Buyer Terms
        </a>.
        See our <a href="/refunds">Refund Policy</a> for details on requesting refunds.
        Monthly subscriptions auto-renew until canceled; canceling stops the next
        renewal but keeps access through the end of the current period. Day passes are
        one-time purchases that grant access for 24 hours.
      </Section>

      <Section title="8. Service availability">
        We work to keep the Service reliable but do not guarantee uninterrupted or
        error-free performance. Signal data is inherently approximate and may be
        delayed, incomplete, or inaccurate. Do not rely on it for safety-critical or
        emergency decisions.
      </Section>

      <Section title="9. Suspension & termination">
        We may suspend or terminate your access if you materially breach these Terms,
        fail to pay amounts due, create security or fraud risk, or repeatedly violate
        our policies. You may stop using the Service at any time. On termination, your
        license to use the Service ends and we may delete account data after a
        reasonable export window.
      </Section>

      <Section title="10. Disclaimers">
        To the fullest extent permitted by law, the Service is provided "as is" and "as
        available", without warranties of any kind — express or implied — including
        implied warranties of merchantability, fitness for a particular purpose, and
        non-infringement.
      </Section>

      <Section title="11. Limitation of liability">
        To the maximum extent permitted by law, FRiNGE will not be liable for indirect,
        incidental, consequential, special, or punitive damages, or loss of profits,
        revenue, data, or goodwill. Our aggregate liability arising out of or relating
        to these Terms or the Service will not exceed the greater of (a) the fees you
        paid us in the twelve (12) months before the event giving rise to the claim, or
        (b) USD $100. Nothing in these Terms limits liability for fraud, gross
        negligence, willful misconduct, death, or personal injury where such limitation
        is not permitted by law.
      </Section>

      <Section title="12. Indemnity">
        You agree to indemnify and hold FRiNGE harmless from any third-party claim
        arising out of your user content, your use of the Service in violation of these
        Terms, or your violation of applicable law.
      </Section>

      <Section title="13. Changes to these Terms">
        We may update these Terms from time to time. If changes are material, we'll
        notify you (for example, by email or in-app notice) before they take effect.
        Continued use of the Service after the effective date constitutes acceptance.
      </Section>

      <Section title="14. Governing law & disputes">
        These Terms are governed by the laws of the State of Delaware, USA, without
        regard to its conflict-of-laws rules. Any dispute will be resolved in the state
        or federal courts located in Delaware, and you consent to their jurisdiction.
      </Section>

      <Section title="15. Miscellaneous">
        These Terms are the entire agreement between you and FRiNGE regarding the
        Service. If any provision is unenforceable, the remainder will remain in
        effect. You may not assign these Terms without our consent; we may assign them
        in connection with a merger, acquisition, or sale of assets. Neither party is
        liable for failures caused by events beyond reasonable control (force majeure).
      </Section>

      <Section title="16. Contact">
        Questions about these Terms? Email <a href="mailto:legal@fringe.example">legal@fringe.example</a>.
        For billing or refund questions, contact Paddle at{" "}
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
