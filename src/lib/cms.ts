// Landing app is read-only. All image URLs come as absolute URLs from the API.
// Supabase storage helpers (publicUrl, signedUrl, uploadMedia) have been removed.

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
export type FaqRow = {
  id: string;
  question: string;
  answer: string;
  profile: "contratante" | "fornecedor";
  sort_order: number;
};
