import { ArrowRight } from "lucide-react";

const steps = [
  {
    n: "01",
    title: "Conte sua necessidade",
    desc: "Envie seu projeto, escopo, prazo, padrão de loja e restrições da obra. O briefing é organizado para facilitar a análise dos fornecedores.",
    tag: "Briefing",
  },
  {
    n: "02",
    title: "Fornecedores qualificados",
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
    title: "Receba propostas qualificadas",
    desc: "Compare propostas de fornecedores avaliados e tome decisões com mais segurança, transparência e rastreabilidade.",
    tag: "Coleta",
  },
  {
    n: "05",
    title: "Contrate com segurança",
    desc: "Formalize a contratação com mais controle sobre escopo, documentação, prazos, medições e execução da obra.",
    tag: "Execução",
  },
];

const COBALT = "var(--primary)";
const NAVY = "var(--navy)";

export function CincoPassos() {
  return (
    <section className="section-y bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary mb-3">
          Como Funciona
        </span>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-14">
          <div className="lg:col-span-7">
            <h2
              className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-[1.1] text-balance"
              style={{ color: NAVY }}
            >
              Cinco passos<br className="hidden sm:block" /> até a{" "}
              <span style={{ color: COBALT }}>obra blindada.</span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-md">
              Do briefing à entrega da chave, você passa por um processo único, padronizado e
              transparente para contratar obras corporativas com mais segurança.
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((s, i) => (
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
                {i < steps.length - 1 && (
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
  );
}
