import { useCallback } from "react";
import { createFileRoute, Link, useHydrated, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { BlogIndex, type BlogSearchUpdate } from "@/components/site/BlogIndex";
import { getBlogPosts, isBlogEnabled } from "@/lib/content";
import { parseBlogListingSearch, type BlogListingSearch } from "@/lib/blog-listing";

const NO_FILTERS: BlogListingSearch = {};

export const Route = createFileRoute("/blog/")({
  // ?q=&tag=&sort=&audience= — see src/lib/blog-listing.ts. Filtering runs
  // client-side over the posts below, so the prerendered page stays the full
  // list and any filtered URL is shareable.
  validateSearch: (search: Record<string, unknown>): BlogListingSearch =>
    parseBlogListingSearch(search),
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
  const urlSearch = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  // The HTML was prerendered with no search params; render that same state
  // until hydration so React adopts the markup, then apply the URL's filters.
  const hydrated = useHydrated();

  const onSearchChange = useCallback(
    (update: BlogSearchUpdate, options?: { replace?: boolean }) => {
      void navigate({
        search: (prev) => parseBlogListingSearch({ ...update(prev) }),
        replace: options?.replace,
        resetScroll: false,
      });
    },
    [navigate],
  );

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
      <BlogIndex
        posts={posts}
        search={hydrated ? urlSearch : NO_FILTERS}
        hydrated={hydrated}
        onSearchChange={onSearchChange}
      />
      <Footer />
    </main>
  );
}
