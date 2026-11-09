import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { CoverImage } from "@/components/site/CoverImage";
import { TagChips } from "@/components/site/TagChips";
import type { BlogListingSearch } from "@/lib/blog-listing";

export type BlogCardPost = {
  slug: string;
  title: string;
  excerpt?: string | null;
  tag?: string | null;
  tags?: string[] | null;
  grad?: string | null;
  cover_image?: string | null;
  read_time?: string | null;
  /** Legacy alias of read_time. */
  read?: string;
  publish_date?: string | null;
};

/**
 * One article card — the home/provider "Novidades do Mercado" section and the
 * /blog listing render the same card.
 */
export function BlogPostCard({
  post,
  showDate = false,
  listingSearch,
}: {
  post: BlogCardPost;
  showDate?: boolean;
  /**
   * The /blog filters in effect when the card was clicked. Carried in history
   * state so the post's "Voltar para o Blog" returns to the same filtered list.
   */
  listingSearch?: BlogListingSearch;
}) {
  const readTime = post.read_time ?? post.read;
  const date = showDate ? post.publish_date : null;

  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      state={listingSearch ? { blogListingSearch: listingSearch } : undefined}
      data-testid="blog-post-card"
      className="group block h-full bg-card rounded-2xl overflow-hidden border border-border hover:shadow-elegant transition-all duration-300"
    >
      <CoverImage
        src={post.cover_image}
        alt={post.title}
        gradientClassName={post.grad}
        className="h-48"
      >
        <TagChips post={post} max={2} variant="overlay" className="absolute top-4 left-4" />
      </CoverImage>
      <div className="p-6">
        {(date || readTime) && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mb-3">
            {date && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3 w-3" /> {date}
              </span>
            )}
            {readTime && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3 w-3" /> {readTime} de leitura
              </span>
            )}
          </div>
        )}
        <h3 className="font-display text-lg font-bold text-navy leading-snug group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{post.excerpt}</p>
        )}
        <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
          Ler artigo <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </Link>
  );
}
