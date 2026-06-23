import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  Building2,
  HardHat,
  Search,
  MessageSquare,
  HelpCircle,
} from "lucide-react";

const COBALT = "var(--primary)";
const NAVY = "var(--navy)";

type Perfil = "contratante" | "prestador";
type FaqItem = { id: string; q: string; a: string };

export const Route = createFileRoute("/duvidas-frequentes")({
  head: () => ({
    meta: [
      { title: "Dúvidas Frequentes — Portal da Obra" },
      {
        name: "description",
        content:
          "Central de ajuda do Portal da Obra. Encontre respostas sobre a plataforma, contratação de obras e participação em oportunidades.",
      },
      { property: "og:title", content: "Dúvidas Frequentes — Portal da Obra" },
      {
        property: "og:description",
        content:
          "Tire suas dúvidas sobre contratação de obras corporativas e participação como fornecedor no Portal da Obra.",
      },
      { property: "og:url", content: "/duvidas-frequentes" },
    ],
    links: [{ rel: "canonical", href: "/duvidas-frequentes" }],
  }),
  component: DuvidasFrequentes,
});

function DuvidasFrequentes() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [query, setQuery] = useState("");

  const { data: allFaqs } = useQuery({
    queryKey: ["public", "faqs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faqs")
        .select("id,question,answer,profile,sort_order")
        .eq("status", "active")
        .order("profile")
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as Array<{ id: string; question: string; answer: string; profile: "contratante" | "fornecedor"; sort_order: number }>;
    },
  });

  const faqContratantes: FaqItem[] = useMemo(
    () =>
      (allFaqs ?? [])
        .filter((r) => r.profile === "contratante")
        .map((r) => ({ id: r.id, q: r.question, a: r.answer })),
    [allFaqs],
  );
  const faqPrestadores: FaqItem[] = useMemo(
    () =>
      (allFaqs ?? [])
        .filter((r) => r.profile === "fornecedor")
        .map((r) => ({ id: r.id, q: r.question, a: r.answer })),
    [allFaqs],
  );

  // Inject FAQ JSON-LD schema dynamically from active DB faqs
  useEffect(() => {
    if (!allFaqs?.length) return;
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: allFaqs.map((i) => ({
        "@type": "Question",
        name: i.question,
        acceptedAnswer: { "@type": "Answer", text: i.answer },
      })),
    };
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.dataset.faqSchema = "true";
    el.textContent = JSON.stringify(schema);
    document.head.appendChild(el);
    return () => {
      el.remove();
    };
  }, [allFaqs]);

  const lista = perfil === "contratante" ? faqContratantes : faqPrestadores;
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return lista;
    return lista.filter(
      (i) => i.q.toLowerCase().includes(q) || i.a.toLowerCase().includes(q),
    );
  }, [lista, query]);



  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden bg-secondary">
        <div className="absolute inset-0 -z-10" style={{ backgroundImage: "var(--gradient-mesh)" }} />
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-success/10 blur-3xl" />

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold uppercase tracking-[0.18em] mb-6 ring-1 ring-primary/20">
            <HelpCircle className="h-3.5 w-3.5" />
            Central de Ajuda
          </div>
          <h1
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-balance"
            style={{ color: NAVY }}
          >
            Como podemos <span style={{ color: COBALT }}>ajudar?</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Encontre respostas rápidas sobre a plataforma, processos de contratação,
            participação em oportunidades e funcionamento do Portal da Obra.
          </p>
        </div>
      </section>

      {/* SELETOR DE PERFIL */}
      {!perfil && (
        <section className="section-y bg-background">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary mb-3">
                Escolha seu perfil
              </span>
              <h2
                className="font-display text-2xl sm:text-3xl font-bold leading-tight text-balance"
                style={{ color: NAVY }}
              >
                Para qual público você quer ver as dúvidas?
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Contratante */}
              <button
                type="button"
                onClick={() => setPerfil("contratante")}
                className="group text-left bg-card rounded-3xl border border-border shadow-card p-8 sm:p-10 hover:shadow-elegant hover:-translate-y-1 transition-all duration-300"
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = COBALT)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
              >
                <span
                  className="grid place-items-center h-14 w-14 rounded-2xl mb-6 text-white"
                  style={{ backgroundColor: COBALT }}
                >
                  <Building2 className="h-6 w-6" />
                </span>
                <h3 className="font-display text-2xl font-bold mb-2" style={{ color: NAVY }}>
                  Sou Contratante
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Quero contratar obras e fornecedores.
                </p>
                <span
                  className="inline-flex items-center gap-2 text-sm font-semibold"
                  style={{ color: COBALT }}
                >
                  Ver dúvidas para contratantes
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </button>

              {/* Prestador */}
              <button
                type="button"
                onClick={() => setPerfil("prestador")}
                className="group text-left bg-card rounded-3xl border border-border shadow-card p-8 sm:p-10 hover:shadow-elegant hover:-translate-y-1 transition-all duration-300"
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = COBALT)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
              >
                <span
                  className="grid place-items-center h-14 w-14 rounded-2xl mb-6"
                  style={{ backgroundColor: "rgba(0,36,135,0.08)", color: COBALT }}
                >
                  <HardHat className="h-6 w-6" />
                </span>
                <h3 className="font-display text-2xl font-bold mb-2" style={{ color: NAVY }}>
                  Sou Fornecedor
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Quero participar de oportunidades e receber demandas.
                </p>
                <span
                  className="inline-flex items-center gap-2 text-sm font-semibold"
                  style={{ color: COBALT }}
                >
                  Ver dúvidas para fornecedores
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* FAQ + BUSCA */}
      {perfil && (
        <section className="section-y bg-background">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            {/* Tabs de perfil */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
              <div className="inline-flex p-1 rounded-full bg-secondary border border-border self-start">
                {(["contratante", "prestador"] as Perfil[]).map((p) => {
                  const active = perfil === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPerfil(p)}
                      className="px-5 py-2 rounded-full text-sm font-semibold transition-colors"
                      style={
                        active
                          ? { backgroundColor: COBALT, color: "#fff" }
                          : { color: NAVY }
                      }
                    >
                      {p === "contratante" ? "Contratantes" : "Fornecedores"}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => {
                  setPerfil(null);
                  setQuery("");
                }}
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors self-start sm:self-auto"
              >
                ← Trocar perfil
              </button>
            </div>

            {/* Busca */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Digite sua dúvida"
                className="h-12 pl-11 rounded-full bg-card border-border"
              />
            </div>

            {/* Accordion */}
            {filtered.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-2xl border border-border">
                <p className="text-sm text-muted-foreground">
                  Nenhum resultado encontrado para "{query}".
                </p>
              </div>
            ) : (
              <Accordion type="single" collapsible className="space-y-4">
                {filtered.map((item, i) => (
                  <AccordionItem
                    key={item.q}
                    value={`faq-${i}`}
                    className="group bg-card rounded-2xl border border-border overflow-hidden transition-colors duration-200 hover:bg-primary data-[state=open]:bg-primary data-[state=open]:border-primary data-[state=open]:shadow-elegant"
                  >
                    <AccordionTrigger className="text-left font-display text-lg font-bold text-navy hover:no-underline py-6 px-6 transition-colors duration-200 group-hover:text-white [&[data-state=open]]:text-white [&>svg]:text-primary group-hover:[&>svg]:text-white [&[data-state=open]>svg]:text-white [&>svg]:h-5 [&>svg]:w-5">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="bg-card px-6 pb-6 pt-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </section>
      )}

      {/* CTA FINAL */}
      <section className="py-20 bg-secondary/40">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <span
            className="grid place-items-center h-12 w-12 rounded-2xl mx-auto mb-6 text-white"
            style={{ backgroundColor: COBALT }}
          >
            <MessageSquare className="h-5 w-5" />
          </span>
          <h2
            className="font-display text-2xl sm:text-3xl font-bold leading-tight mb-3"
            style={{ color: NAVY }}
          >
            Ainda precisa de ajuda?
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-7 max-w-xl mx-auto">
            Nossa equipe está pronta para esclarecer qualquer dúvida.
          </p>
          <Button
            asChild
            variant="hero"
            size="xl"
          >
            <Link to="/" hash="contato">
              Falar com Especialista
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
