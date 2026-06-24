import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getBlogSlugs, getObraSlugs } from "@/lib/content";

// TODO: replace with your project URL once a custom domain is set.
const BASE_URL = "";

interface SitemapEntry {
  path: string;
  changefreq?: "daily" | "weekly" | "monthly" | "yearly";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        // Static pages always included
        const staticEntries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/como-funciona", changefreq: "monthly", priority: "0.9" },
          { path: "/solucoes", changefreq: "monthly", priority: "0.9" },
          { path: "/prestadores", changefreq: "monthly", priority: "0.9" },
          { path: "/sobre", changefreq: "monthly", priority: "0.7" },
          { path: "/bids", changefreq: "daily", priority: "0.8" },
          { path: "/obras-realizadas", changefreq: "weekly", priority: "0.8" },
          { path: "/blog", changefreq: "weekly", priority: "0.8" },
          { path: "/duvidas-frequentes", changefreq: "monthly", priority: "0.6" },
          { path: "/privacidade-e-contratos", changefreq: "yearly", priority: "0.3" },
        ];

        // Dynamic entries from snapshot (enumerated at build time / SSR)
        let blogEntries: SitemapEntry[] = [];
        let obraEntries: SitemapEntry[] = [];
        try {
          blogEntries = getBlogSlugs().map((slug) => ({
            path: `/blog/${slug}`,
            changefreq: "monthly" as const,
            priority: "0.7",
          }));
          obraEntries = getObraSlugs().map((slug) => ({
            path: `/obras-realizadas/${slug}`,
            changefreq: "monthly" as const,
            priority: "0.7",
          }));
        } catch {
          // Snapshot unavailable (e.g. runtime with no snapshot) — skip dynamic entries
        }

        const entries = [...staticEntries, ...blogEntries, ...obraEntries];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
