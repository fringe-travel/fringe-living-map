import { createFileRoute, Link } from "@tanstack/react-router";
import appPreview from "@/assets/fringe-app-preview.jpeg";

export const Route = createFileRoute("/vibers")({
  head: () => ({
    meta: [
      { title: "For Vibers, FRiNGE" },
      { name: "description", content: "Tune in and FRiNGE maps the moment. Become a Viber and put your region on the signal map." },
      { property: "og:title", content: "For Vibers, FRiNGE" },
      { property: "og:description", content: "Share real-time vibes. Build status in your region. Earn from coverage." },
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

function Page() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">For Vibers</p>
      <h1 className="mt-3 text-balance text-5xl font-extrabold tracking-tighter md:text-6xl">
        Tune in. FRiNGE maps the moment.
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-foreground/60">
        Vibers help the world see what's happening now. When you share a vibe,
        FRiNGE automatically connects it to the right place.
      </p>

      <ul className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {benefits.map((b, i) => (
          <li
            key={b}
            className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-5"
          >
            <span className="font-mono text-xs font-bold text-primary">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-foreground/85">{b}</span>
          </li>
        ))}
      </ul>

      <div className="mt-14">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/60">
          Apply to be a Viber
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="https://fringe.travel/become-a-viber/rio"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-border bg-surface px-6 py-4 font-bold transition-colors hover:bg-foreground hover:text-background"
          >
            Rio
          </a>
          <a
            href="https://fringe.travel/become-a-viber/hood-river"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-border bg-surface px-6 py-4 font-bold transition-colors hover:bg-foreground hover:text-background"
          >
            Hood River
          </a>
          <a
            href="https://fringe.travel/become-a-viber/boracay"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-border bg-surface px-6 py-4 font-bold transition-colors hover:bg-foreground hover:text-background"
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

      {/* iOS app download */}
      <div className="mt-24 grid items-center gap-12 rounded-3xl border border-border bg-surface/40 p-8 md:grid-cols-2 md:p-12">
        <div className="relative mx-auto w-full max-w-[300px]">
          <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-primary/20 blur-3xl" />
          {/* iPhone-style frame */}
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
            FRiNGE lets travelers post live, location-tagged "vibes" from anywhere on earth, surf
            spots, hidden parks, sunset bars. A real-time map of what's actually happening, right
            now.
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
