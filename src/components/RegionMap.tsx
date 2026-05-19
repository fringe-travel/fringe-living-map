import { useEffect, useRef, useState } from "react";
import type { SignalDrop } from "@/lib/regions";

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
  Ipanema: [-43.2, -22.98],
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
  rio: [-43.2, -22.98],
  "hood-river": [-121.51, 45.71],
};

const REGION_ZOOM: Record<string, number> = {
  boracay: 13,
  rio: 12,
  "hood-river": 11,
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

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

export function RegionMap({
  slug,
  spots,
  label,
  video,
  feed = [],
}: {
  slug: string;
  spots: string[];
  label: string;
  video?: string;
  feed?: SignalDrop[];
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;
    let cancelled = false;
    const markers: any[] = [];
    let activePopup: any = null;

    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      await import("mapbox-gl/dist/mapbox-gl.css");
      if (cancelled || !containerRef.current) return;

      mapboxgl.accessToken = MAPBOX_TOKEN;
      const center = REGION_CENTER[slug] ?? [0, 0];
      const zoom = REGION_ZOOM[slug] ?? 12;

      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center,
        zoom,
        attributionControl: false,
        scrollZoom: false,
      });
      mapRef.current = map;
      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

      map.on("load", () => {
        setReady(true);
        map.resize();
        for (const s of spots) {
          const coords = SPOT_COORDS[s];
          if (!coords) continue;
          const drop = feed.find((d) => d.spot.includes(s)) ?? null;
          const el = document.createElement("div");
          el.className = "region-pin";
          const videoHtml = video
            ? `<video class="region-pin-video" src="${video}" autoplay loop muted playsinline></video>`
            : "";
          el.innerHTML = `<div class="region-pin-card">${videoHtml}<span class="region-pin-label">${s}</span></div><span class="region-pin-dot"></span>`;
          el.style.cursor = "pointer";

          const m = new mapboxgl.Marker({ element: el, anchor: "center" })
            .setLngLat(coords)
            .addTo(map);
          markers.push(m);

          el.addEventListener("click", (e) => {
            e.stopPropagation();
            if (activePopup) { try { activePopup.remove(); } catch {} }
            const tagEmoji = drop ? TAG_EMOJI[drop.tag] ?? "✨" : "✨";
            const videoHtml = video
              ? `<video class="region-popup-video" src="${video}" autoplay loop muted playsinline></video>`
              : "";
            const html = `
              <div class="region-popup">
                ${videoHtml}
                <div class="region-popup-body">
                  <div class="region-popup-head">
                    <span class="region-popup-live"><span class="region-popup-live-dot"></span>LIVE</span>
                    ${drop ? `<span class="region-popup-time">${drop.minutesAgo}m ago</span>` : `<span class="region-popup-time region-popup-time-quiet">No fresh signal</span>`}
                  </div>
                  <div class="region-popup-title">${escapeHtml(s)}</div>
                  <div class="region-popup-sub">${escapeHtml(label)}</div>
                  ${drop ? `
                    <div class="region-popup-quote">
                      <span class="region-popup-quote-tag">${tagEmoji}</span>
                      <span class="region-popup-quote-text">"${escapeHtml(drop.vibe)}"</span>
                    </div>
                    <div class="region-popup-by">@${escapeHtml(drop.by)}</div>
                  ` : `
                    <div class="region-popup-empty">Be the first to drop a vibe here.</div>
                  `}
                </div>
              </div>
            `;
            activePopup = new mapboxgl.Popup({
              offset: 18,
              closeButton: true,
              closeOnClick: true,
              className: "region-mapbox-popup",
              maxWidth: "260px",
            })
              .setLngLat(coords)
              .setHTML(html)
              .addTo(map);
          });
        }
      });
      map.once("idle", () => map.resize());

      const ro = new ResizeObserver(() => map.resize());
      ro.observe(containerRef.current);
      requestAnimationFrame(() => map.resize());
      setTimeout(() => map.resize(), 100);
      setTimeout(() => map.resize(), 500);
      setTimeout(() => map.resize(), 1200);
      (map as any).__cleanup = () => ro.disconnect();
    })();

    return () => {
      cancelled = true;
      if (activePopup) { try { activePopup.remove(); } catch {} }
      for (const m of markers) m.remove();
      if (mapRef.current) {
        try { (mapRef.current as any).__cleanup?.(); } catch {}
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [slug, spots, video, feed, label]);

  return (
    <div className="region-map-shell relative h-[calc(100vh-65px)] min-h-[620px] w-full overflow-hidden bg-surface">
      <div ref={containerRef} className="region-map-canvas absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-signal/40 bg-background/70 px-3 py-1.5 backdrop-blur-md">
        <span className="relative inline-flex size-1.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-signal opacity-70" />
          <span className="relative size-1.5 rounded-full bg-signal" />
        </span>
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-signal">
          {label} · Live map
        </span>
      </div>
      {!ready && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/50">
            Loading map…
          </p>
        </div>
      )}
      <style>{`
        .region-pin {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: translate(-50%, -50%);
        }
        .region-pin-card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          width: 96px;
          border-radius: 8px;
          overflow: hidden;
          background: rgba(0,0,0,0.65);
          border: 1px solid rgba(80,255,160,0.55);
          box-shadow: 0 6px 20px rgba(0,0,0,0.5), 0 0 14px rgba(80,255,160,0.35);
          backdrop-filter: blur(4px);
          animation: region-pin-glow 2.2s ease-in-out infinite;
        }
        .region-pin-video {
          width: 100%;
          height: 56px;
          object-fit: cover;
          display: block;
          background: #000;
        }
        .region-pin-dot {
          margin-top: 4px;
          width: 10px; height: 10px; border-radius: 9999px;
          background: hsl(var(--signal, 142 76% 55%));
          box-shadow: 0 0 0 2px rgba(0,0,0,0.7), 0 0 14px rgba(80,255,160,0.85);
        }
        .region-pin-label {
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.98);
          padding: 4px 7px;
          white-space: nowrap;
          text-align: center;
          text-shadow: 0 0 6px rgba(80,255,160,0.9);
        }
        @keyframes region-pin-glow {
          0%, 100% {
            box-shadow: 0 6px 20px rgba(0,0,0,0.5), 0 0 10px rgba(80,255,160,0.35);
            border-color: rgba(80,255,160,0.45);
          }
          50% {
            box-shadow: 0 6px 20px rgba(0,0,0,0.5), 0 0 22px rgba(80,255,160,0.75);
            border-color: rgba(80,255,160,0.9);
          }
        }
        .region-map-shell .mapboxgl-map,
        .region-map-shell .mapboxgl-canvas-container,
        .region-map-shell .mapboxgl-canvas {
          width: 100% !important;
          height: 100% !important;
        }
        .region-map-shell .mapboxgl-canvas {
          outline: none;
        }

        /* Popup */
        .region-mapbox-popup .mapboxgl-popup-content {
          background: rgba(8, 10, 14, 0.92);
          color: #fff;
          border: 1px solid rgba(80,255,160,0.45);
          border-radius: 14px;
          padding: 0;
          overflow: hidden;
          box-shadow: 0 12px 40px rgba(0,0,0,0.6), 0 0 22px rgba(80,255,160,0.25);
          backdrop-filter: blur(8px);
        }
        .region-popup-video {
          display: block;
          width: 100%;
          height: 140px;
          object-fit: cover;
          background: #000;
          border-bottom: 1px solid rgba(80,255,160,0.35);
        }
        .region-popup-body { padding: 14px 14px 12px; }
        .region-mapbox-popup .mapboxgl-popup-tip {
          border-top-color: rgba(80,255,160,0.55) !important;
          border-bottom-color: rgba(80,255,160,0.55) !important;
        }
        .region-mapbox-popup .mapboxgl-popup-close-button {
          color: rgba(255,255,255,0.7);
          font-size: 18px;
          padding: 2px 8px;
        }
        .region-popup-head {
          display: flex; align-items: center; justify-content: space-between;
          gap: 8px; margin-bottom: 8px;
        }
        .region-popup-live {
          display: inline-flex; align-items: center; gap: 5px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 9px; font-weight: 700; letter-spacing: 0.2em;
          color: rgb(80,255,160);
        }
        .region-popup-live-dot {
          width: 6px; height: 6px; border-radius: 9999px;
          background: rgb(80,255,160);
          box-shadow: 0 0 8px rgba(80,255,160,0.9);
          animation: region-pin-glow 1.6s ease-in-out infinite;
        }
        .region-popup-time {
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(255,255,255,0.7);
        }
        .region-popup-time-quiet { color: rgba(255,255,255,0.35); }
        .region-popup-title {
          font-size: 15px; font-weight: 800; letter-spacing: -0.01em;
          color: #fff;
        }
        .region-popup-sub {
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          margin-top: 2px;
        }
        .region-popup-quote {
          display: flex; gap: 8px; align-items: flex-start;
          margin-top: 10px; padding: 8px 10px;
          background: rgba(255,255,255,0.06);
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .region-popup-quote-tag { font-size: 14px; line-height: 1; }
        .region-popup-quote-text {
          font-size: 12.5px; line-height: 1.35;
          color: rgba(255,255,255,0.92);
        }
        .region-popup-by {
          margin-top: 6px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 10px; color: rgb(80,255,160);
        }
        .region-popup-empty {
          margin-top: 10px;
          font-size: 12px; color: rgba(255,255,255,0.55);
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
