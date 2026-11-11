import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { expect, test, type Page } from "@playwright/test";

// Phase nov08 T4 — the /blog listing: search, category filter, sort, and the
// links that land on it ("Ver Todos os Artigos" on the home, a tag on a post).
//
// Self-contained like lead-form.spec.ts: Playwright builds + previews the site
// from the same snapshot vite.config.ts bakes in (snapshot.json, else
// snapshot.example.json). Expectations are derived from that file here, with
// an oracle written independently of src/lib/blog-listing.ts, so the spec keeps
// working when the published content changes.

type SnapshotPost = {
  slug: string;
  title: string;
  status: string;
  tag?: string | null;
  tags?: string[] | null;
  excerpt?: string | null;
  intro?: string[];
  sections?: Array<{
    heading: string;
    paragraphs?: string[];
    bullets?: string[];
    subsections?: Array<{ heading: string; body: string }>;
  }>;
  conclusion?: string[];
};

type Snapshot = {
  blog_posts?: SnapshotPost[];
  site_settings?: Array<{ key: string; value: string | null }>;
};

function loadSnapshot(): Snapshot {
  const root = fileURLToPath(new URL("..", import.meta.url));
  for (const name of ["snapshot.json", "snapshot.example.json"]) {
    const path = `${root}${name}`;
    if (existsSync(path)) return JSON.parse(readFileSync(path, "utf-8")) as Snapshot;
  }
  return {};
}

const snapshot = loadSnapshot();
const blogSetting = snapshot.site_settings?.find((s) => s.key === "blog_enabled")?.value;
const blogEnabled = !["false", "0", "no", "off"].includes((blogSetting ?? "").trim().toLowerCase());
const published = (snapshot.blog_posts ?? []).filter((p) => p.status === "published");

const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function tagsOf(p: SnapshotPost): string[] {
  const many = (p.tags ?? []).map((t) => t.trim()).filter(Boolean);
  if (many.length > 0) return many;
  return p.tag?.trim() ? [p.tag.trim()] : [];
}

function postsWithTag(tag: string): SnapshotPost[] {
  return published.filter((p) => tagsOf(p).some((t) => fold(t) === fold(tag)));
}

function searchableText(p: SnapshotPost): string {
  const parts = [
    p.title,
    p.excerpt ?? "",
    ...tagsOf(p),
    ...(p.intro ?? []),
    ...(p.conclusion ?? []),
  ];
  for (const s of p.sections ?? []) {
    parts.push(s.heading, ...(s.paragraphs ?? []), ...(s.bullets ?? []));
    for (const sub of s.subsections ?? []) parts.push(sub.heading, sub.body);
  }
  return fold(parts.join(" \n "));
}

/** A tag that narrows the list (fewer posts than the whole blog), smallest first. */
function narrowingTag(): { tag: string; count: number } | null {
  const tags = [...new Set(published.flatMap(tagsOf))];
  const ranked = tags
    .map((tag) => ({ tag, count: postsWithTag(tag).length }))
    .filter((t) => t.count > 0 && t.count < published.length)
    .sort((a, b) => a.count - b.count);
  return ranked[0] ?? null;
}

/**
 * A single title word that carries an accent, typed WITHOUT it, that matches
 * some posts but not all — proves the search narrows and folds accents.
 */
function accentFoldedQuery(): { query: string; expected: string[] } | null {
  for (const p of published) {
    for (const word of p.title.split(/[^\p{L}\p{N}]+/u)) {
      if (word.length < 4 || fold(word) === word.toLowerCase()) continue;
      const query = fold(word);
      const expected = published
        .filter((x) => searchableText(x).includes(query))
        .map((x) => x.title);
      if (expected.length > 0 && expected.length < published.length) return { query, expected };
    }
  }
  return null;
}

async function gotoListing(page: Page, search = ""): Promise<void> {
  await page.goto(`/blog${search}`);
  // The page is prerendered; filters only respond once React has taken over.
  await expect(page.getByTestId("blog-listing")).toHaveAttribute("data-hydrated", "true", {
    timeout: 30_000,
  });
}

const cards = (page: Page) => page.getByTestId("blog-post-card");
const cardTitles = (page: Page) => cards(page).locator("h3").allTextContents();
const searchParam = (page: Page, key: string) => new URL(page.url()).searchParams.get(key);
const categoryChips = (page: Page) => page.getByRole("group", { name: "Filtrar por categoria" });
const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** A category chip reads "<tag> (<count>)". */
const chipName = (tag: string) => new RegExp(`^${escapeRegExp(tag)} \\(\\d+\\)$`);

test.describe("blog listing", () => {
  test.skip(!blogEnabled, "blog_enabled is off in the snapshot — /blog is not built");
  test.skip(published.length < 2, "needs at least two published posts to filter");

  test("lists every published post with the toolbar, the count and the sidebar", async ({
    page,
  }) => {
    await gotoListing(page);

    await expect(cards(page)).toHaveCount(published.length);
    await expect(page.getByTestId("blog-result-count")).toHaveText(`${published.length} artigos`);
    await expect(page.getByRole("searchbox", { name: "Buscar artigos" })).toBeVisible();
    await expect(page.getByLabel("Ordenar por")).toHaveValue("recent");
    await expect(categoryChips(page).getByRole("button", { name: /^Todas/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    const sidebarCategories = page.getByRole("navigation", { name: "Categorias" });
    await expect(sidebarCategories.getByRole("link")).toHaveCount(
      new Set(published.flatMap(tagsOf).map(fold)).size,
    );
    await expect(page.getByRole("navigation", { name: "Recentes" }).getByRole("link")).toHaveCount(
      Math.min(5, published.length),
    );

    // The bug this phase fixes: the listing used to repeat the home section,
    // whose "Ver Todos os Artigos" pointed at the page you were already on.
    await expect(page.getByRole("link", { name: /Ver Todos os Artigos/i })).toHaveCount(0);
  });

  test("'Ver Todos os Artigos' on the home lands on the listing", async ({ page }) => {
    await page.goto("/");
    const cta = page.getByRole("link", { name: /Ver Todos os Artigos/i });
    await cta.scrollIntoViewIfNeeded();
    await cta.click();

    await expect(page).toHaveURL(/\/blog\/?$/);
    await expect(page.getByTestId("blog-listing")).toBeVisible();
    await expect(page.getByRole("searchbox", { name: "Buscar artigos" })).toBeVisible();
  });

  test("searching narrows the list, ignores accents and mirrors ?q=", async ({ page }) => {
    const pick = accentFoldedQuery();
    test.skip(!pick, "no accented title word narrows the snapshot's posts");
    const { query, expected } = pick!;

    await gotoListing(page);
    const box = page.getByRole("searchbox", { name: "Buscar artigos" });
    // Real keystrokes, not fill(): each letter round-trips through the URL and
    // none may be lost on the way.
    await box.pressSequentially(query);

    await expect(box).toHaveValue(query);
    await expect(cards(page)).toHaveCount(expected.length);
    expect((await cardTitles(page)).sort()).toEqual([...expected].sort());
    await expect.poll(() => searchParam(page, "q")).toBe(query);
  });

  test("a shared ?q= link opens with the search box filled", async ({ page }) => {
    const pick = accentFoldedQuery();
    test.skip(!pick, "no accented title word narrows the snapshot's posts");
    const { query, expected } = pick!;

    await gotoListing(page, `?q=${encodeURIComponent(query)}`);

    await expect(page.getByRole("searchbox", { name: "Buscar artigos" })).toHaveValue(query);
    await expect(cards(page)).toHaveCount(expected.length);
  });

  test("an empty result offers to clear the filters", async ({ page }) => {
    await gotoListing(page);
    const box = page.getByRole("searchbox", { name: "Buscar artigos" });
    await box.fill("zzqx-nenhum-artigo-tem-isto");

    await expect(cards(page)).toHaveCount(0);
    await expect(
      page.getByText("Nenhum artigo encontrado com os filtros selecionados."),
    ).toBeVisible();
    await page.getByRole("button", { name: "Limpar filtros" }).click();

    await expect(cards(page)).toHaveCount(published.length);
    await expect(box).toHaveValue("");
    await expect.poll(() => searchParam(page, "q")).toBeNull();
  });

  test("a category chip filters, sets ?tag= and the back button undoes it", async ({ page }) => {
    const pick = narrowingTag();
    test.skip(!pick, "every tag covers every post — nothing to narrow");
    const { tag, count } = pick!;

    await gotoListing(page);
    const chip = categoryChips(page).getByRole("button", { name: chipName(tag) });
    await chip.click();

    await expect(cards(page)).toHaveCount(count);
    expect((await cardTitles(page)).sort()).toEqual(
      postsWithTag(tag)
        .map((p) => p.title)
        .sort(),
    );
    await expect.poll(() => searchParam(page, "tag")).toBe(tag);
    await expect(chip).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByTestId("blog-result-count")).toHaveText(
      count === 1 ? "1 artigo" : `${count} artigos`,
    );

    await page.goBack();
    await expect.poll(() => searchParam(page, "tag")).toBeNull();
    await expect(cards(page)).toHaveCount(published.length);
  });

  test("a shared ?tag= link opens the listing already filtered", async ({ page }) => {
    const pick = narrowingTag();
    test.skip(!pick, "every tag covers every post — nothing to narrow");
    const { tag, count } = pick!;

    // The HTML is prerendered unfiltered (no query string at build time); the
    // filter applies once the page hydrates.
    // NB: no "no hydration error" assertion here — every page of the site
    // already throws React #418 on load (pre-existing, not blog-specific).
    await gotoListing(page, `?tag=${encodeURIComponent(tag)}`);

    await expect(cards(page)).toHaveCount(count);
    await expect(categoryChips(page).getByRole("button", { name: chipName(tag) })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  test("sorting A–Z orders the titles and sets ?sort=", async ({ page }) => {
    await gotoListing(page);
    await page.getByLabel("Ordenar por").selectOption({ label: "A–Z" });

    const expected = published
      .map((p) => p.title)
      .sort((a, b) => a.localeCompare(b, "pt-BR", { sensitivity: "base" }));
    await expect.poll(() => cardTitles(page)).toEqual(expected);
    await expect.poll(() => searchParam(page, "sort")).toBe("title");
  });

  test("a tag on a post page links to the filtered listing", async ({ page }) => {
    const post = published.find((p) => tagsOf(p).length > 0);
    test.skip(!post, "no published post carries a tag");
    const tag = tagsOf(post!)[0];

    await page.goto(`/blog/${post!.slug}`);
    await page.getByRole("link", { name: tag, exact: true }).first().click();

    await expect(page).toHaveURL(/\/blog\/?\?/);
    await expect.poll(() => searchParam(page, "tag")).toBe(tag);
    await expect(page.getByTestId("blog-listing")).toHaveAttribute("data-hydrated", "true");
    await expect(cards(page)).toHaveCount(postsWithTag(tag).length);
  });

  test("'Voltar para o Blog' keeps the filters the reader came from", async ({ page }) => {
    const pick = narrowingTag();
    test.skip(!pick, "every tag covers every post — nothing to narrow");
    const { tag, count } = pick!;

    await gotoListing(page, `?tag=${encodeURIComponent(tag)}&sort=title`);
    await expect(cards(page)).toHaveCount(count);
    await cards(page).first().click();
    await expect(page).toHaveURL(/\/blog\/[^/?]+$/);

    await page.getByRole("link", { name: "Voltar para o Blog" }).click();
    await expect.poll(() => searchParam(page, "tag")).toBe(tag);
    expect(searchParam(page, "sort")).toBe("title");
    await expect(cards(page)).toHaveCount(count);
  });
});
