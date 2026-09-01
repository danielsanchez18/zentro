import type { ProductVariant } from "@/lib/mock/catalog";
import { StatusBadge } from "@/components/app/shared/StatusBadge";

interface ProductVariantsProps {
  variants: ProductVariant[];
  formatPrice: (value: number) => string;
}

export function ProductVariants({ variants, formatPrice }: ProductVariantsProps) {
  if (variants.length === 0) return null;

  return (
    <div className="">
      {/* <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-heading font-medium">Variantes</h3>
        <p className="font-heading text-sm text-muted-foreground">{variants.length} disponibles</p>
      </div> */}
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-2 md:flex">
        {variants.map((variant) => (
          <button
            key={variant.id}
            className="md:w-60 flex items-center justify-between gap-3 rounded-lg border border-border bg-background/50 px-2 py-2 hover:bg-accent/20 cursor-pointer transition"
          >
            <div className="flex items-center gap-x-2">
              <div className="size-10 rounded-md bg-accent"></div>
              <div className="text-start">
                <div className="flex items-center gap-x-1">
                  <p className="truncate text-sm font-medium">{variant.label}</p> -
                  <p className="text-sm text-muted-foreground font-medium">
                    {variant.priceOverride
                      ? formatPrice(variant.priceOverride)
                      : "Usa el precio base"}
                  </p>
                </div>
              <p className="text-xs text-muted-foreground line-clamp-1 font-heading">Descripcion de la variante</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
