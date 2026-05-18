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
  boracay: [121.9248, 11.9674],
  rio: [-43.1729, -22.9711],
  "hood-river": [-121.5215, 45.7054],
};

const TAG_EMOJI: Record<string, string> = {
  crowd: "👥",
  wind: "💨",
  sunset: "🌅",
  food: "🍽️",
  music: "🎶",
  surf: "🏄",
  vibe: "✨",
};

const GLOBE_INITIAL_CENTER: [number, number] = [-98, 40];
const GLOBE_INITIAL_ZOOM = 2.3;
const GLOBE_MAX_AUTO_ZOOM = 3.45;
const GLOBE_BOTTOM_MARGIN = 2;

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function isGlobePixel(r: number, g: number, b: number, a: number): boolean {
  if (a < 20) return false;
  if (r > 238 && g > 238 && b > 238) return false;
  const avg = (r + g + b) / 3;
  return (b > 42 && avg > 28) || (g > 48 && avg > 34) || (r > 58 && g > 48 && b > 32);
}

function measureRenderedGlobeBounds(container: HTMLDivElement): { top: number; bottom: number; height: number } | null {
  const canvas = container.querySelector(".mapboxgl-canvas") as HTMLCanvasElement | null;
  if (!canvas || canvas.clientWidth === 0 || canvas.clientHeight === 0) return null;
  const gl = (canvas.getContext("webgl2") || canvas.getContext("webgl")) as WebGL2RenderingContext | WebGLRenderingContext | null;
  if (!gl) return null;

  const width = gl.drawingBufferWidth;
  const height = gl.drawingBufferHeight;
  if (width <= 0 || height <= 0) return null;

  const pixels = new Uint8Array(width * height * 4);
  try {
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  } catch {
    return null;
  }

  const step = clamp(Math.floor(Math.min(width, height) / 220), 3, 8);
  const xMin = Math.floor(width * 0.2);
  const xMax = Math.floor(width * 0.8);
  const minRowHits = Math.max(8, Math.floor(((xMax - xMin) / step) * 0.07));
  let top = Infinity;
  let bottom = -Infinity;

  for (let y = 0; y < height; y += step) {
    let hits = 0;
    for (let x = xMin; x < xMax; x += step) {
      const idx = (y * width + x) * 4;
      if (isGlobePixel(pixels[idx], pixels[idx + 1], pixels[idx + 2], pixels[idx + 3])) hits += 1;
    }
    if (hits >= minRowHits) {
      const cssY = canvas.clientHeight - (y / height) * canvas.clientHeight;
      top = Math.min(top, cssY);
      bottom = Math.max(bottom, cssY);
    }
  }

  if (!Number.isFinite(top) || !Number.isFinite(bottom) || bottom <= top) return null;
  return { top, bottom, height: bottom - top };
}

type Pin = {
  id: string;
  coords: [number, number];
  label: string;
  sublabel?: string;
  vibe?: string;
  by?: string;
  minutesAgo?: number;
  tag?: string;
  slug?: string;
  isRegion?: boolean;
  isAmbient?: boolean;
  freshVibes?: number;
  activeSpots?: number;
  lastUpdatedMin?: number;
  tags?: string;
};

function buildPins(): Pin[] {
  const pts: Pin[] = [];
  for (const r of regions) {
    const center = REGION_CENTER[r.slug] ?? [0, 0];
    const latest = r.previewFeed[0];
    pts.push({
      id: `region-${r.slug}`,
      coords: center,
      label: r.name.replace(" Signal", ""),
      sublabel: r.country,
      vibe: latest?.vibe,
      by: latest?.by,
      minutesAgo: latest?.minutesAgo,
      tag: latest?.tag,
      slug: r.slug,
      isRegion: true,
      freshVibes: r.freshVibes,
      activeSpots: r.activeSpots,
      lastUpdatedMin: r.lastUpdatedMin,
      tags: r.tags,
    });
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
  const framedCenterLatRef = useRef(GLOBE_INITIAL_CENTER[1]);
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

  // Use the rendered canvas itself as the source of truth. Mapbox's globe
  // projection is non-linear, so formula-only zoom guesses drift across
  // viewport sizes; measuring the actual drawn sphere lets us correct both
  // zoom and vertical framing until the bottom reaches the container edge.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let raf = 0;
    const apply = () => {
      const m = mapRef.current;
      if (!m) return;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      try {
        m.resize();
        const bounds = mode === "3d" ? measureRenderedGlobeBounds(el) : null;
        if (!bounds) return;

        const targetBottom = rect.height - GLOBE_BOTTOM_MARGIN;
        const zoomScale = clamp(rect.height / bounds.height, 1, 1.28);
        const nextZoom = clamp(m.getZoom() + Math.log2(zoomScale), GLOBE_INITIAL_ZOOM, GLOBE_MAX_AUTO_ZOOM);
        const bottomGap = targetBottom - bounds.bottom;
        const screenCenterY = rect.height / 2;
        const globeCenterY = (bounds.top + bounds.bottom) / 2;
        const verticalOffset = clamp(bottomGap + (screenCenterY - globeCenterY) * 0.18, -rect.height * 0.3, rect.height * 0.45);

        if (Math.abs(nextZoom - m.getZoom()) > 0.01) m.setZoom(nextZoom);
        if (Math.abs(verticalOffset) > 2) m.panBy([0, verticalOffset], { duration: 0 });
        framedCenterLatRef.current = m.getCenter().lat;
      } catch {}
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      let passes = 0;
      const tick = () => {
        apply();
        passes += 1;
        if (passes < 8) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    schedule();
    const ro = new ResizeObserver(schedule);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [isFullscreen, ready, mode]);

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
        preserveDrawingBuffer: true,
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
            el.className = "fringe-beacon";
            const tagEmoji = p.tag ? TAG_EMOJI[p.tag] ?? "✨" : "✨";
            el.innerHTML = `
              <span class="fringe-beacon-rings">
                <span class="fringe-beacon-ring r1"></span>
                <span class="fringe-beacon-ring r2"></span>
                <span class="fringe-beacon-ring r3"></span>
              </span>
              <span class="fringe-beacon-core"></span>
              <div class="fringe-card" role="group">
                <div class="fringe-card-head">
                  <span class="fringe-card-live">
                    <span class="fringe-card-live-dot"></span>LIVE
                  </span>
                  ${typeof p.lastUpdatedMin === "number" ? `<span class="fringe-card-time">${p.lastUpdatedMin}m ago</span>` : ""}
                </div>
                <div class="fringe-card-title">${escapeHtml(p.label)}</div>
                ${p.sublabel ? `<div class="fringe-card-sub">${escapeHtml(p.sublabel)}</div>` : ""}
                <div class="fringe-card-stats">
                  ${typeof p.freshVibes === "number" ? `<span class="fringe-card-stat"><b>${p.freshVibes}</b> fresh</span>` : ""}
                  ${typeof p.activeSpots === "number" ? `<span class="fringe-card-stat"><b>${p.activeSpots}</b> spots</span>` : ""}
                </div>
                ${p.vibe ? `
                  <div class="fringe-card-quote">
                    <span class="fringe-card-quote-tag">${tagEmoji}</span>
                    <span class="fringe-card-quote-text">"${escapeHtml(p.vibe)}"</span>
                  </div>
                  ${p.by ? `<div class="fringe-card-by">@${escapeHtml(p.by)}</div>` : ""}
                ` : ""}
                <div class="fringe-card-cta">Open Signal <span aria-hidden>→</span></div>
              </div>
            `;
          } else {
            el.className = "fringe-spot";
            el.innerHTML = `
              <span class="fringe-spot-icon">${emoji}</span>
              <span class="fringe-spot-label">
                <span class="fringe-spot-name">${escapeHtml(p.label)}</span>
                ${p.sublabel ? `<span class="fringe-spot-sub">${escapeHtml(p.sublabel)}</span>` : ""}
              </span>
            `;
          }

          if (p.slug) {
            el.style.cursor = "pointer";
            el.addEventListener("click", (e) => {
              e.stopPropagation();
              navigate({ to: "/regions/$slug", params: { slug: p.slug! } });
            });
          }
          const anchor = "center";
          const m = new mapboxgl.Marker({ element: el, anchor, offset: [0, 0] })
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
          c.lat = framedCenterLatRef.current;
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
      <div ref={containerRef} className="living-globe-map absolute inset-0" />

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

        /* Compact spot pin — icon centered exactly on coord, label floats below without affecting anchor */
        .fringe-spot {
          position: relative;
          width: 0;
          height: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: auto;
        }
        .fringe-spot-icon {
          font-size: 16px;
          line-height: 1;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.85));
          transition: transform 0.18s ease, filter 0.18s ease;
        }
        .fringe-spot:hover .fringe-spot-icon {
          transform: scale(1.15);
          filter: drop-shadow(0 0 8px hsl(var(--signal, 142 76% 55%) / 0.9));
        }
        .fringe-spot-icon.region {
          font-size: 12px;
        }
        .fringe-spot-label {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translate(-50%, 4px);
          display: flex;
          flex-direction: column;
          align-items: center;
          line-height: 1.15;
          text-shadow: 0 1px 3px rgba(0,0,0,0.95), 0 0 6px rgba(0,0,0,0.85);
          white-space: nowrap;
          pointer-events: none;
        }
        .fringe-spot-name {
          font-family: ui-sans-serif, system-ui, -apple-system, "Helvetica Neue", sans-serif;
          font-size: 10px;
          font-weight: 700;
          color: rgba(255,255,255,0.98);
          letter-spacing: 0.02em;
        }
        .fringe-spot-sub {
          font-family: ui-sans-serif, system-ui, -apple-system, "Helvetica Neue", sans-serif;
          font-size: 9px;
          font-weight: 500;
          color: rgba(255,255,255,0.78);
          letter-spacing: 0.02em;
        }

        /* Radiant pulse beacon — for live regions */
        .fringe-beacon {
          position: relative;
          width: 0;
          height: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: auto;
        }
        .fringe-beacon-core {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 9999px;
          background: hsl(var(--signal, 165 85% 56%));
          box-shadow:
            0 0 0 2px rgba(0,0,0,0.55),
            0 0 12px hsl(var(--signal, 165 85% 56%) / 0.95),
            0 0 28px hsl(var(--signal, 165 85% 56%) / 0.65);
          z-index: 2;
        }
        .fringe-beacon-rings {
          position: absolute;
          inset: 0;
          display: block;
          pointer-events: none;
        }
        .fringe-beacon-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          border-radius: 9999px;
          border: 1.5px solid hsl(var(--signal, 165 85% 56%));
          transform: translate(-50%, -50%) scale(0.4);
          opacity: 0;
          animation: fringe-beacon-ping 2.6s cubic-bezier(0,0,0.2,1) infinite;
        }
        .fringe-beacon-ring.r1 { width: 28px; height: 28px; animation-delay: 0s; }
        .fringe-beacon-ring.r2 { width: 44px; height: 44px; animation-delay: 0.6s; }
        .fringe-beacon-ring.r3 { width: 60px; height: 60px; animation-delay: 1.2s; }
        @keyframes fringe-beacon-ping {
          0%   { transform: translate(-50%, -50%) scale(0.35); opacity: 0.9; }
          70%  { opacity: 0.15; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
        }
        /* Rich spot card */
        .fringe-card {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, 38px);
          width: 240px;
          padding: 12px 13px 11px;
          background: linear-gradient(180deg, rgba(10,14,16,0.92), rgba(6,9,11,0.95));
          border: 1px solid hsl(var(--signal, 165 85% 56%) / 0.35);
          border-radius: 12px;
          backdrop-filter: blur(10px);
          box-shadow:
            0 10px 30px rgba(0,0,0,0.55),
            0 0 0 1px rgba(255,255,255,0.04) inset,
            0 0 24px hsl(var(--signal, 165 85% 56%) / 0.18);
          color: rgba(255,255,255,0.95);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.18s ease, transform 0.18s ease;
          z-index: 5;
        }
        .fringe-card::before {
          content: "";
          position: absolute;
          top: -6px;
          left: 50%;
          transform: translateX(-50%) rotate(45deg);
          width: 10px;
          height: 10px;
          background: rgba(10,14,16,0.92);
          border-left: 1px solid hsl(var(--signal, 165 85% 56%) / 0.35);
          border-top: 1px solid hsl(var(--signal, 165 85% 56%) / 0.35);
        }
        .fringe-beacon:hover .fringe-card,
        .fringe-beacon:focus-within .fringe-card {
          opacity: 1;
          transform: translate(-50%, 30px);
        }
        .fringe-card-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }
        .fringe-card-live {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.2em;
          color: hsl(var(--signal, 165 85% 56%));
        }
        .fringe-card-live-dot {
          width: 6px; height: 6px; border-radius: 9999px;
          background: hsl(var(--signal, 165 85% 56%));
          box-shadow: 0 0 8px hsl(var(--signal, 165 85% 56%));
          animation: fringe-card-blink 1.6s ease-in-out infinite;
        }
        @keyframes fringe-card-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        .fringe-card-time {
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 9px;
          color: rgba(255,255,255,0.55);
          letter-spacing: 0.08em;
        }
        .fringe-card-title {
          font-family: ui-sans-serif, system-ui, -apple-system, "Helvetica Neue", sans-serif;
          font-size: 16px;
          font-weight: 800;
          letter-spacing: -0.01em;
          color: #fff;
          line-height: 1.1;
        }
        .fringe-card-sub {
          margin-top: 2px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
        }
        .fringe-card-stats {
          display: flex;
          gap: 10px;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .fringe-card-stat {
          font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
          font-size: 10px;
          color: rgba(255,255,255,0.6);
        }
        .fringe-card-stat b {
          color: #fff;
          font-weight: 700;
          margin-right: 3px;
        }
        .fringe-card-quote {
          margin-top: 9px;
          display: flex;
          gap: 6px;
          align-items: flex-start;
        }
        .fringe-card-quote-tag {
          font-size: 12px;
          line-height: 1.3;
          flex-shrink: 0;
        }
        .fringe-card-quote-text {
          font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
          font-size: 11px;
          line-height: 1.35;
          color: rgba(255,255,255,0.82);
          font-style: italic;
        }
        .fringe-card-by {
          margin-top: 3px;
          margin-left: 18px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 9px;
          color: rgba(255,255,255,0.5);
        }
        .fringe-card-cta {
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 7px 10px;
          background: hsl(var(--signal, 165 85% 56%));
          color: #04110e;
          border-radius: 7px;
          font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.04em;
        }
        .fringe-beacon:hover .fringe-beacon-core {
          box-shadow:
            0 0 0 2px rgba(0,0,0,0.55),
            0 0 16px hsl(var(--signal, 165 85% 56%)),
            0 0 36px hsl(var(--signal, 165 85% 56%) / 0.8);
        }

        .living-globe-map,
        .living-globe-map .mapboxgl-map,
        .living-globe-map .mapboxgl-canvas-container,
        .living-globe-map .mapboxgl-canvas {
          position: absolute !important;
          inset: 0 !important;
          width: 100% !important;
          height: 100% !important;
        }
        .living-globe-map .mapboxgl-canvas { outline: none; }
      `}</style>
    </section>
  );
}