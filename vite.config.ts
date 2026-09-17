// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import type { Plugin } from "vite";
import { parseBlogEnabled, BLOG_ENABLED_SETTING_KEY } from "./src/lib/blog-settings";

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
  site_settings?: Array<{ key: string; value: string | null }>;
  showcase_bids?: unknown[];
}

function loadSnapshot(): {
  raw: SnapshotRaw;
  blogSlugs: string[];
  obraSlugs: string[];
  blogEnabled: boolean;
} {
  const candidates = [
    resolve(__dirname, "snapshot.json"),
    resolve(__dirname, "snapshot.example.json"),
  ];
  for (const p of candidates) {
    if (!existsSync(p)) continue;
    try {
      const raw = JSON.parse(readFileSync(p, "utf-8")) as SnapshotRaw;
      const blogEnabled = parseBlogEnabled(
        raw.site_settings?.find((s) => s.key === BLOG_ENABLED_SETTING_KEY)?.value,
      );
      // Blog off ⇒ the /blog pages simply aren't in the prerender page list.
      const blogSlugs = blogEnabled
        ? (raw.blog_posts ?? []).filter((b) => b.status === "published").map((b) => b.slug)
        : [];
      const obraSlugs = (raw.obras ?? [])
        .filter((o) => o.status === "published")
        .map((o) => o.slug);
      return { raw, blogSlugs, obraSlugs, blogEnabled };
    } catch {
      // try next
    }
  }
  console.warn(
    "[vite.config.ts] No snapshot found — dynamic routes will not be prerendered. " +
      "Place snapshot.json (or snapshot.example.json) at the repo root before building.",
  );
  return { raw: {}, blogSlugs: [], obraSlugs: [], blogEnabled: true };
}

const { raw: snapshotRaw, blogSlugs, obraSlugs, blogEnabled } = loadSnapshot();

// Static routes that are always prerendered
const staticRoutes = [
  "/",
  "/como-funciona",
  "/solucoes",
  "/prestadores",
  "/sobre",
  "/bids",
  "/obras-realizadas",
  ...(blogEnabled ? ["/blog"] : []),
  "/duvidas-frequentes",
  "/privacidade-e-contratos",
];

const dynamicRoutes = [
  ...blogSlugs.map((slug) => `/blog/${slug}`),
  ...obraSlugs.map((slug) => `/obras-realizadas/${slug}`),
];

const allPages = [...staticRoutes, ...dynamicRoutes, "/sitemap.xml"].map((path) => ({ path }));

// ---------------------------------------------------------------------------
// QA (noindex) build mode. SITE_NOINDEX=true flips two things together so a
// QA copy of the site (e.g. to review unpublished blog articles) can never be
// crawled or indexed:
//  1. The root <meta name="robots"> switches from "index, follow" to
//     "noindex, nofollow" — see __SITE_NOINDEX__ in src/routes/__root.tsx.
//  2. The emitted dist/client/robots.txt is rewritten to disallow every user
//     agent (including the named AI crawlers), replacing the allow-all
//     committed in public/robots.txt for a normal build.
// Default is false — a normal production build is byte-for-byte unchanged.
// ---------------------------------------------------------------------------
const siteNoindex = process.env.SITE_NOINDEX === "true";
console.log(
  `[vite.config.ts] Build mode: ${
    siteNoindex
      ? "QA (SITE_NOINDEX=true — noindex,nofollow + robots.txt disallow-all)"
      : "production (indexable)"
  }`,
);

/**
 * Overwrites the emitted robots.txt with a disallow-all once the client
 * environment has finished writing its output (after Vite's own public-dir
 * copy runs), so a QA build never ships the crawlable robots.txt copied
 * verbatim from public/. No-op when SITE_NOINDEX is not set.
 */
function noindexRobotsPlugin(): Plugin {
  return {
    name: "portal-da-obra:noindex-robots",
    apply: "build",
    writeBundle: {
      order: "post",
      handler(options) {
        if (!siteNoindex) return;
        // Only the client environment's output is synced to S3/CloudFront.
        if (this.environment && this.environment.name !== "client") return;
        const outDir = options.dir ?? resolve(__dirname, "dist/client");
        const robotsPath = resolve(outDir, "robots.txt");
        writeFileSync(robotsPath, "User-agent: *\nDisallow: /\n");
        console.log(`[vite.config.ts] QA build — rewrote ${robotsPath} to disallow-all.`);
      },
    },
  };
}

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
      // TanStack Start's autoStaticPathsDiscovery auto-discovers every
      // static (param-free) route from the file-based route tree — e.g.
      // "/blog" and "/blog/" would still be prerendered even when omitted
      // from `pages` above, since discovery happens independently of that
      // list. Explicitly exclude the blog surface here when disabled.
      filter: (page: { path: string }) =>
        blogEnabled || (page.path !== "/blog" && !page.path.startsWith("/blog/")),
    },
    pages: allPages,
  },
  plugins: [noindexRobotsPlugin()],
  vite: {
    define: {
      // Inject the full snapshot as a build-time constant.
      // Route loaders and content.ts accessors read from this rather than the
      // file system, which avoids the `require is not defined` error in the
      // ESM server bundle at prerender time.
      __PRERENDER_SNAPSHOT__: JSON.stringify(snapshotRaw),
      // QA (noindex) build mode flag — see src/routes/__root.tsx.
      __SITE_NOINDEX__: JSON.stringify(siteNoindex),
    },
  },
});
