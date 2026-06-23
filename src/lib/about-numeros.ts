import { apiGet } from "@/lib/api";
import type { SettingRow } from "@/lib/cms";

export type AboutIndicator = {
  title: string;
  value: string;
  description: string;
};

export type AboutSegment = {
  label: string;
  active: boolean;
};

export type AboutNumeros = {
  indicators: AboutIndicator[];
  segments: AboutSegment[];
};

export const ABOUT_NUMEROS_KEY = "about_numeros";

export const DEFAULT_ABOUT_NUMEROS: AboutNumeros = {
  indicators: [
    {
      title: "Obras intermediadas",
      value: "+100",
      description: "Projetos corporativos conduzidos através da plataforma.",
    },
    {
      title: "Fornecedores cadastrados",
      value: "+500",
      description: "Rede qualificada de empresas e fornecedores.",
    },
    {
      title: "Área reformada",
      value: "XX mil m²",
      description: "Metros quadrados de obras corporativas contratadas pela plataforma.",
    },
    {
      title: "Volume total de obras",
      value: "R$ XX Mi",
      description: "Valor total movimentado através da plataforma.",
    },
  ],
  segments: [
    { label: "Varejo", active: true },
    { label: "Logístico", active: true },
    { label: "Corporativo", active: true },
    { label: "Industrial", active: true },
  ],
};

export function parseAboutNumeros(raw: string | null | undefined): AboutNumeros {
  if (!raw) return DEFAULT_ABOUT_NUMEROS;
  try {
    const parsed = JSON.parse(raw) as Partial<AboutNumeros>;
    const indicators =
      Array.isArray(parsed.indicators) && parsed.indicators.length === 4
        ? parsed.indicators.map((it, i) => ({
            title: it?.title ?? DEFAULT_ABOUT_NUMEROS.indicators[i].title,
            value: it?.value ?? DEFAULT_ABOUT_NUMEROS.indicators[i].value,
            description:
              it?.description ?? DEFAULT_ABOUT_NUMEROS.indicators[i].description,
          }))
        : DEFAULT_ABOUT_NUMEROS.indicators;
    const segments = Array.isArray(parsed.segments)
      ? parsed.segments
          .filter((s) => s && typeof s.label === "string" && s.label.trim().length > 0)
          .map((s) => ({ label: s.label, active: s.active !== false }))
      : DEFAULT_ABOUT_NUMEROS.segments;
    return { indicators, segments };
  } catch {
    return DEFAULT_ABOUT_NUMEROS;
  }
}

export async function fetchAboutNumeros(): Promise<AboutNumeros> {
  try {
    const rows = await apiGet<SettingRow[]>("/landing/site-settings");
    const raw = rows.find((r) => r.key === ABOUT_NUMEROS_KEY)?.value ?? null;
    return parseAboutNumeros(raw);
  } catch {
    return DEFAULT_ABOUT_NUMEROS;
  }
}
