import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Calendar, MapPin, Tag, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { bids } from "@/lib/bids";

export const Route = createFileRoute("/bids/")({
  head: () => ({
    meta: [
      { title: "Bids Disponíveis — Portal da Obra" },
      {
        name: "description",
        content:
          "Encontre oportunidades reais de obras, reformas e serviços corporativos disponíveis para construtoras e fornecedores qualificados.",
      },
      { property: "og:title", content: "Bids Disponíveis — Portal da Obra" },
      {
        property: "og:description",
        content:
          "Lista atualizada de bids abertos para construtoras e fornecedores no Brasil.",
      },
      { property: "og:url", content: "/bids" },
    ],
    links: [{ rel: "canonical", href: "/bids" }],
  }),
  component: BidsListPage,
});

const ALL = "Todos";

function unique<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

function BidsListPage() {
  const states = useMemo(() => [ALL, ...unique(bids.map((b) => b.state))], []);
  const cities = useMemo(() => [ALL, ...unique(bids.map((b) => b.city))], []);
  const types = useMemo(() => [ALL, ...unique(bids.map((b) => b.type))], []);
  const categories = useMemo(() => [ALL, ...unique(bids.map((b) => b.category))], []);
  const deadlines = useMemo(() => [ALL, ...unique(bids.map((b) => b.deadline))], []);
  const statuses = useMemo(() => [ALL, ...unique(bids.map((b) => b.status))], []);

  const [fState, setFState] = useState(ALL);
  const [fCity, setFCity] = useState(ALL);
  const [fType, setFType] = useState(ALL);
  const [fCategory, setFCategory] = useState(ALL);
  const [fDeadline, setFDeadline] = useState(ALL);
  const [fStatus, setFStatus] = useState(ALL);

  const filtered = bids.filter(
    (b) =>
      (fState === ALL || b.state === fState) &&
      (fCity === ALL || b.city === fCity) &&
      (fType === ALL || b.type === fType) &&
      (fCategory === ALL || b.category === fCategory) &&
      (fDeadline === ALL || b.deadline === fDeadline) &&
      (fStatus === ALL || b.status === fStatus),
  );

  const selectCls =
    "h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-12 pb-4 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-navy/5 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-success mb-3">
            Oportunidades ao vivo
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-navy text-balance max-w-3xl">
            Bids Disponíveis
          </h1>
          <p className="mt-4 max-w-3xl text-base sm:text-lg text-muted-foreground">
            Encontre oportunidades reais de obras, reformas e serviços corporativos
            disponíveis para construtoras e fornecedores qualificados.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border/60 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <select className={selectCls} value={fState} onChange={(e) => setFState(e.target.value)} aria-label="Estado">
              {states.map((o) => <option key={o} value={o}>{o === ALL ? "Estado" : o}</option>)}
            </select>
            <select className={selectCls} value={fCity} onChange={(e) => setFCity(e.target.value)} aria-label="Cidade">
              {cities.map((o) => <option key={o} value={o}>{o === ALL ? "Cidade" : o}</option>)}
            </select>
            <select className={selectCls} value={fType} onChange={(e) => setFType(e.target.value)} aria-label="Tipo de obra">
              {types.map((o) => <option key={o} value={o}>{o === ALL ? "Tipo de obra" : o}</option>)}
            </select>
            <select className={selectCls} value={fCategory} onChange={(e) => setFCategory(e.target.value)} aria-label="Categoria">
              {categories.map((o) => <option key={o} value={o}>{o === ALL ? "Categoria" : o}</option>)}
            </select>
            <select className={selectCls} value={fDeadline} onChange={(e) => setFDeadline(e.target.value)} aria-label="Prazo">
              {deadlines.map((o) => <option key={o} value={o}>{o === ALL ? "Prazo" : o}</option>)}
            </select>
            <select className={selectCls} value={fStatus} onChange={(e) => setFStatus(e.target.value)} aria-label="Status">
              {statuses.map((o) => <option key={o} value={o}>{o === ALL ? "Status" : o}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* List */}
      <section className="py-12 sm:py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "bid encontrado" : "bids encontrados"}
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-border p-10 text-center text-muted-foreground">
              Nenhum bid encontrado com os filtros selecionados.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((b) => (
                <article
                  key={b.slug}
                  className={`group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${b.color} p-6 hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 flex flex-col`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/70 text-navy">
                      <Tag className="h-3 w-3" /> {b.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-success/15 text-success">
                      <CheckCircle2 className="h-3 w-3" /> {b.status}
                    </span>
                  </div>

                  <h2 className="font-display text-xl font-bold text-navy leading-snug">
                    {b.title}
                  </h2>
                  <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    {b.city}/{b.state}
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    Prazo: {b.deadline}
                  </div>

                  <div className="mt-6 pt-6 border-t border-border/60 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{b.type}</span>
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
          )}

          <div className="mt-12 flex justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-navy text-primary-foreground hover:opacity-95 shadow-elegant">
              <a href="https://web.portaldaobra.com.br/register" target="_blank" rel="noopener noreferrer">
                Comece a Construir <ArrowRight className="ml-1.5 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
