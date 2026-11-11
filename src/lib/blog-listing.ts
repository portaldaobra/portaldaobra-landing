/**
 * Search, category filter and sort for the /blog listing.
 *
 * Everything here is pure and runs client-side over the posts baked into the
 * build-time snapshot: the prerendered HTML lists every post, and the reader's
 * filters (mirrored in the URL as ?q=&tag=&sort=&audience=) are applied after
 * hydration. No pagination: the listing is meant for tens of posts, not
 * hundreds — revisit if the blog grows past ~50.
 */
import type { BlogRow } from "@/lib/cms";
import { postTags } from "@/lib/post-tags";

export const BLOG_SORTS = ["recent", "title", "reading-time"] as const;
export type BlogSort = (typeof BLOG_SORTS)[number];
export const DEFAULT_BLOG_SORT: BlogSort = "recent";

/** URL values for the audience filter. Posts marked "ambos" match both. */
export const BLOG_LISTING_AUDIENCES = ["clients", "suppliers"] as const;
export type BlogListingAudience = (typeof BLOG_LISTING_AUDIENCES)[number];

const AUDIENCE_ROW_VALUE: Record<BlogListingAudience, BlogRow["audience"]> = {
  clients: "contratantes",
  suppliers: "fornecedores",
};

/** The listing's URL search params. Absent key = no filter / default sort. */
export interface BlogListingSearch {
  q?: string;
  tag?: string;
  sort?: BlogSort;
  audience?: BlogListingAudience;
}

/** The fields of a post the listing reads. */
export type BlogListingPost = Pick<
  BlogRow,
  | "slug"
  | "title"
  | "excerpt"
  | "tag"
  | "tags"
  | "intro"
  | "sections"
  | "conclusion"
  | "publish_date"
  | "read_time"
  | "sort_order"
  | "audience"
>;

declare module "@tanstack/history" {
  interface HistoryState {
    /**
     * The listing filters a reader had when they opened a post from /blog, so
     * the post's "Voltar para o Blog" returns to the same filtered list.
     */
    blogListingSearch?: BlogListingSearch;
  }
}

// ─── URL search params ───────────────────────────────────────────────────────

function asText(value: unknown): string | undefined {
  // The router JSON-parses each param, so "?q=2026" arrives as a number.
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return typeof value === "string" ? value : undefined;
}

function isOneOf<T extends string>(options: readonly T[], value: unknown): value is T {
  return typeof value === "string" && (options as readonly string[]).includes(value);
}

/**
 * validateSearch for /blog/: keeps the known params, drops unknown or invalid
 * ones, empty values and the default sort, so every URL the listing builds is
 * the shortest one. `q` is kept exactly as typed (trailing space included) —
 * trimming it here would eat the space while the reader is still typing.
 */
export function parseBlogListingSearch(raw: Record<string, unknown>): BlogListingSearch {
  const out: BlogListingSearch = {};
  const q = asText(raw.q);
  if (q !== undefined && q.trim() !== "") out.q = q;
  const tag = asText(raw.tag)?.trim();
  if (tag) out.tag = tag;
  if (isOneOf(BLOG_SORTS, raw.sort) && raw.sort !== DEFAULT_BLOG_SORT) out.sort = raw.sort;
  if (isOneOf(BLOG_LISTING_AUDIENCES, raw.audience)) out.audience = raw.audience;
  return out;
}

// ─── Text helpers ────────────────────────────────────────────────────────────

/** Lower-case, accents removed: "Orçamento" → "orcamento". */
export function normalizeForSearch(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

const MONTHS: Record<string, number> = {
  janeiro: 1,
  jan: 1,
  fevereiro: 2,
  fev: 2,
  marco: 3,
  mar: 3,
  abril: 4,
  abr: 4,
  maio: 5,
  mai: 5,
  junho: 6,
  jun: 6,
  julho: 7,
  jul: 7,
  agosto: 8,
  ago: 8,
  setembro: 9,
  set: 9,
  outubro: 10,
  out: 10,
  novembro: 11,
  nov: 11,
  dezembro: 12,
  dez: 12,
};

function utcDate(year: number, month: number, day: number): number | null {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const time = Date.UTC(year, month - 1, day);
  // Reject roll-overs such as 31/02.
  return new Date(time).getUTCDate() === day ? time : null;
}

/**
 * `publish_date` is free text authored in the CMS ("12 de março de 2026").
 * Returns a UTC timestamp, or null when the text is not a recognisable date.
 * Also accepts ISO ("2026-03-12") and "12/03/2026".
 */
export function parsePtBrDate(text: string | null | undefined): number | null {
  if (!text) return null;
  const value = normalizeForSearch(text).replace(/[º°]/g, "").trim();

  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (iso) return utcDate(Number(iso[1]), Number(iso[2]), Number(iso[3]));

  const numeric = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value);
  if (numeric) return utcDate(Number(numeric[3]), Number(numeric[2]), Number(numeric[1]));

  const long = /^(\d{1,2})\s+(?:de\s+)?([a-z]+)\.?\s+(?:de\s+)?(\d{4})$/.exec(value);
  if (long) {
    const month = MONTHS[long[2]];
    return month ? utcDate(Number(long[3]), month, Number(long[1])) : null;
  }
  return null;
}

/** "7 min" → 7. Null when the text carries no number. */
export function parseReadingMinutes(text: string | null | undefined): number | null {
  const match = text ? /(\d+)/.exec(text) : null;
  return match ? Number(match[1]) : null;
}

// ─── Sort ────────────────────────────────────────────────────────────────────

const collator = new Intl.Collator("pt-BR", { sensitivity: "base" });

/** Nulls always sort last, whatever the direction. */
function compareNullable(a: number | null, b: number | null, direction: 1 | -1): number {
  if (a === b) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return (a - b) * direction;
}

function compareRecent(a: BlogListingPost, b: BlogListingPost): number {
  return (
    compareNullable(parsePtBrDate(a.publish_date), parsePtBrDate(b.publish_date), -1) ||
    a.sort_order - b.sort_order ||
    collator.compare(a.title, b.title)
  );
}

const COMPARATORS: Record<BlogSort, (a: BlogListingPost, b: BlogListingPost) => number> = {
  recent: compareRecent,
  title: (a, b) => collator.compare(a.title, b.title) || compareRecent(a, b),
  "reading-time": (a, b) =>
    compareNullable(parseReadingMinutes(a.read_time), parseReadingMinutes(b.read_time), 1) ||
    compareRecent(a, b),
};

/** Returns a sorted copy; the input is left untouched. */
export function sortBlogPosts<T extends BlogListingPost>(posts: readonly T[], sort: BlogSort): T[] {
  return posts.slice().sort(COMPARATORS[sort]);
}

/** The newest `limit` posts (publish_date, then sort_order). */
export function recentBlogPosts<T extends BlogListingPost>(posts: readonly T[], limit = 5): T[] {
  return sortBlogPosts(posts, "recent").slice(0, limit);
}

// ─── Filter ──────────────────────────────────────────────────────────────────

const searchTextCache = new WeakMap<object, string>();

/** Title, excerpt, tags and the article body, normalised for matching. */
function searchableText(post: BlogListingPost): string {
  const cached = searchTextCache.get(post);
  if (cached !== undefined) return cached;
  const parts: string[] = [post.title, post.excerpt ?? "", ...postTags(post)];
  parts.push(...(post.intro ?? []));
  for (const section of post.sections ?? []) {
    parts.push(section.heading, ...(section.paragraphs ?? []), ...(section.bullets ?? []));
    for (const sub of section.subsections ?? []) parts.push(sub.heading, sub.body);
  }
  parts.push(...(post.conclusion ?? []));
  const text = normalizeForSearch(parts.join("\n"));
  searchTextCache.set(post, text);
  return text;
}

export function postHasTag(post: BlogListingPost, tag: string): boolean {
  const wanted = normalizeForSearch(tag.trim());
  return postTags(post).some((t) => normalizeForSearch(t) === wanted);
}

function audienceMatches(post: BlogListingPost, audience: BlogListingAudience): boolean {
  return post.audience === "ambos" || post.audience === AUDIENCE_ROW_VALUE[audience];
}

/**
 * Keeps the posts that match every given criterion. `q` matches when every
 * word appears somewhere in the post (any order, accents and case ignored).
 */
export function filterBlogPosts<T extends BlogListingPost>(
  posts: readonly T[],
  criteria: Pick<BlogListingSearch, "q" | "tag" | "audience">,
): T[] {
  const words = normalizeForSearch(criteria.q ?? "")
    .split(/\s+/)
    .filter(Boolean);
  const tag = criteria.tag?.trim();
  return posts.filter((post) => {
    if (criteria.audience && !audienceMatches(post, criteria.audience)) return false;
    if (tag && !postHasTag(post, tag)) return false;
    if (words.length > 0) {
      const text = searchableText(post);
      if (!words.every((w) => text.includes(w))) return false;
    }
    return true;
  });
}

// ─── Categories ──────────────────────────────────────────────────────────────

export interface BlogCategoryCount {
  tag: string;
  count: number;
}

/**
 * Every tag used by the posts with how many posts carry it, A–Z (pt-BR).
 * Tags that differ only by case/accents are one category, labelled as first
 * seen; a post counts once per category.
 */
export function blogCategoryCounts(posts: readonly BlogListingPost[]): BlogCategoryCount[] {
  const byKey = new Map<string, BlogCategoryCount>();
  for (const post of posts) {
    const seen = new Set<string>();
    for (const tag of postTags(post)) {
      const key = normalizeForSearch(tag);
      if (seen.has(key)) continue;
      seen.add(key);
      const entry = byKey.get(key);
      if (entry) entry.count += 1;
      else byKey.set(key, { tag, count: 1 });
    }
  }
  return [...byKey.values()].sort((a, b) => collator.compare(a.tag, b.tag));
}
