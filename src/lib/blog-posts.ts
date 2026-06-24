import { getBlogPosts, getBlogPost } from "@/lib/content";
import type { BlogRow } from "@/lib/cms";

export type BlogPost = BlogRow & {
  /** Alias for read_time (backward compat). */
  read: string;
  /** Alias for publish_date (backward compat). */
  date: string;
};

function adapt(row: BlogRow): BlogPost {
  return {
    ...row,
    read: row.read_time ?? "",
    date: row.publish_date ?? "",
  };
}

export type BlogAudience = "contratantes" | "fornecedores";

export type BlogListFilter = {
  audience?: BlogAudience;
  homeFeatured?: boolean;
  limit?: number;
};

export function getBlogPostList(filter: BlogListFilter = {}): BlogPost[] {
  return getBlogPosts(filter).map(adapt);
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  const row = getBlogPost(slug);
  return row ? adapt(row) : null;
}
