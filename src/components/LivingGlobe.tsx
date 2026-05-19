import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
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
  rio: [-43.1822, -22.9846],
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
  image?: string;
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
      image: r.image,
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
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  useEffect(() => { pausedRef.current = paused; }, [paused]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const pins = useMemo(buildPins, []);

  const totals = useMemo(() => {
    const totalVibes = regions.reduce((s, r) => s + r.freshVibes, 0);
    const totalSpots = regions.reduce((s, r) => s + r.activeSpots, 0);
    return { totalVibes, totalSpots };
  }, []);

  // Simulated current-viewer ticker — derived from totals with gentle drift.
  const [viewers, setViewers] = useState(() => totals.totalVibes * 347 + 11820);
  useEffect(() => {
    const id = window.setInterval(() => {
      setViewers((v) => {
        const drift = Math.floor((Math.random() - 0.45) * 24);
        const next = v + drift;
        return next < 8000 ? 8000 + Math.floor(Math.random() * 50) : next;
      });
    }, 1800);
    return () => window.clearInterval(id);
  }, []);

  const selectedRegion = useMemo(
    () => (selectedSlug ? regions.find((r) => r.slug === selectedSlug) ?? null : null),
    [selectedSlug],
  );

  useEffect(() => {
    if (!selectedSlug) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSelectedSlug(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedSlug]);

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

  // Keep Mapbox's WebGL context untouched. The previous pixel-read framing
  // loop could stall the renderer; resizing plus a conservative zoom keeps
  // the globe stable without hijacking the canvas.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const frameGlobe = () => {
      const m = mapRef.current;
      if (!m) return;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      try {
        m.resize();
        const viewportScale = Math.min(rect.width / 1411, rect.height / 904);
        const nextZoom = clamp(GLOBE_INITIAL_ZOOM + Math.log2(Math.max(viewportScale, 0.72)) * 0.28, 2.05, GLOBE_MAX_AUTO_ZOOM);
        if (mode === "3d" && Math.abs(m.getZoom() - nextZoom) > 0.15) m.setZoom(nextZoom);
        framedCenterLatRef.current = m.getCenter().lat;
      } catch {}
    };
    const schedule = () => {
      requestAnimationFrame(frameGlobe);
    };
    schedule();
    const ro = new ResizeObserver(schedule);
    ro.observe(el);
    return () => {
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
              <span class="fringe-beacon-core">
                ${p.image ? `<img class="fringe-beacon-thumb" src="${escapeHtml(p.image)}" alt="" loading="lazy" />` : ""}
              </span>
              <span class="fringe-beacon-chip">
                <span class="fringe-beacon-chip-dot"></span>
                ${escapeHtml(p.label)}
                ${typeof p.freshVibes === "number" ? `<span class="fringe-beacon-chip-viewers" aria-label="viewers"><svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>${(p.freshVibes * 37 + 184).toLocaleString()}</span>` : ""}
              </span>
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
              setSelectedSlug(p.slug!);
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
        if (!userInteracting && !pausedRef.current && z < maxSpinZoom) {
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
        <div className="pointer-events-auto flex items-center gap-2.5 rounded-2xl border border-signal/40 bg-background/70 px-3.5 py-2 shadow-lg backdrop-blur-md sm:gap-3 sm:px-4 sm:py-2.5">
          <span className="relative inline-flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-signal opacity-70" />
            <span className="relative size-2 rounded-full bg-signal" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-extrabold tracking-tight text-foreground sm:text-base">
              FRiNGE Sessions
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/70 sm:text-[11px]">
              {totals.totalVibes} fresh vibes · {viewers.toLocaleString()} viewers
            </span>
          </div>
        </div>
        <div className="pointer-events-auto flex flex-col items-end gap-2">
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
            onClick={() => setPaused((p) => !p)}
            className="inline-flex items-center gap-1.5 rounded-full border border-foreground/20 bg-background/60 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-foreground/80 backdrop-blur-md transition-colors hover:text-foreground sm:px-3 sm:py-1.5 sm:text-[10px] sm:tracking-[0.25em]"
            aria-label={paused ? "Resume rotation" : "Pause rotation"}
            aria-pressed={paused}
          >
            <span aria-hidden>{paused ? "▶" : "❚❚"}</span>
            {paused ? "Play" : "Pause"}
          </button>
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

      {/* Spot card modal */}
      {selectedRegion && (
        <div
          className="absolute inset-0 z-30 flex items-end justify-center bg-black/55 backdrop-blur-sm sm:items-center"
          onClick={() => setSelectedSlug(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-lg overflow-hidden rounded-t-3xl border border-signal/40 bg-background shadow-2xl sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="relative inline-flex size-2">
                    <span className="absolute inset-0 animate-ping rounded-full bg-signal opacity-70" />
                    <span className="relative size-2 rounded-full bg-signal" />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-signal">
                    On air · {selectedRegion.lastUpdatedMin}m ago
                  </span>
                </div>
                <h3 className="mt-1.5 text-2xl font-extrabold tracking-tight">
                  {selectedRegion.name.replace(" Signal", "")}
                </h3>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55">
                  {selectedRegion.country}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSlug(null)}
                aria-label="Close"
                className="rounded-full border border-border bg-surface px-2.5 py-1 text-sm leading-none text-foreground/70 transition-colors hover:text-foreground"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 border-b border-border bg-surface/40 px-6 py-4 text-center">
              <ModalStat n={selectedRegion.freshVibes} label="Fresh vibes" highlight />
              <ModalStat n={selectedRegion.activeSpots} label="Active spots" />
              <ModalStat n={selectedRegion.previewFeed.length} label="Recent drops" />
            </div>

            <div className="max-h-[55vh] overflow-y-auto px-6 py-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/55">
                Locations in the area
              </p>
              <ul className="mt-3 grid grid-cols-2 gap-2">
                {selectedRegion.spots.map((s) => {
                  const fresh = selectedRegion.previewFeed.find((d) => d.spot.includes(s));
                  return (
                    <li
                      key={s}
                      className="flex items-center justify-between gap-2 rounded-xl border border-border bg-surface/60 px-3 py-2 text-sm"
                    >
                      <span className="font-semibold text-foreground/90">{s}</span>
                      <span
                        className={`size-1.5 rounded-full ${fresh ? "bg-signal shadow-[0_0_8px_hsl(var(--signal))]" : "bg-foreground/20"}`}
                        aria-label={fresh ? "Fresh vibe" : "Quiet"}
                      />
                    </li>
                  );
                })}
              </ul>

              <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/55">
                Latest vibes
              </p>
              <ul className="mt-3 grid grid-cols-2 gap-3">
                {selectedRegion.previewFeed.slice(0, 4).map((d, i) => {
                  const emoji = TAG_EMOJI[d.tag] ?? "✨";
                  return (
                    <li
                      key={i}
                      className="overflow-hidden rounded-xl border border-border bg-background"
                    >
                      <div className="relative aspect-[9/16] w-full overflow-hidden bg-surface-2">
                        <video
                          src="/fringe-app-preview.mp4"
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        <span className="absolute left-2 top-2 rounded-full bg-black/65 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-signal backdrop-blur-sm">
                          ● Live
                        </span>
                        <span className="absolute right-2 top-2 rounded-full bg-black/65 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur-sm">
                          {d.minutesAgo}m
                        </span>
                      </div>
                      <div className="px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm leading-none">{emoji}</span>
                          <span className="truncate text-xs font-bold text-foreground/90">
                            {d.spot}
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs text-foreground/75">"{d.vibe}"</p>
                        <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.15em] text-foreground/45">
                          @{d.by}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="border-t border-border bg-surface/40 px-6 py-4">
              <Link
                to="/regions/$slug"
                params={{ slug: selectedRegion.slug }}
                onClick={() => setSelectedSlug(null)}
                className="block w-full rounded-xl bg-signal py-3 text-center text-sm font-extrabold uppercase tracking-[0.12em] text-background transition-transform hover:scale-[1.02]"
              >
                Open full signal →
              </Link>
            </div>
          </div>
        </div>
      )}

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

        /* Radiant pulse beacon — for live regions.
           Zero-size container so the geographic coord stays the exact
           anchor at every zoom level, regardless of chip/card layout. */
        .fringe-beacon {
          position: relative;
          width: 0;
          height: 0;
          pointer-events: none;
          cursor: pointer;
        }
        .fringe-beacon-core {
          position: absolute;
          top: 0;
          left: 0;
          width: 16px;
          height: 16px;
          margin: -8px 0 0 -8px;
          border-radius: 9999px;
          background: radial-gradient(circle at 30% 30%, #fff 0%, hsl(var(--signal, 165 85% 56%)) 55%, hsl(var(--signal, 165 85% 56%) / 0.85) 100%);
          box-shadow:
            0 0 0 2px rgba(0,0,0,0.6),
            0 0 0 4px hsl(var(--signal, 165 85% 56%) / 0.35),
            0 0 18px hsl(var(--signal, 165 85% 56%) / 0.95),
            0 0 36px hsl(var(--signal, 165 85% 56%) / 0.7);
          z-index: 2;
          pointer-events: auto;
          animation: fringe-beacon-core-pulse 2.2s ease-in-out infinite;
          transition: width 0.25s ease, height 0.25s ease, margin 0.25s ease, box-shadow 0.25s ease;
          overflow: hidden;
        }
        .fringe-beacon-thumb {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 9999px;
          opacity: 0;
          transition: opacity 0.25s ease;
          pointer-events: none;
        }
        .fringe-beacon:hover .fringe-beacon-core {
          width: 56px;
          height: 56px;
          margin: -28px 0 0 -28px;
          animation: none;
          box-shadow:
            0 0 0 2px rgba(0,0,0,0.7),
            0 0 0 3px hsl(var(--signal, 165 85% 56%)),
            0 0 24px hsl(var(--signal, 165 85% 56%) / 0.9),
            0 8px 28px rgba(0,0,0,0.5);
        }
        .fringe-beacon:hover .fringe-beacon-thumb {
          opacity: 1;
        }
        @keyframes fringe-beacon-core-pulse {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.18); }
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
        .fringe-beacon-ring.r1 { width: 36px; height: 36px; animation-delay: 0s; }
        .fringe-beacon-ring.r2 { width: 56px; height: 56px; animation-delay: 0.6s; }
        .fringe-beacon-ring.r3 { width: 78px; height: 78px; animation-delay: 1.2s; }
        @keyframes fringe-beacon-ping {
          0%   { transform: translate(-50%, -50%) scale(0.35); opacity: 0.9; }
          70%  { opacity: 0.15; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
        }
        /* Compact always-visible chip — bigger, easier to read */
        .fringe-beacon-chip {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, 32px);
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 11px 6px 11px;
          background: rgba(6,9,11,0.88);
          border: 1px solid hsl(var(--signal, 165 85% 56%) / 0.55);
          border-radius: 9999px;
          backdrop-filter: blur(8px);
          font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.01em;
          color: #fff;
          white-space: nowrap;
          pointer-events: auto;
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(0,0,0,0.45), 0 0 18px hsl(var(--signal, 165 85% 56%) / 0.25);
          transition: opacity 0.15s ease, transform 0.18s ease;
        }
        .fringe-beacon-chip-dot {
          width: 7px; height: 7px; border-radius: 9999px;
          background: hsl(var(--signal, 165 85% 56%));
          box-shadow: 0 0 8px hsl(var(--signal, 165 85% 56%));
        }
        .fringe-beacon-chip-viewers {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-left: 4px;
          padding-left: 8px;
          border-left: 1px solid hsl(var(--signal, 165 85% 56%) / 0.35);
          font-size: 11px;
          font-weight: 700;
          color: hsl(var(--signal, 165 85% 56%));
          font-variant-numeric: tabular-nums;
        }
        .fringe-beacon-chip-viewers svg {
          opacity: 0.95;
        }
        .fringe-beacon:hover .fringe-beacon-chip {
          transform: translate(-50%, 36px) scale(1.04);
        }

        /* Rich spot card */
        .fringe-card {
          display: none;
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
function ModalStat({ n, label, highlight }: { n: number; label: string; highlight?: boolean }) {
  return (
    <div>
      <p className={`text-2xl font-extrabold tracking-tight ${highlight ? "text-signal" : "text-foreground"}`}>
        {n}
      </p>
      <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/55">
        {label}
      </p>
    </div>
  );
}
