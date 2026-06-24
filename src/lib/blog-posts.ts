import { queryOptions } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { BlogRow } from "@/lib/cms";

export type BlogPost = BlogRow & {
  /** Alias para o tempo de leitura (compatibilidade com componentes antigos). */
  read: string;
  /** Alias para a data de publicação. */
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

export const blogListQuery = (filter: BlogListFilter = {}) =>
  queryOptions({
    queryKey: ["blog", "list", filter],
    queryFn: async (): Promise<BlogPost[]> => {
      const rows = await apiGet<BlogRow[]>("/landing/blog-posts", {
        audience: filter.audience,
        featured_home: filter.homeFeatured || undefined,
        limit: filter.limit,
      });
      return rows.map(adapt);
    },
  });

export const blogPostQuery = (slug: string) =>
  queryOptions({
    queryKey: ["blog", "post", slug],
    queryFn: async (): Promise<BlogPost | null> => {
      try {
        const row = await apiGet<BlogRow>(`/landing/blog-posts/${slug}`);
        return adapt(row);
      } catch (e) {
        if (e != null && typeof e === "object" && "status" in e && (e as { status: number }).status === 404) {
          return null;
        }
        throw e;
      }
    },
  });
