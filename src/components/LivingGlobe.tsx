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
    pts.push({
      id: `region-${r.slug}`,
      coords: center,
      label: r.name.replace(" Signal", ""),
      slug: r.slug,
      isRegion: true,
    });

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

  for (const a of AMBIENT_SPOTS) {
    pts.push({ id: `ambient-${a.label}`, coords: a.coords, label: a.label });
  }

  return pts;
}

function latLngToVector3(lng: number, lat: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return {
    x: -radius * Math.sin(phi) * Math.cos(theta),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta),
  };
}

function makeEarthTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;
  const ocean = ctx.createLinearGradient(0, 0, 0, canvas.height);
  ocean.addColorStop(0, "#07172f");
  ocean.addColorStop(0.48, "#0b3f55");
  ocean.addColorStop(1, "#031423");
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalAlpha = 0.72;
  ctx.fillStyle = "#123c32";
  const land = [
    [260, 190, 330, 150, 0.1],
    [390, 430, 210, 300, -0.35],
    [820, 245, 260, 210, -0.1],
    [1040, 385, 360, 250, 0.15],
    [1230, 230, 230, 170, -0.2],
    [1510, 390, 300, 190, 0.25],
    [1640, 690, 210, 150, -0.2],
    [1760, 270, 160, 130, 0.5],
  ];

  for (const [x, y, w, h, rot] of land) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.ellipse(0, 0, w, h, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.globalAlpha = 0.45;
  ctx.strokeStyle = "rgba(103, 232, 249, 0.32)";
  ctx.lineWidth = 1;
  for (let y = 96; y < canvas.height; y += 96) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  for (let x = 128; x < canvas.width; x += 128) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  return canvas;
}

export function LivingGlobe() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const labelLayerRef = useRef<HTMLDivElement | null>(null);
  const points = useMemo(buildPoints, []);
  const totalVibes = points.filter((p) => p.vibe).length + 33;

  useEffect(() => {
    if (!mountRef.current || !labelLayerRef.current) return;

    let disposed = false;
    let frame = 0;
    const labels: HTMLDivElement[] = [];

    (async () => {
      const THREE = await import("three");
      if (disposed || !mountRef.current || !labelLayerRef.current) return;

      const mount = mountRef.current;
      const labelLayer = labelLayerRef.current;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      mount.appendChild(renderer.domElement);

      const globeGroup = new THREE.Group();
      scene.add(globeGroup);
      camera.position.set(0, 0, 7.4);

      const texture = new THREE.CanvasTexture(makeEarthTexture());
      texture.colorSpace = THREE.SRGBColorSpace;

      const earth = new THREE.Mesh(
        new THREE.SphereGeometry(2.65, 96, 96),
        new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.74,
          metalness: 0.08,
          emissive: new THREE.Color(0x062235),
          emissiveIntensity: 0.22,
        }),
      );
      globeGroup.add(earth);

      const atmosphere = new THREE.Mesh(
        new THREE.SphereGeometry(2.72, 96, 96),
        new THREE.MeshBasicMaterial({
          color: 0x28f0d9,
          transparent: true,
          opacity: 0.13,
          blending: THREE.AdditiveBlending,
          side: THREE.BackSide,
        }),
      );
      globeGroup.add(atmosphere);

      const grid = new THREE.Mesh(
        new THREE.SphereGeometry(2.675, 48, 24),
        new THREE.MeshBasicMaterial({
          color: 0x67e8f9,
          transparent: true,
          opacity: 0.08,
          wireframe: true,
        }),
      );
      globeGroup.add(grid);

      scene.add(new THREE.AmbientLight(0x99ccff, 1.6));
      const key = new THREE.DirectionalLight(0xffffff, 2.6);
      key.position.set(3, 2.5, 4);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0x2dd4bf, 2.2);
      rim.position.set(-4, 1, -3);
      scene.add(rim);

      const starGeometry = new THREE.BufferGeometry();
      const starPositions = new Float32Array(900);
      for (let i = 0; i < starPositions.length; i += 3) {
        starPositions[i] = (Math.random() - 0.5) * 34;
        starPositions[i + 1] = (Math.random() - 0.5) * 20;
        starPositions[i + 2] = -4 - Math.random() * 16;
      }
      starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
      scene.add(
        new THREE.Points(
          starGeometry,
          new THREE.PointsMaterial({ color: 0xffffff, size: 0.018, transparent: true, opacity: 0.75 }),
        ),
      );

      const markerMaterial = new THREE.SpriteMaterial({
        color: 0x2df6c8,
        transparent: true,
        opacity: 0.92,
        depthTest: false,
      });
      const regionMaterial = new THREE.SpriteMaterial({
        color: 0xffd166,
        transparent: true,
        opacity: 1,
        depthTest: false,
      });

      const markerData = points.map((point) => {
        const pos = latLngToVector3(point.coords[0], point.coords[1], 2.78);
        const sprite = new THREE.Sprite(point.isRegion ? regionMaterial.clone() : markerMaterial.clone());
        sprite.position.set(pos.x, pos.y, pos.z);
        sprite.scale.setScalar(point.isRegion ? 0.18 : point.vibe ? 0.12 : 0.075);
        globeGroup.add(sprite);

        const label = document.createElement("div");
        label.className = `globe-label ${point.isRegion ? "is-region" : point.vibe ? "is-vibe" : "is-ambient"}`;
        label.textContent = point.label;
        if (point.slug) {
          label.addEventListener("click", () => {
            window.location.href = `/regions/${point.slug}`;
          });
        }
        labelLayer.appendChild(label);
        labels.push(label);
        return { point, sprite, label, base: sprite.scale.x };
      });

      const resize = () => {
        if (!mountRef.current) return;
        const rect = mountRef.current.getBoundingClientRect();
        renderer.setSize(rect.width, rect.height, false);
        camera.aspect = rect.width / Math.max(rect.height, 1);
        camera.updateProjectionMatrix();
      };

      const ro = new ResizeObserver(resize);
      ro.observe(mount);
      resize();

      const animate = () => {
        if (disposed || !mountRef.current || !labelLayerRef.current) return;
        frame = requestAnimationFrame(animate);
        globeGroup.rotation.y += 0.0019;
        globeGroup.rotation.x = -0.12;

        const rect = mount.getBoundingClientRect();
        const time = performance.now() * 0.002;
        for (const item of markerData) {
          const pulse = 1 + Math.sin(time + item.sprite.position.x * 2.1) * 0.22;
          item.sprite.scale.setScalar(item.base * pulse);
          const world = new THREE.Vector3();
          item.sprite.getWorldPosition(world);
          const normal = world.clone().normalize();
          const cameraDirection = camera.position.clone().sub(world).normalize();
          const visible = normal.dot(cameraDirection) > 0.16;
          const projected = world.project(camera);
          const x = (projected.x * 0.5 + 0.5) * rect.width;
          const y = (-projected.y * 0.5 + 0.5) * rect.height;
          item.label.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          item.label.style.opacity = visible && x > -60 && x < rect.width + 60 && y > -30 && y < rect.height + 30 ? "1" : "0";
        }

        renderer.render(scene, camera);
      };
      animate();

      return () => {
        ro.disconnect();
        cancelAnimationFrame(frame);
        for (const label of labels) label.remove();
        renderer.dispose();
        texture.dispose();
        earth.geometry.dispose();
        grid.geometry.dispose();
        atmosphere.geometry.dispose();
      };
    })().then((cleanup) => {
      if (cleanup && disposed) cleanup();
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      for (const label of labels) label.remove();
      if (mountRef.current) mountRef.current.innerHTML = "";
    };
  }, [points]);

  return (
    <div className="relative h-[calc(100svh-64px)] min-h-[640px] w-full overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(45,246,200,0.24),transparent_34%),radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.18),transparent_48%),linear-gradient(180deg,#02060a,#000)]" />
      <div ref={mountRef} className="absolute inset-0" />
      <div ref={labelLayerRef} className="pointer-events-none absolute inset-0 z-[2]" />

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
        .globe-label {
          position: absolute;
          left: 0;
          top: 0;
          pointer-events: auto;
          transform-origin: 0 0;
          margin-left: 11px;
          margin-top: -7px;
          color: rgba(255,255,255,0.82);
          font-size: 10px;
          font-weight: 700;
          line-height: 1;
          text-shadow: 0 0 12px rgba(0,0,0,0.95);
          white-space: nowrap;
          transition: opacity 180ms ease;
        }
        .globe-label::before {
          content: "";
          position: absolute;
          left: -14px;
          top: 1px;
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background: #2df6c8;
          box-shadow: 0 0 0 4px rgba(45,246,200,0.18), 0 0 18px rgba(45,246,200,0.85);
          animation: vibePulse 2.4s ease-in-out infinite;
        }
        .globe-label.is-region {
          color: #ffe08a;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .globe-label.is-region::before {
          width: 12px;
          height: 12px;
          left: -18px;
          top: -1px;
          background: #ffd166;
          box-shadow: 0 0 0 5px rgba(255,209,102,0.18), 0 0 24px rgba(255,209,102,0.95);
        }
        .globe-label.is-ambient {
          color: rgba(255,255,255,0.52);
          font-weight: 500;
        }
        .globe-label.is-ambient::before {
          width: 6px;
          height: 6px;
          background: #fb923c;
          box-shadow: 0 0 0 3px rgba(251,146,60,0.16), 0 0 14px rgba(251,146,60,0.65);
        }
        @keyframes vibePulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.35); opacity: 0.82; }
        }
      `}</style>
    </div>
  );
}
