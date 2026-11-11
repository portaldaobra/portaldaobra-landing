import { expect, test } from "@playwright/test";
import {
  blogCategoryCounts,
  filterBlogPosts,
  normalizeForSearch,
  parseBlogListingSearch,
  parsePtBrDate,
  parseReadingMinutes,
  recentBlogPosts,
  sortBlogPosts,
  type BlogListingPost,
} from "../src/lib/blog-listing";

// Pure logic behind the /blog listing (phase nov08 T4). The landing has no unit
// runner, so these run under the Playwright runner without opening a page.

function post(overrides: Partial<BlogListingPost> & { slug: string }): BlogListingPost {
  return {
    title: overrides.slug,
    excerpt: null,
    tag: null,
    tags: null,
    intro: [],
    sections: [],
    conclusion: [],
    publish_date: null,
    read_time: null,
    sort_order: 0,
    audience: "ambos",
    ...overrides,
  };
}

const titles = (list: BlogListingPost[]) => list.map((p) => p.title);

test.describe("normalizeForSearch", () => {
  test("drops accents and case", () => {
    expect(normalizeForSearch("Orçamento PRÁTICO de Obras")).toBe("orcamento pratico de obras");
    expect(normalizeForSearch("Tendências")).toBe("tendencias");
  });
});

test.describe("parsePtBrDate", () => {
  test("reads the CMS pt-BR long form", () => {
    expect(parsePtBrDate("12 de março de 2026")).toBe(Date.UTC(2026, 2, 12));
    expect(parsePtBrDate("2 de fevereiro de 2026")).toBe(Date.UTC(2026, 1, 2));
    expect(parsePtBrDate("1º de abril de 2025")).toBe(Date.UTC(2025, 3, 1));
    expect(parsePtBrDate("  31 de Dezembro de 2024 ")).toBe(Date.UTC(2024, 11, 31));
  });

  test("reads ISO and dd/mm/yyyy", () => {
    expect(parsePtBrDate("2026-03-12")).toBe(Date.UTC(2026, 2, 12));
    expect(parsePtBrDate("2026-03-12T10:00:00Z")).toBe(Date.UTC(2026, 2, 12));
    expect(parsePtBrDate("12/03/2026")).toBe(Date.UTC(2026, 2, 12));
  });

  test("returns null for anything else", () => {
    expect(parsePtBrDate(null)).toBeNull();
    expect(parsePtBrDate("")).toBeNull();
    expect(parsePtBrDate("em breve")).toBeNull();
    expect(parsePtBrDate("12 de marsupial de 2026")).toBeNull();
    expect(parsePtBrDate("40 de março de 2026")).toBeNull();
  });
});

test.describe("parseReadingMinutes", () => {
  test("pulls the minutes out of the read_time text", () => {
    expect(parseReadingMinutes("7 min")).toBe(7);
    expect(parseReadingMinutes("10 minutos")).toBe(10);
    expect(parseReadingMinutes(null)).toBeNull();
    expect(parseReadingMinutes("rápida")).toBeNull();
  });
});

test.describe("sortBlogPosts", () => {
  const a = post({
    slug: "a",
    title: "Banco",
    publish_date: "2 de fevereiro de 2026",
    sort_order: 1,
    read_time: "9 min",
  });
  const b = post({
    slug: "b",
    title: "Ábaco",
    publish_date: "12 de março de 2026",
    sort_order: 3,
    read_time: "5 min",
  });
  const c = post({
    slug: "c",
    title: "Casa",
    publish_date: "12 de março de 2026",
    sort_order: 2,
    read_time: null,
  });
  const d = post({
    slug: "d",
    title: "árvore",
    publish_date: null,
    sort_order: 0,
    read_time: "5 min",
  });

  test("recent: newest date first, same day by sort_order, undated last", () => {
    expect(titles(sortBlogPosts([a, b, c, d], "recent"))).toEqual([
      "Casa",
      "Ábaco",
      "Banco",
      "árvore",
    ]);
  });

  test("title: pt-BR A–Z, accents and case ignored", () => {
    expect(titles(sortBlogPosts([c, a, d, b], "title"))).toEqual([
      "Ábaco",
      "árvore",
      "Banco",
      "Casa",
    ]);
  });

  test("reading-time: shortest first, ties by recency, unknown last", () => {
    expect(titles(sortBlogPosts([a, c, d, b], "reading-time"))).toEqual([
      "Ábaco",
      "árvore",
      "Banco",
      "Casa",
    ]);
  });

  test("does not mutate the input", () => {
    const input = [a, b, c];
    sortBlogPosts(input, "title");
    expect(titles(input)).toEqual(["Banco", "Ábaco", "Casa"]);
  });
});

test.describe("filterBlogPosts", () => {
  const budget = post({
    slug: "budget",
    title: "Orçamento de obras corporativas",
    excerpt: "Como montar uma planilha",
    tags: ["Orçamento", "Gestão de Obras"],
    audience: "contratantes",
  });
  const tech = post({
    slug: "tech",
    title: "Tecnologia na contratação",
    tag: "Tecnologia",
    sections: [
      { heading: "Plataformas digitais", paragraphs: ["Cotação eletrônica reduz prazos."] },
    ],
    audience: "fornecedores",
  });
  const trends = post({
    slug: "trends",
    title: "Tendências 2026",
    tags: ["Tendências"],
    intro: ["Varejo em expansão"],
    audience: "ambos",
  });
  const all = [budget, tech, trends];

  test("no criteria keeps everything", () => {
    expect(titles(filterBlogPosts(all, {}))).toEqual(titles(all));
  });

  test("q matches title, excerpt and section text, accent-insensitively", () => {
    expect(titles(filterBlogPosts(all, { q: "orcamento" }))).toEqual([budget.title]);
    expect(titles(filterBlogPosts(all, { q: "PLANILHA" }))).toEqual([budget.title]);
    expect(titles(filterBlogPosts(all, { q: "plataformas" }))).toEqual([tech.title]);
    expect(titles(filterBlogPosts(all, { q: "cotacao eletronica" }))).toEqual([tech.title]);
    expect(titles(filterBlogPosts(all, { q: "varejo" }))).toEqual([trends.title]);
  });

  test("q needs every word, in any order", () => {
    expect(titles(filterBlogPosts(all, { q: "corporativas orçamento" }))).toEqual([budget.title]);
    expect(filterBlogPosts(all, { q: "orcamento tecnologia" })).toEqual([]);
    expect(titles(filterBlogPosts(all, { q: "   " }))).toEqual(titles(all));
  });

  test("tag matches any of the post's tags, and the legacy single tag", () => {
    expect(titles(filterBlogPosts(all, { tag: "Gestão de Obras" }))).toEqual([budget.title]);
    expect(titles(filterBlogPosts(all, { tag: "gestao de obras" }))).toEqual([budget.title]);
    expect(titles(filterBlogPosts(all, { tag: "Tecnologia" }))).toEqual([tech.title]);
    expect(filterBlogPosts(all, { tag: "Inexistente" })).toEqual([]);
  });

  test("audience keeps posts written for both", () => {
    expect(titles(filterBlogPosts(all, { audience: "clients" }))).toEqual([
      budget.title,
      trends.title,
    ]);
    expect(titles(filterBlogPosts(all, { audience: "suppliers" }))).toEqual([
      tech.title,
      trends.title,
    ]);
  });

  test("criteria combine", () => {
    expect(filterBlogPosts(all, { tag: "Tecnologia", audience: "clients" })).toEqual([]);
  });
});

test.describe("blogCategoryCounts", () => {
  test("counts each tag once per post, sorted A–Z in pt-BR", () => {
    const counts = blogCategoryCounts([
      post({ slug: "1", tags: ["Orçamento", "Gestão"] }),
      post({ slug: "2", tags: ["orçamento", "Orçamento"] }),
      post({ slug: "3", tag: "Ábaco" }),
      post({ slug: "4" }),
    ]);
    expect(counts).toEqual([
      { tag: "Ábaco", count: 1 },
      { tag: "Gestão", count: 1 },
      { tag: "Orçamento", count: 2 },
    ]);
  });
});

test.describe("recentBlogPosts", () => {
  test("returns the newest N", () => {
    const list = [1, 2, 3, 4, 5, 6, 7].map((day) =>
      post({ slug: `p${day}`, title: `P${day}`, publish_date: `${day} de janeiro de 2026` }),
    );
    expect(titles(recentBlogPosts(list, 5))).toEqual(["P7", "P6", "P5", "P4", "P3"]);
  });
});

test.describe("parseBlogListingSearch", () => {
  test("keeps valid params and drops the rest", () => {
    expect(
      parseBlogListingSearch({ q: "obra", tag: "Orçamento", sort: "title", audience: "clients" }),
    ).toEqual({ q: "obra", tag: "Orçamento", sort: "title", audience: "clients" });
    expect(parseBlogListingSearch({ sort: "bogus", audience: "everyone", extra: "x" })).toEqual({});
  });

  test("drops empty values and the default sort, keeps the query as typed", () => {
    expect(parseBlogListingSearch({ q: "  ", tag: "", sort: "recent" })).toEqual({});
    expect(parseBlogListingSearch({ q: "obra " })).toEqual({ q: "obra " });
  });

  test("turns numbers parsed from the URL back into text", () => {
    expect(parseBlogListingSearch({ q: 2026 })).toEqual({ q: "2026" });
  });
});
