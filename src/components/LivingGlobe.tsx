import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { regions } from "@/lib/regions";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYmdhbGxhZ3NkIiwiYSI6ImNtYnR5cTc0cTA4Z2gycXBxNDR3dXdkencifQ.gKQH6ihL3rMHiTkdmyjoBg";

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
  { coords: [-75.6, 35.2], label: "Cape Hatteras" },
  { coords: [-70.4, 19.8], label: "Cabarete" },
  { coords: [-38.6, -3.6], label: "Cumbuco" },
  { coords: [-5.6, 36.0], label: "Tarifa" },
  { coords: [-9.07, 39.6], label: "Nazaré" },
  { coords: [13.6, 68.0], label: "Lofoten" },
  { coords: [151.2, -33.8], label: "Sydney" },
  { coords: [18.4, -34.0], label: "Cape Town" },
  { coords: [139.7, 35.6], label: "Tokyo" },
  { coords: [100.5, 13.7], label: "Bangkok" },
];

type Pin = {
  id: string;
  coords: [number, number];
  label: string;
  vibe?: string;
  slug?: string;
  isRegion?: boolean;
};

function buildPins(): Pin[] {
  const pts: Pin[] = [];
  for (const r of regions) {
    const center = REGION_CENTER[r.slug] ?? [0, 0];
    pts.push({
      id: `region-${r.slug}`,
      coords: center,
      label: r.name.replace(" Signal", ""),
      slug: r.slug,
      isRegion: true,
    });
    for (const d of r.previewFeed.slice(0, 3)) {
      pts.push({
        id: `${r.slug}-${d.spot}-${d.by}`,
        coords: SPOT_COORDS[d.spot] ?? center,
        label: d.spot,
        vibe: d.vibe,
        slug: r.slug,
      });
    }
  }
  for (const a of AMBIENT_SPOTS) {
    pts.push({ id: `ambient-${a.label}`, coords: a.coords, label: a.label });
  }
  return pts;
}

export function LivingGlobe() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<"3d" | "2d">("3d");
  const pins = useMemo(buildPins, []);

  useEffect(() => {
    if (!mapRef.current) return;
    try {
      mapRef.current.setProjection(mode === "3d" ? "globe" : "mercator");
    } catch {}
  }, [mode]);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;
    let cancelled = false;
    let spinTimer: number | undefined;
    let userInteracting = false;
    const markers: any[] = [];

    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      await import("mapbox-gl/dist/mapbox-gl.css");
      if (cancelled || !containerRef.current) return;

      mapboxgl.accessToken = MAPBOX_TOKEN;

      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/satellite-v9",
        projection: "globe" as any,
        zoom: 1.6,
        center: [10, 20],
        pitch: 0,
        attributionControl: false,
        interactive: true,
        scrollZoom: false,
      });
      mapRef.current = map;

      map.on("style.load", () => {
        map.setFog({
          color: "rgb(186, 210, 235)",
          "high-color": "rgb(36, 92, 223)",
          "horizon-blend": 0.02,
          "space-color": "rgb(8, 8, 16)",
          "star-intensity": 0.7,
        } as any);
        setReady(true);

        for (const p of pins) {
          const el = document.createElement("div");
          el.className = "fringe-pin";
          el.innerHTML = `
            <span class="fringe-pin-ring"></span>
            <span class="fringe-pin-dot ${p.isRegion ? "is-region" : ""}"></span>
            <span class="fringe-pin-label">${p.label}</span>
          `;
          if (p.slug) {
            el.style.cursor = "pointer";
            el.addEventListener("click", (e) => {
              e.stopPropagation();
              navigate({ to: "/regions/$slug", params: { slug: p.slug! } });
            });
          }
          const m = new mapboxgl.Marker({ element: el, anchor: "center" })
            .setLngLat(p.coords)
            .addTo(map);
          markers.push(m);
        }
      });

      const secondsPerRevolution = 120;
      const maxSpinZoom = 4;

      const spin = () => {
        if (!mapRef.current) return;
        const z = mapRef.current.getZoom();
        if (!userInteracting && z < maxSpinZoom) {
          const distancePerSecond = 360 / secondsPerRevolution;
          const c = mapRef.current.getCenter();
          c.lng -= distancePerSecond;
          mapRef.current.easeTo({ center: c, duration: 1000, easing: (n: number) => n });
        }
        spinTimer = window.setTimeout(spin, 1000);
      };

      map.on("mousedown", () => { userInteracting = true; });
      map.on("mouseup", () => { userInteracting = false; });
      map.on("dragend", () => { userInteracting = false; });
      map.on("touchstart", () => { userInteracting = true; });
      map.on("touchend", () => { userInteracting = false; });

      spinTimer = window.setTimeout(spin, 1500);

      const onResize = () => map.resize();
      window.addEventListener("resize", onResize);
      const ro = new ResizeObserver(() => map.resize());
      ro.observe(containerRef.current);
      setTimeout(() => map.resize(), 100);

      (map as any).__cleanup = () => {
        window.removeEventListener("resize", onResize);
        ro.disconnect();
      };
    })();

    return () => {
      cancelled = true;
      if (spinTimer) clearTimeout(spinTimer);
      for (const m of markers) m.remove();
      if (mapRef.current) {
        try { (mapRef.current as any).__cleanup?.(); } catch {}
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [navigate, pins]);

  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-background">
      <div ref={containerRef} className="absolute inset-0" />

      {!ready && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/50">
            Spinning up the Living Globe…
          </p>
        </div>
      )}

      {/* Top overlay: live badge + 2D/3D toggle */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-3 px-6 pt-6 md:pt-8">
        <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-signal/40 bg-background/60 px-3 py-1.5 backdrop-blur-md">
          <span className="relative inline-flex size-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-signal opacity-70" />
            <span className="relative size-1.5 rounded-full bg-signal" />
          </span>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-signal">
            The Living Globe is on
          </span>
        </div>
        <div className="pointer-events-auto inline-flex overflow-hidden rounded-full border border-foreground/20 bg-background/60 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setMode("3d")}
            className={`px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.25em] transition-colors ${mode === "3d" ? "bg-foreground text-background" : "text-foreground/70 hover:text-foreground"}`}
          >
            3D
          </button>
          <button
            type="button"
            onClick={() => setMode("2d")}
            className={`px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.25em] transition-colors ${mode === "2d" ? "bg-foreground text-background" : "text-foreground/70 hover:text-foreground"}`}
          >
            2D
          </button>
        </div>
      </div>

      {/* Bottom hint */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center px-6 pb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/60 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
          Tap a region pin to open it · drag to spin
        </p>
      </div>

      <style>{`
        .fringe-pin {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: translate(-50%, -50%);
          pointer-events: auto;
        }
        .fringe-pin-dot {
          display: block;
          width: 10px;
          height: 10px;
          border-radius: 9999px;
          background: hsl(var(--sunset, 28 92% 60%));
          box-shadow: 0 0 0 2px rgba(0,0,0,0.6), 0 0 16px rgba(255,180,80,0.7);
        }
        .fringe-pin-dot.is-region {
          width: 14px;
          height: 14px;
          background: hsl(var(--signal, 142 76% 55%));
          box-shadow: 0 0 0 2px rgba(0,0,0,0.7), 0 0 20px rgba(80,255,160,0.85);
        }
        .fringe-pin-ring {
          position: absolute;
          top: 0; left: 50%;
          width: 22px; height: 22px;
          margin-left: -11px;
          border-radius: 9999px;
          border: 1.5px solid rgba(255,255,255,0.65);
          animation: fringe-ping 2.4s cubic-bezier(0,0,0.2,1) infinite;
          opacity: 0;
        }
        @keyframes fringe-ping {
          0% { transform: scale(0.4); opacity: 0.9; }
          80%, 100% { transform: scale(2.2); opacity: 0; }
        }
        .fringe-pin-label {
          margin-top: 6px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.92);
          background: rgba(0,0,0,0.55);
          padding: 2px 6px;
          border-radius: 4px;
          white-space: nowrap;
          backdrop-filter: blur(4px);
        }
        .mapboxgl-canvas { outline: none; }
      `}</style>
    </section>
  );
}
