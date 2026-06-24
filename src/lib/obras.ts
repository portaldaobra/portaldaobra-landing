import { getObras, getObra } from "@/lib/content";
import type { ObraRow } from "@/lib/cms";

export type { ObraRow };

/** Static fallback used by the Bids homepage component (visual preview, not CMS data). */
export const obras: Array<{
  slug: string;
  title: string;
  segment: string;
  city: string;
  state: string;
  area: string;
  status: string;
  color: string;
  summary: string;
  scope: string[];
  results: string[];
}> = [
  {
    slug: "reforma-rede-farmacias",
    title: "Reforma Rede de Farmácias",
    segment: "Varejo",
    city: "São Paulo",
    state: "SP",
    area: "1.200 m²",
    status: "Concluída",
    color: "from-primary/10 to-primary/5",
    summary:
      "Projeto de modernização e adequação de unidades comerciais executado através da rede qualificada de fornecedores do Portal da Obra.",
    scope: ["Demolições", "Civil", "Elétrica", "Comunicação Visual", "Acabamentos"],
    results: [
      "Obra entregue no prazo",
      "Processo auditável",
      "Contratação centralizada",
      "Gestão estruturada",
    ],
  },
  {
    slug: "retrofit-escritorio-corporativo",
    title: "Retrofit Escritório Corporativo",
    segment: "Corporativo",
    city: "Rio de Janeiro",
    state: "RJ",
    area: "2.800 m²",
    status: "Concluída",
    color: "from-success/10 to-success/5",
    summary:
      "Projeto de modernização e adequação de unidades comerciais executado através da rede qualificada de fornecedores do Portal da Obra.",
    scope: ["Demolições", "Civil", "Elétrica", "Comunicação Visual", "Acabamentos"],
    results: [
      "Obra entregue no prazo",
      "Processo auditável",
      "Contratação centralizada",
      "Gestão estruturada",
    ],
  },
  {
    slug: "adequacao-centro-distribuicao",
    title: "Adequação Centro de Distribuição",
    segment: "Logístico",
    city: "Cajamar",
    state: "SP",
    area: "4.500 m²",
    status: "Concluída",
    color: "from-navy/10 to-navy/5",
    summary:
      "Projeto de modernização e adequação de unidades comerciais executado através da rede qualificada de fornecedores do Portal da Obra.",
    scope: ["Demolições", "Civil", "Elétrica", "Comunicação Visual", "Acabamentos"],
    results: [
      "Obra entregue no prazo",
      "Processo auditável",
      "Contratação centralizada",
      "Gestão estruturada",
    ],
  },
];

export function obrasListQuery(): ObraRow[] {
  return getObras();
}

export function getObraBySlug(slug: string): ObraRow | null {
  return getObra(slug);
}
