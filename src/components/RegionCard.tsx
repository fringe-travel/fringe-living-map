import { Link } from "@tanstack/react-router";
import type { Region } from "@/lib/regions";
import { UnlockButton } from "@/components/UnlockButton";
import { getRegionPriceIds } from "@/lib/pricing-ids";

const statusBadge: Record<Region["status"], { label: string; cls: string }> = {
  signal: { label: "On Air", cls: "bg-signal text-primary-foreground" },
  high: { label: "High Activity", cls: "bg-sunset text-primary-foreground" },
  quiet: { label: "Quiet Hour", cls: "bg-foreground/20 text-foreground" },
};

export function RegionCard({ region }: { region: Region }) {
  const badge = statusBadge[region.status];
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-surface transition-all duration-500 hover:border-primary/40">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={region.image}
          alt={`${region.name} — ${region.country}`}
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
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold tracking-tight">{region.name}</h3>
            <p className="mt-1 text-sm text-foreground/50">{region.tags}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-foreground/40">From</p>
            <p className="font-bold text-primary">${region.pricePerDay}/day</p>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-3 gap-2">
          <Stat value={String(region.freshVibes)} label="Fresh Vibes" />
          <Stat value={String(region.activeSpots)} label="Active Spots" />
          <Stat value={`${region.lastUpdatedMin}m`} label="Ago" highlight />
        </div>

        <div className="mb-6 flex flex-wrap gap-1.5">
          {region.spots.slice(0, 4).map((s) => (
            <span
              key={s}
              className="rounded-full border border-border bg-background/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-foreground/60"
            >
              {s}
            </span>
          ))}
        </div>

        {(() => {
          const priceIds = getRegionPriceIds(region.slug);
          return priceIds ? (
            <UnlockButton
              priceId={priceIds.day}
              reason={`Unlock ${region.name}`}
              className="mt-auto block w-full rounded-xl bg-foreground py-3.5 text-center text-sm font-bold text-background transition-colors hover:bg-primary disabled:opacity-60"
            >
              Unlock {region.name} — ${region.pricePerDay} today
            </UnlockButton>
          ) : (
            <Link
              to="/regions/$slug"
              params={{ slug: region.slug }}
              className="mt-auto block w-full rounded-xl bg-foreground py-3.5 text-center text-sm font-bold text-background transition-colors hover:bg-primary"
            >
              Unlock {region.name}
            </Link>
          );
        })()}
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
