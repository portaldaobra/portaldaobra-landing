import { ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { blogListQuery, type BlogAudience } from "@/lib/blog-posts";

export function Blog({
  limit,
  showCta = true,
  audience,
  homeFeatured = false,
  /**
   * Preloaded posts from a route loader (used in prerendered pages so content
   * is baked into HTML). If provided, skips the client-side React Query fetch.
   */
  initialPosts,
}: {
  limit?: number;
  showCta?: boolean;
  audience?: BlogAudience;
  homeFeatured?: boolean;
  initialPosts?: Array<{
    slug: string;
    title: string;
    excerpt?: string | null;
    tag?: string | null;
    grad?: string | null;
    read_time?: string | null;
    read?: string;
  }>;
} = {}) {
  const { data: list = initialPosts ?? [], isLoading } = useQuery({
    ...blogListQuery({ limit, audience, homeFeatured }),
    // Skip network fetch when initial data is already provided by a route loader
    enabled: !initialPosts || initialPosts.length === 0,
    initialData: initialPosts,
  });

  return (
    <section className="section-y bg-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary mb-3">
            Insights
          </span>
          <h2 className="h2-section text-navy">Novidades do Mercado</h2>
        </div>

        {isLoading && !initialPosts ? (
          <div className="py-12 grid place-items-center">
            <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : list.length === 0 ? (
          <p className="text-center text-muted-foreground">Nenhum artigo publicado.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            {list.map((p) => (
              <Link
                key={p.slug}
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="group block bg-card rounded-2xl overflow-hidden border border-border hover:shadow-elegant transition-all duration-300"
              >
                <div
                  className={`h-48 bg-gradient-to-br ${p.grad ?? "from-primary to-navy"} relative overflow-hidden`}
                >
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{ backgroundImage: "var(--gradient-mesh)" }}
                  />
                  {p.tag && (
                    <span className="absolute top-4 left-4 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 text-navy">
                      {p.tag}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  {(p.read_time ?? p.read) && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                      <Clock className="h-3 w-3" /> {p.read_time ?? p.read} de leitura
                    </div>
                  )}
                  <h3 className="font-display text-lg font-bold text-navy leading-snug group-hover:text-primary transition-colors">
                    {p.title}
                  </h3>
                  {p.excerpt && (
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {p.excerpt}
                    </p>
                  )}
                  <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                    Ler artigo <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
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
