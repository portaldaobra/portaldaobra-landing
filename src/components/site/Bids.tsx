import { MapPin, Ruler, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { obras } from "@/lib/obras";

const projects = obras;

export function Bids() {
  return (
    <section className="section-y bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
          <div className="max-w-2xl">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-success mb-3">
              Obras intermediadas
            </span>
            <h2 className="h2-section text-navy">
              Projetos realizados através do{" "}
              <span className="text-primary">Portal da Obra</span>.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Conheça alguns exemplos de obras corporativas conduzidas através da nossa rede
              de fornecedores qualificados.
            </p>
          </div>
          <Button variant="outline" className="hidden sm:inline-flex" asChild>
            <Link to="/obras-realizadas">
              Ver todos os projetos <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <article
              key={p.slug}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${p.color} p-6 hover:shadow-elegant hover:-translate-y-1 hover:border-primary transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/70 text-navy uppercase tracking-wide">
                  {p.segment}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-success/15 text-success">
                  <CheckCircle2 className="h-3 w-3" /> Concluída
                </span>
              </div>

              <h3 className="font-display text-xl font-bold text-navy leading-snug">{p.title}</h3>
              <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                {p.city}/{p.state}
              </div>
              <div className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Ruler className="h-4 w-4 text-primary" />
                {p.area}
              </div>

              <div className="mt-6 pt-6 border-t border-[rgba(8,29,88,0.12)] flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Obra concluída</span>
                <Link
                  to="/obras-realizadas/$slug"
                  params={{ slug: p.slug }}
                  className="text-sm font-semibold text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all"
                >
                  Ver Case <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="sm:hidden mt-8">
          <Button variant="outline" className="w-full" asChild>
            <Link to="/obras-realizadas">Ver todos os projetos</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
