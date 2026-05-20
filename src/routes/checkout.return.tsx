import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/checkout/return")({
  validateSearch: (search: Record<string, unknown>): { session_id?: string } => ({
    session_id: typeof search.session_id === "string" ? search.session_id : undefined,
  }),
  component: CheckoutReturn,
});

type FoundingRow = { founding_number: number; claimed_at: string };

function CheckoutReturn() {
  const { session_id } = Route.useSearch();
  const { user } = useAuth();
  const [founding, setFounding] = useState<FoundingRow | null>(null);
  const [checking, setChecking] = useState(!!session_id && !!user);

  // Poll briefly for the founding_members row to appear (webhook is async).
  useEffect(() => {
    if (!session_id || !user) {
      setChecking(false);
      return;
    }
    let cancelled = false;
    let attempts = 0;

    const check = async () => {
      const { data } = await supabase
        .from("founding_members")
        .select("founding_number, claimed_at")
        .eq("user_id", user.id)
        .order("claimed_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (cancelled) return;
      if (data) {
        // Only treat as "just claimed" if within the last 10 minutes
        const claimedAgoMs = Date.now() - new Date(data.claimed_at).getTime();
        if (claimedAgoMs < 10 * 60 * 1000) {
          setFounding(data);
          setChecking(false);
          return true;
        }
      }
      return false;
    };

    (async () => {
      // Poll up to ~15 seconds
      while (!cancelled && attempts < 10) {
        const found = await check();
        if (found) return;
        attempts++;
        await new Promise((r) => setTimeout(r, 1500));
      }
      if (!cancelled) setChecking(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [session_id, user?.id]);

  if (!session_id) {
    return (
      <section className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">FRiNGE</p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tighter">No session found</h1>
        <p className="mt-4 text-foreground/60">
          We couldn't find a checkout session. Head back and try again.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
        >
          Back to the Living Globe →
        </Link>
      </section>
    );
  }

  if (founding) {
    return (
      <section className="relative mx-auto max-w-2xl px-6 py-24 text-center">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-sunset/5 to-transparent blur-2xl" />
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
          Founding Member · Confirmed
        </p>
        <h1 className="mt-4 text-5xl font-extrabold tracking-tighter">
          Welcome, Founding Member. 🤙
        </h1>
        <div className="mx-auto mt-8 inline-flex flex-col items-center rounded-2xl border border-primary/40 bg-gradient-to-b from-primary/15 to-sunset/10 px-10 py-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/60">
            Your Founding Number
          </span>
          <span className="mt-1 text-5xl font-extrabold tracking-tighter text-primary">
            #{String(founding.founding_number).padStart(4, "0")}
          </span>
          <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">
            of 2000
          </span>
        </div>
        <p className="mt-6 text-foreground/70">
          Status, forever. 5 welcome Shakas just landed in your wallet. Priority on
          everything we ship from here.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            to="/account"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
          >
            See your badge →
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-bold hover:bg-surface"
          >
            Back to the Globe
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-xl px-6 py-24 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">FRiNGE</p>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tighter">You're in. 🤙</h1>
      <p className="mt-4 text-foreground/60">
        {checking
          ? "Confirming your purchase…"
          : "Your access is unlocking right now. If anything looks off, refresh in a few seconds."}
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
      >
        Back to the Living Globe →
      </Link>
    </section>
  );
}
