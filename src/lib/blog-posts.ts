import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
      let q = supabase
        .from("blog_posts")
        .select("*")
        .eq("status", "published")
        .order("sort_order", { ascending: true })
        .order("updated_at", { ascending: false });
      if (filter.homeFeatured) q = q.eq("featured_home", true);
      if (filter.audience === "contratantes") q = q.in("audience", ["contratantes", "ambos"]);
      if (filter.audience === "fornecedores") q = q.in("audience", ["fornecedores", "ambos"]);
      if (filter.limit) q = q.limit(filter.limit);
      const { data, error } = await q;
      if (error) throw error;
      return (data as unknown as BlogRow[]).map(adapt);
    },
  });

export const blogPostQuery = (slug: string) =>
  queryOptions({
    queryKey: ["blog", "post", slug],
    queryFn: async (): Promise<BlogPost | null> => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw error;
      return data ? adapt(data as unknown as BlogRow) : null;
    },
  });
