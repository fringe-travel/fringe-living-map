import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef } from "react";
import { regions } from "@/lib/regions";

const SPOT_COORDS: Record<string, [number, number]> = {
  "Station 1": [121.92, 11.97],
  "Station 2": [121.93, 11.96],
  "D'Mall": [121.93, 11.97],
  Bulabog: [121.94, 11.96],
  "White Beach": [121.92, 11.96],
  "Sunset Beach": [121.91, 11.99],
  Arpoador: [-43.19, -22.99],
  "Ipanema Posto 9": [-43.2, -22.98],
  Barra: [-43.36, -23.0],
  Copacabana: [-43.18, -22.97],
  Leblon: [-43.22, -22.98],
  Lapa: [-43.18, -22.91],
  "The Hook": [-121.51, 45.71],
  "Event Site": [-121.5, 45.71],
  "Swell City": [-121.62, 45.71],
  Rowena: [-121.3, 45.68],
  Waterfront: [-121.51, 45.72],
  Spit: [-121.49, 45.71],
};

const REGION_CENTER: Record<string, [number, number]> = {
  boracay: [121.93, 11.97],
  rio: [-43.18, -22.91],
  "hood-river": [-121.51, 45.71],
};

const AMBIENT_SPOTS: { coords: [number, number]; label: string }[] = [
  { coords: [-156.3, 20.8], label: "Maui" },
  { coords: [-122.4, 37.8], label: "San Francisco" },
  { coords: [-106.8, 39.2], label: "Aspen" },
  { coords: [-75.6, 35.2], label: "Cape Hatteras" },
  { coords: [-70.4, 19.8], label: "Cabarete" },
  { coords: [-68.3, 12.2], label: "Bonaire" },
  { coords: [-38.6, -3.6], label: "Cumbuco" },
  { coords: [-5.6, 36.0], label: "Tarifa" },
  { coords: [-9.07, 39.6], label: "Nazaré" },
  { coords: [13.6, 68.0], label: "Lofoten" },
  { coords: [115.9, -32.0], label: "Perth" },
  { coords: [151.2, -33.8], label: "Sydney" },
  { coords: [174.8, -41.3], label: "Wellington" },
  { coords: [55.5, -21.1], label: "Réunion" },
  { coords: [18.4, -34.0], label: "Cape Town" },
  { coords: [139.7, 35.6], label: "Tokyo" },
  { coords: [100.5, 13.7], label: "Bangkok" },
  { coords: [77.6, 12.9], label: "Bangalore" },
];

type GlobePoint = {
  id: string;
  coords: [number, number];
  label: string;
  vibe?: string;
  slug?: string;
  isRegion?: boolean;
};

type Projected = GlobePoint & { x: number; y: number; z: number; visible: boolean };

function buildPoints(): GlobePoint[] {
  const pts: GlobePoint[] = [];

  for (const r of regions) {
    const center = REGION_CENTER[r.slug] ?? [0, 0];
    pts.push({ id: `region-${r.slug}`, coords: center, label: r.name.replace(" Signal", ""), slug: r.slug, isRegion: true });

    for (const d of r.previewFeed.slice(0, 4)) {
      pts.push({
        id: `${r.slug}-${d.spot}-${d.by}`,
        coords: SPOT_COORDS[d.spot] ?? center,
        label: d.spot,
        vibe: d.vibe,
        slug: r.slug,
      });
    }
  }

  for (const a of AMBIENT_SPOTS) pts.push({ id: `ambient-${a.label}`, coords: a.coords, label: a.label });
  return pts;
}

function project(lng: number, lat: number, rotation: number, cx: number, cy: number, r: number): Projected["visible"] extends boolean ? { x: number; y: number; z: number; visible: boolean } : never {
  const lambda = ((lng + rotation) * Math.PI) / 180;
  const phi = (lat * Math.PI) / 180;
  const cosPhi = Math.cos(phi);
  const x3 = cosPhi * Math.sin(lambda);
  const y3 = Math.sin(phi);
  const z3 = cosPhi * Math.cos(lambda);
  return { x: cx + r * x3, y: cy - r * y3, z: z3, visible: z3 > -0.08 } as never;
}

function drawSphere(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();

  const ocean = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.38, r * 0.1, cx, cy, r * 1.08);
  ocean.addColorStop(0, "#1a797f");
  ocean.addColorStop(0.34, "#0b4057");
  ocean.addColorStop(0.72, "#061d35");
  ocean.addColorStop(1, "#020811");
  ctx.fillStyle = ocean;
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

  ctx.strokeStyle = "rgba(103,232,249,0.16)";
  ctx.lineWidth = 1;
  for (let lat = -60; lat <= 60; lat += 15) {
    const y = cy - r * Math.sin((lat * Math.PI) / 180);
    const width = r * Math.cos((lat * Math.PI) / 180);
    ctx.beginPath();
    ctx.ellipse(cx, y, width, r * 0.022, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  for (let i = -75; i <= 75; i += 15) {
    ctx.beginPath();
    ctx.ellipse(cx, cy, r * Math.cos((i * Math.PI) / 180), r, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  const land = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
  land.addColorStop(0, "rgba(35,115,72,0.72)");
  land.addColorStop(1, "rgba(94,140,78,0.7)");
  ctx.fillStyle = land;
  const blobs = [
    [-103, 48, 0.28, 0.18, -0.35],
    [-70, -17, 0.15, 0.28, 0.2],
    [18, 6, 0.31, 0.21, -0.1],
    [72, 35, 0.38, 0.2, 0.15],
    [103, 4, 0.24, 0.16, -0.18],
    [135, -25, 0.18, 0.12, 0.2],
    [44, -20, 0.1, 0.14, -0.1],
    [-42, 72, 0.14, 0.08, 0.1],
  ];
  for (const [lng, lat, wr, hr, rot] of blobs) {
    const p = project(lng, lat, 0, cx, cy, r);
    if (!p.visible) continue;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(rot);
    ctx.globalAlpha = Math.max(0.12, p.z * 0.7);
    ctx.beginPath();
    ctx.ellipse(0, 0, r * wr, r * hr, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const shade = ctx.createRadialGradient(cx - r * 0.28, cy - r * 0.25, r * 0.18, cx + r * 0.26, cy + r * 0.06, r * 1.1);
  shade.addColorStop(0, "rgba(255,255,255,0.2)");
  shade.addColorStop(0.42, "rgba(255,255,255,0)");
  shade.addColorStop(0.78, "rgba(0,0,0,0.28)");
  shade.addColorStop(1, "rgba(0,0,0,0.78)");
  ctx.fillStyle = shade;
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = "rgba(45,246,200,0.5)";
  ctx.lineWidth = 2;
  ctx.shadowColor = "rgba(45,246,200,0.9)";
  ctx.shadowBlur = 28;
  ctx.beginPath();
  ctx.arc(cx, cy, r + 1, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

export function LivingGlobe() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const points = useMemo(buildPoints, []);
  const totalVibes = points.filter((p) => p.vibe).length + 33;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let projectedPoints: Projected[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const draw = (time: number) => {
      const cx = width / 2;
      const cy = height * 0.52;
      const r = Math.min(width * 0.43, height * 0.46, 390);
      const rotation = 210 - time * 0.006;

      ctx.clearRect(0, 0, width, height);
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(width, height) * 0.65);
      bg.addColorStop(0, "rgba(45,246,200,0.2)");
      bg.addColorStop(0.42, "rgba(14,165,233,0.08)");
      bg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.72)";
      for (let i = 0; i < 130; i++) {
        const x = (Math.sin(i * 91.7) * 0.5 + 0.5) * width;
        const y = (Math.cos(i * 47.3) * 0.5 + 0.5) * height;
        const alpha = 0.22 + ((i % 7) / 7) * 0.45;
        ctx.globalAlpha = alpha;
        ctx.fillRect(x, y, i % 11 === 0 ? 2 : 1, i % 11 === 0 ? 2 : 1);
      }
      ctx.restore();

      drawSphere(ctx, cx, cy, r);

      projectedPoints = points
        .map((point) => ({ ...point, ...project(point.coords[0], point.coords[1], rotation, cx, cy, r * 1.035) }))
        .filter((point) => point.visible)
        .sort((a, b) => a.z - b.z);

      for (const p of projectedPoints) {
        const pulse = 1 + Math.sin(time * 0.006 + p.x * 0.03) * 0.26;
        const isRegion = !!p.isRegion;
        const isVibe = !!p.vibe;
        const dot = (isRegion ? 7 : isVibe ? 5 : 3.5) * pulse;
        const color = isRegion ? "#ffd166" : isVibe ? "#2df6c8" : "#fb923c";
        const opacity = Math.max(0.2, Math.min(1, p.z));

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.shadowColor = color;
        ctx.shadowBlur = isRegion ? 24 : 16;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, dot, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = opacity * 0.28;
        ctx.beginPath();
        ctx.arc(p.x, p.y, dot * 3.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = opacity;
        ctx.font = isRegion ? "700 12px Inter, sans-serif" : "700 10px Inter, sans-serif";
        ctx.fillStyle = isRegion ? "#ffe08a" : isVibe ? "rgba(255,255,255,0.86)" : "rgba(255,255,255,0.55)";
        ctx.fillText(p.label, p.x + dot + 6, p.y + 4);
        ctx.restore();
      }

      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);

    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const hit = projectedPoints.find((p) => p.slug && Math.hypot(p.x - x, p.y - y) < 32);
      if (hit?.slug) window.location.href = `/regions/${hit.slug}`;
    };
    canvas.addEventListener("click", handleClick);

    return () => {
      cancelAnimationFrame(frame);
      canvas.removeEventListener("click", handleClick);
      ro.disconnect();
    };
  }, [points]);

  return (
    <div className="relative h-[calc(100svh-64px)] min-h-[640px] w-full overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#02060a,#000)]" />
      <canvas ref={canvasRef} className="absolute inset-0 size-full cursor-pointer" aria-label="Rotating Living Globe with live vibes" />

      <div className="pointer-events-none absolute left-6 top-6 z-10 flex items-start gap-3 md:left-8 md:top-8">
        <div className="pointer-events-auto">
          <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">The Living Globe</h1>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
            {totalVibes} fresh vibes · {regions.length} live regions
          </p>
        </div>
        <span className="pointer-events-auto mt-1 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/15 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300 backdrop-blur">
          <span className="relative inline-flex size-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative size-1.5 rounded-full bg-emerald-400" />
          </span>
          Live
        </span>
      </div>

      <div className="absolute right-6 top-6 z-10 flex gap-2 md:right-8 md:top-8">
        <Link to="/signal-regions" className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/20">
          Regions
        </Link>
        <Link to="/vibers" className="rounded-full bg-white px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-emerald-300">
          Capture a Vibe
        </Link>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 via-black/25 to-transparent pt-24">
        <div className="pointer-events-auto mx-auto flex max-w-7xl flex-col items-start gap-3 px-6 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-300">Real people · real places · fresh signals</p>
            <h2 className="mt-2 max-w-2xl text-balance text-4xl font-extrabold leading-[1] tracking-tighter text-white md:text-6xl">
              Discover adventure through <span className="italic text-emerald-300">real people</span> around the world.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-white/60">Tap any glow to drop into the region. No uploads. No edits. No filters. Only delete.</p>
        </div>
      </div>
    </div>
  );
}
