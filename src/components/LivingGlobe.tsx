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

const TAG_EMOJI: Record<string, string> = {
  crowd: "👥",
  wind: "💨",
  sunset: "🌅",
  food: "🍽️",
  music: "🎶",
  surf: "🏄",
  vibe: "✨",
};

const GLOBE_INITIAL_CENTER: [number, number] = [10, -80];
const GLOBE_INITIAL_ZOOM = 1.4;

type Pin = {
  id: string;
  coords: [number, number];
  label: string;
  vibe?: string;
  by?: string;
  minutesAgo?: number;
  tag?: string;
  slug?: string;
  isRegion?: boolean;
  isAmbient?: boolean;
};

function buildPins(): Pin[] {
  const pts: Pin[] = [];
  for (const r of regions) {
    const center = REGION_CENTER[r.slug] ?? [0, 0];
    pts.push({
      id: `region-${r.slug}`,
      coords: center,
      label: r.name.replace(" Signal", ""),
      sublabel: r.country,
      slug: r.slug,
      isRegion: true,
    });
    for (const d of r.previewFeed.slice(0, 3)) {
      pts.push({
        id: `${r.slug}-${d.spot}-${d.by}`,
        coords: SPOT_COORDS[d.spot] ?? center,
        label: d.spot,
        sublabel: r.country,
        vibe: d.vibe,
        by: d.by,
        minutesAgo: d.minutesAgo,
        tag: d.tag,
        slug: r.slug,
      });
    }
  }
  for (const a of AMBIENT_SPOTS) {
    pts.push({ id: `ambient-${a.label}`, coords: a.coords, label: a.label, isAmbient: true });
  }
  return pts;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

export function LivingGlobe() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const mapRef = useRef<any>(null);
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<"3d" | "2d">("3d");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const pins = useMemo(buildPins, []);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("fullscreen") === "1" && sectionRef.current && !document.fullscreenElement) {
      sectionRef.current.requestFullscreen?.().catch(() => {});
      const url = new URL(window.location.href);
      url.searchParams.delete("fullscreen");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  const toggleFullscreen = () => {
    const el = sectionRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

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
        zoom: GLOBE_INITIAL_ZOOM,
        center: GLOBE_INITIAL_CENTER,
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
          const emoji = p.tag ? TAG_EMOJI[p.tag] ?? "📍" : "📍";

          if (p.isAmbient) {
            el.className = "fringe-pin";
            el.innerHTML = `
              <span class="fringe-anchor"><span class="fringe-anchor-dot ambient"></span></span>
              <span class="fringe-pin-label">${escapeHtml(p.label)}</span>
            `;
          } else if (p.isRegion) {
            el.className = "fringe-spot-card region";
            el.innerHTML = `
              <div class="fringe-card-body">
                <div class="fringe-card-row">
                  <span class="fringe-card-emoji">🟢</span>
                  <span class="fringe-card-title">${escapeHtml(p.label)}</span>
                </div>
                <div class="fringe-card-cta">Open Signal →</div>
              </div>
              <span class="fringe-card-tail"></span>
              <span class="fringe-anchor"><span class="fringe-anchor-dot region"></span></span>
            `;
          } else {
            el.className = "fringe-spot-card";
            const meta = [
              p.by ? `@${escapeHtml(p.by)}` : "",
              p.minutesAgo != null ? `${p.minutesAgo}m ago` : "",
            ].filter(Boolean).join(" · ");
            el.innerHTML = `
              <div class="fringe-card-body">
                <div class="fringe-card-row">
                  <span class="fringe-card-emoji">${emoji}</span>
                  <span class="fringe-card-title">${escapeHtml(p.label)}</span>
                </div>
                ${p.vibe ? `<div class="fringe-card-vibe">${escapeHtml(p.vibe)}</div>` : ""}
                ${meta ? `<div class="fringe-card-meta">${meta}</div>` : ""}
              </div>
              <span class="fringe-card-tail"></span>
              <span class="fringe-anchor"><span class="fringe-anchor-dot"></span></span>
            `;
          }

          if (p.slug) {
            el.style.cursor = "pointer";
            el.addEventListener("click", (e) => {
              e.stopPropagation();
              navigate({ to: "/regions/$slug", params: { slug: p.slug! } });
            });
          }
          const m = new mapboxgl.Marker({ element: el, anchor: "bottom", offset: [0, 0] })
            .setLngLat(p.coords)
            .addTo(map);
          markers.push(m);
        }

      });

      const secondsPerRevolution = 120;
      const maxSpinZoom = 4;

      const frameGlobe = () => map.resize();

      const spin = () => {
        if (!mapRef.current) return;
        const z = mapRef.current.getZoom();
        if (!userInteracting && z < maxSpinZoom) {
          const distancePerSecond = 360 / secondsPerRevolution;
          const c = mapRef.current.getCenter();
          c.lng -= distancePerSecond;
          c.lat = GLOBE_INITIAL_CENTER[1];
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

      const onResize = frameGlobe;
      window.addEventListener("resize", onResize);
      const ro = new ResizeObserver(frameGlobe);
      ro.observe(containerRef.current);
      setTimeout(frameGlobe, 100);

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
    <section id="living-globe" ref={sectionRef} className="relative h-[calc(100svh-4rem)] w-full overflow-hidden bg-background">
      <div ref={containerRef} className="absolute inset-0 -translate-y-72" />

      {!ready && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/50">
            Spinning up the Living Globe…
          </p>
        </div>
      )}

      {isFullscreen && (
        <button
          type="button"
          onClick={toggleFullscreen}
          className="absolute right-3 top-3 z-20 inline-flex items-center gap-2 rounded-full border border-foreground/30 bg-background/85 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-foreground shadow-lg backdrop-blur-md transition-colors hover:bg-background sm:right-6 sm:top-6 sm:px-5 sm:py-2.5"
          aria-label="Exit full screen"
        >
          <span aria-hidden className="text-base leading-none">×</span>
          Exit Fullscreen
        </button>
      )}

      {/* Top overlay: live badge + controls */}
      <div className="pointer-events-none absolute inset-x-0 top-16 z-10 flex flex-wrap items-center justify-between gap-2 px-3 pt-3 sm:gap-3 sm:px-6 sm:pt-4 md:pt-6">
        <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-signal/40 bg-background/60 px-2.5 py-1 backdrop-blur-md sm:px-3 sm:py-1.5">
          <span className="relative inline-flex size-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-signal opacity-70" />
            <span className="relative size-1.5 rounded-full bg-signal" />
          </span>
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-signal sm:text-[10px] sm:tracking-[0.25em]">
            <span className="sm:hidden">Live</span>
            <span className="hidden sm:inline">The Living Globe is on</span>
          </span>
        </div>
        <div className="pointer-events-auto flex flex-wrap items-center justify-end gap-2">
          <div className="inline-flex overflow-hidden rounded-full border border-foreground/20 bg-background/60 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setMode("3d")}
              className={`px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] transition-colors sm:px-3 sm:py-1.5 sm:text-[10px] sm:tracking-[0.25em] ${mode === "3d" ? "bg-foreground text-background" : "text-foreground/70 hover:text-foreground"}`}
            >
              3D
            </button>
            <button
              type="button"
              onClick={() => setMode("2d")}
              className={`px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] transition-colors sm:px-3 sm:py-1.5 sm:text-[10px] sm:tracking-[0.25em] ${mode === "2d" ? "bg-foreground text-background" : "text-foreground/70 hover:text-foreground"}`}
            >
              2D
            </button>
          </div>
          <div className="inline-flex overflow-hidden rounded-full border border-foreground/20 bg-background/60 backdrop-blur-md">
            <button
              type="button"
              onClick={() => mapRef.current?.zoomIn()}
              className="px-2.5 py-0.5 font-mono text-sm font-bold text-foreground/80 transition-colors hover:text-foreground sm:px-3 sm:py-1 sm:text-base"
              aria-label="Zoom in"
            >
              +
            </button>
            <span className="w-px bg-foreground/20" />
            <button
              type="button"
              onClick={() => mapRef.current?.zoomOut()}
              className="px-2.5 py-0.5 font-mono text-sm font-bold text-foreground/80 transition-colors hover:text-foreground sm:px-3 sm:py-1 sm:text-base"
              aria-label="Zoom out"
            >
              −
            </button>
          </div>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-background/60 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-foreground/80 backdrop-blur-md transition-colors hover:text-foreground sm:px-3 sm:py-1.5 sm:text-[10px] sm:tracking-[0.25em]"
            aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"}
          >
            {isFullscreen ? "Exit" : "Full"}
            <span className="hidden sm:inline">{isFullscreen ? " Full" : " Screen"}</span>
          </button>
        </div>
      </div>

      {/* Bottom hint */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center px-6 pb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/60 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
          Tap a region pin · drag to spin · pinch or +/− to zoom
        </p>
      </div>

      <style>{`
        /* Ambient (label-only) pin */
        .fringe-pin {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          pointer-events: auto;
        }
        .fringe-pin-label {
          margin-top: 4px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.85);
          background: rgba(0,0,0,0.5);
          padding: 2px 6px;
          border-radius: 4px;
          white-space: nowrap;
          backdrop-filter: blur(4px);
        }

        /* Anchor dot — sits exactly on the lng/lat */
        .fringe-anchor {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 14px;
          height: 14px;
        }
        .fringe-anchor-dot {
          width: 10px;
          height: 10px;
          border-radius: 9999px;
          background: hsl(var(--sunset, 28 92% 60%));
          box-shadow: 0 0 0 2px rgba(0,0,0,0.65), 0 0 14px rgba(255,180,80,0.75);
        }
        .fringe-anchor-dot.region {
          width: 12px; height: 12px;
          background: hsl(var(--signal, 142 76% 55%));
          box-shadow: 0 0 0 2px rgba(0,0,0,0.7), 0 0 18px rgba(80,255,160,0.9);
        }
        .fringe-anchor-dot.ambient {
          width: 8px; height: 8px;
          background: rgba(255,255,255,0.85);
          box-shadow: 0 0 0 2px rgba(0,0,0,0.6), 0 0 10px rgba(255,255,255,0.5);
        }
        .fringe-anchor-dot::after {
          content: "";
          position: absolute;
          inset: -6px;
          border-radius: 9999px;
          border: 1.5px solid rgba(255,255,255,0.55);
          animation: fringe-ping 2.4s cubic-bezier(0,0,0.2,1) infinite;
          opacity: 0;
        }
        @keyframes fringe-ping {
          0% { transform: scale(0.4); opacity: 0.9; }
          80%, 100% { transform: scale(2.2); opacity: 0; }
        }

        /* Spot card — anchored above the location dot */
        .fringe-spot-card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          pointer-events: auto;
          /* card grows up, anchor dot sits at bottom on the coord */
        }
        .fringe-spot-card .fringe-card-body {
          min-width: 150px;
          max-width: 220px;
          padding: 8px 10px;
          border-radius: 10px;
          background: rgba(10, 10, 14, 0.82);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(10px);
          box-shadow: 0 10px 28px -10px rgba(0,0,0,0.75);
          color: rgba(255,255,255,0.95);
          font-family: ui-sans-serif, system-ui, -apple-system, "Helvetica Neue", sans-serif;
          transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
        }
        .fringe-spot-card:hover .fringe-card-body {
          transform: translateY(-2px);
          border-color: hsl(var(--signal, 142 76% 55%) / 0.55);
          box-shadow: 0 14px 36px -10px rgba(0,0,0,0.85), 0 0 0 1px hsl(var(--signal, 142 76% 55%) / 0.25);
        }
        .fringe-spot-card.region .fringe-card-body {
          background: rgba(8, 20, 14, 0.88);
          border-color: hsl(var(--signal, 142 76% 55%) / 0.45);
        }
        .fringe-card-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .fringe-card-emoji {
          font-size: 13px;
          line-height: 1;
        }
        .fringe-card-title {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.96);
        }
        .fringe-card-vibe {
          margin-top: 4px;
          font-size: 11px;
          line-height: 1.35;
          color: rgba(255,255,255,0.82);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .fringe-card-meta {
          margin-top: 6px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 9px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
        }
        .fringe-card-cta {
          margin-top: 4px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: hsl(var(--signal, 142 76% 55%));
        }
        /* Tail / connector from card to anchor dot */
        .fringe-card-tail {
          width: 2px;
          height: 10px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.5), rgba(255,255,255,0.1));
        }

        .mapboxgl-canvas { outline: none; }
      `}</style>
    </section>
  );
}

