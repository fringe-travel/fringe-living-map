import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useMembership } from "@/hooks/useMembership";
import { useAuth } from "@/hooks/useAuth";
import { AuthDialog } from "@/components/AuthDialog";

type Props = {
  code: string;
  discountLabel: string;
};

export function MemberDiscountReveal({ code, discountLabel }: Props) {
  const { user, loading: authLoading } = useAuth();
  const { isMember, loading: memberLoading } = useMembership();
  const [authOpen, setAuthOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const loading = authLoading || (user && memberLoading);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="h-12 w-full animate-pulse rounded bg-foreground/10" />
      </div>
    );
  }

  // Member: show code inline
  if (isMember) {
    return (
      <div className="rounded-2xl border border-signal/30 bg-signal/5 p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
          ✓ Member discount · {discountLabel}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <code className="rounded-xl border border-signal/40 bg-background px-4 py-3 font-mono text-lg font-bold tracking-widest text-foreground">
            {code}
          </code>
          <button
            onClick={copy}
            className="rounded-xl bg-foreground px-4 py-3 text-sm font-bold text-background transition-transform hover:scale-[1.02]"
          >
            {copied ? "Copied ✓" : "Copy code"}
          </button>
        </div>
        <p className="mt-3 text-xs text-foreground/60">
          Show this code at the partner. Discounts may vary on certain dates or services.
        </p>
      </div>
    );
  }

  // Non-member: blurred code + CTA
  return (
    <>
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
          Member discount · {discountLabel}
        </p>
        <div className="relative mt-3 select-none">
          <code
            aria-hidden
            className="block w-fit rounded-xl border border-border bg-background px-4 py-3 font-mono text-lg font-bold tracking-widest text-foreground blur-md"
          >
            {code}
          </code>
        </div>
        <p className="mt-4 text-sm text-foreground/70">
          Become a FRiNGE Member to reveal this code and unlock discounts from partners around the world.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {user ? (
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              Become a Member · $20/mo
            </Link>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              Sign in to become a Member
            </button>
          )}
          <Link
            to="/pricing"
            className="inline-flex items-center justify-center rounded-xl border border-border px-5 py-3 text-sm font-bold hover:bg-surface"
          >
            See membership
          </Link>
        </div>
      </div>
      <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
