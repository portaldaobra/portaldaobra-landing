import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AudienceProvider } from "@/components/site/AudienceContext";
import { SeoInjector } from "@/components/site/SeoInjector";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Portal da Obra | Contratação de Obras Corporativas" },
      {
        name: "description",
        content:
          "Conectamos empresas a fornecedores qualificados para contratação de obras corporativas com mais transparência, segurança e eficiência.",
      },
      { name: "author", content: "Portal da Obra" },
      { name: "robots", content: "index, follow" },
      // API base URL for consent-store.js (PUT /api/v1/consent); heuristic in the
      // script handles localhost:8011 vs prod, but the meta provides an explicit override
      // for the prerendered HTML. The value is intentionally blank so the heuristic
      // kicks in — set a real URL here if the build-time env var is available.
      { name: "api-base", content: "" },
      { property: "og:site_name", content: "Portal da Obra" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:title", content: "Portal da Obra | Contratação de Obras Corporativas" },
      {
        property: "og:description",
        content:
          "Conectamos empresas a fornecedores qualificados para contratação de obras corporativas com mais transparência, segurança e eficiência.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Portal da Obra | Contratação de Obras Corporativas" },
      {
        name: "twitter:description",
        content:
          "Plataforma B2B para contratação de obras corporativas: curadoria, BIDs, equalização de propostas e gestão centralizada.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap",
      },
    ],
    scripts: [
      // Consent Mode v2: default-deny BEFORE any analytics tag fires.
      // Must be the first script in <head> (before GTM or any analytics).
      {
        children:
          "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied'});window.__gtmConsentInitialized=true;",
      },
      // GTM consent-gated loader (lazy-injects GTM only after analytics consent).
      { src: "/js/gtm-gate.js", defer: true },
      // Consent store + banner scripts (body-level; defer ensures DOM is ready).
      { src: "/js/consent-store.js", defer: true },
      { src: "/js/cookie-banner.js", defer: true },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Portal da Obra",
          url: "/",
          description:
            "Plataforma B2B que conecta empresas a fornecedores qualificados para contratação de obras corporativas no Brasil.",
          areaServed: "BR",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Portal da Obra",
          url: "/",
          inLanguage: "pt-BR",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        {/* LGPD cookie-banner mount point — cookie-banner.js attaches to this div */}
        <div id="cookie-banner" className="hidden fixed inset-x-0 bottom-0 z-50" />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AudienceProvider>
        <SeoInjector />
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </AudienceProvider>
    </QueryClientProvider>
  );
}
