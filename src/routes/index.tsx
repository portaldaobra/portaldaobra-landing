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
import {
  getBlogPosts,
  getBrands,
  getTestimonials,
  getSocialLinks,
  getObraTypes,
  getFormCategories,
  getFormLocations,
  getSiteSettings,
} from "@/lib/content";

export const Route = createFileRoute("/")({
  loader: async () => {
    return {
      blogPosts: getBlogPosts({ limit: 3, homeFeatured: true }),
      brands: getBrands(),
      testimonials: getTestimonials("contractor"),
      socialLinks: getSocialLinks(),
      obraTypes: getObraTypes(),
      formCategories: getFormCategories(),
      formLocations: getFormLocations(),
      siteSettings: getSiteSettings(),
    };
  },
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
  const loaderData = Route.useLoaderData();

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero
        initialObraTypes={loaderData.obraTypes}
        initialFormCategories={loaderData.formCategories}
        initialFormLocations={loaderData.formLocations}
      />
      <Clients initialBrands={loaderData.brands} />
      <Comparativo />
      <RedeQualificada />
      <PainelUnico />
      <Bids />
      <DepoimentosContratantes initialTestimonials={loaderData.testimonials} />
      <CtaSeguranca />
      <Blog limit={3} homeFeatured initialPosts={loaderData.blogPosts} />
      <Contact />
      <Footer initialSocials={loaderData.socialLinks} />
      <Toaster richColors position="top-right" />
    </main>
  );
}
