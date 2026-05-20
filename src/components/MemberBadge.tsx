import { Link } from "@tanstack/react-router";
import { useMembership } from "@/hooks/useMembership";

export function MemberBadge() {
  const { isMember, loading } = useMembership();
  if (loading || !isMember) return null;
  return (
    <Link
      to="/partners"
      title="FRiNGE Member · partner discounts unlocked"
      className="hidden items-center gap-1.5 rounded-full border border-primary/50 bg-primary/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary/20 md:inline-flex"
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
      Member
    </Link>
  );
}
