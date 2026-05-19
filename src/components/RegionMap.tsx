import { useEffect, useRef, useState } from "react";

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

export function RegionMap({
  slug,
  spots,
  label,
  video,
}: {
  slug: string;
  spots: string[];
  label: string;
  video?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;
    let cancelled = false;
    const markers: any[] = [];

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

      map.on("load", () => {
        setReady(true);
        map.resize();
        for (const s of spots) {
          const coords = SPOT_COORDS[s];
          if (!coords) continue;
          const el = document.createElement("div");
          el.className = "region-pin";
          const videoHtml = video
            ? `<video class="region-pin-video" src="${video}" autoplay loop muted playsinline></video>`
            : "";
          el.innerHTML = `<div class="region-pin-card">${videoHtml}<span class="region-pin-label">${s}</span></div><span class="region-pin-dot"></span>`;
          const m = new mapboxgl.Marker({ element: el, anchor: "center" })
            .setLngLat(coords)
            .addTo(map);
          markers.push(m);
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
      for (const m of markers) m.remove();
      if (mapRef.current) {
        try { (mapRef.current as any).__cleanup?.(); } catch {}
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [slug, spots]);

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
        .region-pin-dot {
          width: 12px; height: 12px; border-radius: 9999px;
          background: hsl(var(--signal, 142 76% 55%));
          box-shadow: 0 0 0 2px rgba(0,0,0,0.7), 0 0 18px rgba(80,255,160,0.85);
        }
        .region-pin-label {
          margin-top: 6px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.98);
          background: rgba(0,0,0,0.65);
          padding: 3px 7px;
          border-radius: 4px;
          white-space: nowrap;
          backdrop-filter: blur(4px);
          border: 1px solid rgba(80,255,160,0.55);
          text-shadow: 0 0 6px rgba(80,255,160,0.9);
          animation: region-pin-glow 2.2s ease-in-out infinite;
        }
        @keyframes region-pin-glow {
          0%, 100% {
            box-shadow: 0 0 6px rgba(80,255,160,0.45), 0 0 14px rgba(80,255,160,0.25);
            border-color: rgba(80,255,160,0.45);
          }
          50% {
            box-shadow: 0 0 12px rgba(80,255,160,0.9), 0 0 26px rgba(80,255,160,0.55);
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
      `}</style>
    </div>
  );
}
