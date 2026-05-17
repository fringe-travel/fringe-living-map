import { createFileRoute } from "@tanstack/react-router";
import { SignalMapMockup } from "@/components/SignalMapMockup";

export const Route = createFileRoute("/now-map")({
  head: () => ({
    meta: [
      { title: "Now Map — FRiNGE" },
      { name: "description", content: "The FRiNGE Now Map shows where real activity is happening — not just where places exist." },
      { property: "og:title", content: "Now Map — FRiNGE" },
      { property: "og:description", content: "Live pins, freshness, replays, and spot intelligence." },
    ],
  }),
  component: Page,
});

const feats = [
  { title: "Live pins", body: "See which spots have fresh activity, in real time." },
  { title: "Auto-location association", body: "Every vibe connects to its spot, zone, and region automatically." },
  { title: "Freshness indicators", body: "Know if a vibe happened 2 minutes ago, 30 minutes ago, or yesterday." },
  { title: "Locked premium spots", body: "Free users preview. Paid users unlock the full live region." },
  { title: "Replay layer", body: "See recent moments even after the live vibe ends." },
  { title: "Spot intelligence", body: "Know if a place is active, quiet, crowded, windy, fun, or dead." },
];

function Page() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 radial-glow" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Now Map</p>
            <h1 className="mt-3 text-balance text-5xl font-extrabold tracking-tighter md:text-6xl">
              The map is alive.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-foreground/60">
              The FRiNGE Now Map shows where real activity is happening — not just
              where places exist.
            </p>
          </div>
          <div className="lg:col-span-5">
            <SignalMapMockup />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {feats.map((f, i) => (
            <div key={f.title} className="bg-background p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                Feature {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-foreground/60">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
