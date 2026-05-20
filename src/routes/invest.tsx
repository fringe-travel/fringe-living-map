import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/invest")({
  head: () => ({
    meta: [
      { title: "Founding Investor Circle — FRiNGE" },
      {
        name: "description",
        content:
          "100 seats. $2,000 each. Founding Member status plus equity in FRiNGE. By application only.",
      },
      { property: "og:title", content: "Founding Investor Circle — FRiNGE" },
      {
        property: "og:description",
        content:
          "100 seats. $2,000. Founding Member status plus equity in FRiNGE. By application only.",
      },
      { property: "og:url", content: "https://fringe-living-map.lovable.app/invest" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://fringe-living-map.lovable.app/invest" }],
  }),
  component: InvestPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  accredited: z.boolean(),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

function InvestPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: user?.email ?? "",
    phone: "",
    accredited: false,
    message: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check your details.");
      return;
    }
    setSubmitting(true);
    const { error: dbError } = await supabase.from("investor_interest").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      accredited: parsed.data.accredited,
      message: parsed.data.message || null,
      user_id: user?.id ?? null,
    });
    setSubmitting(false);
    if (dbError) {
      setError("Something went wrong. Try again in a moment.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <header className="max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sunset">
          Founding Investor Circle · 100 seats
        </p>
        <h1 className="mt-3 text-balance text-5xl font-extrabold tracking-tighter md:text-6xl">
          Own a piece of the Living Globe.
        </h1>
        <p className="mt-5 text-pretty text-lg text-foreground/70">
          100 people will go beyond Founding Member. $2,000 gets you Founding Member
          status, 5 welcome Shakas, and equity in FRiNGE itself. By application only.
        </p>
      </header>

      <div className="mt-14 grid gap-10 md:grid-cols-[1.1fr_1fr]">
        {/* What's included */}
        <div className="rounded-3xl border border-primary/40 bg-gradient-to-br from-primary/10 via-background to-sunset/10 p-8 md:p-10">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-extrabold tracking-tighter">$2,000</span>
            <span className="text-sm text-foreground/50">one-time · 100 seats</span>
          </div>
          <ul className="mt-6 grid gap-3 text-sm text-foreground/85">
            {[
              "Equity in FRiNGE — final terms confirmed in the closing documents.",
              "Permanent Founding Member status (badge, perks, Founding Wall).",
              "5 welcome Shakas to send to vibers on day one.",
              "First look at every region, partnership, and program we ship.",
              "Quarterly investor updates direct from the team.",
              "Listed seat number on the Founding Investor roll.",
            ].map((line) => (
              <li key={line} className="flex gap-3">
                <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-sunset" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 border-t border-border/60 pt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">
            This page is an expression of interest, not an offer to sell securities. Any
            investment will be made under definitive subscription documents, subject to
            eligibility and applicable law.
          </p>
        </div>

        {/* Application form */}
        <div className="rounded-3xl border border-border bg-surface/30 p-8 md:p-10">
          {submitted ? (
            <div className="flex h-full flex-col items-start justify-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                Application received
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tighter">
                We'll be in touch. 🤙
              </h2>
              <p className="mt-4 text-foreground/70">
                Someone from the team will reach out with the data room and next steps.
              </p>
              <Link
                to="/"
                className="mt-8 inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-bold hover:bg-surface"
              >
                Back to the Globe
              </Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                Request an intro
              </p>
              <h2 className="text-2xl font-extrabold tracking-tighter">
                Apply for a seat
              </h2>

              <label className="grid gap-1.5 text-sm">
                <span className="font-medium">Name</span>
                <input
                  type="text"
                  required
                  maxLength={120}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </label>

              <label className="grid gap-1.5 text-sm">
                <span className="font-medium">Email</span>
                <input
                  type="email"
                  required
                  maxLength={255}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </label>

              <label className="grid gap-1.5 text-sm">
                <span className="font-medium">
                  Phone <span className="text-foreground/40">(optional)</span>
                </span>
                <input
                  type="tel"
                  maxLength={40}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </label>

              <label className="grid gap-1.5 text-sm">
                <span className="font-medium">
                  A note <span className="text-foreground/40">(optional)</span>
                </span>
                <textarea
                  rows={3}
                  maxLength={2000}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="What draws you to FRiNGE?"
                  className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </label>

              <label className="flex items-start gap-3 text-xs text-foreground/70">
                <input
                  type="checkbox"
                  checked={form.accredited}
                  onChange={(e) => setForm({ ...form, accredited: e.target.checked })}
                  className="mt-0.5 h-4 w-4 accent-primary"
                />
                <span>
                  I confirm I'm an accredited / sophisticated investor under the rules
                  of my jurisdiction (or willing to verify before closing).
                </span>
              </label>

              {error && (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Request an intro →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
