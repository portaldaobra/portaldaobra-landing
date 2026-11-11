import { Link } from "@tanstack/react-router";
import { postTags } from "@/lib/post-tags";

/**
 * Blog tags, rendered as stickers.
 *
 * The article header previously emitted a bare inline <span> straight after the
 * "Voltar para o Blog" link. Both were inline-level, so the tag rode up onto the
 * same line as the link and read as part of it rather than as a tag. These sit
 * on their own row, and the peel treatment (a slight tilt, a lift shadow and a
 * folded corner) is what makes them legible as tags at a glance.
 */
export function TagChips({
  post,
  max,
  className = "",
  variant = "default",
  linkToListing = false,
}: {
  post: { tags?: string[] | null; tag?: string | null };
  /** Cap for tight slots such as a card overlay. Extra tags collapse to "+N". */
  max?: number;
  className?: string;
  /** "overlay" sits on top of cover art and needs an opaque backing. */
  variant?: "default" | "overlay";
  /**
   * Each tag links to the /blog listing filtered by it (?tag=). Only where the
   * chips are not already inside a link — never on a card.
   */
  linkToListing?: boolean;
}) {
  const all = postTags(post);
  if (all.length === 0) return null;

  const shown = typeof max === "number" ? all.slice(0, max) : all;
  const hidden = all.length - shown.length;

  const base =
    "tag-peel inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wider";
  const skin =
    variant === "overlay"
      ? "bg-white/95 text-navy"
      : "bg-primary/10 text-primary ring-1 ring-inset ring-primary/20";

  return (
    <ul className={`flex flex-wrap items-center gap-2 ${className}`}>
      {shown.map((t) =>
        linkToListing ? (
          <li key={t}>
            <Link
              to="/blog"
              search={{ tag: t }}
              title={`Ver artigos de ${t}`}
              className={`${base} ${skin} hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
            >
              {t}
            </Link>
          </li>
        ) : (
          <li key={t} className={`${base} ${skin}`}>
            {t}
          </li>
        ),
      )}
      {hidden > 0 && (
        <li className={`${base} ${skin} tag-peel-flat`} aria-label={`mais ${hidden} tags`}>
          +{hidden}
        </li>
      )}
    </ul>
  );
}
