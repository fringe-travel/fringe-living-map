const COLUMNS = [
  {
    name: "Instagram / TikTok",
    tone: "muted" as const,
    items: ["Edited", "Algorithmic", "Performative", "Delayed", "Entertainment-first"],
  },
  {
    name: "Google Maps",
    tone: "muted" as const,
    items: ["Static", "Old reviews", "Stale photos", "No energy", "No moment"],
  },
  {
    name: "Weather apps",
    tone: "muted" as const,
    items: [
      "Useful but incomplete",
      "Conditions without context",
      "No crowd",
      "No activity",
      "No vibe",
    ],
  },
  {
    name: "FRiNGE",
    tone: "primary" as const,
    items: ["Live", "Human", "Location-based", "Unedited", "Adventure-first", "Real-world decisions"],
  },
];

export function ComparisonSection() {
  return (
    <section className="border-t border-border py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-4xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
            What makes FRiNGE different
          </p>
          <h2 className="mt-3 text-balance text-4xl font-extrabold tracking-tighter md:text-5xl lg:text-6xl">
            Social media shows what people want you to see.{" "}
            <span className="text-primary">FRiNGE shows what is actually happening.</span>
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {COLUMNS.map((c) => (
            <div
              key={c.name}
              className={`flex flex-col rounded-3xl border p-7 ${
                c.tone === "primary"
                  ? "border-primary/40 bg-primary/5"
                  : "border-border bg-surface"
              }`}
            >
              <p
                className={`font-mono text-[10px] uppercase tracking-[0.2em] ${
                  c.tone === "primary" ? "text-primary" : "text-foreground/40"
                }`}
              >
                {c.tone === "primary" ? "The new layer" : "Today"}
              </p>
              <h3 className="mt-3 text-xl font-bold tracking-tight">{c.name}</h3>
              <ul className="mt-6 space-y-2 text-sm">
                {c.items.map((i) => (
                  <li
                    key={i}
                    className={`flex items-start gap-2 ${
                      c.tone === "primary" ? "text-foreground/90" : "text-foreground/60"
                    }`}
                  >
                    <span className={c.tone === "primary" ? "text-primary" : "text-foreground/30"}>
                      {c.tone === "primary" ? "+" : "—"}
                    </span>
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-12 max-w-3xl text-pretty text-xl font-medium text-foreground/80 md:text-2xl">
          FRiNGE is not another content app. It is a real-time window into the physical world.
        </p>
      </div>
    </section>
  );
}
