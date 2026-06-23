import { supabase } from "@/integrations/supabase/client";

export type BlogRow = {
  id: string;
  slug: string;
  tag: string | null;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  grad: string | null;
  read_time: string | null;
  publish_date: string | null;
  author: string | null;
  intro: string[];
  sections: Array<{
    heading: string;
    paragraphs?: string[];
    bullets?: string[];
    subsections?: Array<{ heading: string; body: string }>;
  }>;
  conclusion: string[];
  status: "draft" | "published";
  sort_order: number;
  audience: "contratantes" | "fornecedores" | "ambos";
  featured_home: boolean;
  featured_contratantes: boolean;
  featured_fornecedores: boolean;
  created_at: string;
  updated_at: string;
};

export type BrandRow = {
  id: string;
  name: string;
  logo_url: string | null;
  segment: string | null;
  website: string | null;
  status: "active" | "inactive";
  sort_order: number;
};

export type TestimonialRow = {
  id: string;
  audience: "contractor" | "supplier";
  name: string;
  role: string | null;
  company: string | null;
  quote: string;
  indicator: string | null;
  avatar_url: string | null;
  status: "active" | "inactive";
  sort_order: number;
};

export type ObraRow = {
  id: string;
  slug: string;
  title: string;
  segment: string | null;
  city: string | null;
  state: string | null;
  area: string | null;
  obra_status: string;
  color: string | null;
  summary: string | null;
  scope: string[];
  results: string[];
  cover_image: string | null;
  completion_date: string | null;
  status: "draft" | "published";
  sort_order: number;
};

export type SocialRow = { platform: string; url: string };
export type SettingRow = { key: string; value: string | null };

export const MEDIA_BUCKET = "admin-media";

export function publicUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function signedUrl(
  path: string | null | undefined,
  expiresIn = 60 * 60,
): Promise<string> {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const { data, error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .createSignedUrl(path, expiresIn);
  if (error) throw error;
  return data.signedUrl;
}

export const ALLOWED_IMAGE_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
] as const;
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5MB

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

export async function uploadMedia(file: File, folder = "uploads"): Promise<string> {
  if (!(ALLOWED_IMAGE_MIME as readonly string[]).includes(file.type)) {
    throw new Error("Formato não suportado. Use JPG, PNG, WEBP, GIF ou SVG.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Arquivo excede 5MB.");
  }
  const ext = EXT_BY_MIME[file.type] ?? "bin";
  const safeFolder = folder.replace(/[^a-zA-Z0-9/_-]/g, "").replace(/^\/+|\/+$/g, "") || "uploads";
  const path = `${safeFolder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type,
  });
  if (error) throw error;
  return path;
}

