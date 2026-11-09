import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { getBlogPosts } from "@/lib/content";
import type { BlogAudience } from "@/lib/content";
import { BlogPostCard, type BlogCardPost } from "@/components/site/BlogPostCard";

/**
 * The "Novidades do Mercado" teaser section (home, prestadores). The full
 * listing with search and filters is BlogIndex, on /blog.
 */
export function Blog({
  limit,
  showCta = true,
  audience,
  homeFeatured = false,
  /**
   * Preloaded posts from a route loader (used in prerendered pages so content
   * is baked into HTML). If provided, skips the snapshot accessor fallback.
   */
  initialPosts,
}: {
  limit?: number;
  /** "Ver Todos os Artigos" — a link to the /blog listing. */
  showCta?: boolean;
  audience?: BlogAudience;
  homeFeatured?: boolean;
  initialPosts?: BlogCardPost[];
} = {}) {
  const list: BlogCardPost[] =
    initialPosts && initialPosts.length > 0
      ? initialPosts
      : getBlogPosts({ limit, audience, homeFeatured });

  return (
    <section className="section-y bg-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary mb-3">
            Insights
          </span>
          <h2 className="h2-section text-navy">Novidades do Mercado</h2>
        </div>

        {list.length === 0 ? (
          <p className="text-center text-muted-foreground">Nenhum artigo publicado.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            {list.map((p) => (
              <BlogPostCard key={p.slug} post={p} />
            ))}
          </div>
        )}

        {showCta && (
          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
              <Link to="/blog">
                Ver Todos os Artigos <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
