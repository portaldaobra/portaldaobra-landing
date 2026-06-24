import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/logo-portalobra.svg.asset.json";
import { TopBar } from "./TopBar";

const nav = [
  { label: "Como Funciona", to: "/como-funciona" },
  { label: "Soluções", to: "/solucoes" },
  { label: "Sobre Nós", to: "/sobre" },
  { label: "Blog", to: "/blog" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full">
      <TopBar />
      <div className="glass border-b border-border/60">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center group" aria-label="Portal da Obra">
            <img
              src={logoAsset.url}
              alt="Portal da Obra"
              className="h-7 sm:h-8 w-auto"
              width={354}
              height={36}
              decoding="async"
              fetchPriority="high"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <a href="https://web.portaldaobra.com.br/register" target="_blank" rel="noopener noreferrer">Criar Conta</a>
            </Button>
            <Button asChild size="sm" className="bg-gradient-to-r from-primary to-navy text-primary-foreground hover:opacity-95 shadow-elegant">
              <a href="https://web.portaldaobra.com.br/auth/login" target="_blank" rel="noopener noreferrer">Entrar</a>
            </Button>
          </div>

          <button
            className="lg:hidden p-2 rounded-md text-foreground"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden border-t border-border/60 bg-background/95 px-4 py-4 space-y-3">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="block text-sm font-medium text-foreground/80 hover:text-primary"
              >
                {n.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <a href="https://web.portaldaobra.com.br/auth/login" target="_blank" rel="noopener noreferrer">Entrar</a>
              </Button>
              <Button asChild size="sm" className="flex-1 bg-primary text-primary-foreground">
                <a href="https://web.portaldaobra.com.br/register" target="_blank" rel="noopener noreferrer">Criar Conta</a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
