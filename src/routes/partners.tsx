import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Partner = {
  slug: string;
  name: string;
  region_slug: string;
  category: string;
  discount_label: string;
  blurb: string | null;
};

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "FRiNGE Partners, Discounts from real local businesses." },
      {
        name: "description",
        content:
          "FRiNGE Members unlock discounts from partners around the world. Kite schools, cafes, surf shops, coworks, and more.",
      },
      { property: "og:title", content: "FRiNGE Partners" },
      {
        property: "og:description",
        content: "Member discounts from partners around the world.",
      },
      { property: "og:url", content: "https://fringe-living-map.lovable.app/partners" },
    ],
    links: [{ rel: "canonical", href: "https://fringe-living-map.lovable.app/partners" }],
  }),
  component: PartnersPage,
});

function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("partners")
      .select("slug, name, region_slug, category, discount_label, blurb")
      .eq("active", true)
      .order("name")
      .then(({ data }) => {
        setPartners((data as Partner[]) || []);
        setLoading(false);
      });
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <header className="max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
          FRiNGE Partners
        </p>
        <h1 className="mt-3 text-balance text-5xl font-extrabold tracking-tighter md:text-6xl">
          Real discounts from real local businesses.
        </h1>
        <p className="mt-5 text-pretty text-lg text-foreground/60">
          The Living Globe is free. FRiNGE Membership unlocks ongoing discounts from
          partners on the ground. Kite schools, cafes, surf shops, coworks. The
          places vibers actually go.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/pricing"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            Become a Member · $20/mo
          </Link>
        </div>
      </header>

      <div className="mt-16">
        {loading ? (
          <p className="text-sm text-foreground/60">Loading partners…</p>
        ) : partners.length === 0 ? (
          <p className="text-sm text-foreground/60">No partners yet, check back soon.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((p) => (
              <li key={p.slug}>
                <Link
                  to="/partners/$slug"
                  params={{ slug: p.slug }}
                  className="group block h-full rounded-3xl border border-border bg-background p-6 transition-all hover:-translate-y-0.5 hover:border-primary/50"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                    {regionDisplay(p.region_slug)} · {p.category}
                  </p>
                  <h2 className="mt-3 text-2xl font-extrabold tracking-tight">{p.name}</h2>
                  {p.blurb && (
                    <p className="mt-2 line-clamp-3 text-sm text-foreground/60">{p.blurb}</p>
                  )}
                  <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-sunset/40 bg-sunset/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-sunset">
                    {p.discount_label}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function regionDisplay(slug: string) {
  return slug
    .split("-")
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join(" ");
}
