import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Ruler, CheckCircle2, ArrowRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { getObras } from "@/lib/content";
import type { ObraRow } from "@/lib/cms";

export const Route = createFileRoute("/obras-realizadas/")({
  loader: async () => {
    const obras = getObras();
    return { obras };
  },
  head: () => ({
    meta: [
      { title: "Obras Realizadas — Portal da Obra" },
      {
        name: "description",
        content:
          "Portfólio de obras corporativas intermediadas pelo Portal da Obra: varejo, corporativo, logístico e industrial.",
      },
      { property: "og:title", content: "Obras Realizadas — Portal da Obra" },
      {
        property: "og:description",
        content:
          "Conheça projetos concluídos através da rede qualificada de fornecedores do Portal da Obra.",
      },
    ],
  }),
  component: ObrasRealizadasPage,
});

const filters = ["Todos", "Varejo", "Corporativo", "Logístico", "Industrial"] as const;

function ObrasRealizadasPage() {
  const { obras } = Route.useLoaderData();
  const [active, setActive] = useState<(typeof filters)[number]>("Todos");

  const list = active === "Todos" ? obras : obras.filter((o: ObraRow) => o.segment === active);

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="bg-gradient-to-br from-primary/5 via-background to-background border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-success mb-3">
            Obras intermediadas
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-navy text-balance max-w-3xl">
            Projetos realizados através do <span className="text-primary">Portal da Obra</span>.
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl">
            Portfólio de obras corporativas executadas pela nossa rede qualificada de fornecedores —
            prova da experiência, capacidade operacional e credibilidade da plataforma.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 mb-10">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors border ${
                  active === f
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:border-primary hover:text-primary"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {list.length === 0 ? (
            <p className="text-muted-foreground">Nenhuma obra encontrada neste segmento.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {list.map((o: ObraRow) => (
                <article
                  key={o.slug}
                  className={`group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${o.color ?? "from-primary/10 to-primary/5"} p-6 hover:shadow-elegant hover:-translate-y-1 hover:border-primary transition-all duration-300`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/70 text-navy uppercase tracking-wide">
                      {o.segment}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-success/15 text-success">
                      <CheckCircle2 className="h-3 w-3" /> {o.obra_status}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-navy leading-snug">
                    {o.title}
                  </h3>
                  <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    {o.city}/{o.state}
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Ruler className="h-4 w-4 text-primary" />
                    {o.area}
                  </div>

                  <div className="mt-6 pt-6 border-t border-[rgba(8,29,88,0.12)] flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Obra concluída</span>
                    <Link
                      to="/obras-realizadas/$slug"
                      params={{ slug: o.slug }}
                      className="text-sm font-semibold text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all"
                    >
                      Ver Case <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-16 text-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-primary to-navy text-primary-foreground shadow-elegant"
            >
              <a
                href="https://web.portaldaobra.com.br/register"
                target="_blank"
                rel="noopener noreferrer"
              >
                Comece a Construir
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
