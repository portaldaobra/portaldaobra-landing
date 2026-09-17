import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Blog } from "@/components/site/Blog";
import { ArrowLeft } from "lucide-react";
import { getBlogPosts, isBlogEnabled } from "@/lib/content";

export const Route = createFileRoute("/blog/")({
  loader: async () => {
    const posts = getBlogPosts({});
    return { posts };
  },
  head: () => ({
    meta: [
      { title: "Blog — Portal da Obra" },
      {
        name: "description",
        content: "Conteúdos e insights sobre construção corporativa, varejo e gestão de obras.",
      },
      { property: "og:title", content: "Blog — Portal da Obra" },
      { property: "og:description", content: "Insights de mercado para empresas em expansão." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogPage,
});

function BlogPage() {
  const { posts } = Route.useLoaderData();

  // The blog is excluded from the prerender list when blog_enabled is off
  // (see vite.config.ts), so a normal build never ships this page — but a
  // direct hit in dev mode, or a stale bookmark/link, must not crash.
  if (!isBlogEnabled()) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="font-display text-2xl font-bold text-navy">Blog indisponível</h1>
          <p className="mt-3 text-muted-foreground">Esta seção não está disponível no momento.</p>
          <Link
            to="/"
            className="mt-6 inline-block text-sm font-semibold text-primary hover:underline"
          >
            Voltar para a página inicial
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-12 pb-4 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
      </div>
      <Blog initialPosts={posts} />
      <Footer />
    </main>
  );
}
