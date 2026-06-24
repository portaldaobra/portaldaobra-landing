import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { fetchAboutNumeros, DEFAULT_ABOUT_NUMEROS } from "@/lib/about-numeros";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import aboutImg from "@/assets/about-portal.webp";
import {
  Users,
  Building,
  Globe,
  Laptop,
  Eye,
  Lock,
  Sparkles,
  Handshake,
  Zap,
} from "lucide-react";

const COBALT = "var(--primary)";
const NAVY = "var(--navy)";

export const aboutNumerosQuery = queryOptions({
  queryKey: ["about_numeros"],
  queryFn: fetchAboutNumeros,
  staleTime: 30_000,
});

export const Route = createFileRoute("/sobre")({
  loader: ({ context }) => context.queryClient.ensureQueryData(aboutNumerosQuery),
  head: () => ({
    meta: [
      { title: "Sobre o Portal da Obra" },
      {
        name: "description",
        content:
          "Conheça a missão do Portal da Obra e como estamos transformando a contratação de obras corporativas.",
      },
      { property: "og:title", content: "Sobre o Portal da Obra" },
      {
        property: "og:description",
        content:
          "Conheça a missão do Portal da Obra e como estamos transformando a contratação de obras corporativas.",
      },
      { property: "og:url", content: "/sobre" },
    ],
    links: [{ rel: "canonical", href: "/sobre" }],
  }),
  errorComponent: ({ error }) => <div className="p-8" role="alert">{error.message}</div>,
  notFoundComponent: () => <div className="p-8">Página não encontrada.</div>,
  component: Sobre,
});

const stats = [
  { icon: Users, label: "Fornecedores Cadastrados", value: "+500" },
  { icon: Building, label: "Obras Intermediadas", value: "+100" },
  { icon: Globe, label: "Cobertura", value: "Nacional" },
  { icon: Laptop, label: "Processo", value: "100% Digital" },
];



const valores = [
  {
    title: "Atitude de dono",
    desc: "Cuidamos do negócio, ninguém aqui é só passageiro.",
  },
  {
    title: "Entregamos resultados",
    desc: "Sem firula com entrega, foco total no que gera valor.",
  },
  {
    title: "Inconformismo",
    desc: "Sempre tem um jeito melhor, não aceitamos mediocridade.",
  },
  {
    title: "Inspiramos pelo exemplo",
    desc: "Buscamos ser nossa melhor versão todos os dias.",
  },
  {
    title: "Ética",
    desc: "Fazemos o que é certo, mesmo quando ninguém está vendo.",
  },
];

function Sobre() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden bg-secondary">
        <div className="absolute inset-0 -z-10" style={{ backgroundImage: "var(--gradient-mesh)" }} />
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-success/10 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span
                className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em]"
                style={{ color: COBALT }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: COBALT }} />
                Sobre o Portal da Obra
              </span>
              <h1
                className="mt-6 font-display text-4xl sm:text-5xl lg:text-[3.25rem] font-bold leading-[1.08] tracking-tight text-balance"
                style={{ color: NAVY }}
              >
                Nossa missão é{" "}
                <span style={{ color: COBALT }}>
                  colocar fim à bagunça
                </span>{" "}
                na contratação de obras corporativas no Brasil.
              </h1>
              <p className="mt-8 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
                Com{" "}
                <span className="font-semibold" style={{ color: NAVY }}>tecnologia</span>,{" "}
                <span className="font-semibold" style={{ color: NAVY }}>critério</span> e{" "}
                <span className="font-semibold" style={{ color: NAVY }}>transparência</span>, conectamos quem faz com quem precisa.
              </p>
            </div>

            <div className="relative lg:justify-self-end w-full max-w-[520px]">
              <div className="absolute -inset-3 bg-gradient-to-br from-primary/20 to-success/15 rounded-3xl blur-2xl" />
              <div className="relative overflow-hidden rounded-3xl shadow-elegant ring-1 ring-white/40">
                <img
                  src={aboutImg}
                  alt="Profissionais analisando projeto em galpão corporativo"
                  title="Portal da Obra — quem somos"
                  width={1280}
                  height={1600}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="w-full h-auto object-cover aspect-[4/5]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* POR QUE EXISTIMOS */}
      <section className="section-y-lg bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-l-2 pl-8 sm:pl-10" style={{ borderColor: COBALT }}>
            <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-primary mb-4">
              Por que existimos
            </span>
            <div className="grid gap-10 lg:gap-16 lg:grid-cols-2 items-start">
              <h2
                className="font-display text-3xl sm:text-4xl lg:text-[2.5rem] font-bold leading-[1.15] tracking-tight text-balance"
                style={{ color: NAVY }}
              >
                Nascemos para resolver um dos maiores desafios das empresas:{" "}
                <span style={{ color: COBALT }}>
                  contratar obras e serviços com segurança, transparência e previsibilidade.
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed lg:mt-2">
                O Portal da Obra conecta contratantes, construtoras e fornecedores qualificados
                através de um processo estruturado, reduzindo riscos, retrabalho e tempo de
                contratação.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* PORTAL DA OBRA EM NÚMEROS */}
      <section className="section-y bg-background relative overflow-hidden">
        <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary mb-3">
              Portal da Obra em Números
            </span>
            <h2
              className="font-display text-3xl sm:text-4xl lg:text-[2.5rem] font-bold leading-tight text-balance"
              style={{ color: NAVY }}
            >
              Indicadores que demonstram nossa{" "}
              <span style={{ color: COBALT }}>capacidade de conexão.</span>
            </h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Entre contratantes, fornecedores e obras corporativas em todo o Brasil.
            </p>
          </div>

          <NumerosGrid />
        </div>
      </section>



      {/* NOSSA VISÃO */}
      <section className="section-y bg-background">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div
            className="relative rounded-3xl overflow-hidden p-10 sm:p-14 lg:p-16 text-white shadow-elegant"
            style={{ backgroundColor: NAVY }}
          >
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{ backgroundImage: "var(--gradient-mesh)" }}
            />
            <div className="relative max-w-3xl">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary-300 mb-3">
                Nossa Visão
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.5rem] font-bold leading-[1.1] text-balance">
                Nossa visão para o futuro da{" "}
                <span style={{ color: "#7CA0FF" }}>construção corporativa.</span>
              </h2>
              <div className="mt-8 text-white/85 text-xl sm:text-2xl leading-relaxed font-light max-w-2xl">
                <p>
                  Ser o principal portal de orçamentos e fornecedores de obras corporativas no
                  Brasil, reconhecido por promover{" "}
                  <span className="font-semibold" style={{ color: "#7CA0FF" }}>segurança</span>,{" "}
                  <span className="font-semibold" style={{ color: "#7CA0FF" }}>inovação</span> e{" "}
                  <span className="font-semibold" style={{ color: "#7CA0FF" }}>compliance</span> em
                  cada etapa do processo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NOSSOS VALORES */}
      <section className="section-y bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary mb-3">
              Nossos Valores
            </span>
            <h2
              className="font-display text-3xl sm:text-4xl lg:text-[2.5rem] font-bold leading-[1.1] text-balance"
              style={{ color: NAVY }}
            >
              Princípios que guiam <span style={{ color: COBALT }}>cada decisão.</span>
            </h2>
          </div>

          <ol className="divide-y divide-border/70 border-t border-b border-border/70">
            {valores.map(({ title, desc }, i) => (
              <li
                key={title}
                className="group grid grid-cols-[auto_1fr] md:grid-cols-[auto_minmax(0,18rem)_1fr] items-baseline gap-x-6 md:gap-x-12 gap-y-2 py-7 md:py-9 px-4 -mx-4 rounded-xl transition-all duration-250 hover:bg-[rgba(26,66,175,0.07)]"
              >
                <span
                  className="font-display text-sm font-bold tabular-nums tracking-wider transition-all duration-250 group-hover:scale-110 group-hover:text-[color:var(--cobalt,#1A42AF)]"
                  style={{ color: COBALT }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3
                  className="font-display text-xl sm:text-2xl font-bold leading-tight transition-colors duration-250 group-hover:text-[#1A42AF]"
                  style={{ color: NAVY }}
                >
                  {title}
                </h3>
                <p className="col-start-2 md:col-start-3 text-base text-muted-foreground leading-relaxed max-w-2xl">
                  {desc}
                </p>
              </li>
            ))}
          </ol>

        </div>
      </section>

      <Footer />
    </main>
  );
}

function NumerosGrid() {
  const { data } = useSuspenseQuery(aboutNumerosQuery);
  const indicators = data?.indicators ?? DEFAULT_ABOUT_NUMEROS.indicators;
  const segments = (data?.segments ?? DEFAULT_ABOUT_NUMEROS.segments).filter((s) => s.active);
  const [i0, i1, i2, i3] = indicators;

  return (
    <div className="grid gap-5 lg:gap-6 lg:grid-cols-12">
      <div className="lg:col-span-7 grid gap-5 lg:gap-6 grid-cols-1 sm:grid-cols-2">
        <article className="rounded-2xl bg-card border border-border p-7 sm:p-8 shadow-card hover:shadow-elegant hover:-translate-y-1 transition-all duration-300">
          <div className="font-display text-5xl sm:text-6xl font-bold leading-none tracking-tight" style={{ color: COBALT }}>
            {i0.value}
          </div>
          <h3 className="mt-5 font-display text-base font-bold" style={{ color: NAVY }}>{i0.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{i0.description}</p>
        </article>

        <article className="rounded-2xl bg-card border border-border p-7 sm:p-8 shadow-card hover:shadow-elegant hover:-translate-y-1 transition-all duration-300">
          <div className="font-display text-5xl sm:text-6xl font-bold leading-none tracking-tight" style={{ color: COBALT }}>
            {i1.value}
          </div>
          <h3 className="mt-5 font-display text-base font-bold" style={{ color: NAVY }}>{i1.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{i1.description}</p>
        </article>

        <article
          className="sm:col-span-2 rounded-2xl border p-7 sm:p-9 shadow-card hover:shadow-elegant hover:-translate-y-1 transition-all duration-300"
          style={{ backgroundColor: "#EEF2FF", borderColor: "rgba(0,36,135,0.12)" }}
        >
          <div className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-none tracking-tight whitespace-nowrap" style={{ color: COBALT }}>
            {i2.value}
          </div>
          <h3 className="mt-4 font-display text-base font-bold" style={{ color: NAVY }}>{i2.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xl">{i2.description}</p>
        </article>
      </div>

      <aside
        className="lg:col-span-5 relative rounded-2xl p-8 sm:p-10 text-white shadow-elegant overflow-hidden flex flex-col"
        style={{ backgroundColor: NAVY }}
      >
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute inset-0 opacity-25 pointer-events-none" style={{ backgroundImage: "var(--gradient-mesh)" }} />
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

        <div className="relative flex-1">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.18em] text-white/70 mb-4">
            Portal da Obra
          </span>
          <div className="font-display text-6xl sm:text-7xl font-bold leading-none tracking-tight" style={{ color: "#7CA0FF" }}>
            {i3.value}
          </div>
          <h3 className="mt-5 font-display text-lg font-bold text-white">{i3.title}</h3>
          <p className="mt-2 text-sm text-white/75 leading-relaxed max-w-sm">{i3.description}</p>
        </div>

        {segments.length > 0 && (
          <div className="relative mt-8 pt-6 border-t border-white/15">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60 mb-3">
              Segmentos atendidos
            </span>
            <div className="flex flex-wrap gap-2">
              {segments.map((seg) => (
                <span
                  key={seg.label}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-white ring-1 ring-white/15 backdrop-blur-sm"
                >
                  {seg.label}
                </span>
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

