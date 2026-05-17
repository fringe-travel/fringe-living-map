import mapImg from "@/assets/map-hero.jpg";

type Pin = { x: number; y: number; label: string; state: "active" | "locked" | "warm" };

const pins: Pin[] = [
  { x: 32, y: 38, label: "Station 1", state: "active" },
  { x: 58, y: 30, label: "D'Mall", state: "warm" },
  { x: 70, y: 52, label: "Bulabog", state: "active" },
  { x: 45, y: 62, label: "Sunset Beach", state: "locked" },
  { x: 80, y: 72, label: "Beach Bar", state: "locked" },
];

export function SignalMapMockup() {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_30px_120px_-30px] shadow-primary/30">
      <img
        src={mapImg}
        alt="Signal region map"
        width={1280}
        height={1280}
        className="absolute inset-0 h-full w-full object-cover opacity-70"
      />
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/30" />

      {/* HUD top */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5">
        <div className="rounded-lg border border-border bg-background/70 px-3 py-2 backdrop-blur-md">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/50">Viewing</p>
          <p className="text-sm font-bold">Boracay Signal</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-signal/30 bg-signal/10 px-3 py-1.5 backdrop-blur-md">
          <span className="relative inline-flex size-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-signal opacity-70" />
            <span className="relative size-1.5 rounded-full bg-signal" />
          </span>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-signal">On Air</span>
        </div>
      </div>

      {/* Pins */}
      {pins.map((p) => (
        <PinMarker key={p.label} pin={p} />
      ))}

      {/* Card overlay */}
      <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-border bg-background/80 p-4 backdrop-blur-xl">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold">Station 1 is active</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/50">
              3 fresh vibes · Last 1h
            </p>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary animate-ticker">
            8m ago
          </span>
        </div>
        <div className="flex gap-2">
          <div className="flex h-12 w-20 items-center justify-center rounded-lg border border-border bg-surface-2">
            <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-foreground/40">Preview</span>
          </div>
          <button className="flex-1 rounded-lg bg-primary text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02]">
            Watch now
          </button>
        </div>
      </div>
    </div>
  );
}

function PinMarker({ pin }: { pin: Pin }) {
  const isActive = pin.state === "active";
  const isLocked = pin.state === "locked";
  const color = isActive ? "text-signal" : pin.state === "warm" ? "text-sunset" : "text-foreground/30";

  return (
    <div
      className="absolute"
      style={{ left: `${pin.x}%`, top: `${pin.y}%`, transform: "translate(-50%, -50%)" }}
    >
      <div className="relative">
        {isActive && (
          <span className={`absolute inset-0 size-3 ${color} pulse-ring rounded-full`} />
        )}
        <span
          className={`relative block size-3 rounded-full border-2 border-background ${
            isActive ? "bg-signal" : pin.state === "warm" ? "bg-sunset" : "bg-foreground/40"
          }`}
        />
      </div>
      <div
        className={`mt-2 whitespace-nowrap rounded-md border border-border bg-background/85 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.15em] backdrop-blur-md ${
          isLocked ? "text-foreground/40" : "text-foreground/80"
        }`}
      >
        {isLocked ? "🔒 " : ""}
        {pin.label}
      </div>
    </div>
  );
}
