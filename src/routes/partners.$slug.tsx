import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MemberDiscountReveal } from "@/components/MemberDiscountReveal";

type Partner = {
  slug: string;
  name: string;
  region_slug: string;
  category: string;
  discount_label: string;
  redemption_code: string;
  url: string | null;
  blurb: string | null;
};

export const Route = createFileRoute("/partners/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${prettySlug(params.slug)}, FRiNGE Partner` },
      {
        name: "description",
        content: `Member discount from ${prettySlug(params.slug)} on FRiNGE.`,
      },
    ],
  }),
  component: PartnerPage,
});

function PartnerPage() {
  const { slug } = Route.useParams();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    supabase
      .from("partners")
      .select("slug, name, region_slug, category, discount_label, redemption_code, url, blurb")
      .eq("slug", slug)
      .eq("active", true)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) setMissing(true);
        else setPartner(data as Partner);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return <section className="mx-auto max-w-3xl px-6 py-24 text-foreground/60">Loading…</section>;
  }
  if (missing || !partner) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">Partner not found</h1>
        <Link to="/partners" className="mt-6 inline-block text-sm font-bold text-primary hover:underline">
          ← All partners
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <Link
        to="/partners"
        className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50 hover:text-foreground"
      >
        ← All partners
      </Link>
      <header className="mt-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
          {regionDisplay(partner.region_slug)} · {partner.category}
        </p>
        <h1 className="mt-3 text-balance text-5xl font-extrabold tracking-tighter md:text-6xl">
          {partner.name}
        </h1>
        {partner.blurb && (
          <p className="mt-5 text-pretty text-lg text-foreground/70">{partner.blurb}</p>
        )}
        {partner.url && (
          <a
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
          >
            Visit website →
          </a>
        )}
      </header>

      <div className="mt-10">
        <MemberDiscountReveal
          code={partner.redemption_code}
          discountLabel={partner.discount_label}
        />
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

function prettySlug(slug: string) {
  return slug
    .split("-")
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join(" ");
}
