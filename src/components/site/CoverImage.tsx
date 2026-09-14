import { useState, type ReactNode } from "react";

/**
 * Blog cover art slot: gradient + mesh texture as the permanent base layer,
 * with the real photo (when present) layered on top.
 *
 * If `src` is empty, or the browser fails to load it (404, corrupt file,
 * unsupported format), only the gradient renders — visually identical to a
 * post with no cover image at all. This keeps every existing article safe
 * while `cover_image` is still null across the board.
 *
 * Responsive derivatives follow the convention produced by
 * `scripts/prepare-blog-covers.mjs`: given `src` = "/static/blog/<slug>.jpg",
 * the srcset points at "<slug>-640.webp", "-1280.webp", "-1920.webp" in the
 * same directory. Those files are optional — if they 404 the browser's
 * image-decode failure is caught by the same onError fallback below, so a
 * missing derivative degrades to the gradient rather than a broken icon.
 */

const RESPONSIVE_WIDTHS = [640, 1280, 1920] as const;
const BLOG_COVER_PATTERN = /^(\/static\/blog\/)([^/]+)\.(jpe?g|png)$/i;

function buildSrcSet(src: string): string | undefined {
  const match = BLOG_COVER_PATTERN.exec(src);
  if (!match) return undefined;
  const [, dir, name] = match;
  return RESPONSIVE_WIDTHS.map((w) => `${dir}${name}-${w}.webp ${w}w`).join(", ");
}

export function CoverImage({
  src,
  alt,
  gradientClassName,
  className,
  sizes = "(min-width: 1024px) 640px, 100vw",
  priority = false,
  children,
}: {
  src?: string | null;
  alt: string;
  gradientClassName?: string | null;
  /** Height + rounding classes owned by the caller (e.g. "h-48 rounded-2xl"). */
  className?: string;
  sizes?: string;
  /** Above-the-fold / LCP slot: load eagerly instead of lazily. */
  priority?: boolean;
  children?: ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <div
      className={`${className ?? ""} bg-gradient-to-br ${gradientClassName ?? "from-primary to-navy"} relative overflow-hidden`}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{ backgroundImage: "var(--gradient-mesh)" }}
      />
      {showImage && (
        <img
          src={src ?? undefined}
          srcSet={buildSrcSet(src as string)}
          sizes={sizes}
          alt={alt}
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
          {...(priority
            ? { fetchPriority: "high" as const }
            : { loading: "lazy" as const, decoding: "async" as const })}
        />
      )}
      {children}
    </div>
  );
}
