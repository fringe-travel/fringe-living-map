import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import appPreview from "@/assets/fringe-app-preview.jpeg";
import { regions, DEMO_VIBER_USER_ID, type SignalDrop } from "@/lib/regions";
import { ViberAvatar } from "@/components/ViberAvatar";
import { ShakaButton } from "@/components/ShakaButton";
import { FollowButton } from "@/components/FollowButton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const searchSchema = z.object({
  tab: fallback(z.enum(["latest", "following"]), "latest").default("latest"),
});

export const Route = createFileRoute("/vibers")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Vibers, the global feed on FRiNGE" },
      { name: "description", content: "Every fresh vibe on FRiNGE, from every region and every wandering viber. Tune in and FRiNGE maps the moment." },
      { property: "og:title", content: "Vibers, the global feed on FRiNGE" },
      { property: "og:description", content: "Every fresh vibe on FRiNGE, from every region and every wandering viber." },
      { property: "og:url", content: "https://fringe-living-map.lovable.app/vibers" },
    ],
    links: [
      { rel: "canonical", href: "https://fringe-living-map.lovable.app/vibers" },
    ],
  }),
  component: Page,
});

const benefits = [
  "No manual tagging",
  "Automatic spot association",
  "Show up on the signal map",
  "Build status in your region",
  "Help people discover where to go",
  "Earn from tips, rewards, sponsored coverage",
];

type GlobalDrop = SignalDrop & { regionSlug: string; regionName: string };

function buildGlobalFeed(): GlobalDrop[] {
  const all: GlobalDrop[] = [];
  for (const r of regions) {
    const short = r.name.replace(" Signal", "");
    for (const d of r.previewFeed) {
      all.push({ ...d, regionSlug: r.slug, regionName: short });
    }
  }
  return all.sort((a, b) => a.minutesAgo - b.minutesAgo);
}

function Page() {
  const { tab } = Route.useSearch();
  const { user } = useAuth();
  const allFeed = buildGlobalFeed();
  const [followed, setFollowed] = useState<Set<string>>(new Set());
  const [loadingFollows, setLoadingFollows] = useState(false);

  useEffect(() => {
    if (!user) {
      setFollowed(new Set());
      return;
    }
    setLoadingFollows(true);
    supabase
      .from("viber_follows")
      .select("viber_handle")
      .eq("user_id", user.id)
      .then(({ data }) => {
        setFollowed(new Set((data ?? []).map((r) => r.viber_handle)));
        setLoadingFollows(false);
      });
  }, [user]);

  const feed = tab === "following"
    ? allFeed.filter((d) => followed.has(d.by))
    : allFeed;

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
        <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-signal align-middle" />
        Vibers · Global feed
      </p>
      <h1 className="mt-3 text-balance text-5xl font-extrabold tracking-tighter md:text-6xl">
        Every viber, every region, one feed.
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-foreground/60">
        The freshest drops from the people on the ground, wherever they are. Signed regions, wandering vibers, all in one place.
      </p>

      {/* Tabs */}
      <div className="mt-10 inline-flex rounded-full border border-border bg-background p-1">
        <Link
          to="/vibers"
          search={{ tab: "latest" }}
          className={`rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
            tab === "latest" ? "bg-foreground text-background" : "text-foreground/60 hover:text-foreground"
          }`}
        >
          Latest
        </Link>
        <Link
          to="/vibers"
          search={{ tab: "following" }}
          className={`rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
            tab === "following" ? "bg-foreground text-background" : "text-foreground/60 hover:text-foreground"
          }`}
        >
          Following{user && followed.size > 0 ? ` · ${followed.size}` : ""}
        </Link>
      </div>

      {/* Global feed */}
      <div className="mt-8 flex items-end justify-between gap-6 flex-wrap">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">
          {feed.length} drops · last hour
        </p>
        <Link
          to="/signal-regions"
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary hover:text-foreground"
        >
          Browse by region →
        </Link>
      </div>

      {tab === "following" && !user ? (
        <div className="mt-10 rounded-2xl border border-border bg-surface/40 p-8 text-foreground/70">
          Sign in and tap <span className="font-bold">+ Follow</span> on any viber to build your own feed.
        </div>
      ) : tab === "following" && !loadingFollows && feed.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-border bg-surface/40 p-8 text-foreground/70">
          You're not following anyone yet. Hit <span className="font-bold">+ Follow</span> on a viber in the Latest tab.
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {feed.map((d, i) => (
            <li
              key={`${d.regionSlug}-${i}`}
              className="flex flex-row overflow-hidden rounded-3xl border border-border bg-background"
            >
              <div className="relative aspect-[9/16] w-36 shrink-0 overflow-hidden bg-surface-2 sm:w-44">
                <video
                  src="/fringe-app-preview.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <Link
                  to="/regions/$slug"
                  params={{ slug: d.regionSlug }}
                  className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-background/80 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-signal backdrop-blur-sm hover:text-foreground"
                >
                  {d.regionName}
                </Link>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <ViberAvatar handle={d.by} size={24} />
                    <p className="truncate font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">
                      {d.spot} · @{d.by}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                    {d.minutesAgo}m ago
                  </span>
                </div>
                <p className="mt-3 text-base font-medium text-foreground/90">{d.vibe}</p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <ShakaButton viberName={d.by} viberUserId={DEMO_VIBER_USER_ID} />
                  <FollowButton handle={d.by} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}


      {/* Become a Viber */}
      <div className="mt-24 rounded-3xl border border-border bg-surface/40 p-8 md:p-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">For Vibers</p>
        <h2 className="mt-3 text-balance text-4xl font-extrabold tracking-tighter md:text-5xl">
          Tune in. FRiNGE maps the moment.
        </h2>
        <p className="mt-5 max-w-2xl text-lg text-foreground/60">
          Vibers help the world see what's happening now. When you share a vibe, FRiNGE automatically connects it to the right place.
        </p>

        <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {benefits.map((b, i) => (
            <li
              key={b}
              className="flex items-start gap-4 rounded-2xl border border-border bg-background p-5"
            >
              <span className="font-mono text-xs font-bold text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-foreground/85">{b}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/60">
            Apply to be a Viber
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="https://fringe.travel/become-a-viber/rio"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-border bg-background px-6 py-4 font-bold transition-colors hover:bg-foreground hover:text-background"
            >
              Rio
            </a>
            <a
              href="https://fringe.travel/become-a-viber/hood-river"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-border bg-background px-6 py-4 font-bold transition-colors hover:bg-foreground hover:text-background"
            >
              Hood River
            </a>
            <a
              href="https://fringe.travel/become-a-viber/boracay"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-border bg-background px-6 py-4 font-bold transition-colors hover:bg-foreground hover:text-background"
            >
              Boracay
            </a>
            <a
              href="https://fringe.travel/become-a-viber"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-primary px-7 py-4 font-bold text-primary-foreground transition-transform hover:scale-105"
            >
              Any region →
            </a>
          </div>
        </div>
      </div>

      {/* iOS app download */}
      <div className="mt-16 grid items-center gap-12 rounded-3xl border border-border bg-surface/40 p-8 md:grid-cols-2 md:p-12">
        <div className="relative mx-auto w-full max-w-[300px]">
          <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-primary/20 blur-3xl" />
          <div className="relative aspect-[9/19.5] rounded-[3rem] border-[10px] border-foreground/90 bg-foreground/90 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
            <div className="absolute left-1/2 top-2 z-10 h-6 w-28 -translate-x-1/2 rounded-full bg-foreground/90" />
            <video
              src="/fringe-app-preview.mp4"
              className="h-full w-full rounded-[2.25rem] object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster={appPreview}
            />
          </div>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-signal">
            See FRiNGE in action
          </p>
          <h2 className="mt-4 text-balance text-4xl font-extrabold tracking-tighter md:text-5xl">
            Discover Your Adventure.
          </h2>
          <p className="mt-5 text-lg text-foreground/60">
            FRiNGE lets travelers post live, location tagged vibes from anywhere on earth. Surf spots, hidden parks, sunset bars. A real time map of what's actually happening, right now.
          </p>
          <div className="mt-8">
            <a
              href="https://apps.apple.com/us/app/fringe-travel/id6756793528"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-2xl bg-foreground px-6 py-3.5 text-background transition-transform hover:scale-105"
              aria-label="Download FRiNGE on the App Store"
            >
              <svg viewBox="0 0 24 24" className="size-7" fill="currentColor" aria-hidden="true">
                <path d="M17.05 12.04c-.03-2.69 2.2-3.98 2.3-4.04-1.26-1.84-3.21-2.09-3.9-2.12-1.66-.17-3.24.98-4.08.98-.85 0-2.15-.96-3.54-.93-1.82.03-3.5 1.06-4.44 2.69-1.89 3.28-.48 8.13 1.36 10.79.9 1.3 1.97 2.77 3.36 2.72 1.35-.05 1.86-.87 3.49-.87 1.62 0 2.08.87 3.5.84 1.45-.02 2.37-1.32 3.26-2.63 1.03-1.51 1.45-2.97 1.47-3.05-.03-.01-2.82-1.08-2.85-4.29zM14.44 4.04c.74-.9 1.24-2.14 1.1-3.39-1.06.04-2.36.71-3.13 1.6-.69.79-1.29 2.06-1.13 3.27 1.19.09 2.41-.6 3.16-1.48z" />
              </svg>
              <span className="flex flex-col items-start leading-none">
                <span className="text-[10px] font-medium">Download on the</span>
                <span className="mt-0.5 text-lg font-bold">App Store</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
