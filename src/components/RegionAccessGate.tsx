import { useRegionAccess } from "@/hooks/useRegionAccess";
import { UnlockButton } from "@/components/UnlockButton";
import { getRegionPriceIds } from "@/lib/pricing-ids";

type Props = { regionSlug: string; regionName: string };

export function RegionAccessGate({ regionSlug, regionName }: Props) {
  const { hasAccess, reason, loading } = useRegionAccess(regionSlug);
  const ids = getRegionPriceIds(regionSlug);

  if (loading) return null;

  if (hasAccess) {
    const label =
      reason === "global"
        ? "Global Pass active"
        : reason === "region_monthly"
        ? `${regionName} Pass active`
        : "24-hour pass active";
    return (
      <div className="rounded-2xl border border-signal/30 bg-signal/10 px-4 py-3 text-sm font-bold text-signal">
        ✓ {label}
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-primary/30 bg-primary/5 p-6 md:p-8">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Unlock {regionName}</p>
      <h3 className="mt-2 text-2xl font-extrabold tracking-tighter md:text-3xl">
        Get access to live signals.
      </h3>
      <p className="mt-2 text-sm text-foreground/60">
        Choose a 24-hour pass, a monthly {regionName} pass, or the Global Pass for every region.
      </p>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {ids?.day && (
          <UnlockButton
            priceId={ids.day}
            regionSlug={regionSlug}
            reason={`Unlock ${regionName} for 24 hours`}
            className="rounded-xl border border-border bg-background py-4 text-sm font-bold transition-colors hover:bg-surface"
          >
            24-hour pass · $3
          </UnlockButton>
        )}
        <UnlockButton
          priceId={`${regionSlug.replace("-", "_")}_pass`}
          regionSlug={regionSlug}
          reason={`${regionName} monthly pass`}
          className="rounded-xl bg-foreground py-4 text-sm font-bold text-background transition-colors hover:bg-primary"
        >
          {regionName} monthly · $5/mo
        </UnlockButton>
        <UnlockButton
          priceId="global_pass"
          reason="Unlock every region with the Global Pass"
          className="rounded-xl bg-primary py-4 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
        >
          Global Pass · $20/mo
        </UnlockButton>
      </div>
    </div>
  );
}
