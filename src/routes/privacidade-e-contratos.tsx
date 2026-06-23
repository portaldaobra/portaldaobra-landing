import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ShieldCheck, ChevronDown } from "lucide-react";

const COBALT = "var(--primary)";
const NAVY = "var(--navy)";

export const Route = createFileRoute("/privacidade-e-contratos")({
  head: () => ({
    meta: [
      { title: "Privacidade e Contratos — Portal da Obra" },
      {
        name: "description",
        content:
          "Nossas regras, políticas e compromissos com segurança, transparência e compliance no Portal da Obra.",
      },
      { property: "og:title", content: "Privacidade e Contratos — Portal da Obra" },
      {
        property: "og:description",
        content:
          "Documentos, políticas e compromissos do Portal da Obra: privacidade, contratos, compliance e relacionamento com fornecedores.",
      },
      { property: "og:url", content: "/privacidade-e-contratos" },
    ],
    links: [{ rel: "canonical", href: "/privacidade-e-contratos" }],
  }),
  component: PrivacidadeContratos,
});

type Section = {
  id: string;
  title: string;
  intro: string;
  blocks: { heading: string; body: string }[];
  updatedAt: string;
};

const intro: Section = {
  id: "introducao",
  title: "Privacidade e Contratos",
  intro:
    "No Portal da Obra, estamos comprometidos com a proteção de dados, a transparência nas relações comerciais e a segurança dos processos de contratação de obras corporativas.",
  blocks: [
    {
      heading: "Sobre esta página",
      body: "Esta página reúne nossos principais documentos, políticas e compromissos relacionados à privacidade, contratos, compliance, uso da plataforma e relacionamento entre contratantes e fornecedores. Navegue pelo menu lateral para acessar cada conteúdo.",
    },
  ],
  updatedAt: "13/06/2026",
};

const sections: Section[] = [
  {
    id: "aviso-de-privacidade",
    title: "Aviso de Privacidade",
    intro:
      "Este aviso explica como o Portal da Obra coleta, utiliza, armazena e protege os dados pessoais de contratantes, fornecedores e visitantes da plataforma.",
    blocks: [
      {
        heading: "Dados coletados",
        body: "Coletamos dados cadastrais, de contato, dados profissionais e informações relacionadas às obras e oportunidades publicadas, sempre com finalidade definida e base legal apropriada.",
      },
      {
        heading: "Finalidade do tratamento",
        body: "Os dados são utilizados para viabilizar o cadastro, a qualificação, a participação em BIDs, a contratação de obras e o cumprimento de obrigações legais e contratuais.",
      },
      {
        heading: "Compartilhamento",
        body: "Compartilhamos dados apenas quando necessário para a execução dos serviços, por exigência legal ou mediante autorização do titular.",
      },
      {
        heading: "Direitos do titular",
        body: "Você pode solicitar a confirmação, o acesso, a correção, a portabilidade e a eliminação de seus dados, nos termos da LGPD.",
      },
    ],
    updatedAt: "13/06/2026",
  },
  {
    id: "politica-de-protecao-de-dados",
    title: "Política de Proteção de Dados",
    intro:
      "Define os princípios e práticas adotados pelo Portal da Obra para garantir o tratamento adequado e seguro de dados pessoais.",
    blocks: [
      {
        heading: "Princípios",
        body: "Adotamos os princípios de finalidade, adequação, necessidade, transparência, segurança e prestação de contas em todas as atividades de tratamento de dados.",
      },
      {
        heading: "Medidas de segurança",
        body: "Aplicamos controles técnicos e administrativos para proteger os dados contra acessos não autorizados, perda, alteração ou divulgação indevida.",
      },
      {
        heading: "Retenção e descarte",
        body: "Os dados são mantidos pelo período necessário ao cumprimento das finalidades para as quais foram coletados, observadas obrigações legais e regulatórias.",
      },
    ],
    updatedAt: "13/06/2026",
  },
  {
    id: "termos-e-condicoes-de-uso",
    title: "Termos e Condições de Uso",
    intro:
      "Regulam o uso da plataforma Portal da Obra por contratantes, fornecedores e demais usuários.",
    blocks: [
      {
        heading: "Aceitação",
        body: "Ao utilizar a plataforma, o usuário declara estar de acordo com estes termos e com as demais políticas aplicáveis.",
      },
      {
        heading: "Obrigações do usuário",
        body: "O usuário compromete-se a fornecer informações verdadeiras, a manter seu cadastro atualizado e a utilizar a plataforma de forma ética e em conformidade com a legislação.",
      },
      {
        heading: "Limitação de responsabilidade",
        body: "O Portal da Obra atua como plataforma de conexão entre contratantes e fornecedores, não sendo parte das relações contratuais firmadas entre eles.",
      },
    ],
    updatedAt: "13/06/2026",
  },
  {
    id: "codigo-de-etica",
    title: "Código de Ética",
    intro:
      "Estabelece os valores, princípios e padrões de conduta esperados de todos os participantes do ecossistema Portal da Obra.",
    blocks: [
      {
        heading: "Integridade",
        body: "Agimos com honestidade, transparência e respeito em todas as interações comerciais e institucionais.",
      },
      {
        heading: "Conflito de interesses",
        body: "Identificamos e tratamos eventuais conflitos de interesses de forma transparente, priorizando a confiança das partes envolvidas.",
      },
      {
        heading: "Canal de denúncias",
        body: "Disponibilizamos canais para reporte de condutas inadequadas, garantindo confidencialidade e não retaliação.",
      },
    ],
    updatedAt: "13/06/2026",
  },
  {
    id: "seguranca-da-informacao",
    title: "Segurança da Informação",
    intro:
      "Descreve as práticas adotadas para garantir a confidencialidade, integridade e disponibilidade das informações tratadas pelo Portal da Obra.",
    blocks: [
      {
        heading: "Controle de acesso",
        body: "Acessos a sistemas e dados são concedidos com base no princípio do menor privilégio e revisados periodicamente.",
      },
      {
        heading: "Monitoramento",
        body: "Adotamos mecanismos de monitoramento e registro de eventos para detectar e responder a incidentes de forma tempestiva.",
      },
      {
        heading: "Continuidade",
        body: "Mantemos rotinas de backup e planos de continuidade para preservar a disponibilidade dos serviços.",
      },
    ],
    updatedAt: "13/06/2026",
  },
  {
    id: "regras-de-contratacao",
    title: "Regras de Contratação",
    intro:
      "Apresenta as diretrizes que orientam o processo de contratação de obras por meio do Portal da Obra.",
    blocks: [
      {
        heading: "Qualificação",
        body: "Fornecedores passam por processos de qualificação documental e técnica antes de serem habilitados a participar de oportunidades.",
      },
      {
        heading: "Processo de seleção",
        body: "A seleção é conduzida de forma estruturada, com comparação objetiva de propostas e critérios previamente definidos pelo contratante.",
      },
      {
        heading: "Formalização",
        body: "A contratação é formalizada diretamente entre contratante e fornecedor, com suporte da plataforma na organização documental.",
      },
    ],
    updatedAt: "13/06/2026",
  },
  {
    id: "regras-de-bids",
    title: "Regras de BIDs",
    intro:
      "Define como funcionam os BIDs (oportunidades de contratação) publicados no Portal da Obra.",
    blocks: [
      {
        heading: "Publicação",
        body: "Cada BID é publicado com informações claras sobre escopo, prazos, localização e demais condições relevantes.",
      },
      {
        heading: "Participação",
        body: "Fornecedores qualificados podem manifestar interesse e apresentar propostas dentro do prazo estabelecido.",
      },
      {
        heading: "Avaliação",
        body: "As propostas são avaliadas pelo contratante com base em critérios técnicos, comerciais e de aderência ao escopo.",
      },
      {
        heading: "Encerramento",
        body: "Ao final do processo, o contratante seleciona a proposta vencedora e formaliza a contratação.",
      },
    ],
    updatedAt: "13/06/2026",
  },
  {
    id: "politica-de-fornecedores",
    title: "Política de Fornecedores",
    intro:
      "Estabelece as regras de relacionamento entre o Portal da Obra e os fornecedores cadastrados na plataforma.",
    blocks: [
      {
        heading: "Cadastro e qualificação",
        body: "O fornecedor deve manter dados cadastrais, documentos e certidões atualizados para permanecer ativo na rede qualificada.",
      },
      {
        heading: "Conduta",
        body: "Espera-se conduta ética, pontualidade no cumprimento de prazos e respeito às boas práticas do setor da construção.",
      },
      {
        heading: "Avaliação contínua",
        body: "Fornecedores são avaliados de forma contínua quanto à qualidade técnica, prazos e relacionamento com os contratantes.",
      },
    ],
    updatedAt: "13/06/2026",
  },
];

const groups: { title: string; items: { id: string; label: string }[] }[] = [
  {
    title: "Privacidade e Termos",
    items: [
      { id: "aviso-de-privacidade", label: "Aviso de Privacidade" },
      { id: "politica-de-protecao-de-dados", label: "Política de Proteção de Dados" },
      { id: "termos-e-condicoes-de-uso", label: "Termos e Condições de Uso" },
    ],
  },
  {
    title: "Compliance",
    items: [
      { id: "codigo-de-etica", label: "Código de Ética" },
      { id: "seguranca-da-informacao", label: "Segurança da Informação" },
    ],
  },
  {
    title: "Operações",
    items: [
      { id: "regras-de-contratacao", label: "Regras de Contratação" },
      { id: "regras-de-bids", label: "Regras de BIDs" },
      { id: "politica-de-fornecedores", label: "Política de Fornecedores" },
    ],
  },
];

function PrivacidadeContratos() {
  const [activeId, setActiveId] = useState<string>(intro.id);
  const [mobileOpen, setMobileOpen] = useState(false);

  const current =
    activeId === intro.id ? intro : sections.find((s) => s.id === activeId) ?? intro;

  const activeLabel =
    activeId === intro.id
      ? "Visão Geral"
      : groups.flatMap((g) => g.items).find((i) => i.id === activeId)?.label ??
        "Visão Geral";

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden bg-secondary">
        <div
          className="absolute inset-0 -z-10"
          style={{ backgroundImage: "var(--gradient-mesh)" }}
        />
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-success/10 blur-3xl" />

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold uppercase tracking-[0.18em] mb-6 ring-1 ring-primary/20">
            <ShieldCheck className="h-3.5 w-3.5" />
            Institucional
          </div>
          <h1
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-balance"
            style={{ color: NAVY }}
          >
            Privacidade e <span style={{ color: COBALT }}>Contratos</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Nossas regras, políticas e compromissos com segurança, transparência e
            compliance.
          </p>
        </div>
      </section>

      {/* CONTEÚDO */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12">
            {/* Sidebar */}
            <aside className="lg:col-span-4 xl:col-span-3">
              {/* Mobile dropdown */}
              <div className="lg:hidden mb-4">
                <button
                  type="button"
                  onClick={() => setMobileOpen((v) => !v)}
                  className="w-full flex items-center justify-between bg-card border border-border rounded-2xl px-5 py-4 text-left shadow-card"
                >
                  <span className="text-sm font-semibold" style={{ color: NAVY }}>
                    {activeLabel}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${mobileOpen ? "rotate-180" : ""}`}
                    style={{ color: COBALT }}
                  />
                </button>
              </div>

              <nav
                className={`bg-card border border-border rounded-2xl p-6 shadow-card lg:sticky lg:top-24 ${mobileOpen ? "block" : "hidden lg:block"}`}
                aria-label="Privacidade e Contratos"
              >
                <h2
                  className="font-display text-lg font-bold mb-5"
                  style={{ color: NAVY }}
                >
                  Privacidade e Contratos
                </h2>

                <button
                  type="button"
                  onClick={() => {
                    setActiveId(intro.id);
                    setMobileOpen(false);
                  }}
                  className="block w-full text-left text-sm py-2 px-3 mb-3 rounded-lg font-semibold cursor-pointer transition-all duration-200 hover:bg-[rgba(26,66,175,0.07)] hover:text-[#1A42AF]"
                  style={{
                    color: activeId === intro.id ? "#1A42AF" : NAVY,
                    backgroundColor: activeId === intro.id ? "rgba(26,66,175,0.08)" : "transparent",
                  }}
                >
                  Visão Geral
                </button>

                <div className="space-y-6">
                  {groups.map((group) => (
                    <div key={group.title}>
                      <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground mb-3">
                        {group.title}
                      </h3>
                      <ul className="space-y-1">
                        {group.items.map((item) => {
                          const active = activeId === item.id;
                          return (
                            <li key={item.id} className="relative">
                              <span
                                aria-hidden
                                className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full transition-all duration-200"
                                style={{
                                  backgroundColor: active ? "#1A42AF" : "transparent",
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveId(item.id);
                                  setMobileOpen(false);
                                }}
                                className="group/item w-full text-left text-sm py-2 pl-4 pr-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-[rgba(26,66,175,0.07)] hover:text-[#1A42AF]"
                                style={{
                                  color: active ? "#1A42AF" : "hsl(var(--foreground))",
                                  backgroundColor: active ? "rgba(26,66,175,0.08)" : "transparent",
                                  fontWeight: active ? 600 : 500,
                                }}
                                onMouseEnter={(e) => {
                                  const indicator = e.currentTarget.previousElementSibling as HTMLElement;
                                  if (indicator && !active) indicator.style.backgroundColor = "rgba(26,66,175,0.5)";
                                }}
                                onMouseLeave={(e) => {
                                  const indicator = e.currentTarget.previousElementSibling as HTMLElement;
                                  if (indicator && !active) indicator.style.backgroundColor = "transparent";
                                }}
                              >
                                {item.label}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              </nav>
            </aside>

            {/* Content */}
            <article className="lg:col-span-8 xl:col-span-9">
              <div className="max-w-3xl">
                <h2
                  className="font-display text-3xl sm:text-4xl font-bold leading-tight tracking-tight"
                  style={{ color: NAVY }}
                >
                  {current.title}
                </h2>

                <p className="mt-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Última atualização: {current.updatedAt}
                </p>

                <p className="mt-6 text-base sm:text-lg leading-relaxed text-foreground/80">
                  {current.intro}
                </p>

                <div className="mt-10 space-y-10">
                  {current.blocks.map((block) => (
                    <div key={block.heading}>
                      <h3
                        className="font-display text-xl font-bold mb-3"
                        style={{ color: NAVY }}
                      >
                        {block.heading}
                      </h3>
                      <p className="text-base leading-relaxed text-muted-foreground">
                        {block.body}
                      </p>
                      <div className="mt-8 h-px bg-border/70" />
                    </div>
                  ))}
                </div>

                <div className="mt-10 rounded-2xl border border-border bg-secondary/40 px-6 py-5">
                  <p className="text-sm text-muted-foreground">
                    Este conteúdo poderá ser atualizado periodicamente. Recomendamos
                    consultar esta página com regularidade para acompanhar eventuais
                    revisões.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
