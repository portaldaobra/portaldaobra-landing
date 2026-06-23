import aboutImg from "@/assets/about-portal.webp";
import { Users, Building, Globe, Laptop } from "lucide-react";

const stats = [
  { icon: Users, label: "fornecedores cadastrados", value: "+500" },
  { icon: Building, label: "obras intermediadas", value: "+100" },
  { icon: Globe, label: "cobertura", value: "Nacional" },
  { icon: Laptop, label: "processo", value: "100% digital" },
];

export function About() {
  return (
    <section className="section-y bg-secondary relative overflow-hidden">
      <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute -inset-3 bg-gradient-to-br from-primary/15 to-success/15 rounded-3xl blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl shadow-elegant ring-1 ring-white/40">
              <img
                src={aboutImg}
                alt="Equipe analisando projeto de obra corporativa em galpão industrial"
                title="Portal da Obra — contratação de obras corporativas"
                width={1280}
                height={960}
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-cover aspect-[4/3]"
              />
            </div>
          </div>

          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary mb-3">
              Sobre o Portal da Obra
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-navy leading-tight text-balance">
              Transformando a contratação de obras corporativas
            </h2>
            <div className="mt-5 space-y-4 text-muted-foreground leading-relaxed">
              <p>
                O Portal da Obra foi criado para simplificar a contratação de obras e serviços
                para empresas do varejo.
              </p>
              <p>
                Nossa plataforma conecta contratantes a uma rede qualificada de construtoras e
                fornecedores, promovendo concorrência saudável, redução de custos e maior
                previsibilidade na execução dos projetos.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              {stats.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="rounded-2xl bg-card p-5 border border-border hover:border-primary/30 hover:shadow-card transition-all"
                >
                  <Icon className="h-5 w-5 text-primary mb-2" />
                  <div className="font-display text-2xl font-bold text-navy">{value}</div>
                  <div className="text-xs text-muted-foreground capitalize">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
