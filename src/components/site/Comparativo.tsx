import { Check, AlertCircle } from "lucide-react";

const semPortal = [
  {
    title: "Falta de transparência e compliance",
    desc: "Contratações sem rastro auditável, cheias de risco regulatório e disputas.",
  },
  {
    title: "Tomada de preços lenta",
    desc: "Orçamentos demoram semanas, retornam em formatos incomparáveis e travam decisão.",
  },
  {
    title: "Fornecedor sem histórico técnico",
    desc: "Sem auditoria prévia, a obra entra em risco antes do primeiro tijolo.",
  },
];

const comPortal = [
  {
    title: "Trilha auditável de ponta a ponta",
    desc: "Cada proposta, mensagem e medição assinada digitalmente. Compliance vira padrão.",
  },
  {
    title: "Cotação padronizada e ágil",
    desc: "Templates por escopo. Comparação justa, decisão rápida.",
  },
  {
    title: "Curadoria técnica obrigatória",
    desc: "Quem entra na rede passa por validação documental, análise de CNAE, certidões, regularidade fiscal e requisitos de compliance.",
  },
];

export function Comparativo() {
  return (
    <section className="section-y bg-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-14">
          <div className="lg:col-span-7">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary mb-3">
              Como entregamos
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-navy text-balance leading-[1.1]">
              Transformamos <span className="text-primary">dor de cabeça</span> em processo previsível.
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-md">
              Contratar obras corporativas costuma envolver planilhas trocadas por e-mail, fornecedores sem histórico e cronogramas escorregadios. Aqui isso vira protocolo.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 rounded-2xl overflow-hidden border border-border shadow-card">
          {/* SEM PORTAL */}
          <div className="bg-card p-8 sm:p-10 lg:p-12">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-destructive/80 mb-3">
              Sem Portal
            </span>
            <h3 className="font-display text-2xl font-bold text-navy mb-10">Problemas comuns</h3>
            <ul className="space-y-8">
              {semPortal.map((item, i) => (
                <li
                  key={item.title}
                  className={`flex gap-4 ${i < semPortal.length - 1 ? "pb-8 border-b border-border" : ""}`}
                >
                  <span className="shrink-0 h-10 w-10 grid place-items-center rounded-full bg-destructive/10 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                  </span>
                  <div className="pt-1">
                    <h4 className="font-semibold text-navy mb-1.5">{item.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* COM PORTAL */}
          <div className="bg-navy text-white p-8 sm:p-10 lg:p-12 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-25 pointer-events-none"
              style={{ backgroundImage: "var(--gradient-mesh)" }}
            />
            <div className="relative">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary-300 mb-3">
                Com Portal
              </span>
              <h3 className="font-display text-2xl font-bold text-white mb-10">Nosso método</h3>
              <ul className="space-y-8">
                {comPortal.map((item, i) => (
                  <li
                    key={item.title}
                    className={`flex gap-4 ${i < comPortal.length - 1 ? "pb-8 border-b border-white/10" : ""}`}
                  >
                    <span className="shrink-0 h-10 w-10 grid place-items-center rounded-full bg-primary text-white">
                      <Check className="h-5 w-5" />
                    </span>
                    <div className="pt-1">
                      <h4 className="font-semibold text-white mb-1.5">{item.title}</h4>
                      <p className="text-sm text-white/70 leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
