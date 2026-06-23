import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Blog } from "@/components/site/Blog";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog — Portal da Obra" },
      {
        name: "description",
        content:
          "Conteúdos e insights sobre construção corporativa, varejo e gestão de obras.",
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
      <Blog />
      <Footer />
    </main>
  );
}