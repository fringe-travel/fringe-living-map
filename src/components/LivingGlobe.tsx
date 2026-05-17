import { useEffect, useMemo, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { Link } from "@tanstack/react-router";
import { regions } from "@/lib/regions";
import type * as MapboxNS from "mapbox-gl";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYmdhbGxhZ3NkIiwiYSI6ImNtYnR5cTc0cTA4Z2gycXBxNDR3dXdkencifQ.gKQH6ihL3rMHiTkdmyjoBg";

// Coordinates for spots that appear in region previewFeeds, plus the
// region centers themselves. Anything not in this map falls back to the
// region center with a slight jitter so the globe always looks alive.
const SPOT_COORDS: Record<string, [number, number]> = {
  // Boracay
  "Station 1": [121.92, 11.97],
  "Station 2": [121.93, 11.96],
  "D'Mall": [121.93, 11.97],
  Bulabog: [121.94, 11.96],
  "White Beach": [121.92, 11.96],
  "Sunset Beach": [121.91, 11.99],
  // Rio
  Arpoador: [-43.19, -22.99],
  "Ipanema Posto 9": [-43.2, -22.98],
  Barra: [-43.36, -23.0],
  Copacabana: [-43.18, -22.97],
  Leblon: [-43.22, -22.98],
  Lapa: [-43.18, -22.91],
  // Hood River
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

// Extra "ambient" vibes around the globe to make it feel busy like a
// live signal layer.
const AMBIENT_SPOTS: { coords: [number, number]; label: string }[] = [
  { coords: [-156.3, 20.8], label: "Maui, Hawaii" },
  { coords: [-122.4, 37.8], label: "San Francisco" },
  { coords: [-106.8, 39.2], label: "Aspen, Colorado" },
  { coords: [-75.6, 35.2], label: "Cape Hatteras" },
  { coords: [-71.6, 21.7], label: "Turks and Caicos" },
  { coords: [-70.4, 19.8], label: "Cabarete, DR" },
  { coords: [-67.2, 18.4], label: "Rincón, Puerto Rico" },
  { coords: [-68.3, 12.2], label: "Bonaire, Caribbean" },
  { coords: [-59.5, 13.2], label: "Bathsheba, Barbados" },
  { coords: [-109.8, 24.0], label: "La Ventana" },
  { coords: [-86.9, 21.2], label: "Cozumel, Mexico" },
  { coords: [-81.3, 19.3], label: "Stingray City" },
  { coords: [-38.6, -3.6], label: "Cumbuco, Brazil" },
  { coords: [-72.5, -13.2], label: "Machu Picchu" },
  { coords: [-5.6, 36.0], label: "Tarifa, Spain" },
  { coords: [-9.07, 39.6], label: "Nazaré, Portugal" },
  { coords: [-1.4, 43.5], label: "Hossegor, France" },
  { coords: [2.7, 48.4], label: "Fontainebleau" },
  { coords: [-5.6, 31.5], label: "Todra Gorge" },
  { coords: [-15.9, 23.7], label: "Dakhla, Morocco" },
  { coords: [-23.0, 16.7], label: "Sal, Cape Verde" },
  { coords: [-4.8, 56.4], label: "West Highland Way" },
  { coords: [13.6, 68.0], label: "Lofoten Islands" },
  { coords: [-122.9, 50.1], label: "Whistler, Canada" },
];

type GlobePoint = {
  id: string;
  coords: [number, number];
  label: string;
  vibe?: string;
  by?: string;
  minutesAgo?: number;
  slug?: string;
};

function buildPoints(): GlobePoint[] {
  const pts: GlobePoint[] = [];

  for (const r of regions) {
    const center = REGION_CENTER[r.slug] ?? [0, 0];
    pts.push({
      id: `region-${r.slug}`,
      coords: center,
      label: r.name.replace(" Signal", ""),
      slug: r.slug,
    });

    for (const d of r.previewFeed.slice(0, 4)) {
      const c = SPOT_COORDS[d.spot] ?? [
        center[0] + (Math.random() - 0.5) * 0.05,
        center[1] + (Math.random() - 0.5) * 0.05,
      ];
      pts.push({
        id: `${r.slug}-${d.spot}-${d.by}`,
        coords: c,
        label: `${d.spot}, ${r.country.split(",")[0]}`,
        vibe: d.vibe,
        by: d.by,
        minutesAgo: d.minutesAgo,
        slug: r.slug,
      });
    }
  }

  for (const a of AMBIENT_SPOTS) {
    pts.push({
      id: `ambient-${a.label}`,
      coords: a.coords,
      label: a.label,
    });
  }

  return pts;
}

export function LivingGlobe() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapboxNS.Map | null>(null);
  const points = useMemo(buildPoints, []);
  const [ready, setReady] = useState(false);
  const totalVibes = points.filter((p) => p.vibe).length + 33;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let cancelled = false;
    let cleanup: (() => void) | null = null;

    (async () => {
      const mod = await import("mapbox-gl");
      const mapboxgl = mod.default;
      if (cancelled || !containerRef.current) return;
      mapboxgl.accessToken = MAPBOX_TOKEN;

      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/satellite-v9",
        projection: { name: "globe" } as any,
        zoom: 1.6,
        center: [-40, 18],
        pitch: 0,
        bearing: 0,
        interactive: true,
        attributionControl: false,
      });

      mapRef.current = map;

    map.on("style.load", () => {
      map.setFog({
        color: "rgb(8, 10, 16)",
        "high-color": "rgb(36, 60, 110)",
        "horizon-blend": 0.08,
        "space-color": "rgb(2, 4, 10)",
        "star-intensity": 0.9,
      } as any);
      setReady(true);
    });

    // Add markers
    for (const p of points) {
      const el = document.createElement("div");
      el.className = "vibe-marker";
      const isRegion = p.id.startsWith("region-");
      const hasVibe = !!p.vibe;
      el.innerHTML = `
        <div class="vibe-marker-inner ${isRegion ? "is-region" : hasVibe ? "is-vibe" : "is-ambient"}">
          <span class="vibe-marker-dot"></span>
          <span class="vibe-marker-label">${p.label}</span>
        </div>
      `;

      const marker = new mapboxgl.Marker({ element: el, anchor: "center" })
        .setLngLat(p.coords)
        .addTo(map);

      if (p.slug) {
        el.style.cursor = "pointer";
        el.addEventListener("click", () => {
          window.location.href = `/regions/${p.slug}`;
        });
      }
      void marker;
    }

    // Auto-rotation
    const secondsPerRevolution = 180;
    let userInteracting = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const spin = () => {
      if (!mapRef.current || userInteracting) return;
      const center = mapRef.current.getCenter();
      center.lng -= 360 / secondsPerRevolution;
      mapRef.current.easeTo({
        center,
        duration: 1000,
        easing: (n) => n,
      });
    };

    const loop = () => {
      spin();
      timer = setTimeout(loop, 1000);
    };

    map.on("mousedown", () => {
      userInteracting = true;
    });
    map.on("dragstart", () => {
      userInteracting = true;
    });
    map.on("moveend", () => {
      // resume after a beat of inactivity
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        userInteracting = false;
        loop();
      }, 2000);
    });

      timer = setTimeout(loop, 1500);

      cleanup = () => {
        if (timer) clearTimeout(timer);
        map.remove();
        mapRef.current = null;
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [points]);

  return (
    <div className="relative h-[100svh] w-full overflow-hidden bg-black">
      <div ref={containerRef} className="absolute inset-0" />

      {/* Top-left brand / status */}
      <div className="pointer-events-none absolute left-6 top-6 z-10 flex items-start gap-3">
        <div className="pointer-events-auto">
          <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
            The Living Globe
          </h1>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">
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

      {/* Top-right CTAs */}
      <div className="absolute right-6 top-6 z-10 flex gap-2">
        <Link
          to="/signal-regions"
          className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/20"
        >
          Regions
        </Link>
        <Link
          to="/vibers"
          className="rounded-full bg-white px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-emerald-300"
        >
          Capture a Vibe
        </Link>
      </div>

      {/* Bottom headline */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 via-black/30 to-transparent pt-24">
        <div className="pointer-events-auto mx-auto flex max-w-7xl flex-col items-start gap-3 px-6 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-300">
              Real people · real places · fresh signals
            </p>
            <h2 className="mt-2 max-w-2xl text-balance text-3xl font-extrabold leading-[1] tracking-tighter text-white md:text-5xl">
              Discover adventure through{" "}
              <span className="italic text-emerald-300">real people</span> around the world.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-white/60">
            Tap any glow to drop into the region. No uploads. No edits. No filters. Only delete.
          </p>
        </div>
      </div>

      {!ready && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/60">
            Spinning up the Living Globe…
          </p>
        </div>
      )}

      <style>{`
        .vibe-marker { pointer-events: auto; }
        .vibe-marker-inner {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transform: translate(-50%, -50%);
          position: relative;
        }
        .vibe-marker-dot {
          width: 10px; height: 10px;
          border-radius: 9999px;
          background: #34d399;
          box-shadow: 0 0 0 3px rgba(52,211,153,0.25), 0 0 18px rgba(52,211,153,0.7);
          animation: vibePulse 2.6s ease-in-out infinite;
        }
        .vibe-marker-inner.is-region .vibe-marker-dot {
          width: 14px; height: 14px;
          background: #fbbf24;
          box-shadow: 0 0 0 4px rgba(251,191,36,0.25), 0 0 22px rgba(251,191,36,0.8);
        }
        .vibe-marker-inner.is-ambient .vibe-marker-dot {
          width: 7px; height: 7px;
          background: #f97316;
          box-shadow: 0 0 0 2px rgba(249,115,22,0.2), 0 0 12px rgba(249,115,22,0.6);
        }
        .vibe-marker-label {
          white-space: nowrap;
          font-size: 10px;
          font-weight: 700;
          color: white;
          text-shadow: 0 1px 4px rgba(0,0,0,0.9);
          letter-spacing: 0.02em;
        }
        .vibe-marker-inner.is-region .vibe-marker-label { font-size: 12px; }
        .vibe-marker-inner.is-ambient .vibe-marker-label {
          color: rgba(255,255,255,0.7);
          font-weight: 500;
        }
        @keyframes vibePulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.25); opacity: 0.85; }
        }
        .mapboxgl-ctrl-logo, .mapboxgl-ctrl-attrib { display: none !important; }
      `}</style>
    </div>
  );
}
