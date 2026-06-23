import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Clients } from "@/components/site/Clients";
import { Comparativo } from "@/components/site/Comparativo";

import { RedeQualificada } from "@/components/site/RedeQualificada";

import { Bids } from "@/components/site/Bids";
import { PainelUnico } from "@/components/site/PainelUnico";
import { CtaSeguranca } from "@/components/site/CtaSeguranca";
import { Blog } from "@/components/site/Blog";
import { Contact } from "@/components/site/Contact";
import { DepoimentosContratantes } from "@/components/site/DepoimentosContratantes";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Portal da Obra | Contratação de Obras Corporativas" },
      {
        name: "description",
        content:
          "Conectamos empresas a fornecedores qualificados para contratação de obras corporativas com mais transparência, segurança e eficiência.",
      },
      { property: "og:title", content: "Portal da Obra | Contratação de Obras Corporativas" },
      {
        property: "og:description",
        content:
          "Conectamos empresas a fornecedores qualificados para contratação de obras corporativas com mais transparência, segurança e eficiência.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Contratação de obras corporativas",
          provider: { "@type": "Organization", name: "Portal da Obra" },
          areaServed: "BR",
          serviceType:
            "Curadoria de fornecedores, BIDs, equalização de propostas e gestão de obras corporativas",
          description:
            "Plataforma B2B para contratação de obras corporativas: retrofit, expansão de lojas, obras industriais, escritórios e centros de distribuição.",
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Clients />
      <Comparativo />
      
      <RedeQualificada />
      <PainelUnico />
      <Bids />
      <DepoimentosContratantes />
      <CtaSeguranca />
      <Blog limit={3} homeFeatured />
      <Contact />
      <Footer />
      <Toaster richColors position="top-right" />
    </main>
  );
}
