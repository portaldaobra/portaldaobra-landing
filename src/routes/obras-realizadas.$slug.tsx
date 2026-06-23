import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Ruler, Tag, CheckCircle2, ClipboardList } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { getObra } from "@/lib/content";

export const Route = createFileRoute("/obras-realizadas/$slug")({
  loader: async ({ params }) => {
    const obra = getObra(params.slug);
    if (!obra) throw notFound();
    return { obra };
  },
  head: ({ loaderData, params }) => {
    const obra = loaderData?.obra;
    const url = `/obras-realizadas/${params.slug}`;
    const title = obra ? `${obra.title} — Portal da Obra` : "Obra — Portal da Obra";
    return {
      meta: [
        { title },
        {
          name: "description",
          content: obra?.summary ?? "Case de obra realizada através do Portal da Obra.",
        },
        { property: "og:title", content: title },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  notFoundComponent: () => (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="font-display text-3xl font-bold text-navy">Case não encontrado</h1>
        <p className="mt-3 text-muted-foreground">
          Esta obra pode ter sido removida ou o link está incorreto.
        </p>
        <div className="mt-8">
          <Button asChild>
            <Link to="/obras-realizadas">Ver todas as obras</Link>
          </Button>
        </div>
      </div>
      <Footer />
    </main>
  ),
  component: ObraCasePage,
});

function ObraCasePage() {
  const { obra } = Route.useLoaderData();

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-12 pb-4 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/obras-realizadas"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar para Obras Realizadas
        </Link>
      </div>

      <section
        className={`bg-gradient-to-br ${obra.color ?? "from-primary/10 to-primary/5"} border-b border-border/60`}
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/70 text-navy">
              <Tag className="h-3 w-3" /> {obra.segment}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-success/15 text-success">
              <CheckCircle2 className="h-3 w-3" /> {obra.obra_status}
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy text-balance">
            {obra.title}
          </h1>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary" /> {obra.city}/{obra.state}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Ruler className="h-4 w-4 text-primary" /> {obra.area}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ClipboardList className="h-4 w-4 text-primary" /> {obra.segment}
            </span>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            {obra.summary && (
              <div>
                <h2 className="font-display text-2xl font-bold text-navy mb-3">
                  Resumo do Projeto
                </h2>
                <p className="text-muted-foreground leading-relaxed">{obra.summary}</p>
              </div>
            )}

            {obra.scope.length > 0 && (
              <div>
                <h2 className="font-display text-2xl font-bold text-navy mb-3">Escopo</h2>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {obra.scope.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-muted-foreground">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {obra.results.length > 0 && (
              <div>
                <h2 className="font-display text-2xl font-bold text-navy mb-3">Resultados</h2>
                <ul className="space-y-2">
                  {obra.results.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-muted-foreground">
                      <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4">
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
                  Solicitar Orçamento
                </a>
              </Button>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-border bg-card p-6 sticky top-24 shadow-sm">
              <h3 className="font-display text-lg font-bold text-navy">Ficha técnica</h3>
              <div className="mt-5 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Segmento</span>
                  <span className="font-medium text-foreground">{obra.segment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Local</span>
                  <span className="font-medium text-foreground">
                    {obra.city}/{obra.state}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Área</span>
                  <span className="font-medium text-foreground">{obra.area}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium text-success">{obra.obra_status}</span>
                </div>
                {obra.completion_date && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Conclusão</span>
                    <span className="font-medium text-foreground">{obra.completion_date}</span>
                  </div>
                )}
              </div>
              <Button
                asChild
                className="mt-6 w-full bg-gradient-to-r from-primary to-navy text-primary-foreground shadow-elegant"
              >
                <a
                  href="https://web.portaldaobra.com.br/register"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Solicitar Orçamento
                </a>
              </Button>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  );
}
