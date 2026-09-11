import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CatalogProduct, ProductVariant } from "@/lib/mock/catalog";

const money = (cents: number) =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(
    cents / 100,
  );

export function ProductCard({
  product,
  stock,
  onAdd,
}: {
  product: CatalogProduct;
  stock: number;
  onAdd: (variant?: ProductVariant) => void;
}) {
  const variants =
    product.variants?.filter((item) => item.status === "activo") ?? [];
  return (
    <article className="flex min-h-44 flex-col rounded-xl border p-4 transition-colors hover:border-primary">
      <div className="mb-3 flex size-11 items-center justify-center rounded-lg bg-accent">
        <Package className="size-5 text-muted-foreground" />
      </div>

      <p className="text-sm font-medium">{product.name}</p>
      <p className="line-clamp-1 text-sm text-muted-foreground">
        {product.description}
      </p>

      <div className="mt-auto pt-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-medium text-sm">
            {money(product.basePrice)}
          </span>
          <span
            className={
              stock
                ? "text-sm text-muted-foreground"
                : "text-sm text-destructive"
            }
          >
            {stock ? `${stock} disponibles` : "Agotado"}
          </span>
        </div>

        {variants.length ? (
          <div className="flex flex-wrap gap-1.5">
            {variants.map((variant) => (
              <Button
                key={variant.id}
                variant="outline"
                size="sm"
                disabled={!stock}
                onClick={() => onAdd(variant)}
              >
                {variant.label}
              </Button>
            ))}
          </div>
        ) : (
          <Button disabled={!stock} onClick={() => onAdd()} className="w-full">
            Agregar
          </Button>
        )}
      </div>
    </article>
  );
}
