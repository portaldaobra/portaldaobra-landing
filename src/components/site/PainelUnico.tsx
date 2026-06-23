import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  Receipt,
  DollarSign,
  Users,
  Plus,
  ArrowUpRight,
  Filter,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Variant = "contratante" | "construtora";

type Metric = {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
};

type Item = {
  code: string;
  title: string;
  city: string;
  meta: string;
  count: number;
  status: string;
  statusTone: "info" | "warn" | "success" | "muted";
};

const data: Record<
  Variant,
  {
    breadcrumb: string;
    panelTitle: string;
    panelSubtitle: string;
    ctaLabel: string;
    metrics: Metric[];
    chartTitle: string;
    listTitle: string;
    listMeta: string;
    items: Item[];
    sidebar: { label: string; icon: any; badge?: string }[];
  }
> = {
  contratante: {
    breadcrumb: "portal.obra / contratante / visão-geral",
    panelTitle: "Painel do Contratante",
    panelSubtitle: "Visão consolidada · Q2 / 2026 · 18 obras ativas",
    ctaLabel: "Novo BID",
    metrics: [
      { label: "Obras Ativas", value: "18", delta: "+3 vs trimestre", trend: "up" },
      { label: "BIDs Abertos", value: "7", delta: "-2 vs semana", trend: "down" },
      { label: "Tempo Médio Cotação", value: "11 dias", delta: "-42%", trend: "up" },
      { label: "Capex Contratado", value: "R$ 12,4M", delta: "+8,2%", trend: "up" },
    ],
    chartTitle: "Propostas recebidas — últimos 12 meses",
    listTitle: "BIDs em andamento",
    listMeta: "Mostrando 5 de 18",
    items: [
      { code: "BID-2034", title: "Reforma Loja Iguatemi", city: "São Paulo", meta: "480 m² · Padrão A", count: 4, status: "Em análise", statusTone: "info" },
      { code: "BID-2031", title: "Expansão Unidade Campinas", city: "Campinas", meta: "720 m² · Padrão A+", count: 6, status: "Em coleta", statusTone: "warn" },
      { code: "BID-2029", title: "Nova Loja Belo Horizonte", city: "Belo Horizonte", meta: "220 m²", count: 5, status: "Contratada", statusTone: "success" },
      { code: "BID-2025", title: "Retrofit Escritório Corporativo", city: "Rio de Janeiro", meta: "Andar 12 · 410 m²", count: 8, status: "Em análise", statusTone: "info" },
      { code: "BID-2018", title: "MEP Centro de Distribuição", city: "Cajamar", meta: "4.200 m²", count: 3, status: "Rascunho", statusTone: "muted" },
    ],
    sidebar: [
      { label: "Visão geral", icon: LayoutDashboard },
      { label: "BIDs", icon: FileText, badge: "7" },
      { label: "Contratos", icon: CheckSquare },
      { label: "Medições", icon: Receipt },
      { label: "Pagamentos", icon: DollarSign },
      { label: "Fornecedores", icon: Users },
    ],
  },
  construtora: {
    breadcrumb: "portal.obra / construtora / oportunidades",
    panelTitle: "Painel da Construtora",
    panelSubtitle: "Pipeline comercial · Q2 / 2026 · 24 oportunidades",
    ctaLabel: "Enviar Proposta",
    metrics: [
      { label: "BIDs Disponíveis", value: "24", delta: "+6 vs semana", trend: "up" },
      { label: "Propostas Enviadas", value: "12", delta: "+4 vs semana", trend: "up" },
      { label: "Contratos Ativos", value: "5", delta: "+1 vs mês", trend: "up" },
      { label: "Taxa de Conversão", value: "32%", delta: "+5,4%", trend: "up" },
    ],
    chartTitle: "Oportunidades acessadas — últimos 12 meses",
    listTitle: "Oportunidades disponíveis",
    listMeta: "Mostrando 5 de 24",
    items: [
      { code: "BID-1148", title: "Loja Varejo SP", city: "São Paulo", meta: "380 m² · Padrão A", count: 9, status: "Aberta", statusTone: "info" },
      { code: "BID-1142", title: "Centro de Distribuição MG", city: "Betim", meta: "6.500 m²", count: 4, status: "Em coleta", statusTone: "warn" },
      { code: "BID-1139", title: "Reforma Unidade RJ", city: "Rio de Janeiro", meta: "260 m²", count: 7, status: "Aberta", statusTone: "info" },
      { code: "BID-1133", title: "Escritório Corporativo PR", city: "Curitiba", meta: "Andar 8 · 540 m²", count: 5, status: "Proposta enviada", statusTone: "success" },
      { code: "BID-1127", title: "Roll-out Sul — 4 lojas", city: "Porto Alegre", meta: "Padrão A", count: 6, status: "Aberta", statusTone: "info" },
    ],
    sidebar: [
      { label: "Oportunidades", icon: LayoutDashboard },
      { label: "BIDs", icon: FileText, badge: "24" },
      { label: "Propostas", icon: CheckSquare, badge: "12" },
      { label: "Contratos", icon: Receipt },
      { label: "Faturamento", icon: DollarSign },
      { label: "Equipe", icon: Users },
    ],
  },
};

const statusStyles: Record<Item["statusTone"], string> = {
  info: "bg-primary-100 text-primary-700",
  warn: "bg-amber-100 text-amber-700",
  success: "bg-emerald-100 text-emerald-700",
  muted: "bg-secondary text-muted-foreground",
};

// Smooth line chart path (viewBox 0 0 600 160)
const chartPath =
  "M0,130 C40,128 70,118 110,112 C160,104 190,110 230,98 C275,84 305,92 345,78 C385,64 415,70 455,54 C495,38 525,42 565,28 L600,22";

const chartArea = chartPath + " L600,160 L0,160 Z";

export function PainelUnico({ variant = "contratante" }: { variant?: Variant } = {}) {
  const d = data[variant];
  const isContratante = variant === "contratante";
  const supportCopy = isContratante
    ? "BIDs, contratos, medições e pagamentos numa interface única — auditável e exportável."
    : "Oportunidades, propostas, contratos e faturamento numa interface única — clara e organizada.";
  const ctaHref = isContratante
    ? "https://web.portaldaobra.com.br/register"
    : "https://web.portaldaobra.com.br/register?perfil=prestador";
  const ctaTitle = isContratante
    ? "Centralize a contratação e a execução das suas obras."
    : "Acompanhe suas oportunidades e propostas num só lugar.";

  return (
    <section className="section-y bg-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-10 lg:mb-14">
          <div className="lg:col-span-7">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary mb-3">
              Plataforma
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-navy text-balance leading-[1.1]">
              Toda a obra <span className="text-primary">no mesmo painel</span>.
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-md">
              {supportCopy}
            </p>
          </div>
        </div>


        {/* Mockup */}
        <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center gap-3 px-4 sm:px-5 h-10 border-b border-border bg-secondary/60">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-destructive/70" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
            </div>
            <div className="text-xs text-muted-foreground font-mono truncate">{d.breadcrumb}</div>
            <div className="ml-auto flex items-center gap-2 text-[10px] text-muted-foreground">
              <span className="font-semibold">v2.4</span>
              <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground grid place-items-center text-[10px] font-bold">
                JS
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-[220px_1fr]">
            {/* Sidebar */}
            <aside className="hidden md:block border-r border-border bg-secondary/40 p-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 mb-2">
                Menu
              </div>
              <nav className="space-y-1">
                {d.sidebar.map((s, i) => {
                  const Icon = s.icon;
                  const active = i === 0;
                  return (
                    <div
                      key={s.label}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        active
                          ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                          : "text-foreground/70 hover:bg-card hover:text-navy"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1 truncate">{s.label}</span>
                      {s.badge && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                            active ? "bg-white/20 text-white" : "bg-primary-100 text-primary-700"
                          }`}
                        >
                          {s.badge}
                        </span>
                      )}
                    </div>
                  );
                })}
              </nav>
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 mt-6 mb-2">
                Atalhos
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground/70">
                  <Plus className="h-4 w-4" />
                  <span className="flex-1">{d.ctaLabel}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground">
                    N
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground/70">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>Exportar SAP</span>
                </div>
              </div>
            </aside>

            {/* Main */}
            <div className="p-5 sm:p-7 space-y-6">
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-navy">
                    {d.panelTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {d.panelSubtitle}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium px-3 h-9 rounded-full border border-border text-foreground/80 hover:bg-secondary transition-colors">
                    <Filter className="h-3.5 w-3.5" /> Filtrar período
                  </button>
                  <button className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3 h-9 rounded-full bg-navy text-white hover:bg-navy/90 transition-colors">
                    <Plus className="h-3.5 w-3.5" /> {d.ctaLabel}
                  </button>
                </div>
              </div>

              {/* Metric cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {d.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="rounded-xl border border-border bg-card p-4 hover:shadow-card hover:-translate-y-0.5 transition-all"
                  >
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {m.label}
                    </div>
                    <div className="mt-2 font-display text-2xl font-bold text-navy">{m.value}</div>
                    <div
                      className={`mt-1 text-[11px] font-medium ${
                        m.trend === "up" ? "text-emerald-600" : "text-destructive"
                      }`}
                    >
                      {m.trend === "up" ? "↑" : "↓"} {m.delta}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold text-navy">{d.chartTitle}</div>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-primary" /> Volume
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-border" /> Meta
                    </span>
                  </div>
                </div>
                <svg
                  viewBox="0 0 600 160"
                  preserveAspectRatio="none"
                  className="w-full h-32 sm:h-40"
                >
                  <defs>
                    <linearGradient id="painel-area" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.55 0.20 263)" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="oklch(0.55 0.20 263)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* grid */}
                  {[40, 80, 120].map((y) => (
                    <line
                      key={y}
                      x1="0"
                      x2="600"
                      y1={y}
                      y2={y}
                      stroke="currentColor"
                      className="text-border"
                      strokeDasharray="3 4"
                    />
                  ))}
                  <path d={chartArea} fill="url(#painel-area)" />
                  <path
                    d={chartPath}
                    fill="none"
                    stroke="oklch(0.42 0.20 263)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="600" cy="22" r="4" fill="oklch(0.42 0.20 263)" />
                </svg>
              </div>

              {/* List */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold text-navy">{d.listTitle}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {d.listMeta}
                  </div>
                </div>
                <div className="space-y-2">
                  {d.items.map((it) => (
                    <div
                      key={it.code}
                      className="group flex items-center gap-3 sm:gap-4 rounded-xl border border-border bg-card px-4 py-3 hover:border-primary/40 hover:shadow-sm transition-all"
                    >
                      <span className="hidden sm:inline text-[10px] font-mono font-semibold text-muted-foreground w-16 shrink-0">
                        {it.code}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-navy truncate">{it.title}</div>
                        <div className="text-[11px] uppercase tracking-wide text-muted-foreground truncate">
                          {it.city} · {it.meta}
                        </div>
                      </div>
                      <div className="hidden sm:block text-right shrink-0">
                        <div className="text-base font-bold text-primary leading-none">{it.count}</div>
                        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                          propostas
                        </div>
                      </div>
                      <span
                        className={`hidden md:inline text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${statusStyles[it.statusTone]}`}
                      >
                        {it.status}
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA final */}
        <div className="mt-12 text-center">
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-navy text-balance">
            {ctaTitle}
          </h3>
          <div className="mt-6">
            <Button
              size="lg"
              asChild
              className="bg-gradient-to-r from-primary to-navy text-primary-foreground hover:opacity-95 shadow-elegant"
            >
              <a href={ctaHref} target="_blank" rel="noopener noreferrer">
                Comece a Construir <ArrowRight className="ml-1.5 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
