import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Calendar, MapPin, Tag, CheckCircle2, ClipboardList } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { getBidBySlug } from "@/lib/bids";

export const Route = createFileRoute("/bids/$slug")({
  loader: ({ params }) => {
    const bid = getBidBySlug(params.slug);
    if (!bid) throw notFound();
    return { bid };
  },
  head: ({ loaderData }) => {
    const bid = loaderData?.bid;
    const title = bid ? `${bid.title} — Bid | Portal da Obra` : "Bid — Portal da Obra";
    const description = bid
      ? `${bid.title} em ${bid.city}/${bid.state}. Categoria: ${bid.category}. Prazo: ${bid.deadline}.`
      : "Detalhes do bid no Portal da Obra.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: BidDetailPage,
  notFoundComponent: () => (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="font-display text-3xl font-bold text-navy">Bid não encontrado</h1>
        <p className="mt-3 text-muted-foreground">Este bid pode ter sido encerrado ou removido.</p>
        <div className="mt-8">
          <Button asChild>
            <Link to="/bids">Ver todos os bids</Link>
          </Button>
        </div>
      </div>
      <Footer />
    </main>
  ),
});

function BidDetailPage() {
  const { bid } = Route.useLoaderData();

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-12 pb-4 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/bids"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar para Bids
        </Link>
      </div>

      <section className={`bg-gradient-to-br ${bid.color} border-b border-border/60`}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/70 text-navy">
              <Tag className="h-3 w-3" /> {bid.category}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-success/15 text-success">
              <CheckCircle2 className="h-3 w-3" /> {bid.status}
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy text-balance">
            {bid.title}
          </h1>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary" /> {bid.city}/{bid.state}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-primary" /> Prazo: {bid.deadline}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ClipboardList className="h-4 w-4 text-primary" /> {bid.type}
            </span>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="font-display text-2xl font-bold text-navy mb-3">Escopo Resumido</h2>
              <p className="text-muted-foreground leading-relaxed">{bid.scope}</p>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-navy mb-3">Requisitos</h2>
              <ul className="space-y-2">
                {bid.requirements.map((r: string) => (
                  <li key={r} className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-border bg-card p-6 sticky top-24 shadow-sm">
              <h3 className="font-display text-lg font-bold text-navy">Interessado neste bid?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Envie sua manifestação de interesse e participe do processo de seleção.
              </p>
              <Button asChild className="mt-5 w-full bg-gradient-to-r from-primary to-navy text-primary-foreground shadow-elegant">
                <a href="https://web.portaldaobra.com.br/register" target="_blank" rel="noopener noreferrer">
                  Tenho Interesse
                </a>
              </Button>
              <div className="mt-6 pt-6 border-t border-border space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Categoria</span><span className="font-medium text-foreground">{bid.category}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Localização</span><span className="font-medium text-foreground">{bid.city}/{bid.state}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Prazo</span><span className="font-medium text-foreground">{bid.deadline}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="font-medium text-success">{bid.status}</span></div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  );
}
