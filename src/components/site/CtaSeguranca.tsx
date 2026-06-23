
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const COBALT = "var(--primary)";
const NAVY = "var(--navy)";

export function CtaSeguranca() {
  return (
    <section className="section-y bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="relative rounded-3xl overflow-hidden p-10 sm:p-14 lg:p-20 shadow-elegant text-white"
          style={{
            background: `linear-gradient(135deg, ${NAVY} 0%, ${COBALT} 100%)`,
          }}
        >
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          {/* Glow accents */}
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />

          <div className="relative max-w-3xl mx-auto text-center">
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-white/70 mb-5">
              Sua próxima obra começa aqui
            </span>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-[1.1] text-balance">
              Pronto para contratar sua obra com{" "}
              <span style={{ color: "#7CA0FF" }}>segurança?</span>
            </h2>

            <p className="mt-6 text-lg text-white/80 leading-relaxed max-w-2xl mx-auto">
              Junte-se às empresas que já utilizam o Portal da Obra para contratar fornecedores
              qualificados, organizar propostas e conduzir obras com mais transparência, controle
              e eficiência.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full bg-white text-navy hover:bg-white/90 font-semibold tracking-wide px-7 shadow-elegant"
              >
                <a href="https://web.portaldaobra.com.br/register" target="_blank" rel="noopener noreferrer">
                  Abrir meu primeiro BID
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-full bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white font-semibold tracking-wide px-7"
              >
                <a href="#contato">Falar com especialista</a>
              </Button>
            </div>

            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/70">
              {["Rede qualificada", "Processo auditável", "Cobertura nacional"].map((b, i) => (
                <li key={b} className="flex items-center gap-6">
                  <span className="font-medium">{b}</span>
                  {i < 2 && <span className="hidden sm:inline h-1 w-1 rounded-full bg-white/30" />}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
