import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogPostCard } from "@/components/site/BlogPostCard";
import type { BlogRow } from "@/lib/cms";
import {
  BLOG_LISTING_AUDIENCES,
  BLOG_SORTS,
  DEFAULT_BLOG_SORT,
  blogCategoryCounts,
  filterBlogPosts,
  normalizeForSearch,
  parseBlogListingSearch,
  recentBlogPosts,
  sortBlogPosts,
  type BlogListingAudience,
  type BlogListingSearch,
  type BlogSort,
} from "@/lib/blog-listing";

const SORT_LABELS: Record<BlogSort, string> = {
  recent: "Mais recentes",
  title: "A–Z",
  "reading-time": "Leitura mais curta",
};

const AUDIENCE_LABELS: Record<BlogListingAudience, string> = {
  clients: "Contratantes",
  suppliers: "Fornecedores",
};

export type BlogSearchUpdate = (prev: BlogListingSearch) => BlogListingSearch;

const sameTag = (a: string | undefined, b: string) =>
  a !== undefined && normalizeForSearch(a) === normalizeForSearch(b);

const articles = (n: number) => (n === 1 ? "1 artigo" : `${n} artigos`);

/**
 * The /blog listing: search, category chips, sort and audience over the posts
 * baked into the build, with a "Categorias" + "Recentes" sidebar.
 *
 * `search` is the URL state (?q=&tag=&sort=&audience=). The route passes `{}`
 * until hydration so the first client render matches the prerendered HTML;
 * the reader's filters apply right after.
 */
export function BlogIndex({
  posts,
  search,
  hydrated,
  onSearchChange,
}: {
  posts: BlogRow[];
  search: BlogListingSearch;
  hydrated: boolean;
  /** `replace` for keystrokes (no history entry per letter); push otherwise. */
  onSearchChange: (update: BlogSearchUpdate, options?: { replace?: boolean }) => void;
}) {
  const searchInputId = useId();
  const sortId = useId();
  const audienceId = useId();

  // The search box is local state so typing never waits on the router; each
  // change is mirrored to ?q=. A ?q= that changes from elsewhere (back button,
  // "Limpar filtros", a shared link after hydration) is copied back in.
  const [query, setQuery] = useState(search.q ?? "");
  const pushedQuery = useRef(search.q);
  useEffect(() => {
    if (search.q !== pushedQuery.current) {
      pushedQuery.current = search.q;
      setQuery(search.q ?? "");
    }
  }, [search.q]);

  const sort = search.sort ?? DEFAULT_BLOG_SORT;
  const activeTag = search.tag;
  const audience = search.audience;

  const allCategories = useMemo(() => blogCategoryCounts(posts), [posts]);
  const recent = useMemo(() => recentBlogPosts(posts, 5), [posts]);
  const showAudienceFilter = useMemo(() => posts.some((p) => p.audience !== "ambos"), [posts]);

  // Category counts follow the search and audience, so each number is what a
  // click on that category will show.
  const withoutTag = useMemo(
    () => filterBlogPosts(posts, { q: query, audience }),
    [posts, query, audience],
  );
  const facetCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of blogCategoryCounts(withoutTag)) counts.set(normalizeForSearch(c.tag), c.count);
    return counts;
  }, [withoutTag]);
  const countFor = (tag: string) => facetCounts.get(normalizeForSearch(tag)) ?? 0;

  const results = useMemo(
    () => sortBlogPosts(filterBlogPosts(withoutTag, { tag: activeTag }), sort),
    [withoutTag, activeTag, sort],
  );

  const currentSearch = useMemo(
    () => parseBlogListingSearch({ ...search, q: query }),
    [search, query],
  );
  const hasFilters = Boolean(query.trim() || activeTag || audience);

  function changeQuery(value: string) {
    setQuery(value);
    const next = value.trim() === "" ? undefined : value;
    pushedQuery.current = next;
    onSearchChange((prev) => ({ ...prev, q: next }), { replace: true });
  }

  function selectTag(tag: string | undefined) {
    onSearchChange((prev) => ({ ...prev, tag }));
  }

  function clearFilters() {
    setQuery("");
    pushedQuery.current = undefined;
    onSearchChange((prev) => ({ sort: prev.sort }));
  }

  const chipClass = (active: boolean) =>
    `inline-flex items-center gap-1 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
      active
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border bg-background text-foreground hover:border-primary/40 hover:text-primary"
    }`;
  const selectClass =
    "h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  return (
    <div data-testid="blog-listing" data-hydrated={hydrated ? "true" : "false"}>
      <section className="bg-secondary border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-12 sm:pb-14">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Link>
          <span className="mt-8 block text-xs font-bold uppercase tracking-wider text-primary">
            Blog
          </span>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl font-bold text-navy text-balance">
            Novidades do Mercado
          </h1>
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-muted-foreground">
            Conteúdos e insights sobre construção corporativa, varejo e gestão de obras.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-14 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="min-w-0">
            {/* Toolbar — always visible, whatever the results. */}
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-end">
                <div className="flex-1">
                  <label
                    htmlFor={searchInputId}
                    className="block text-xs font-semibold text-muted-foreground mb-1.5"
                  >
                    Buscar
                  </label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id={searchInputId}
                      type="search"
                      aria-label="Buscar artigos"
                      placeholder="Título, resumo ou conteúdo"
                      value={query}
                      onChange={(e) => changeQuery(e.target.value)}
                      className="h-11 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 md:flex md:w-auto">
                  <div className="md:w-44">
                    <label
                      htmlFor={sortId}
                      className="block text-xs font-semibold text-muted-foreground mb-1.5"
                    >
                      Ordenar por
                    </label>
                    <select
                      id={sortId}
                      className={selectClass}
                      value={sort}
                      onChange={(e) => {
                        const next = e.target.value as BlogSort;
                        onSearchChange((prev) => ({ ...prev, sort: next }));
                      }}
                    >
                      {BLOG_SORTS.map((s) => (
                        <option key={s} value={s}>
                          {SORT_LABELS[s]}
                        </option>
                      ))}
                    </select>
                  </div>
                  {showAudienceFilter && (
                    <div className="md:w-44">
                      <label
                        htmlFor={audienceId}
                        className="block text-xs font-semibold text-muted-foreground mb-1.5"
                      >
                        Público
                      </label>
                      <select
                        id={audienceId}
                        className={selectClass}
                        value={audience ?? ""}
                        onChange={(e) => {
                          const next = (e.target.value || undefined) as
                            | BlogListingAudience
                            | undefined;
                          onSearchChange((prev) => ({ ...prev, audience: next }));
                        }}
                      >
                        <option value="">Todos</option>
                        {BLOG_LISTING_AUDIENCES.map((a) => (
                          <option key={a} value={a}>
                            {AUDIENCE_LABELS[a]}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {allCategories.length > 0 && (
                <div
                  role="group"
                  aria-label="Filtrar por categoria"
                  className="flex flex-wrap gap-2"
                >
                  <button
                    type="button"
                    aria-pressed={!activeTag}
                    className={chipClass(!activeTag)}
                    onClick={() => selectTag(undefined)}
                  >
                    Todas <span className="text-xs opacity-75">({withoutTag.length})</span>
                  </button>
                  {allCategories.map((c) => {
                    const active = sameTag(activeTag, c.tag);
                    return (
                      <button
                        key={c.tag}
                        type="button"
                        aria-pressed={active}
                        className={chipClass(active)}
                        onClick={() => selectTag(active ? undefined : c.tag)}
                      >
                        {c.tag} <span className="text-xs opacity-75">({countFor(c.tag)})</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-6 mb-5 flex flex-wrap items-center justify-between gap-3">
              <p
                data-testid="blog-result-count"
                aria-live="polite"
                className="text-sm font-medium text-muted-foreground"
              >
                {results.length === 0 ? "Nenhum artigo" : articles(results.length)}
              </p>
              {hasFilters && results.length > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                >
                  <X className="h-3.5 w-3.5" /> Limpar filtros
                </button>
              )}
            </div>

            {results.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-10 text-center">
                <p className="text-muted-foreground">
                  Nenhum artigo encontrado com os filtros selecionados.
                </p>
                {hasFilters && (
                  <Button variant="outline" className="mt-5" onClick={clearFilters}>
                    Limpar filtros
                  </Button>
                )}
              </div>
            ) : (
              <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((p) => (
                  <li key={p.slug}>
                    <BlogPostCard post={p} showDate listingSearch={currentSearch} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Sidebar — beside the list on desktop, after it on mobile. */}
          <aside className="space-y-6">
            {allCategories.length > 0 && (
              <section className="rounded-2xl border border-border bg-card p-6">
                <h2 className="font-display text-lg font-bold text-navy">Categorias</h2>
                <nav aria-label="Categorias" className="mt-4">
                  <ul className="space-y-1">
                    {allCategories.map((c) => {
                      const active = sameTag(activeTag, c.tag);
                      return (
                        <li key={c.tag}>
                          <Link
                            to="/blog"
                            search={parseBlogListingSearch({ ...currentSearch, tag: c.tag })}
                            aria-current={active ? "true" : undefined}
                            className={`flex items-center justify-between gap-3 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-secondary hover:text-primary ${
                              active ? "bg-secondary font-semibold text-primary" : "text-navy"
                            }`}
                          >
                            <span>{c.tag}</span>
                            <span className="text-xs text-muted-foreground">
                              ({countFor(c.tag)})
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </section>
            )}

            {recent.length > 0 && (
              <section className="rounded-2xl border border-border bg-card p-6">
                <h2 className="font-display text-lg font-bold text-navy">Recentes</h2>
                <nav aria-label="Recentes" className="mt-4">
                  <ul className="space-y-4">
                    {recent.map((p) => (
                      <li key={p.slug}>
                        <Link
                          to="/blog/$slug"
                          params={{ slug: p.slug }}
                          state={{ blogListingSearch: currentSearch }}
                          className="group block"
                        >
                          <span className="block text-sm font-semibold leading-snug text-navy group-hover:text-primary transition-colors">
                            {p.title}
                          </span>
                          {p.publish_date && (
                            <span className="mt-1 block text-xs text-muted-foreground">
                              {p.publish_date}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </section>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}
