import { createFileRoute, Link } from "@tanstack/react-router";
import { getTestimonials, getBlogPosts } from "@/lib/content";
import type { TestimonialRow } from "@/lib/cms";

import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Target,
  Filter,
  LineChart,
  Building,
  Store,
  Warehouse,
  Building2,
  Factory,
  Star,
  MapPin,
  TrendingUp,
  FileCheck,
  Users,
  Quote,
  HardHat,
  Calendar,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Blog } from "@/components/site/Blog";
import { PainelUnico } from "@/components/site/PainelUnico";
import { Contact } from "@/components/site/Contact";
import heroImg from "@/assets/prestadores-hero.webp";

export const Route = createFileRoute("/prestadores")({
  loader: async () => {
    return {
      testimonials: getTestimonials("supplier"),
      blogPosts: getBlogPosts({ limit: 3 }),
    };
  },
  head: () => ({
    meta: [
      { title: "Rede de Fornecedores Qualificados | Portal da Obra" },
      {
        name: "description",
        content:
          "Conheça nossa rede especializada de fornecedores para obras corporativas em todo o Brasil.",
      },
      { property: "og:title", content: "Rede de Fornecedores Qualificados | Portal da Obra" },
      {
        property: "og:description",
        content:
          "Conheça nossa rede especializada de fornecedores para obras corporativas em todo o Brasil.",
      },
      { property: "og:url", content: "/prestadores" },
      { property: "og:image", content: heroImg },
    ],
    links: [{ rel: "canonical", href: "/prestadores" }],
  }),
  component: Prestadores,
});

const CTA_HREF = "https://web.portaldaobra.com.br/register";

function PrimaryCTA({
  className = "",
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  const base =
    variant === "dark"
      ? "bg-white text-navy hover:bg-white/90"
      : "bg-gradient-to-r from-primary to-navy text-primary-foreground hover:opacity-95 shadow-elegant";
  return (
    <Button asChild size="lg" className={`${base} ${className}`}>
      <a href={CTA_HREF} target="_blank" rel="noopener noreferrer">
        Comece a Construir <ArrowRight className="ml-1.5 h-4 w-4" />
      </a>
    </Button>
  );
}

const heroBenefits = [
  "Participe de BIDs qualificados",
  "Receba demandas reais de empresas",
  "Reduza o tempo de prospecção",
  "Amplie sua carteira de clientes",
];

const advantages = [
  {
    icon: Target,
    title: "BIDs qualificados",
    desc: "Receba oportunidades compatíveis com sua região, especialidade e capacidade técnica.",
  },
  {
    icon: Filter,
    title: "Menos prospecção fria",
    desc: "Pare de depender apenas de indicações e encontre clientes com demanda real.",
  },
  {
    icon: LineChart,
    title: "Mais previsibilidade comercial",
    desc: "Organize seu pipeline de obras e acompanhe oportunidades de forma mais estratégica.",
  },
  {
    icon: Building,
    title: "Clientes corporativos",
    desc: "Conecte sua empresa a redes de varejo, empresas logísticas e operações comerciais.",
  },
];

const obras = [
  {
    icon: Store,
    title: "Varejo",
    desc: "Lojas, franquias, reformas comerciais, retrofit e implantação de novas unidades.",
    tags: ["Lojas", "Franquias", "Retrofit"],
  },
  {
    icon: Warehouse,
    title: "Logístico",
    desc: "Galpões, centros de distribuição, áreas técnicas e adequações operacionais.",
    tags: ["Galpões", "CDs", "Adequação"],
  },
  {
    icon: Building2,
    title: "Lajes Corporativas",
    desc: "Escritórios, sedes administrativas, ambientes corporativos e obras de adequação.",
    tags: ["Escritórios", "Sedes", "Corporativo"],
  },
  {
    icon: Factory,
    title: "Industrial",
    desc: "Plantas industriais, adequações fabris, expansões operacionais, áreas produtivas e infraestrutura técnica.",
    tags: ["Indústrias", "Adequações", "Expansão"],
  },
];

const earnings = [
  {
    icon: MapPin,
    title: "Você escolhe onde atuar",
    desc: "Defina regiões, categorias e tipos de obra compatíveis com sua operação.",
  },
  {
    icon: TrendingUp,
    title: "Crescimento sob demanda",
    desc: "Participe de mais oportunidades conforme sua equipe e agenda permitirem.",
  },
  {
    icon: FileCheck,
    title: "Propostas mais qualificadas",
    desc: "Receba escopos mais claros para montar propostas melhores.",
  },
  {
    icon: Users,
    title: "Relacionamento com empresas",
    desc: "Aumente sua presença junto a empresas que contratam obras com frequência.",
  },
];

function Prestadores() {
  const loaderData = Route.useLoaderData();
  const testimonials: TestimonialRow[] = loaderData.testimonials && loaderData.testimonials.length > 0
    ? loaderData.testimonials
    : getTestimonials("supplier");

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* HERO — dark immersive */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt=""
            aria-hidden="true"
            width={1920}
            height={1080}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-navy/60" />
          <div
            className="absolute inset-0 opacity-30 mix-blend-overlay"
            style={{
              backgroundImage:
                "radial-gradient(1000px 600px at 80% 20%, hsl(var(--primary)/0.6), transparent 60%)",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white mb-10"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar para a Home
          </Link>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur px-4 py-1.5 mb-6">
              <HardHat className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Para Fornecedores
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-balance leading-[1.05]">
              Receba oportunidades de obras e aumente seus ganhos
            </h1>
            <p className="mt-6 text-lg text-white/80 leading-relaxed max-w-2xl">
              O Portal da Obra conecta construtoras, empreiteiras e fornecedores de serviços a
              empresas que precisam executar obras corporativas, reformas e manutenções.
            </p>

            <ul className="mt-8 grid sm:grid-cols-2 gap-3 max-w-2xl">
              {heroBenefits.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2.5 rounded-lg bg-white/5 border border-white/10 px-3 py-2.5"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-sm font-medium text-white/95">{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap gap-3">
              <PrimaryCTA variant="dark" />
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                <Link to="/bids">Ver oportunidades</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* VANTAGENS — numbered list */}
      <section className="section-y bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
              Vantagens
            </span>
            <h2 className="h2-section text-navy">
              Quem constrói com o Portal da Obra tem mais oportunidades
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            {advantages.map((a, i) => {
              const Icon = a.icon;
              return (
                <article
                  key={a.title}
                  className="group relative bg-card p-8 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="font-display text-5xl font-bold text-muted-foreground/20 leading-none">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-xl font-bold text-navy">{a.title}</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">{a.desc}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* TIPOS DE OBRA — horizontal cards with side accent */}
      <section className="section-y bg-secondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
              Segmentos
            </span>
            <h2 className="h2-section text-navy">
              Escolha os tipos de obras que sua empresa quer executar
            </h2>
          </div>

          <div className="space-y-4">
            {obras.map((o, i) => {
              const Icon = o.icon;
              return (
                <article
                  key={o.title}
                  className="group flex flex-col md:flex-row items-stretch bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/40 hover:shadow-elegant transition-all"
                >
                  <div className="md:w-2 bg-gradient-to-b from-primary to-navy" />
                  <div className="flex-1 p-8 flex flex-col md:flex-row md:items-center gap-6">
                    <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary shrink-0">
                      <Icon className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-mono text-muted-foreground">0{i + 1}</span>
                      </div>
                      <h3 className="font-display text-2xl font-bold text-navy">{o.title}</h3>
                      <p className="mt-1.5 text-muted-foreground leading-relaxed">{o.desc}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {o.tags.map((t) => (
                          <span
                            key={t}
                            className="text-xs font-medium text-primary bg-primary/10 rounded-full px-2.5 py-1"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-12">
            <PrimaryCTA />
          </div>
        </div>
      </section>

      {/* BIDs AO VIVO — adapted for prestadores */}
      <BidsPrestadores />

      {/* PAINEL DA CONSTRUTORA */}
      <PainelUnico variant="construtora" />

      {/* DEPOIMENTOS */}

      <section className="section-y bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
              Depoimentos
            </span>
            <h2 className="h2-section text-navy">
              Fornecedores que crescem com novas oportunidades
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {(testimonials ?? []).map((t) => (
              <article
                key={t.id}
                className="relative rounded-2xl border border-border bg-card p-7 hover:shadow-elegant transition-all duration-300"
              >
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                <p className="text-foreground leading-relaxed">"{t.quote}"</p>
                <div className="mt-6 pt-5 border-t border-border/60 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-navy">{t.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t.role} • {t.company}
                    </p>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* GANHOS — split panel */}
      <section className="section-y bg-navy text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(800px 400px at 20% 80%, hsl(var(--primary)/0.5), transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
              Ganhos
            </span>
            <h2 className="h2-section">Ganhos que se adaptam ao seu ritmo</h2>
            <p className="mt-5 text-white/70 leading-relaxed">
              Participe de oportunidades conforme a capacidade da sua empresa, sem comprometer sua
              operação atual.
            </p>
            <div className="mt-8">
              <PrimaryCTA variant="dark" />
            </div>
          </div>

          <div className="lg:col-span-8 grid sm:grid-cols-2 gap-4">
            {earnings.map((e) => {
              const Icon = e.icon;
              return (
                <article
                  key={e.title}
                  className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 hover:bg-white/10 transition-colors"
                >
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/20 text-primary mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg font-bold leading-snug">{e.title}</h3>
                  <p className="mt-2 text-sm text-white/70 leading-relaxed">{e.desc}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* INSIGHTS */}
      <Blog limit={3} initialPosts={loaderData.blogPosts} />

      {/* CONTATO */}
      <Contact />

      <Footer />
    </main>
  );
}

const bidsPrestadores = [
  {
    slug: "reforma-unidade-comercial-pr",
    tipo: "Reforma Comercial",
    cidade: "São Paulo/SP",
    segmento: "Varejo",
    area: "450 m²",
    prazo: "Até 18/06",
    status: "Recebendo propostas",
  },
  {
    slug: "retrofit-fachada-mg",
    tipo: "Retrofit Corporativo",
    cidade: "Rio de Janeiro/RJ",
    segmento: "Corporativo",
    area: "1.200 m²",
    prazo: "Até 22/06",
    status: "Recebendo propostas",
  },
  {
    slug: "expansao-loja-varejo-sp",
    tipo: "Loja de Shopping",
    cidade: "Curitiba/PR",
    segmento: "Varejo",
    area: "180 m²",
    prazo: "Até 25/06",
    status: "Recebendo propostas",
  },
  {
    slug: "manutencao-predial-corporativa-sp",
    tipo: "Centro de Distribuição",
    cidade: "Cajamar/SP",
    segmento: "Logístico",
    area: "3.500 m²",
    prazo: "Até 30/06",
    status: "Recebendo propostas",
  },
  {
    slug: "adequacao-layout-comercial-rs",
    tipo: "Adequação Industrial",
    cidade: "Betim/MG",
    segmento: "Industrial",
    area: "2.100 m²",
    prazo: "Até 02/07",
    status: "Recebendo propostas",
  },
  {
    slug: "nova-unidade-franqueada-rj",
    tipo: "Expansão Comercial",
    cidade: "Goiânia/GO",
    segmento: "Varejo",
    area: "620 m²",
    prazo: "Até 05/07",
    status: "Recebendo propostas",
  },
];

const COBALT = "var(--primary)";
const NAVY_HEX = "var(--navy)";

function BidsPrestadores() {
  return (
    <section className="section-y bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 mb-5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
              Oportunidades atualizadas constantemente
            </span>
          </div>
          <h2
            className="font-display text-3xl sm:text-4xl lg:text-[2.5rem] font-bold leading-[1.1] text-balance"
            style={{ color: NAVY_HEX }}
          >
            Oportunidades reais <span style={{ color: COBALT }}>acontecendo agora.</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Acompanhe exemplos de demandas publicadas na plataforma e descubra como sua empresa pode
            participar de novas oportunidades de obras corporativas.
          </p>
        </div>

        <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {bidsPrestadores.map((b) => (
            <article
              key={b.tipo + b.cidade}
              className="group relative bg-card rounded-2xl border border-border shadow-card p-6 hover:shadow-elegant hover:-translate-y-1 hover:border-primary/40 transition-all duration-300 flex flex-col"
            >
              <div className="flex items-center justify-between mb-5">
                <span
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] px-2.5 py-1 rounded-full text-white"
                  style={{ backgroundColor: COBALT }}
                >
                  {b.segmento}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  {b.status}
                </span>
              </div>

              <h3
                className="font-display text-lg font-bold leading-snug mb-4"
                style={{ color: NAVY_HEX }}
              >
                {b.tipo}
              </h3>

              <dl className="space-y-2.5 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <dt className="sr-only">Cidade</dt>
                  <dd className="font-medium text-foreground">{b.cidade}</dd>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building className="h-4 w-4 text-primary shrink-0" />
                  <dt className="sr-only">Área</dt>
                  <dd>{b.area}</dd>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4 text-primary shrink-0" />
                  <dt className="sr-only">Prazo</dt>
                  <dd>{b.prazo}</dd>
                </div>
              </dl>

              <div className="mt-6 pt-5 border-t border-dashed border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Demanda ativa</span>
                <Link
                  to="/bids/$slug"
                  params={{ slug: b.slug }}
                  className="text-sm font-semibold text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all cursor-pointer"
                >
                  Participar <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button asChild variant="hero" size="xl">
            <Link to="/bids">
              Ver Todos os Bids
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
