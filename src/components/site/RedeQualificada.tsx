
import { Check, MapPin, ArrowRight, ShieldCheck, Store, Warehouse, Building2, Factory, HeartPulse, UtensilsCrossed, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const segmentos = ["Varejo", "Logístico", "Corporativo", "Industrial"];
const qualificacoes = [
  "Documentação validada",
  "Capacidade técnica",
  "Histórico analisado",
  "Compliance aprovado",
];
const cobertura = ["Nacional"];

type Card = {
  icon: LucideIcon;
  name: string;
  city: string;
  tags: string[];
  obras: string;
  anos: string;
};

const cards: Card[] = [
  { icon: Store, name: "Construção de Lojas e Varejo", city: "São Paulo/SP", tags: ["Varejo", "Roll-Out"], obras: "120 obras", anos: "15 anos" },
  { icon: Warehouse, name: "Centros de Distribuição", city: "Rio de Janeiro/RJ", tags: ["Logístico", "Galpões"], obras: "85 obras", anos: "12 anos" },
  { icon: Building2, name: "Escritórios Corporativos", city: "Curitiba/PR", tags: ["Corporativo", "Retrofit"], obras: "67 obras", anos: "9 anos" },
  { icon: Factory, name: "Obras Industriais", city: "Belo Horizonte/MG", tags: ["Industrial", "Adequações"], obras: "102 obras", anos: "14 anos" },
  { icon: HeartPulse, name: "Clínicas e Hospitais", city: "Campinas/SP", tags: ["Saúde", "Alta Complexidade"], obras: "58 obras", anos: "8 anos" },
  { icon: UtensilsCrossed, name: "Restaurantes e Food Service", city: "Porto Alegre/RS", tags: ["Food Service", "Expansão"], obras: "74 obras", anos: "11 anos" },
];

function FilterGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-navy-foreground/60 mb-3">
        {title}
      </h4>
      <ul className="space-y-2.5">
        {items.map((i) => (
          <li
            key={i}
            className="flex items-center gap-2.5 text-sm text-navy-foreground/90"
          >
            <span className="grid place-items-center h-5 w-5 shrink-0 rounded-full bg-primary text-primary-foreground ring-1 ring-primary/40">
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RedeQualificada() {
  return (
    <section className="section-y bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-10">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-success mb-3">
            Rede especializada
          </span>
          <h2 className="h2-section text-navy max-w-3xl">
            Uma rede de fornecedores que já passou pela{" "}
            <span className="text-primary">peneira fina</span>.
          </h2>
          <div className="mt-6 max-w-[720px] text-muted-foreground font-normal leading-[1.7]">
            <p>
              Reunimos fornecedores selecionados por critérios técnicos, experiência
              comprovada e capacidade de atender obras em todo o Brasil.
            </p>
          </div>
        </div>

        {/* Premium container */}
        <div
          className="relative overflow-hidden rounded-3xl bg-navy text-navy-foreground p-6 sm:p-10 shadow-elegant"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        >
          <div className="absolute -top-32 -right-32 h-72 w-72 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

          <div className="relative grid lg:grid-cols-[260px_1fr] gap-8">
            {/* Sidebar filters */}
            <aside className="space-y-8 lg:border-r lg:border-white/10 lg:pr-8">
              <FilterGroup title="Segmentos" items={segmentos} />
              <FilterGroup title="Qualificações" items={qualificacoes} />
              <FilterGroup title="Cobertura" items={cobertura} />
            </aside>

            {/* Cards grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {cards.map((c) => {
                const Icon = c.icon;
                return (
                <article
                  key={c.name}
                  className="rounded-2xl bg-white/5 border border-white/10 p-5 hover:border-primary/50 hover:bg-white/[0.07] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/10 text-white ring-1 ring-white/15">
                      <Icon className="h-5 w-5" strokeWidth={2.2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-base font-bold text-navy-foreground truncate">
                        {c.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-navy-foreground/70 mt-0.5">
                        <MapPin className="h-3 w-3" />
                        {c.city}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {c.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-md bg-white/10 text-white/95 border border-white/15"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-navy-foreground">{c.obras}</div>
                      <div className="text-navy-foreground/60">executadas</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-navy-foreground">{c.anos}</div>
                      <div className="text-navy-foreground/60">de mercado</div>
                    </div>
                  </div>
                </article>
                );
              })}
            </div>
          </div>

          {/* Footer highlight strip */}
          <div className="relative mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-white ring-1 ring-white/15">
                <ShieldCheck className="h-5 w-5" strokeWidth={2.2} />
              </div>
              <div>
                <div className="font-display text-xl font-bold text-navy-foreground">
                  +100 fornecedores qualificados
                </div>
                <div className="text-sm text-navy-foreground/60">
                  Participando da rede Portal da Obra.
                </div>
              </div>
            </div>
            <Button asChild size="lg">
              <a href="https://web.portaldaobra.com.br/register" target="_blank" rel="noopener noreferrer">
                Comece a Construir <ArrowRight className="ml-1.5 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
