import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ShieldCheck,
  Clipboard,
  Scale,
  Users,
  FileText,
  SearchCheck,
  Target,
  Eye,
  Filter,
  ListChecks,
  Network,
  TrendingUp,
  Building2,
  Check,
  
  LineChart,
  Lock,
  Gauge,
  Zap,
  Layers,
  Sparkles,
  Handshake,
  CheckCircle2,
} from "lucide-react";
import aboutImg from "@/assets/about-portal.webp";
import prestadoresHero from "@/assets/prestadores-hero.webp";

const COBALT = "var(--primary)";
const NAVY = "var(--navy)";

export const Route = createFileRoute("/solucoes")({
  head: () => ({
    meta: [
      { title: "Soluções para Contratação de Obras Corporativas" },
      {
        name: "description",
        content:
          "Curadoria de fornecedores, equalização de propostas, gestão documental e contratação centralizada.",
      },
      { property: "og:title", content: "Soluções para Contratação de Obras Corporativas" },
      {
        property: "og:description",
        content:
          "Curadoria de fornecedores, equalização de propostas, gestão documental e contratação centralizada.",
      },
      { property: "og:url", content: "/solucoes" },
    ],
    links: [{ rel: "canonical", href: "/solucoes" }],
  }),
  component: SolucoesPage,
});

const contratantes = [
  { icon: ShieldCheck, title: "Curadoria de Fornecedores", desc: "Selecionamos empresas compatíveis com o escopo, região e perfil da obra." },
  { icon: Clipboard, title: "Gestão de BIDs", desc: "Organize processos de concorrência de forma estruturada e rastreável." },
  { icon: Scale, title: "Equalização de Propostas", desc: "Compare propostas em formato padronizado e facilite a tomada de decisão." },
  { icon: Users, title: "Concorrência Qualificada", desc: "Receba múltiplas propostas de fornecedores previamente avaliados." },
  { icon: FileText, title: "Gestão Documental", desc: "Centralize contratos, certidões, ARTs e documentos em um único ambiente." },
  { icon: SearchCheck, title: "Rastreabilidade Completa", desc: "Todas as decisões e interações registradas para consulta e auditoria." },
];

const prestadores = [
  { icon: Target, title: "Participação em BIDs", desc: "Acesse oportunidades alinhadas ao seu perfil." },
  { icon: Eye, title: "Visibilidade Comercial", desc: "Amplie sua presença junto a empresas contratantes." },
  { icon: Filter, title: "Menos Prospecção", desc: "Receba demandas qualificadas." },
  { icon: ListChecks, title: "Gestão de Propostas", desc: "Organize todas as oportunidades em um só lugar." },
  { icon: Network, title: "Networking Corporativo", desc: "Conecte-se com grandes empresas." },
  { icon: TrendingUp, title: "Crescimento Escalável", desc: "Prepare sua empresa para novos contratos e novos mercados." },
];






const fluxo = [
  { icon: Building2, title: "Contratante", desc: "Publica a necessidade da obra." },
  { icon: Sparkles, title: "Portal da Obra", desc: "Organiza, padroniza e qualifica." },
  { icon: Users, title: "Fornecedores Qualificados", desc: "Enviam propostas equalizadas." },
  { icon: Handshake, title: "Contratação", desc: "Decisão com mais segurança." },
  { icon: Check, title: "Execução", desc: "Acompanhamento centralizado." },
];


function SolucoesPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden bg-secondary">
        <div className="absolute inset-0 -z-10" style={{ backgroundImage: "var(--gradient-mesh)" }} />
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-success/10 blur-3xl" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold uppercase tracking-[0.18em] mb-6 ring-1 ring-primary/20">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            Soluções
          </div>
          <h1
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-balance"
            style={{ color: NAVY }}
          >
            Uma plataforma completa para contratar obras com{" "}
            <span style={{ color: COBALT }}>mais controle.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            O Portal da Obra centraliza fornecedores, concorrências, propostas, documentação e
            gestão da contratação em uma única plataforma. Reduza riscos, ganhe previsibilidade e
            tome decisões com mais segurança.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              variant="hero"
              size="xl"
            >
              <a href="https://web.portaldaobra.com.br/register" target="_blank" rel="noopener noreferrer">
                Solicitar Orçamento
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full font-semibold tracking-wide px-7"
            >
              <a href="https://web.portaldaobra.com.br/register" target="_blank" rel="noopener noreferrer">Comece a Construir</a>
            </Button>
          </div>
        </div>
      </section>

      {/* SOLUÇÕES PARA CONTRATANTES */}
      <section className="section-y bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary mb-3">
              Para Contratantes
            </span>
            <h2
              className="font-display text-3xl sm:text-4xl lg:text-[2.5rem] font-bold leading-[1.1] text-balance"
              style={{ color: NAVY }}
            >
              Tudo que sua empresa precisa para{" "}
              <span style={{ color: COBALT }}>contratar melhor.</span>
            </h2>
          </div>

          <div className="grid gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-12">
            {/* Featured card */}
            <article className="lg:col-span-5 relative overflow-hidden rounded-3xl border border-border shadow-card bg-card flex flex-col">
              <div className="relative h-64 sm:h-72 lg:h-80 overflow-hidden">
                <img
                  src={aboutImg}
                  alt="Contratação corporativa de obras com fornecedores qualificados"
                  title="Soluções para contratantes"
                  width={1280}
                  height={960}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(180deg, rgba(0,14,66,0.05) 0%, rgba(0,14,66,0.55) 100%)`,
                  }}
                />
                <span className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 backdrop-blur text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: COBALT }}>
                  Plataforma corporativa
                </span>
              </div>
              <div className="p-7 lg:p-8 flex-1 flex flex-col">
                <h3 className="font-display text-2xl lg:text-[1.75rem] font-bold leading-tight mb-3" style={{ color: NAVY }}>
                  Contratação corporativa sem improviso.
                </h3>
                <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                  O Portal da Obra centraliza todo o processo de contratação, desde a seleção de fornecedores até a comparação de propostas e gestão documental, trazendo mais segurança, competitividade e previsibilidade para cada projeto.
                </p>
              </div>
            </article>

            {/* Benefits grid */}
            <div className="lg:col-span-7 grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2">
              {contratantes.map(({ icon: Icon, title, desc }) => (
                <article
                  key={title}
                  className="bg-card rounded-2xl border border-border shadow-card p-6 hover:shadow-elegant hover:-translate-y-1 transition-all duration-300"
                >
                  <span
                    className="grid place-items-center h-11 w-11 rounded-2xl mb-4 text-white"
                    style={{ backgroundColor: COBALT }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-base lg:text-lg font-bold mb-2" style={{ color: NAVY }}>
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SOLUÇÕES PARA PRESTADORES */}
      <section className="section-y bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary mb-3">
              Para Fornecedores
            </span>
            <h2
              className="font-display text-3xl sm:text-4xl lg:text-[2.5rem] font-bold leading-[1.1] text-balance"
              style={{ color: NAVY }}
            >
              Mais oportunidades para{" "}
              <span style={{ color: COBALT }}>quem executa obras.</span>
            </h2>
          </div>

          <div className="grid gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-12">
            {/* Benefits grid (left on desktop) */}
            <div className="lg:col-span-7 lg:order-1 order-2 grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2">
              {prestadores.map(({ icon: Icon, title, desc }) => (
                <article
                  key={title}
                  className="bg-card rounded-2xl border border-border shadow-card p-6 hover:shadow-elegant hover:-translate-y-1 transition-all duration-300"
                >
                  <span
                    className="grid place-items-center h-11 w-11 rounded-2xl mb-4"
                    style={{ backgroundColor: "rgba(0,36,135,0.08)", color: COBALT }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-base lg:text-lg font-bold mb-2" style={{ color: NAVY }}>
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </article>
              ))}
            </div>

            {/* Featured card (right on desktop, first on mobile) */}
            <article className="lg:col-span-5 lg:order-2 order-1 relative overflow-hidden rounded-3xl border border-border shadow-card bg-card flex flex-col">
              <div className="relative h-64 sm:h-72 lg:h-80 overflow-hidden">
                <img
                  src={prestadoresHero}
                  alt="Fornecedores e equipes em campo durante execução de obra corporativa"
                  title="Rede qualificada de fornecedores"
                  width={1920}
                  height={1080}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(180deg, rgba(0,14,66,0.05) 0%, rgba(0,14,66,0.55) 100%)`,
                  }}
                />
                <span className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 backdrop-blur text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: COBALT }}>
                  Rede de fornecedores
                </span>
              </div>
              <div className="p-7 lg:p-8 flex-1 flex flex-col">
                <h3 className="font-display text-2xl lg:text-[1.75rem] font-bold leading-tight mb-3" style={{ color: NAVY }}>
                  Mais obras. Menos tempo procurando clientes.
                </h3>
                <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                  O Portal da Obra conecta fornecedores qualificados a empresas que possuem demandas reais de construção, reforma e expansão, criando novas oportunidades de negócio de forma estruturada e transparente.
                </p>
              </div>
            </article>
          </div>

          <div className="mt-12 flex justify-center">
            <Button asChild size="lg" variant="outline" className="h-12 rounded-full font-semibold px-7">
              <Link to="/prestadores">Conhecer área de Fornecedores</Link>
            </Button>
          </div>
        </div>
      </section>



      {/* FLUXO DE INTEGRAÇÃO */}
      <section className="section-y bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary mb-3">
              Integração
            </span>
            <h2
              className="font-display text-3xl sm:text-4xl lg:text-[2.5rem] font-bold leading-[1.1] text-balance"
              style={{ color: NAVY }}
            >
              Conectando quem precisa contratar com{" "}
              <span style={{ color: COBALT }}>quem sabe executar.</span>
            </h2>
          </div>

          <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            {fluxo.map(({ icon: Icon, title, desc }, i) => (
              <article
                key={title}
                className="relative bg-card rounded-2xl border border-border shadow-card p-6 hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 text-center"
              >
                <div className="flex justify-center mb-4">
                  <span
                    className="grid place-items-center h-14 w-14 rounded-full text-white ring-4 ring-primary/10"
                    style={{ backgroundColor: COBALT }}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                </div>
                <h3 className="font-display text-base font-bold mb-2" style={{ color: NAVY }}>
                  {title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                {i < fluxo.length - 1 && (
                  <ArrowRight
                    className="absolute top-1/2 -right-[22px] -translate-y-1/2 h-5 w-5 hidden lg:block"
                    style={{ color: COBALT, opacity: 0.4 }}
                  />
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* POR QUE EMPRESAS ESCOLHEM */}
      <section className="section-y bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12 items-end mb-12">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary mb-3">
                Por que o Portal
              </span>
              <h2
                className="font-display text-3xl sm:text-4xl lg:text-[2.5rem] font-bold leading-[1.1] text-balance"
                style={{ color: NAVY }}
              >
                Por que empresas{" "}
                <span style={{ color: COBALT }}>escolhem</span> o Portal da Obra.
              </h2>
            </div>
            <p className="text-base text-muted-foreground leading-relaxed lg:pb-2">
              Mais do que uma plataforma, o Portal da Obra oferece um processo estruturado
              para contratar obras com mais previsibilidade, transparência e controle.
            </p>
          </div>

          <div className="bg-card rounded-3xl border border-border shadow-card p-6 sm:p-10 lg:p-12">
            <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: LineChart, title: "Mais previsibilidade", desc: "Organize concorrências, propostas e fornecedores em um processo estruturado e rastreável." },
                { icon: Lock, title: "Mais segurança", desc: "Fornecedores qualificados e processos documentados para reduzir riscos na contratação." },
                { icon: Gauge, title: "Mais controle", desc: "Centralize informações, propostas e decisões em um único ambiente." },
                { icon: Zap, title: "Mais agilidade", desc: "Reduza o tempo gasto com cotações, comparações e gestão de fornecedores." },
                { icon: Eye, title: "Mais transparência", desc: "Todas as etapas ficam registradas e acessíveis para consulta e auditoria." },
                { icon: Layers, title: "Mais escala", desc: "Padronize processos e replique contratações em diferentes regiões e unidades." },
              ].map(({ icon: Icon, title, desc }) => (
                <article
                  key={title}
                  className="group rounded-2xl border border-transparent p-5 hover:border-primary hover:-translate-y-1 hover:shadow-elegant transition-all duration-300"
                >
                  <span
                    className="grid place-items-center h-12 w-12 rounded-2xl mb-5 text-white"
                    style={{ backgroundColor: COBALT }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-lg font-bold mb-2" style={{ color: NAVY }}>
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* CTA FINAL */}
      <section className="section-y bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="relative rounded-3xl overflow-hidden p-10 sm:p-14 lg:p-20 shadow-elegant text-white"
            style={{
              background: `linear-gradient(135deg, ${NAVY} 0%, ${COBALT} 100%)`,
            }}
          >
            <div
              className="absolute inset-0 opacity-[0.07] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />

            <div className="relative max-w-3xl mx-auto text-center">
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-[1.1] text-balance">
                Pronto para{" "}
                <span style={{ color: "#7CA0FF" }}>transformar</span>{" "}
                a contratação das suas obras?
              </h2>
              <p className="mt-6 text-lg text-white/80 leading-relaxed max-w-2xl mx-auto">
                Centralize fornecedores, compare propostas, reduza riscos e conduza suas
                obras com mais controle, transparência e eficiência.
              </p>
              <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-full bg-white text-navy hover:bg-white/90 font-semibold tracking-wide px-7 shadow-elegant"
                >
                  <a href="https://web.portaldaobra.com.br/register" target="_blank" rel="noopener noreferrer">
                    Solicitar Orçamento
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white font-semibold tracking-wide px-7"
                >
                  <a href="https://web.portaldaobra.com.br/register" target="_blank" rel="noopener noreferrer">
                    Comece a Construir
                  </a>
                </Button>
              </div>
              <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs sm:text-sm text-white/75">
                {[
                  "Fornecedores qualificados",
                  "Processo auditável",
                  "Cobertura nacional",
                  "Plataforma 100% digital",
                ].map((b) => (
                  <li key={b} className="inline-flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
