import { Link } from "@tanstack/react-router";
import type { Region } from "@/lib/regions";
import { UnlockButton } from "@/components/UnlockButton";
import { REGION_SUPPORT_PRICE_IDS, VIBE_REQUEST_PRICE_IDS } from "@/lib/pricing-ids";

const statusBadge: Record<Region["status"], { label: string; cls: string }> = {
  signal: { label: "Live Signal", cls: "bg-signal text-primary-foreground" },
  high: { label: "High Activity", cls: "bg-sunset text-primary-foreground" },
  quiet: { label: "Quiet Hour", cls: "bg-foreground/20 text-foreground" },
};

export function RegionCard({ region }: { region: Region }) {
  const badge = statusBadge[region.status];
  const recent = [...region.previewFeed]
    .sort((a, b) => a.minutesAgo - b.minutesAgo)
    .slice(0, 3);
  const shortName = region.name.replace(" Signal", "");

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-surface transition-all duration-500 hover:border-primary/40">
      <Link
        to="/regions/$slug"
        params={{ slug: region.slug }}
        aria-label={`Open ${shortName}`}
        className="absolute inset-0 z-10"
      />
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={region.image}
          alt={`${shortName} — ${region.country}`}
          loading="lazy"
          width={1024}
          height={768}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
        <span
          className={`absolute right-4 top-4 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] ${badge.cls}`}
        >
          {region.status === "signal" && (
            <span className="mr-1.5 inline-block size-1.5 animate-pulse rounded-full bg-primary-foreground align-middle" />
          )}
          {badge.label}
        </span>
        <div className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/70">
          {region.country}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-7">
        <div className="mb-5">
          <h3 className="text-2xl font-bold tracking-tight">{shortName}</h3>
          <p className="mt-1 text-sm text-foreground/50">{region.tags}</p>
        </div>

        <div className="mb-5 grid grid-cols-3 gap-2">
          <Stat value={String(region.freshVibes)} label="Fresh Signals" />
          <Stat value={String(region.activeSpots)} label="Active Spots" highlight />
          <Stat value={`${region.lastUpdatedMin}m`} label="Last vibe" />
        </div>

        <ul className="mb-6 space-y-2 text-sm">
          {recent.map((d, i) => (
            <li key={i} className="flex items-start justify-between gap-3 text-foreground/70">
              <div className="min-w-0">
                <p className="truncate font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/40">
                  {d.spot} · @{d.by}
                </p>
                <p className="mt-0.5 truncate text-foreground/80">{d.vibe}</p>
              </div>
              <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.15em] text-primary">
                {d.minutesAgo}m
              </span>
            </li>
          ))}
        </ul>

        <div className="relative z-20 mt-auto grid grid-cols-3 gap-2">
          <Link
            to="/regions/$slug"
            params={{ slug: region.slug }}
            className="rounded-xl bg-foreground px-3 py-3 text-center text-xs font-bold text-background transition-colors hover:bg-primary"
          >
            Explore
          </Link>
          <UnlockButton
            priceId={VIBE_REQUEST_PRICE_IDS.basic}
            reason={`Request a vibe from ${shortName}`}
            className="rounded-xl border border-border bg-background px-3 py-3 text-center text-xs font-bold text-foreground transition-colors hover:bg-surface-2 disabled:opacity-60"
          >
            Request
          </UnlockButton>
          <UnlockButton
            priceId={REGION_SUPPORT_PRICE_IDS.supporter}
            reason={`Support ${shortName}`}
            className="rounded-xl border border-signal/40 bg-signal/10 px-3 py-3 text-center text-xs font-bold text-signal transition-colors hover:bg-signal/20 disabled:opacity-60"
          >
            Support
          </UnlockButton>
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label, highlight }: { value: string; label: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-3 text-center">
      <p className={`text-xl font-bold ${highlight ? "text-primary" : "text-foreground"}`}>{value}</p>
      <p className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.15em] text-foreground/40">{label}</p>
    </div>
  );
}
