// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

// ---------------------------------------------------------------------------
// Load the full snapshot at config-time (Node context, synchronous).
// Resolution order: snapshot.json (CI download) → snapshot.example.json (local).
//
// TWO uses:
//  1. Enumerate slugs for TanStack Start prerender page list.
//  2. Inject the full snapshot as a build-time `define` constant so route
//     loaders can access data without any file I/O at prerender runtime
//     (avoids the ESM `require is not defined` problem in the server bundle).
// ---------------------------------------------------------------------------
interface SnapshotRaw {
  generated_at?: string;
  blog_posts?: Array<{ slug: string; status: string; [k: string]: unknown }>;
  obras?: Array<{ slug: string; status: string; [k: string]: unknown }>;
  testimonials?: unknown[];
  brands?: unknown[];
  faqs?: unknown[];
  obra_types?: unknown[];
  form_categories?: unknown[];
  form_locations?: unknown[];
  social_links?: unknown[];
  site_settings?: unknown[];
  showcase_bids?: unknown[];
}

function loadSnapshot(): { raw: SnapshotRaw; blogSlugs: string[]; obraSlugs: string[] } {
  const candidates = [
    resolve(__dirname, "snapshot.json"),
    resolve(__dirname, "snapshot.example.json"),
  ];
  for (const p of candidates) {
    if (!existsSync(p)) continue;
    try {
      const raw = JSON.parse(readFileSync(p, "utf-8")) as SnapshotRaw;
      const blogSlugs = (raw.blog_posts ?? [])
        .filter((b) => b.status === "published")
        .map((b) => b.slug);
      const obraSlugs = (raw.obras ?? [])
        .filter((o) => o.status === "published")
        .map((o) => o.slug);
      return { raw, blogSlugs, obraSlugs };
    } catch {
      // try next
    }
  }
  console.warn(
    "[vite.config.ts] No snapshot found — dynamic routes will not be prerendered. " +
      "Place snapshot.json (or snapshot.example.json) at the repo root before building.",
  );
  return { raw: {}, blogSlugs: [], obraSlugs: [] };
}

const { raw: snapshotRaw, blogSlugs, obraSlugs } = loadSnapshot();

// Static routes that are always prerendered
const staticRoutes = [
  "/",
  "/como-funciona",
  "/solucoes",
  "/prestadores",
  "/sobre",
  "/bids",
  "/obras-realizadas",
  "/blog",
  "/duvidas-frequentes",
  "/privacidade-e-contratos",
];

const dynamicRoutes = [
  ...blogSlugs.map((slug) => `/blog/${slug}`),
  ...obraSlugs.map((slug) => `/obras-realizadas/${slug}`),
];

const allPages = [...staticRoutes, ...dynamicRoutes, "/sitemap.xml"].map((path) => ({ path }));

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    // Prerender all public routes to static HTML at build time.
    // Pages are enumerated from the local snapshot so dynamic slugs are included.
    prerender: {
      enabled: true,
      crawlLinks: false,
      failOnError: false,
    },
    pages: allPages,
  },
  vite: {
    define: {
      // Inject the full snapshot as a build-time constant.
      // Route loaders and content.ts accessors read from this rather than the
      // file system, which avoids the `require is not defined` error in the
      // ESM server bundle at prerender time.
      __PRERENDER_SNAPSHOT__: JSON.stringify(snapshotRaw),
    },
  },
});
