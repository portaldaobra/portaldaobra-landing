/**
 * Shared parsing for the `blog_enabled` site_settings flag.
 *
 * Used by both src/lib/content.ts (runtime/prerender accessor, via the
 * `@/` alias) and vite.config.ts (build-time prerender page enumeration,
 * a plain Node module outside the app's path-alias resolution — hence the
 * relative import there). Kept dependency-free so both can share it.
 */

export const BLOG_ENABLED_SETTING_KEY = "blog_enabled";

const FALSE_VALUES = new Set(["false", "0", "no", "off"]);

/**
 * Default-on: a missing, empty, or unparseable value must never silently
 * hide the blog. Only an explicit false-ish string turns it off.
 */
export function parseBlogEnabled(rawValue: string | null | undefined): boolean {
  if (rawValue == null) return true;
  const normalized = rawValue.trim().toLowerCase();
  if (normalized === "") return true;
  return !FALSE_VALUES.has(normalized);
}
