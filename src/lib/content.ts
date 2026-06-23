/**
 * content.ts — Snapshot accessors for SSR/prerender.
 *
 * Data is injected at build time by vite.config.ts via Vite's `define` option.
 * The constant __PRERENDER_SNAPSHOT__ is replaced with the literal JSON object
 * in both the client and server bundles — no file I/O at runtime.
 *
 * This avoids the `require is not defined` error that occurs when route loaders
 * try to read the snapshot via `node:fs` inside the ESM server bundle.
 *
 * In local dev (vite dev server), the snapshot is also injected at startup from
 * whichever snapshot file exists: snapshot.json → snapshot.example.json.
 */

// Declare the build-time constant injected by vite.config.ts.
// Vite replaces this identifier with the literal JSON at bundle time.
declare const __PRERENDER_SNAPSHOT__: import("./content").Snapshot | undefined;

import type {
  BlogRow,
  BrandRow,
  TestimonialRow,
  ObraRow,
  SocialRow,
  SettingRow,
  FaqRow,
} from "@/lib/cms";
import { parseAboutNumeros, ABOUT_NUMEROS_KEY, type AboutNumeros } from "@/lib/about-numeros";

// ─── Snapshot shape ───────────────────────────────────────────────────────────

export interface ObraTypeRow {
  name: string;
  is_default: boolean;
}
export interface FormCategoryRow {
  name: string;
}
export interface FormLocationRow {
  name: string;
}

export interface Snapshot {
  generated_at: string;
  blog_posts: BlogRow[];
  obras: ObraRow[];
  testimonials: TestimonialRow[];
  brands: BrandRow[];
  faqs: FaqRow[];
  obra_types: ObraTypeRow[];
  form_categories: FormCategoryRow[];
  form_locations: FormLocationRow[];
  social_links: SocialRow[];
  site_settings: SettingRow[];
  showcase_bids: unknown[];
}

const EMPTY_SNAPSHOT: Snapshot = {
  generated_at: "",
  blog_posts: [],
  obras: [],
  testimonials: [],
  brands: [],
  faqs: [],
  obra_types: [],
  form_categories: [],
  form_locations: [],
  social_links: [],
  site_settings: [],
  showcase_bids: [],
};

// ─── Snapshot reader ─────────────────────────────────────────────────────────

let _cache: Snapshot | null = null;

/**
 * Return the snapshot injected at build time by vite.config.ts.
 *
 * Vite replaces `__PRERENDER_SNAPSHOT__` with the literal snapshot JSON in
 * both client and server bundles. No file I/O occurs at runtime, so this works
 * in the ESM server bundle during prerender.
 */
export function getSnapshot(): Snapshot {
  if (_cache) return _cache;

  // __PRERENDER_SNAPSHOT__ is replaced by Vite's `define` with the literal
  // snapshot object at build time. In dev mode it is also injected by the
  // vite dev server from the config-time loadSnapshot() call.
  // We use typeof to guard against environments where it may not be replaced.
  if (typeof __PRERENDER_SNAPSHOT__ !== "undefined" && __PRERENDER_SNAPSHOT__) {
    _cache = __PRERENDER_SNAPSHOT__ as Snapshot;
    return _cache;
  }

  // Fallback: empty snapshot (prevents runtime crash if define was not applied).
  return EMPTY_SNAPSHOT;
}

// ─── Typed accessors ─────────────────────────────────────────────────────────

export type BlogAudience = "contratantes" | "fornecedores";

export interface BlogListFilter {
  audience?: BlogAudience;
  homeFeatured?: boolean;
  limit?: number;
}

/** Map snapshot audience enum to component enum. */
function audienceMatches(rowAudience: string, filter?: BlogAudience): boolean {
  if (!filter) return true;
  const normalized = filter === "contratantes" ? "contratantes" : "fornecedores";
  if (rowAudience === "ambos") return true;
  if (normalized === "contratantes") return rowAudience === "contratantes";
  return rowAudience === "fornecedores";
}

export function getBlogPosts(filter: BlogListFilter = {}): BlogRow[] {
  const snap = getSnapshot();
  let posts = snap.blog_posts.filter((p) => p.status === "published");

  if (filter.audience) {
    posts = posts.filter((p) => audienceMatches(p.audience, filter.audience));
  }
  if (filter.homeFeatured) {
    posts = posts.filter((p) => p.featured_home);
  }

  // Sort by sort_order then publish_date desc
  posts = posts.slice().sort((a, b) => {
    if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
    return (b.publish_date ?? "").localeCompare(a.publish_date ?? "");
  });

  if (filter.limit) {
    posts = posts.slice(0, filter.limit);
  }

  return posts;
}

export function getBlogPost(slug: string): BlogRow | null {
  const snap = getSnapshot();
  return snap.blog_posts.find((p) => p.slug === slug && p.status === "published") ?? null;
}

export function getObras(): ObraRow[] {
  return getSnapshot()
    .obras.filter((o) => o.status === "published")
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function getObra(slug: string): ObraRow | null {
  return getSnapshot().obras.find((o) => o.slug === slug && o.status === "published") ?? null;
}

export function getFaqs(profile?: "contratante" | "fornecedor"): FaqRow[] {
  const rows = getSnapshot()
    .faqs.slice()
    .sort((a, b) => a.sort_order - b.sort_order);
  if (!profile) return rows;
  return rows.filter((f) => f.profile === profile);
}

export function getTestimonials(audience: "contractor" | "supplier"): TestimonialRow[] {
  return getSnapshot()
    .testimonials.filter((t) => t.audience === audience && t.status === "active")
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function getBrands(): BrandRow[] {
  return getSnapshot()
    .brands.filter((b) => b.status === "active")
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function getSiteSettings(): SettingRow[] {
  return getSnapshot().site_settings;
}

export function getSocialLinks(): SocialRow[] {
  return getSnapshot().social_links;
}

export function getObraTypes(): ObraTypeRow[] {
  return getSnapshot().obra_types;
}

export function getFormCategories(): FormCategoryRow[] {
  return getSnapshot().form_categories;
}

export function getFormLocations(): FormLocationRow[] {
  return getSnapshot().form_locations;
}

export function getAboutNumeros(): AboutNumeros {
  const settings = getSiteSettings();
  const raw = settings.find((s) => s.key === ABOUT_NUMEROS_KEY)?.value ?? null;
  return parseAboutNumeros(raw);
}

/** All blog slugs for sitemap / prerender page enumeration. */
export function getBlogSlugs(): string[] {
  return getBlogPosts().map((p) => p.slug);
}

/** All obra slugs for sitemap / prerender page enumeration. */
export function getObraSlugs(): string[] {
  return getObras().map((o) => o.slug);
}
