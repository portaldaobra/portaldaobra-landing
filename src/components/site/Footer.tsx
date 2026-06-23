import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Facebook, Instagram, Linkedin, Twitter, Youtube, MessageCircle, Music2, Globe } from "lucide-react";
import logoAsset from "@/assets/logo-portalobra.svg.asset.json";
import { apiGet } from "@/lib/api";
import type { SocialRow } from "@/lib/cms";

const columns = [
  {
    title: "Links Úteis",
    links: [
      { label: "Dúvidas Frequentes", to: "/duvidas-frequentes" },
      { label: "Privacidade e Contratos", to: "/privacidade-e-contratos" },
    ],
  },
  {
    title: "Institucional",
    links: [
      { label: "Home", to: "/" },
      { label: "Sobre Nós", to: "/sobre" },
      { label: "Como Funciona", to: "/como-funciona" },
      { label: "Bids Disponíveis", to: "/bids" },
      { label: "Obras Realizadas", to: "/obras-realizadas" },
      { label: "Fique por Dentro", to: "/blog" },
    ],
  },
  {
    title: "Área do Cliente",
    links: [
      { label: "Portal de Acesso", to: "https://web.portaldaobra.com.br/auth/login" },
      { label: "Criar Conta", to: "https://web.portaldaobra.com.br/register" },
    ],
  },
  {
    title: "Contato",
    links: [{ label: "Fale Conosco", to: "/#contato" }],
  },
];

const ICONS: Record<string, { Icon: React.ElementType; label: string }> = {
  facebook: { Icon: Facebook, label: "Facebook" },
  instagram: { Icon: Instagram, label: "Instagram" },
  linkedin: { Icon: Linkedin, label: "LinkedIn" },
  twitter: { Icon: Twitter, label: "X (Twitter)" },
  x: { Icon: Twitter, label: "X (Twitter)" },
  youtube: { Icon: Youtube, label: "YouTube" },
  tiktok: { Icon: Music2, label: "TikTok" },
  whatsapp: { Icon: MessageCircle, label: "WhatsApp" },
};

function normalizeUrl(u: string | null | undefined): string | null {
  if (!u) return null;
  let s = u.trim();
  if (!s || s === "#") return null;
  // Prepend https:// when scheme is missing (e.g. "www.facebook.com/...", "instagram.com/foo")
  if (!/^https?:\/\//i.test(s)) {
    if (s.startsWith("//")) s = "https:" + s;
    else s = "https://" + s.replace(/^\/+/, "");
  }
  try {
    const parsed = new URL(s);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    if (!parsed.hostname.includes(".")) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

export function Footer() {
  const { data: socials = [] } = useQuery({
    queryKey: ["social_links"],
    queryFn: async (): Promise<{ platform: string; url: string }[]> => {
      try {
        const rows = await apiGet<SocialRow[]>("/landing/social-links");
        return rows
          .map((s) => ({ platform: s.platform, url: normalizeUrl(s.url) }))
          .filter((s): s is { platform: string; url: string } => !!s.url);
      } catch {
        return [];
      }
    },
  });

  return (
    <footer className="bg-navy text-navy-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid gap-12 lg:gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <img
              src={logoAsset.url}
              alt="Portal da Obra"
              className="h-8 w-auto mb-6 brightness-0 invert"
              width={354}
              height={36}
              loading="lazy"
              decoding="async"
            />
            <p className="text-sm text-navy-foreground/70 leading-relaxed max-w-sm">
              Conectamos empresas a fornecedores qualificados por meio de uma plataforma
              moderna, transparente e eficiente para a contratação de obras corporativas.
            </p>

            {socials.length > 0 && (
              <div className="mt-7 flex items-center gap-3 flex-wrap">
                {socials.map((s) => {
                  const meta = ICONS[s.platform.toLowerCase()] ?? {
                    Icon: Globe,
                    label: s.platform,
                  };
                  const { Icon, label } = meta;
                  return (
                    <a
                      key={s.platform}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      title={label}
                      className="grid h-9 w-9 place-items-center rounded-full ring-1 ring-white/15 text-navy-foreground/80 hover:text-primary-foreground hover:bg-primary hover:ring-primary transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <h4 className="font-semibold mb-4 text-xs uppercase tracking-[0.12em] text-navy-foreground/90">
                {col.title}
              </h4>
              <ul className="space-y-3 text-sm text-navy-foreground/70">
                {col.links.map((l) => {
                  const isInternal = l.to.startsWith("/") && !l.to.startsWith("/#");
                  const isExternal = /^https?:\/\//i.test(l.to);
                  return (
                    <li key={l.label}>
                      {isInternal ? (
                        <Link to={l.to} className="hover:text-primary transition-colors">
                          {l.label}
                        </Link>
                      ) : (
                        <a
                          href={l.to}
                          {...(isExternal
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                          className="hover:text-primary transition-colors"
                        >
                          {l.label}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-navy-foreground/60">
          <p>© 2026 Portal da Obra. Todos os direitos reservados.</p>
          <p className="text-navy-foreground/50">Plataforma B2B de obras corporativas</p>
        </div>
      </div>
    </footer>
  );
}
