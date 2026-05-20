import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMembership } from "@/hooks/useMembership";

type Partner = {
  slug: string;
  name: string;
  region_slug: string;
  category: string;
  discount_label: string;
};

export function PartnerDiscountTeaser() {
  const { isMember } = useMembership();
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    supabase
      .from("partners")
      .select("slug, name, region_slug, category, discount_label")
      .eq("active", true)
      .order("name")
      .limit(3)
      .then(({ data }) => setPartners((data as Partner[]) || []));
  }, []);

  if (partners.length === 0) return null;

  return (
    <section className="border-t border-border bg-surface/40 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
          Member perk · Partner discounts
        </p>
        <h2 className="mt-4 max-w-3xl text-balance text-4xl font-extrabold tracking-tighter md:text-5xl">
          {isMember
            ? "Your codes are live around the globe."
            : "Discounts from real places vibers actually go."}
        </h2>
        <p className="mt-4 max-w-2xl text-foreground/60">
          The Living Globe is free for everyone. FRiNGE Membership unlocks
          ongoing discounts from partners on the ground.
        </p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-3">
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
                <h3 className="mt-3 text-xl font-extrabold tracking-tight">{p.name}</h3>
                <p
                  className={`mt-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] transition ${
                    isMember
                      ? "border-sunset/40 bg-sunset/10 text-sunset"
                      : "border-border bg-foreground/5 text-foreground/40 blur-[3px] group-hover:blur-[2px]"
                  }`}
                  aria-hidden={!isMember}
                >
                  {p.discount_label}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/partners"
            className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-sm font-bold text-foreground transition-colors hover:bg-surface"
          >
            See all partners
          </Link>
          {!isMember && (
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              Become a Member · $20/mo
            </Link>
          )}
        </div>
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
