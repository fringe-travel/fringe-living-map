type Tier = {
  label: string;
  price: string;
  blurb: string;
};

const TIERS: Tier[] = [
  {
    label: "Spot Supporter",
    price: "$100–$300/mo",
    blurb: "Supports fresh signals around a specific spot — cafes, kite schools, surf shops, hostels, bars.",
  },
  {
    label: "Region Supporter",
    price: "$500–$1,500/mo",
    blurb: "Supports consistent coverage across a region. Your brand appears on the region page.",
  },
  {
    label: "Adventure Partner",
    price: "$2,500+/mo",
    blurb: "Supports multiple regions, events, or seasonal adventure campaigns.",
  },
];

type Props = { regionName?: string };

export function PartnerHereBlock({ regionName }: Props) {
  const subject = regionName ? `Partner in ${regionName}` : "Partner with FRiNGE";
  const mailto = `mailto:admin@fringe.travel?subject=${encodeURIComponent(subject)}`;

  return (
    <div className="rounded-3xl border border-sunset/25 bg-sunset/5 p-8 md:p-10">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sunset">Partner Here</p>
      <h3 className="mt-3 text-3xl font-extrabold tracking-tighter md:text-4xl">
        {regionName
          ? `Partner in ${regionName}.`
          : "Local businesses help keep the signal alive."}
      </h3>
      <p className="mt-3 max-w-xl text-foreground/60">
        Help people discover your place through fresh real-world signals.{" "}
        <span className="text-foreground/80">
          Partners support the signal. They do not control what people capture.
        </span>
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {TIERS.map((t) => (
          <div key={t.label} className="flex flex-col rounded-2xl border border-border bg-background p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sunset">{t.label}</p>
            <p className="mt-2 text-2xl font-extrabold tracking-tighter">{t.price}</p>
            <p className="mt-3 flex-1 text-sm text-foreground/60">{t.blurb}</p>
          </div>
        ))}
      </div>

      <a
        href={mailto}
        className="mt-8 inline-flex rounded-xl bg-sunset px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:brightness-110"
      >
        Get in touch
      </a>
    </div>
  );
}
