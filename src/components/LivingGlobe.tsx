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

function pointStyle([lng, lat]: [number, number], offset = 0) {
  const x = ((lng + 180) / 360) * 100 + offset;
  const y = ((90 - lat) / 180) * 100;
  return { left: `${x}%`, top: `${y}%` };
}

const LAND_BLOBS = [
  { left: "8%", top: "18%", width: "24%", height: "24%", rotate: "-18deg" },
  { left: "18%", top: "48%", width: "14%", height: "32%", rotate: "10deg" },
  { left: "43%", top: "25%", width: "18%", height: "20%", rotate: "-8deg" },
  { left: "52%", top: "37%", width: "16%", height: "28%", rotate: "12deg" },
  { left: "60%", top: "19%", width: "31%", height: "25%", rotate: "6deg" },
  { left: "71%", top: "43%", width: "22%", height: "19%", rotate: "-12deg" },
  { left: "78%", top: "65%", width: "13%", height: "14%", rotate: "15deg" },
  { left: "31%", top: "10%", width: "10%", height: "8%", rotate: "8deg" },
];

export function LivingGlobe() {
  const points = useMemo(buildPoints, []);
  const totalVibes = points.filter((p) => p.vibe).length + 33;
  const markerPasses = [0, 100];

  return (
    <div className="relative h-[calc(100svh-64px)] min-h-[640px] w-full overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(45,246,200,0.18),transparent_32%),linear-gradient(180deg,#02060a,#000)]" />
      <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(circle,rgba(255,255,255,0.34)_1px,transparent_1px)] [background-size:84px_84px]" />

      <div className="absolute inset-0 flex items-center justify-center px-4 pt-8 pb-28 md:pb-20">
        <div className="living-globe" aria-label="Rotating Living Globe with live vibes">
          <div className="globe-map">
            {[0, 100].map((offset) => (
              <div key={`land-${offset}`} className="absolute inset-y-0 w-1/2" style={{ left: `${offset}%` }}>
                {LAND_BLOBS.map((blob, index) => (
                  <span
                    key={`${offset}-${index}`}
                    className="absolute rounded-[48%] bg-emerald-500/45 blur-[0.2px]"
                    style={{ ...blob, transform: `rotate(${blob.rotate})` }}
                  />
                ))}
              </div>
            ))}

            {markerPasses.flatMap((offset) =>
              points.map((point) => (
                <a
                  key={`${point.id}-${offset}`}
                  href={point.slug ? `/regions/${point.slug}` : undefined}
                  className={`vibe-pin ${point.isRegion ? "is-region" : point.vibe ? "is-vibe" : "is-ambient"}`}
                  style={pointStyle(point.coords, offset)}
                  aria-label={point.label}
                >
                  <span className="pin-dot" />
                  <span className="pin-label">{point.label}</span>
                </a>
              )),
            )}
          </div>
          <div className="globe-grid" />
          <div className="globe-shine" />
        </div>
      </div>

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

      <style>{`
        .living-globe {
          position: relative;
          width: min(82vw, 760px);
          aspect-ratio: 1;
          border-radius: 9999px;
          overflow: hidden;
          background:
            radial-gradient(circle at 34% 24%, rgba(255,255,255,0.22), transparent 18%),
            radial-gradient(circle at 45% 42%, #155e75 0%, #0f3c57 42%, #06162a 76%, #020711 100%);
          box-shadow:
            0 0 0 1px rgba(45,246,200,0.28),
            0 0 72px rgba(45,246,200,0.32),
            inset -60px -24px 90px rgba(0,0,0,0.76),
            inset 28px 18px 44px rgba(255,255,255,0.1);
        }
        .living-globe::before {
          content: "";
          position: absolute;
          inset: -3%;
          border-radius: inherit;
          border: 2px solid rgba(45,246,200,0.46);
          box-shadow: 0 0 40px rgba(45,246,200,0.58), inset 0 0 38px rgba(45,246,200,0.18);
          z-index: 4;
          pointer-events: none;
        }
        .globe-map {
          position: absolute;
          inset: 0;
          width: 200%;
          height: 100%;
          animation: globePan 34s linear infinite;
          background:
            repeating-linear-gradient(0deg, transparent 0 10%, rgba(103,232,249,0.08) 10.2% 10.45%, transparent 10.7% 20%),
            repeating-linear-gradient(90deg, transparent 0 8%, rgba(103,232,249,0.08) 8.1% 8.35%, transparent 8.55% 16%);
        }
        .globe-grid,
        .globe-shine {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
        }
        .globe-grid {
          z-index: 3;
          background: radial-gradient(circle at 34% 26%, transparent 0 28%, rgba(0,0,0,0.14) 58%, rgba(0,0,0,0.72) 100%);
          mix-blend-mode: multiply;
        }
        .globe-shine {
          z-index: 5;
          background: radial-gradient(circle at 28% 22%, rgba(255,255,255,0.24), transparent 18%), linear-gradient(110deg, rgba(255,255,255,0.08), transparent 42%);
        }
        .vibe-pin {
          position: absolute;
          z-index: 6;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          transform: translate(-50%, -50%);
          text-decoration: none;
          white-space: nowrap;
        }
        .pin-dot {
          width: 9px;
          height: 9px;
          border-radius: 9999px;
          background: #2df6c8;
          box-shadow: 0 0 0 4px rgba(45,246,200,0.2), 0 0 18px rgba(45,246,200,0.95);
          animation: vibePulse 2.4s ease-in-out infinite;
          flex: none;
        }
        .pin-label {
          color: rgba(255,255,255,0.82);
          font-size: 10px;
          font-weight: 800;
          line-height: 1;
          text-shadow: 0 1px 8px rgba(0,0,0,0.95);
        }
        .vibe-pin.is-region .pin-dot {
          width: 13px;
          height: 13px;
          background: #ffd166;
          box-shadow: 0 0 0 5px rgba(255,209,102,0.22), 0 0 24px rgba(255,209,102,1);
        }
        .vibe-pin.is-region .pin-label {
          color: #ffe08a;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .vibe-pin.is-ambient .pin-dot {
          width: 6px;
          height: 6px;
          background: #fb923c;
          box-shadow: 0 0 0 3px rgba(251,146,60,0.18), 0 0 14px rgba(251,146,60,0.7);
        }
        .vibe-pin.is-ambient .pin-label {
          color: rgba(255,255,255,0.55);
          font-weight: 600;
        }
        @keyframes globePan {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes vibePulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.38); opacity: 0.82; }
        }
        @media (max-width: 720px) {
          .living-globe { width: min(108vw, 560px); }
          .pin-label { display: none; }
        }
      `}</style>
    </div>
  );
}
