import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Facebook,
  Linkedin,
  Twitter,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { blogListQuery, blogPostQuery, type BlogPost } from "@/lib/blog-posts";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params, context }) => {
    const post = await context.queryClient.ensureQueryData(blogPostQuery(params.slug));
    if (!post) throw notFound();
    await context.queryClient.ensureQueryData(blogListQuery({}));
  },
  head: ({ params }) => {
    const url = `/blog/${params.slug}`;
    const title = "Artigo — Portal da Obra";
    return {
      meta: [
        { title },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  errorComponent: ({ error }) => (
    <main className="min-h-screen grid place-items-center p-8 text-center">
      <div>
        <p className="text-destructive font-semibold">Erro ao carregar o artigo.</p>
        <p className="text-sm text-muted-foreground mt-2">{String(error)}</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/blog">Voltar para o Blog</Link>
        </Button>
      </div>
    </main>
  ),
  notFoundComponent: () => (
    <main className="min-h-screen grid place-items-center p-8 text-center">
      <div>
        <h1 className="font-display text-2xl font-bold text-navy">Artigo não encontrado</h1>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/blog">Voltar para o Blog</Link>
        </Button>
      </div>
    </main>
  ),
  component: ArticlePage,
});

function ArticlePage() {
  const { slug } = Route.useParams();
  const { data: post } = useSuspenseQuery(blogPostQuery(slug));
  const { data: all = [] } = useQuery(blogListQuery({}));
  if (!post) return null;

  const idx = all.findIndex((p: BlogPost) => p.slug === post.slug);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;
  const related = all.filter((p: BlogPost) => p.slug !== post.slug).slice(0, 3);

  const shareUrl = `/blog/${post.slug}`;
  const shareText = encodeURIComponent(post.title);
  const shareHref = encodeURIComponent(shareUrl);

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <article className="pt-10 pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar para o Blog
          </Link>

          {post.tag && (
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary mb-4">
              {post.tag}
            </span>
          )}

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-navy leading-tight text-balance">
            {post.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {post.date && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> {post.date}
              </span>
            )}
            {post.read && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {post.read} de leitura
              </span>
            )}
          </div>

          <div
            className={`mt-8 h-64 sm:h-80 rounded-2xl bg-gradient-to-br ${post.grad ?? "from-primary to-navy"} relative overflow-hidden`}
          >
            <div
              className="absolute inset-0 opacity-30"
              style={{ backgroundImage: "var(--gradient-mesh)" }}
            />
          </div>

          {/* Intro */}
          <div className="mt-10 space-y-4">
            {post.intro.map((p, i) => (
              <p key={i} className="text-lg text-foreground/90 leading-relaxed">
                {p}
              </p>
            ))}
          </div>

          {/* Sections */}
          <div className="mt-12 space-y-12">
            {post.sections.map((s) => (
              <section key={s.heading}>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy">
                  {s.heading}
                </h2>
                {(s.paragraphs ?? []).map((p, i) => (
                  <p key={i} className="mt-4 text-base text-foreground/85 leading-relaxed">
                    {p}
                  </p>
                ))}

                {s.bullets && (
                  <ul className="mt-5 space-y-2.5">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3 text-base text-foreground/85">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {s.subsections && (
                  <div className="mt-6 space-y-5">
                    {s.subsections.map((sub) => (
                      <div key={sub.heading}>
                        <h3 className="font-display text-lg font-semibold text-navy">
                          {sub.heading}
                        </h3>
                        <p className="mt-2 text-base text-foreground/85 leading-relaxed">
                          {sub.body}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Conclusion */}
          {post.conclusion.length > 0 && (
            <section className="mt-14">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy">Conclusão</h2>
              <div className="mt-4 space-y-4">
                {post.conclusion.map((p, i) => (
                  <p key={i} className="text-base text-foreground/85 leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          )}

          {/* Share */}
          <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-border pt-8">
            <span className="text-sm font-semibold text-foreground">Compartilhar:</span>
            <ShareButton label="LinkedIn" icon={Linkedin} href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareHref}`} />
            <ShareButton label="Facebook" icon={Facebook} href={`https://www.facebook.com/sharer/sharer.php?u=${shareHref}`} />
            <ShareButton label="X" icon={Twitter} href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareHref}`} />
            <ShareButton label="WhatsApp" icon={MessageCircle} href={`https://api.whatsapp.com/send?text=${shareText}%20${shareHref}`} />
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-2xl bg-gradient-to-r from-primary to-navy p-8 text-primary-foreground">
            <h3 className="font-display text-xl sm:text-2xl font-bold leading-snug text-balance">
              Torne a contratação de obras mais eficiente, transparente e competitiva com o Portal da Obra.
            </h3>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary" className="font-semibold">
                <Link to="/">
                  Solicitar Orçamento <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-white/40 text-white hover:bg-white/10 hover:text-white">
                <Link to="/blog">Ver mais artigos</Link>
              </Button>
            </div>
          </div>

          {/* Prev / Next */}
          <nav className="mt-12 grid sm:grid-cols-2 gap-4">
            {prev ? (
              <Link
                to="/blog/$slug"
                params={{ slug: prev.slug }}
                className="group block rounded-xl border border-border bg-card p-5 hover:border-primary/40 transition-colors"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  ← Artigo anterior
                </span>
                <p className="mt-2 font-display font-bold text-navy group-hover:text-primary transition-colors">
                  {prev.title}
                </p>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                to="/blog/$slug"
                params={{ slug: next.slug }}
                className="group block rounded-xl border border-border bg-card p-5 hover:border-primary/40 transition-colors sm:text-right"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Próximo artigo →
                </span>
                <p className="mt-2 font-display font-bold text-navy group-hover:text-primary transition-colors">
                  {next.title}
                </p>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-8">
              Artigos relacionados
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((r: BlogPost) => (
                <Link
                  key={r.slug}
                  to="/blog/$slug"
                  params={{ slug: r.slug }}
                  className="group block bg-card rounded-2xl overflow-hidden border border-border hover:shadow-elegant transition-all duration-300"
                >
                  <div className={`h-36 bg-gradient-to-br ${r.grad ?? "from-primary to-navy"} relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "var(--gradient-mesh)" }} />
                    {r.tag && (
                      <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 text-navy">
                        {r.tag}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-base font-bold text-navy leading-snug group-hover:text-primary transition-colors">
                      {r.title}
                    </h3>
                    {r.excerpt && (
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{r.excerpt}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <Footer />
    </main>
  );
}

function ShareButton({
  label,
  icon: Icon,
  href,
}: {
  label: string;
  icon: typeof Linkedin;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Compartilhar no ${label}`}
      className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-border text-foreground/70 hover:text-primary hover:border-primary/40 transition-colors"
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}

// Keep Loader2 referenced to avoid unused import lint
void Loader2;
