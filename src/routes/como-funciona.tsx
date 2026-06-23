import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import aboutImg from "@/assets/about-portal.webp";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  FileWarning,
  Search,
  ShieldAlert,
  Clock,
  Eye,
  LayoutGrid,
  Scale,
  Lock,
  ClipboardCheck,
  Network,
  Store,
  Building2,
  Warehouse,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Factory,
} from "lucide-react";

const COBALT = "var(--primary)";
const NAVY = "var(--navy)";

export const Route = createFileRoute("/como-funciona")({
  head: () => ({
    meta: [
      { title: "Como Funciona | Portal da Obra" },
      {
        name: "description",
        content:
          "Entenda como o Portal da Obra organiza todo o processo de contratação de obras corporativas.",
      },
      { property: "og:title", content: "Como Funciona | Portal da Obra" },
      {
        property: "og:description",
        content:
          "Entenda como o Portal da Obra organiza todo o processo de contratação de obras corporativas.",
      },
      { property: "og:url", content: "/como-funciona" },
    ],
    links: [{ rel: "canonical", href: "/como-funciona" }],
  }),
  component: ComoFunciona,
});

const desafios = [
  {
    icon: FileWarning,
    title: "Propostas incomparáveis",
    desc: "Cada fornecedor envia informações em formatos diferentes.",
  },
  {
    icon: Search,
    title: "Falta de transparência",
    desc: "Históricos, negociações e documentos ficam dispersos.",
  },
  {
    icon: ShieldAlert,
    title: "Risco na contratação",
    desc: "Nem sempre existe validação técnica adequada.",
  },
  {
    icon: Clock,
    title: "Processo lento",
    desc: "A tomada de decisão demora mais do que deveria.",
  },
];

const passos = [
  {
    n: "01",
    title: "Conte sua necessidade",
    desc: "Envie seu projeto, escopo, prazo, padrão de loja e restrições da obra. O briefing é organizado para facilitar a análise dos fornecedores.",
    tag: "Briefing",
  },
  {
    n: "02",
    title: "Curadoria de Fornecedores",
    desc: "A curadoria seleciona fornecedores compatíveis com a sua obra, região, capacidade técnica e documentação necessária.",
    tag: "Curadoria",
  },
  {
    n: "03",
    title: "Equalização completa",
    desc: "As propostas são organizadas em um formato comparável, permitindo analisar prazos, escopo, preço e condições com mais clareza.",
    tag: "Padronização",
  },
  {
    n: "04",
    title: "Análise e escolha",
    desc: "Compare propostas de fornecedores avaliados e tome decisões com mais segurança, transparência e rastreabilidade.",
    tag: "Decisão",
  },
  {
    n: "05",
    title: "Contrate com segurança",
    desc: "Formalize a contratação com mais controle sobre escopo, documentação, prazos, medições e execução da obra.",
    tag: "Execução",
  },
];

const ganhos = [
  { icon: ClipboardCheck, title: "Curadoria de Fornecedores", desc: "Avaliação técnica, documental e operacional para maior segurança na contratação." },
  { icon: Scale, title: "Equalização de Propostas", desc: "Comparação estruturada para análise justa entre fornecedores concorrentes." },
  { icon: LayoutGrid, title: "Gestão Centralizada", desc: "Todo o processo concentrado em uma única plataforma." },
  { icon: Eye, title: "Transparência", desc: "Histórico completo das interações, documentos e decisões." },
  { icon: Network, title: "Escalabilidade", desc: "Capacidade de atender projetos em diferentes regiões do Brasil." },
  { icon: Lock, title: "Segurança", desc: "Processos estruturados, auditáveis e rastreáveis do início ao fim." },
];

const publico = [
  { icon: Store, title: "Varejo", desc: "Expansão, retrofit, reforma e implantação de lojas." },
  { icon: Warehouse, title: "Logístico", desc: "Centros de distribuição, galpões e operações." },
  { icon: Building2, title: "Corporativo", desc: "Escritórios, sedes e adequações." },
  { icon: Factory, title: "Industrial", desc: "Adequações e obras operacionais." },
];



function ComoFunciona() {
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
            Como Funciona
          </div>
          <h1
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-balance"
            style={{ color: NAVY }}
          >
            Contratar obras corporativas{" "}
            <span style={{ color: COBALT }}>não precisa ser complicado.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            O Portal da Obra organiza todo o processo de contratação de obras corporativas,
            conectando empresas a fornecedores qualificados através de uma jornada simples,
            transparente e auditável.
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

      {/* O DESAFIO */}
      <section className="section-y bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary mb-3">
              O Desafio
            </span>
            <h2
              className="font-display text-3xl sm:text-4xl lg:text-[2.5rem] font-bold leading-[1.1] text-balance"
              style={{ color: NAVY }}
            >
              Os desafios da contratação{" "}
              <span style={{ color: COBALT }}>de obras corporativas.</span>
            </h2>
            <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
              Muitas empresas ainda enfrentam problemas como:
            </p>
          </div>

          <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {desafios.map(({ icon: Icon, title, desc }) => (
              <article
                key={title}
                className="bg-card rounded-2xl border border-border shadow-card p-6 hover:shadow-elegant hover:-translate-y-1 transition-all duration-300"
              >
                <span
                  className="grid place-items-center h-11 w-11 rounded-xl mb-5"
                  style={{ backgroundColor: "rgba(0,36,135,0.08)", color: COBALT }}
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
      </section>

      {/* NOSSA SOLUÇÃO */}
      <section className="section-y bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary mb-3">
                Nossa Solução
              </span>
              <h2
                className="font-display text-3xl sm:text-4xl lg:text-[2.5rem] font-bold leading-tight text-balance"
                style={{ color: NAVY }}
              >
                Foi por isso que criamos o{" "}
                <span style={{ color: COBALT }}>Portal da Obra.</span>
              </h2>
              <div className="mt-5 space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Desenvolvemos uma plataforma especializada para conectar empresas a fornecedores
                  qualificados através de um processo estruturado, auditável e transparente.
                </p>
                <p>O resultado é uma contratação mais eficiente, segura e previsível.</p>
              </div>

              <ul className="mt-8 space-y-3">
                {[
                  "Processo estruturado de ponta a ponta",
                  "Auditabilidade completa das contratações",
                  "Fornecedores qualificados tecnicamente",
                ].map((b) => (
                  <li key={b} className="flex items-center gap-3 text-base font-medium text-foreground">
                    <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: COBALT }} />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <div className="absolute -inset-3 bg-gradient-to-br from-primary/20 to-success/15 rounded-3xl blur-2xl" />
              <div
                className="relative rounded-3xl shadow-elegant border border-border overflow-hidden"
                style={{ background: "var(--gradient-mesh)" }}
              >
                <div className="bg-card/95 backdrop-blur p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
                    <span className="ml-3 text-xs text-muted-foreground font-mono">
                      portaldaobra.com.br
                    </span>
                  </div>
                  <div className="space-y-3">
                    {["Briefing recebido", "Fornecedores selecionados", "Propostas equalizadas", "Contratação segura"].map(
                      (t, i) => (
                        <div
                          key={t}
                          className="flex items-center justify-between p-4 rounded-xl border border-border bg-background"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className="grid place-items-center h-8 w-8 rounded-full text-white text-xs font-bold"
                              style={{ backgroundColor: COBALT }}
                            >
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="text-sm font-semibold" style={{ color: NAVY }}>
                              {t}
                            </span>
                          </div>
                          <CheckCircle2 className="h-4 w-4" style={{ color: COBALT }} />
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA NA PRÁTICA — 5 passos */}
      <section className="section-y bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary mb-3">
            Na Prática
          </span>
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-14">
            <div className="lg:col-span-7">
              <h2
                className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-[1.1] text-balance"
                style={{ color: NAVY }}
              >
                Cinco passos até uma{" "}
                <span style={{ color: COBALT }}>contratação mais eficiente.</span>
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-md">
                Do briefing à entrega da chave, você passa por um processo único, padronizado e transparente para contratar obras corporativas com mais segurança.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            {passos.map((s, i) => (
              <article
                key={s.n}
                className="relative group bg-card rounded-2xl border border-border shadow-card p-6 hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="flex items-center justify-between mb-6">
                  <span
                    className="grid place-items-center h-11 w-11 rounded-full text-white font-display font-bold text-sm ring-4 ring-primary/10"
                    style={{ backgroundColor: COBALT }}
                  >
                    {s.n}
                  </span>
                  {i < passos.length - 1 && (
                    <ArrowRight
                      className="h-4 w-4 hidden lg:block"
                      style={{ color: COBALT, opacity: 0.4 }}
                    />
                  )}
                </div>
                <h3
                  className="font-display text-lg font-bold leading-snug mb-3"
                  style={{ color: NAVY }}
                >
                  {s.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{s.desc}</p>
                <div className="mt-6 pt-5 border-t border-dashed border-border">
                  <span
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] px-2.5 py-1.5 rounded-md text-white"
                    style={{ backgroundColor: COBALT }}
                  >
                    {s.tag}
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* COMO ENTREGAMOS VALOR */}
      <section className="section-y bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary mb-3">
              Como Entregamos Valor
            </span>
            <h2
              className="font-display text-3xl sm:text-4xl lg:text-[2.5rem] font-bold leading-[1.1] text-balance"
              style={{ color: NAVY }}
            >
              Um método pensado para{" "}
              <span style={{ color: COBALT }}>cada etapa da contratação.</span>
            </h2>
          </div>


          <div className="grid gap-6 lg:gap-8 lg:grid-cols-12 items-stretch">
            {/* Card destaque */}
            <article
              className="lg:col-span-5 rounded-2xl border border-border bg-card shadow-card overflow-hidden flex flex-col hover:shadow-elegant hover:-translate-y-1 transition-all duration-300"
            >
              <div className="p-8 sm:p-9">
                <span
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em]"
                  style={{ backgroundColor: "rgba(0,36,135,0.08)", color: COBALT }}
                >
                  Nosso método
                </span>
                <h3
                  className="mt-5 font-display text-2xl sm:text-[1.75rem] font-bold leading-tight"
                  style={{ color: NAVY }}
                >
                  Como entregamos valor
                </h3>
                <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Conectamos contratantes e fornecedores através de um processo estruturado,
                  transformando uma contratação complexa em uma jornada segura, transparente
                  e previsível.
                </p>
              </div>
              <div className="relative mt-auto flex-1 min-h-[260px] sm:min-h-[320px] overflow-hidden">
                <img
                  src={aboutImg}
                  alt="Profissionais analisando projeto de obra corporativa"
                  title="Como o Portal da Obra entrega valor"
                  width={1280}
                  height={960}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(180deg, rgba(0,14,66,0) 60%, rgba(0,14,66,0.35) 100%)" }}
                />
              </div>
            </article>

            {/* Grid de benefícios */}
            <div className="lg:col-span-7 grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2">
              {ganhos.map(({ icon: Icon, title, desc }) => (
                <article
                  key={title}
                  className="bg-card rounded-2xl border border-border shadow-card p-6 sm:p-7 hover:shadow-elegant hover:-translate-y-1 hover:border-primary/30 transition-all duration-300"
                >
                  <span
                    className="grid place-items-center h-11 w-11 rounded-2xl mb-4 text-white"
                    style={{ backgroundColor: COBALT }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-base sm:text-lg font-bold mb-2" style={{ color: NAVY }}>
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* QUEM UTILIZA */}
      <section className="section-y bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary mb-3">
              Por Tipo de Obra
            </span>
            <h2
              className="font-display text-3xl sm:text-4xl lg:text-[2.5rem] font-bold leading-[1.1] text-balance"
              style={{ color: NAVY }}
            >
              Tipos de obras{" "}
              <span style={{ color: COBALT }}>atendidas.</span>
            </h2>
            <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
              O Portal da Obra conecta empresas e fornecedores em diferentes segmentos da
              construção corporativa, permitindo processos mais eficientes e padronizados.
            </p>
          </div>

          <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {publico.map(({ icon: Icon, title, desc }) => (
              <article
                key={title}
                className="bg-card rounded-2xl border border-border shadow-card p-6 hover:shadow-elegant hover:-translate-y-1 transition-all duration-300"
              >
                <span
                  className="grid place-items-center h-12 w-12 rounded-xl mb-5 ring-4 ring-primary/10 text-white"
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
      </section>

      {/* ESCOLHA SEU PERFIL */}
      <section className="section-y bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-14">
            <div className="lg:col-span-7">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary mb-3">
                Comece Agora
              </span>
              <h2
                className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-[1.1] text-balance"
                style={{ color: NAVY }}
              >
                Escolha seu perfil.{" "}
                <span style={{ color: COBALT }}>Comece da forma certa.</span>
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-md">
                Contratantes e fornecedores possuem jornadas diferentes dentro da plataforma,
                mas compartilham o mesmo compromisso com transparência, qualidade e eficiência.
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:gap-7 grid-cols-1 lg:grid-cols-2">
            {/* CARD PRESTADOR */}
            <article className="group relative bg-card rounded-3xl border border-border shadow-card p-8 sm:p-10 hover:shadow-elegant hover:-translate-y-1 hover:border-primary transition-all duration-300 flex flex-col">
              <div className="flex items-center gap-4 mb-5">
                <span
                  className="grid place-items-center h-14 w-14 rounded-2xl shrink-0"
                  style={{ backgroundColor: "rgba(0,36,135,0.08)", color: COBALT }}
                >
                  <Building2 className="h-6 w-6" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-2xl font-bold leading-tight" style={{ color: NAVY }}>
                    Sou Fornecedor
                  </h3>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    Construtoras • Empreiteiras • Fornecedores
                  </p>
                </div>
              </div>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
                Receba oportunidades de obras corporativas, participe de BIDs qualificados e
                amplie sua carteira de clientes.
              </p>

              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "Participação em oportunidades reais",
                  "Recebimento de BIDs qualificados",
                  "Gestão centralizada de propostas",
                  "Mais visibilidade comercial",
                  "Relacionamento com empresas contratantes",
                ].map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-3 text-sm text-foreground/90"
                  >
                    <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: COBALT }} />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-full font-semibold tracking-wide px-7 self-start border-2"
                style={{ borderColor: COBALT, color: COBALT }}
              >
                <a href="https://web.portaldaobra.com.br/register" target="_blank" rel="noopener noreferrer">
                  Cadastrar como Fornecedor
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </article>

            {/* CARD CONTRATANTE — destaque */}
            <article
              className="group relative rounded-3xl shadow-elegant p-8 sm:p-10 hover:-translate-y-1 transition-all duration-300 flex flex-col text-white overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${NAVY} 0%, ${COBALT} 100%)`,
              }}
            >
              <div
                className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
              <span
                className="absolute top-6 right-6 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] px-3 py-1.5 rounded-full bg-white text-navy"
              >
                <Sparkles className="h-3 w-3" />
                Mais Procurado
              </span>

              <div className="relative flex items-center gap-4 mb-5">
                <span className="grid place-items-center h-14 w-14 rounded-2xl shrink-0 bg-white/10 ring-1 ring-white/20 text-white">
                  <ShieldCheck className="h-6 w-6" />
                </span>
                <div className="min-w-0 pr-24">
                  <h3 className="font-display text-2xl font-bold leading-tight">
                    Sou Contratante
                  </h3>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">
                    Empresas • Varejo • Operações Corporativas
                  </p>
                </div>
              </div>

              <p className="relative text-sm sm:text-base text-white/85 leading-relaxed mb-6">
                Publique sua demanda, receba propostas comparáveis e contrate fornecedores
                qualificados com mais segurança e previsibilidade.
              </p>

              <ul className="relative space-y-3 mb-8 flex-1">
                {[
                  "Recebimento de múltiplas propostas",
                  "Curadoria de fornecedores",
                  "Equalização de propostas",
                  "Gestão centralizada da contratação",
                  "Processo auditável e transparente",
                ].map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-3 text-sm text-white/90"
                  >
                    <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-white" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                size="lg"
                className="relative h-12 rounded-full bg-white text-navy hover:bg-white/90 font-semibold tracking-wide px-7 self-start shadow-elegant"
              >
                <a
                  href="https://web.portaldaobra.com.br/register"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Cadastrar como Contratante
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </article>
          </div>

          <div className="mt-10 text-center text-sm text-muted-foreground">
            Já possui uma conta?{" "}
            <a
              href="https://web.portaldaobra.com.br/auth/login"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline underline-offset-4 hover:no-underline"
              style={{ color: COBALT }}
            >
              Entrar na plataforma →
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
