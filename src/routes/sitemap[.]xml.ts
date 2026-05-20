import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { regions } from "@/lib/regions";

const BASE_URL = "https://fringe-living-map.lovable.app";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const paths = [
          "/",
          "/signal-regions",
          "/vibers",
          "/pricing",
          "/privacy",
          "/terms",
          "/refunds",
          ...regions.map((r) => `/regions/${r.slug}`),
        ];
        const urls = paths
          .map((p) => `  <url><loc>${BASE_URL}${p}</loc><changefreq>weekly</changefreq></url>`)
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
