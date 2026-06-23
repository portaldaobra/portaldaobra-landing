export type Bid = {
  slug: string;
  title: string;
  city: string;
  state: string;
  type: string;
  category: string;
  deadline: string;
  status: "Aberto" | "Encerrado";
  color: string;
  scope: string;
  requirements: string[];
};

export const bids: Bid[] = [
  {
    slug: "expansao-loja-varejo-sp",
    title: "Expansão de Loja de Varejo",
    city: "São Paulo",
    state: "SP",
    type: "Construção Comercial",
    category: "Construção Comercial",
    deadline: "10 dias",
    status: "Aberto",
    color: "from-primary/10 to-primary/5",
    scope:
      "Expansão de unidade de varejo com ampliação de área de vendas, depósito e estrutura de atendimento ao cliente. Inclui obras civis, instalações elétricas, hidráulicas, climatização e acabamentos.",
    requirements: [
      "Construtora com CNPJ ativo e atestados de capacidade técnica",
      "Experiência comprovada em obras de varejo",
      "Equipe técnica com engenheiro responsável",
      "Disponibilidade para início imediato",
    ],
  },
  {
    slug: "reforma-unidade-comercial-pr",
    title: "Reforma de Unidade Comercial",
    city: "Curitiba",
    state: "PR",
    type: "Reforma",
    category: "Reforma",
    deadline: "7 dias",
    status: "Aberto",
    color: "from-success/10 to-success/5",
    scope:
      "Reforma completa de unidade comercial existente, incluindo demolição parcial, novos revestimentos, atualização de instalações e modernização do layout interno.",
    requirements: [
      "Experiência prévia em reformas comerciais",
      "Capacidade de executar obra com unidade em operação parcial",
      "Cronograma detalhado de execução",
    ],
  },
  {
    slug: "retrofit-fachada-mg",
    title: "Retrofit de Fachada",
    city: "Belo Horizonte",
    state: "MG",
    type: "Retrofit",
    category: "Retrofit",
    deadline: "12 dias",
    status: "Aberto",
    color: "from-navy/10 to-navy/5",
    scope:
      "Modernização de fachada corporativa com novos materiais, iluminação arquitetônica e adequação à identidade visual da marca.",
    requirements: [
      "Experiência em retrofit de fachadas",
      "Equipamentos de acesso em altura (NR-35)",
      "Plano de segurança e mobilidade urbana",
    ],
  },
  {
    slug: "manutencao-predial-corporativa-sp",
    title: "Manutenção Predial Corporativa",
    city: "Campinas",
    state: "SP",
    type: "Manutenção",
    category: "Manutenção",
    deadline: "5 dias",
    status: "Aberto",
    color: "from-primary/10 to-primary/5",
    scope:
      "Contrato de manutenção predial preventiva e corretiva, abrangendo sistemas elétricos, hidráulicos, climatização e infraestrutura geral.",
    requirements: [
      "Equipe técnica multidisciplinar",
      "Atendimento em até 24h para chamados críticos",
      "Relatórios mensais de manutenção",
    ],
  },
  {
    slug: "nova-unidade-franqueada-rj",
    title: "Construção de Nova Unidade Franqueada",
    city: "Rio de Janeiro",
    state: "RJ",
    type: "Construção",
    category: "Construção",
    deadline: "15 dias",
    status: "Aberto",
    color: "from-success/10 to-success/5",
    scope:
      "Construção do zero de nova unidade franqueada conforme manual de implantação da marca, incluindo obra civil, instalações e acabamentos padronizados.",
    requirements: [
      "Experiência em obras padronizadas de franquias",
      "Cumprimento de manual de marca",
      "Prazo de entrega rigoroso",
    ],
  },
  {
    slug: "adequacao-layout-comercial-rs",
    title: "Adequação de Layout Comercial",
    city: "Porto Alegre",
    state: "RS",
    type: "Adequação",
    category: "Adequação",
    deadline: "8 dias",
    status: "Aberto",
    color: "from-navy/10 to-navy/5",
    scope:
      "Adequação de layout interno de unidade comercial com remanejamento de divisórias, reposicionamento de pontos elétricos e novo mobiliário corporativo.",
    requirements: [
      "Experiência em obras de adequação rápida",
      "Mínima interferência na operação",
      "Equipe especializada em divisórias e marcenaria",
    ],
  },
];

export const getBidBySlug = (slug: string) => bids.find((b) => b.slug === slug);
