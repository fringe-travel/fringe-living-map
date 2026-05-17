import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/vibers")({
  head: () => ({
    meta: [
      { title: "For Vibers — FRiNGE" },
      { name: "description", content: "Tune in and FRiNGE maps the moment. Become a Viber and put your region on the signal map." },
      { property: "og:title", content: "For Vibers — FRiNGE" },
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

      <div className="mt-14 flex flex-wrap gap-3">
        <Link to="/" className="rounded-xl bg-primary px-7 py-4 font-bold text-primary-foreground transition-transform hover:scale-105">
          Apply to be a Viber
        </Link>
        <Link to="/now-map" className="rounded-xl border border-border bg-surface px-7 py-4 font-bold hover:bg-surface-2">
          See the Now Map
        </Link>
      </div>
    </section>
  );
}
