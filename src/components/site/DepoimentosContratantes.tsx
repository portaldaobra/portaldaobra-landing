import { Quote } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { TestimonialRow } from "@/lib/cms";

const COBALT = "var(--primary)";
const NAVY = "var(--navy)";

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");
}

export function DepoimentosContratantes() {
  const { data: depoimentos } = useQuery({
    queryKey: ["testimonials", "contractor"],
    queryFn: async (): Promise<TestimonialRow[]> => {
      try {
        return await apiGet<TestimonialRow[]>("/landing/testimonials", {
          audience: "contractor",
        });
      } catch {
        return [];
      }
    },
  });

  if (!depoimentos?.length) return null;

  return (
    <section className="section-y bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 mb-14 items-end">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary mb-3">
              Depoimentos
            </span>
            <h2
              className="font-display text-3xl sm:text-4xl lg:text-[2.5rem] font-bold leading-[1.1] text-balance"
              style={{ color: NAVY }}
            >
              O que os <span style={{ color: COBALT }}>contratantes</span> estão dizendo.
            </h2>
          </div>
          <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
            Gestores de expansão, facilities, engenharia, suprimentos e operações compartilham
            como o Portal da Obra transformou seus processos de contratação.
          </p>
        </div>

        <div className="grid gap-5 sm:gap-6 grid-cols-1 md:grid-cols-2">
          {depoimentos.map((d) => (
            <article
              key={d.id}
              className="group bg-card rounded-2xl border border-border shadow-card p-7 sm:p-8 hover:shadow-elegant hover:-translate-y-1 transition-all duration-300"
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = COBALT)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
            >
              <Quote className="h-7 w-7 mb-5" style={{ color: COBALT }} strokeWidth={2.5} />
              <p className="text-[15px] leading-relaxed mb-7" style={{ color: NAVY }}>
                {d.quote}
              </p>

              <div className="pt-6 border-t border-border flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  {d.avatar_url ? (
                    <img
                      src={d.avatar_url}
                      alt={d.name}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                  ) : (
                    <span
                      className="grid place-items-center h-11 w-11 rounded-full text-white text-xs font-bold tracking-wide"
                      style={{ backgroundColor: COBALT }}
                    >
                      {initialsOf(d.name)}
                    </span>
                  )}
                  <div>
                    <div className="font-semibold text-sm" style={{ color: NAVY }}>
                      {d.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {[d.role, d.company].filter(Boolean).join(" · ")}
                    </div>
                  </div>
                </div>
                {d.indicator && (
                  <div
                    className="text-[11px] font-bold uppercase tracking-[0.12em] text-right"
                    style={{ color: COBALT }}
                  >
                    {d.indicator}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
