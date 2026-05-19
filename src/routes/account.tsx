import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { getStripeEnvironment } from "@/lib/stripe";
import { createPortalSession } from "@/utils/payments.functions";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Your Account, FRiNGE" },
      { name: "description", content: "Manage your FRiNGE passes, subscriptions, and billing." },
    ],
  }),
  component: AccountPage,
});

type SubRow = {
  paddle_subscription_id: string;
  price_id: string;
  status: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean | null;
};
type AccessRow = { region_slug: string; price_id: string; expires_at: string };
type FoundingRow = { founding_number: number; claimed_at: string };

function AccountPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const env = getStripeEnvironment();
  const [subs, setSubs] = useState<SubRow[]>([]);
  const [passes, setPasses] = useState<AccessRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/" });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const [{ data: s }, { data: p }] = await Promise.all([
        supabase
          .from("subscriptions")
          .select("paddle_subscription_id, price_id, status, current_period_end, cancel_at_period_end")
          .eq("user_id", user.id)
          .eq("environment", env)
          .order("created_at", { ascending: false }),
        supabase
          .from("region_access")
          .select("region_slug, price_id, expires_at")
          .eq("user_id", user.id)
          .eq("environment", env)
          .gt("expires_at", new Date().toISOString())
          .order("expires_at", { ascending: false }),
      ]);
      if (!cancelled) {
        setSubs((s as SubRow[]) || []);
        setPasses((p as AccessRow[]) || []);
        setLoading(false);
      }
    };
    load();
    const channel = supabase
      .channel(`account-${user.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "subscriptions", filter: `user_id=eq.${user.id}` }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "region_access", filter: `user_id=eq.${user.id}` }, load)
      .subscribe();
    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [user?.id, env]);

  const openPortal = async () => {
    setError(null);
    setPortalLoading(true);
    try {
      const url = await createPortalSession({
        data: { environment: env, returnUrl: `${window.location.origin}/account` },
      });
      window.open(url, "_blank", "noopener");
    } catch (e: any) {
      setError(e?.message ?? "Could not open billing portal.");
    } finally {
      setPortalLoading(false);
    }
  };

  if (authLoading || !user) {
    return <section className="mx-auto max-w-3xl px-6 py-24 text-center text-foreground/60">Loading…</section>;
  }

  const activeSubs = subs.filter((s) =>
    ["active", "trialing", "past_due"].includes(s.status) ||
    (s.status === "canceled" && s.current_period_end && new Date(s.current_period_end) > new Date())
  );

  return (
    <section className="mx-auto max-w-3xl space-y-10 px-6 py-16">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Your account</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tighter">{user.email}</h1>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={openPortal}
            disabled={portalLoading || activeSubs.length === 0}
            className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-50"
          >
            {portalLoading ? "Opening…" : "Manage billing"}
          </button>
          <button
            onClick={() => supabase.auth.signOut()}
            className="rounded-xl border border-border px-5 py-3 text-sm font-bold hover:bg-surface"
          >
            Sign out
          </button>
        </div>
        {error && <p className="mt-3 text-xs text-red-500">{error}</p>}
        {activeSubs.length === 0 && (
          <p className="mt-3 text-xs text-foreground/50">Buy a pass to enable billing management.</p>
        )}
      </header>

      <div>
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-foreground/50">Subscriptions</h2>
        {loading ? (
          <p className="mt-3 text-sm text-foreground/60">Loading…</p>
        ) : activeSubs.length === 0 ? (
          <p className="mt-3 text-sm text-foreground/60">No active subscriptions.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {activeSubs.map((s) => (
              <li key={s.paddle_subscription_id} className="rounded-2xl border border-border bg-surface p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-bold">{prettyPrice(s.price_id)}</p>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">
                    {s.status}
                  </span>
                </div>
                {s.current_period_end && (
                  <p className="mt-1 text-xs text-foreground/60">
                    {s.cancel_at_period_end
                      ? `Cancels on ${formatDate(s.current_period_end)} · access remains until then`
                      : `Renews on ${formatDate(s.current_period_end)}`}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-foreground/50">Active day passes</h2>
        {passes.length === 0 ? (
          <p className="mt-3 text-sm text-foreground/60">No active day passes.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {passes.map((p) => (
              <li key={p.region_slug} className="flex items-center justify-between rounded-2xl border border-border bg-surface p-5">
                <p className="font-bold capitalize">{p.region_slug.replace("-", " ")}</p>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">
                  expires {formatDate(p.expires_at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link to="/" className="inline-block text-xs font-mono uppercase tracking-[0.18em] text-foreground/50 hover:text-foreground">
        ← Back to the globe
      </Link>
    </section>
  );
}

function prettyPrice(id: string) {
  const map: Record<string, string> = {
    global_pass: "Global Pass · $20/mo",
    boracay_pass: "Boracay Monthly · $5/mo",
    rio_pass: "Rio Monthly · $5/mo",
    hood_river_pass: "Hood River Monthly · $5/mo",
    region_support_supporter: "Region Support, Supporter · $5/mo",
    region_support_backer: "Region Support, Backer · $10/mo",
    region_support_patron: "Region Support, Patron · $25/mo",
  };
  return map[id] ?? id;
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
