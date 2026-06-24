import { Check, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";
import { useAudience } from "./AudienceContext";
import { getObraTypes, getFormCategories, getFormLocations } from "@/lib/content";
import type { ObraTypeRow, FormCategoryRow, FormLocationRow } from "@/lib/content";

const audienceContent = {
  lojistas: {
    badge: "PLATAFORMA B2B DE OBRAS CORPORATIVAS",
    headlinePrefix: "Contratação",
    headlineHighlight: "segura e eficiente",
    headlineSuffix: "para obras corporativas",
    description:
      "Conectamos empresas aos melhores fornecedores de serviços do mercado através de um processo rápido, transparente e competitivo.",
    benefits: [
      "Solicite Orçamentos",
      "Receba Propostas",
      "Compare Fornecedores",
      "Contrate com Segurança",
    ],
    cta: "SOLICITAR ORÇAMENTO",
  },
  prestadores: {
    badge: "Para construtoras e fornecedores de serviços",
    headlinePrefix: "Amplie sua",
    headlineHighlight: "carteira de clientes",
    headlineSuffix: "com novas oportunidades de obras",
    description:
      "Receba oportunidades qualificadas de obras corporativas em todo o Brasil e envie propostas para empresas que estão prontas para contratar.",
    benefits: [
      "Receba Oportunidades",
      "Encontre Novas Obras",
      "Amplie sua Carteira de Clientes",
      "Envie Propostas",
    ],
    cta: "CADASTRAR EMPRESA",
  },
} as const;

export function Hero({
  initialObraTypes,
  initialFormCategories,
  initialFormLocations,
}: {
  initialObraTypes?: ObraTypeRow[];
  initialFormCategories?: FormCategoryRow[];
  initialFormLocations?: FormLocationRow[];
} = {}) {
  const { audience } = useAudience();
  const content = audienceContent[audience];

  const obraTypes = initialObraTypes && initialObraTypes.length > 0
    ? initialObraTypes
    : getObraTypes();
  const tipoOptions = obraTypes.map((t) => t.name);
  const tipoDefault = obraTypes.find((t) => t.is_default)?.name;

  const categorias = initialFormCategories && initialFormCategories.length > 0
    ? initialFormCategories
    : getFormCategories();
  const categoriaOptions = categorias.map((c) => c.name);

  const localizacoes = initialFormLocations && initialFormLocations.length > 0
    ? initialFormLocations
    : getFormLocations();
  const localizacaoOptions = localizacoes.map((l) => l.name);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Busca enviada! Em instantes mostraremos os resultados.");
  };

  return (
    <section className="relative overflow-hidden bg-secondary">
      <div className="absolute inset-0 -z-10" style={{ backgroundImage: "var(--gradient-mesh)" }} />
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-success/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Content - left */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold uppercase tracking-[0.18em] mb-6 ring-1 ring-primary/20">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                {content.badge}
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight text-balance text-navy">
                {content.headlinePrefix}{" "}
                <span className="text-primary">{content.headlineHighlight}</span>{" "}
                {content.headlineSuffix}
              </h1>

              <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed text-balance">
                {content.description}
              </p>

              <ul className="mt-8 space-y-3.5">
                {content.benefits.map((b) => (
                  <li
                    key={b}
                    className="flex items-center gap-3 text-base font-medium text-foreground"
                  >
                    <span className="grid place-items-center h-6 w-6 rounded-full bg-success/15 text-success shrink-0">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Form - right column */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-success/20 to-primary/20 rounded-3xl blur-xl opacity-40" />
              <div className="relative bg-muted/60 backdrop-blur rounded-3xl shadow-card ring-1 ring-border p-6 sm:p-7">
                {/* Intro */}
                <div className="px-1 pb-5">
                  <p className="text-base sm:text-lg font-medium text-navy leading-snug tracking-tight">
                    Preencha e receba orçamentos de fornecedores qualificados.
                  </p>
                </div>
                <div className="h-px bg-border" />

                <form onSubmit={onSubmit} className="mt-6 space-y-3.5">
                  <Row label="Data">
                    <Input type="date" className="h-10 rounded-full bg-background border-border" />
                  </Row>

                  <Row label="Estado">
                    <SelectField
                      placeholder="Selecione"
                      options={["SP", "RJ", "MG", "PR", "RS", "BA", "PE", "CE", "DF"]}
                    />
                  </Row>

                  <Row label="Cidade">
                    <Input
                      placeholder="Digite a cidade"
                      className="h-10 rounded-full bg-background border-border"
                    />
                  </Row>

                  <Row label="Tipo">
                    <SelectField
                      placeholder="Selecione"
                      options={tipoOptions}
                      defaultValue={tipoDefault}
                    />
                  </Row>

                  <Row label="Categoria">
                    <SelectField placeholder="Selecione" options={categoriaOptions} />
                  </Row>

                  <Row label="Localização">
                    <SelectField placeholder="Selecione" options={localizacaoOptions} />
                  </Row>

                  <Button type="submit" variant="hero" size="lg" className="w-full">
                    <Search className="h-4 w-4" />
                    {content.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[88px_1fr] items-center gap-3">
      <Label className="text-xs font-semibold text-foreground/80">{label}</Label>
      <div>{children}</div>
    </div>
  );
}

function SelectField({
  placeholder,
  options,
  defaultValue,
}: {
  placeholder: string;
  options: string[];
  defaultValue?: string;
}) {
  return (
    <Select defaultValue={defaultValue}>
      <SelectTrigger className="h-10 rounded-full bg-background border-border">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
