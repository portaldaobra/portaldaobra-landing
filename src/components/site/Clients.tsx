import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { BrandRow } from "@/lib/cms";

const ROW_1 = ["renato cariani", "shoulder", "fazenda churrascada", "overmith", "interfit"];
const ROW_2 = ["selfit", "cinadis", "urbanize"];

function matchOrder(brands: BrandRow[], order: string[]): BrandRow[] {
  const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
  const result: BrandRow[] = [];
  for (const key of order) {
    const found = brands.find((b) => norm(b.name).includes(key));
    if (found && !result.includes(found)) result.push(found);
  }
  return result;
}

function BrandLogo({ brand }: { brand: BrandRow }) {
  if (!brand.logo_url) {
    return <span className="block h-10 w-32 bg-muted rounded" aria-label={brand.name} />;
  }
  return (
    <img
      src={brand.logo_url}
      alt={brand.name}
      className="block object-contain object-center h-full w-auto max-w-[180px] opacity-80 hover:opacity-100 transition-opacity"
    />
  );
}

function MarqueeRow({
  brands,
  direction,
  durationMs,
  className,
}: {
  brands: BrandRow[];
  direction: "left" | "right";
  durationMs: number;
  className?: string;
}) {
  if (!brands.length) return null;
  const items = [...brands, ...brands];
  return (
    <div className={`group relative overflow-hidden ${className ?? ""}`}>
      <div
        className="flex w-max items-center gap-20 md:gap-28 group-hover:[animation-play-state:paused] motion-reduce:!animate-none"
        style={{
          animation: `${direction === "left" ? "po-marquee-l" : "po-marquee-r"} ${durationMs}ms linear infinite`,
        }}
      >
        {items.map((b, i) => (
          <div
            key={`${b.id}-${i}`}
            title={b.name}
            className="shrink-0 flex items-center justify-center h-16 sm:h-20"
          >
            <BrandLogo brand={b} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function Clients({
  initialBrands,
}: {
  initialBrands?: BrandRow[];
} = {}) {
  const { data: brands = [] } = useQuery({
    queryKey: ["public", "brands"],
    queryFn: async (): Promise<BrandRow[]> => {
      try {
        return await apiGet<BrandRow[]>("/landing/brands");
      } catch {
        return [];
      }
    },
    initialData: initialBrands,
    enabled: !initialBrands || initialBrands.length === 0,
  });

  if (!brands.length) return null;

  const row1 = matchOrder(brands, ROW_1);
  const row2 = matchOrder(brands, ROW_2);
  const used = new Set([...row1, ...row2].map((b) => b.id));
  const remaining = brands.filter((b) => !used.has(b.id));
  const desktopRow1 = row1.length ? [...row1, ...remaining] : brands;
  const desktopRow2 = row2;
  const singleRow = [...desktopRow1, ...desktopRow2];

  return (
    <section className="section-y bg-background">
      <style>{`
        @keyframes po-marquee-l {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes po-marquee-r {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}</style>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="h2-section text-navy">Empresas que confiam no Portal da Obra</h2>
          <p className="mt-3 text-muted-foreground">
            Impulsionamos projetos de varejo, corporativo, logístico, industrial e demais operações
            que demandam obras e serviços especializados.
          </p>
        </div>

        {/* Desktop: two rows */}
        <div
          className="hidden lg:block space-y-8"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <MarqueeRow brands={desktopRow1} direction="left" durationMs={45000} />
          {desktopRow2.length > 0 && (
            <MarqueeRow brands={desktopRow2} direction="right" durationMs={38000} />
          )}
        </div>

        {/* Tablet/Mobile: single row */}
        <div
          className="lg:hidden"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <MarqueeRow
            brands={singleRow}
            direction="left"
            durationMs={60000}
            className="sm:hidden"
          />
          <MarqueeRow
            brands={singleRow}
            direction="left"
            durationMs={50000}
            className="hidden sm:block"
          />
        </div>
      </div>
    </section>
  );
}
