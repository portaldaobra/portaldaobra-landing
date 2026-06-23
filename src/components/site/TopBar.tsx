import { Link, useRouterState } from "@tanstack/react-router";
import { Store, HardHat } from "lucide-react";

const options = [
  { to: "/", label: "Sou Contratante", icon: Store },
  { to: "/prestadores", label: "Sou Fornecedor", icon: HardHat },
] as const;

export function TopBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="w-full bg-navy text-navy-foreground border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-end gap-2">
        {options.map((o) => {
          const Icon = o.icon;
          const active =
            o.to === "/prestadores"
              ? pathname.startsWith("/prestadores")
              : !pathname.startsWith("/prestadores");
          return (
            <Link
              key={o.to}
              to={o.to}
              aria-current={active ? "page" : undefined}
              className={`inline-flex items-center gap-2 px-5 h-[42px] rounded-full text-[15px] font-semibold transition-all ${
                active
                  ? "bg-primary text-primary-foreground shadow-md ring-1 ring-white/15"
                  : "text-white/75 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="h-[18px] w-[18px]" />
              {o.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
