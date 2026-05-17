import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Notice — FRiNGE" },
      { name: "description", content: "How FRiNGE, Inc. collects, uses, and protects your personal data." },
      { property: "og:title", content: "Privacy Notice — FRiNGE" },
      { property: "og:description", content: "How FRiNGE, Inc. collects, uses, and protects your personal data." },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">Legal</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tighter">Privacy Notice</h1>
      <p className="mt-2 text-sm text-foreground/50">Last updated: May 17, 2026</p>

      <Section title="1. Who we are">
        This Privacy Notice describes how <strong>FRiNGE, Inc.</strong> ("FRiNGE",
        "we", "us") collects, uses, and shares your personal data when you use the
        FRiNGE Signal Network and related websites and services (the "Service"). For
        the personal data described here, FRiNGE acts as the <strong>data controller</strong>.
      </Section>

      <Section title="2. Data we collect">
        <ul>
          <li><strong>Account data</strong> — name, email address, password hash, sign-in provider (e.g. Google).</li>
          <li><strong>Profile & preferences</strong> — favorite regions, notification settings.</li>
          <li><strong>Usage data</strong> — pages viewed, features used, region access events, approximate location derived from IP.</li>
          <li><strong>Device & technical data</strong> — IP address, browser, operating system, device identifiers, cookies.</li>
          <li><strong>Support communications</strong> — messages you send us and our responses.</li>
          <li><strong>Order data</strong> — limited to confirmation that a purchase took place; payment card details are collected by Paddle, not by us.</li>
          <li><strong>User-contributed signals</strong> — content you choose to submit (vibes, photos, comments).</li>
        </ul>
      </Section>

      <Section title="3. How we use your data">
        We process personal data to:
        <ul>
          <li>create and manage your account and authenticate sign-ins;</li>
          <li>provide the Service, including granting region access after a purchase;</li>
          <li>operate and improve our features, reliability, and security;</li>
          <li>prevent fraud, abuse, and security incidents;</li>
          <li>provide customer support;</li>
          <li>communicate with you about your account, the Service, and (with your consent where required) marketing;</li>
          <li>comply with legal obligations.</li>
        </ul>
      </Section>

      <Section title="4. Legal bases (UK/EEA users)">
        We rely on: <strong>performance of a contract</strong> (to provide the Service you
        purchased), <strong>legitimate interests</strong> (to secure and improve the Service,
        and to communicate with you about it), <strong>consent</strong> (for optional cookies
        and marketing where required), and <strong>legal obligation</strong> (e.g. tax,
        accounting, lawful requests).
      </Section>

      <Section title="5. Who we share data with">
        <ul>
          <li><strong>Service providers / subprocessors</strong> — hosting and infrastructure providers, authentication, email delivery, analytics, and customer-support tooling, all bound by data-processing terms.</li>
          <li><strong>Merchant of Record — Paddle</strong> — Paddle.com Market Limited acts as Merchant of Record for our sales. Paddle independently collects and processes the personal and payment data needed to take payment, manage subscriptions, calculate tax, and issue invoices, under its own privacy notice.</li>
          <li><strong>Professional advisers</strong> — lawyers, accountants, and auditors, where reasonably necessary.</li>
          <li><strong>Authorities</strong> — where required by law, court order, or to protect rights, safety, or the integrity of the Service.</li>
          <li><strong>Successors</strong> — in connection with a merger, acquisition, or sale of assets, subject to customary confidentiality.</li>
        </ul>
        We do not sell personal data.
      </Section>

      <Section title="6. International transfers">
        We are based in the United States and our service providers may process data in
        other countries. Where data is transferred out of the UK or EEA, we rely on
        appropriate safeguards such as Standard Contractual Clauses or adequacy
        decisions.
      </Section>

      <Section title="7. Retention">
        We keep personal data only as long as needed for the purposes described above
        — typically for the life of your account plus a reasonable period to comply
        with legal, tax, and accounting obligations and to resolve disputes. We then
        delete or anonymize it.
      </Section>

      <Section title="8. Your rights">
        Depending on where you live, you may have the right to access, correct,
        delete, restrict, or port your personal data, to object to certain processing,
        and to withdraw consent. UK/EEA users also have the right to lodge a complaint
        with their local supervisory authority. We aim to respond to requests within
        one month. To exercise a right, email{" "}
        <a href="mailto:admin@fringe.travel">admin@fringe.travel</a>.
      </Section>

      <Section title="9. Security">
        We use appropriate technical and organizational measures — including encryption
        in transit, access controls, and least-privilege practices — to protect
        personal data. No system is perfectly secure; please use a strong, unique
        password.
      </Section>

      <Section title="10. Cookies">
        We use essential cookies to keep you signed in and to remember preferences. We
        may also use analytics cookies to understand how the Service is used. Where
        required by law, we ask for your consent before setting non-essential cookies,
        and you can manage your preferences in your browser at any time.
      </Section>

      <Section title="11. Children">
        The Service is not directed to children under 13 (or the equivalent minimum age
        in your jurisdiction). We do not knowingly collect personal data from children.
      </Section>

      <Section title="12. Changes to this notice">
        We may update this Privacy Notice from time to time. If changes are material,
        we'll notify you before they take effect.
      </Section>

      <Section title="13. Contact">
        Questions or requests? Email{" "}
        <a href="mailto:admin@fringe.travel">admin@fringe.travel</a>.
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
