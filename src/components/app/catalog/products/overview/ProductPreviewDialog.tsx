"use client";

import {
  Tag,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { CatalogProduct } from "@/lib/mock/catalog";
import { categoryName, subcategoryName } from "@/lib/mock/catalog";
import { StatusBadge } from "@/components/app/shared/StatusBadge";

interface ProductPreviewDialogProps {
  product: CatalogProduct | null;
  slug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(price);

/**
 * Preview de un producto del Catálogo.
 *
 * Diseño tipo dashboard:
 *  - Hero con ícono grande + nombre + descripción
 *  - Métricas clave (precio, variantes, categoría)
 *  - Lista de variantes si existen
 *  - Botón "Ver detalle completo"
 */
export const ProductPreviewDialog = ({
  product,
  slug,
  open,
  onOpenChange,
}: ProductPreviewDialogProps) => {
  const router = useRouter();
  if (!product) return null;

  const variantCount = product.variants?.length ?? 0;

  const goToDetail = () => {
    onOpenChange(false);
    router.push(`/app/${slug}/catalogo/producto/${product.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0">
        
        {/* ── Hero ──────────────────────────────────────────── */}
        <div className={cn("relative flex flex-col gap-3 p-5 pb-0")}>
          <div className="flex h-50 w-full shrink-0 items-center justify-center rounded-2xl bg-accent">
          </div>
          <div className="min-w-0 flex-1 mt-2">
            <DialogTitle className="text-lg font-medium leading-tight">{product.name}</DialogTitle>
            <DialogDescription className="mt-1 text-sm font-heading">
              {product.description ?? "Sin descripción"}
            </DialogDescription>
          </div>
        </div>

        {/* ── Categoría + Variantes ─────────────────────────── */}
        <div className="p-5 pt-4 space-y-4">
          {/* Categoría */}
          <div className="flex items-center gap-2 text-sm">
            <Tag className="size-4 text-muted-foreground" />
            <div className="inline-flex items-center gap-x-1 font-heading font-medium ">
              {categoryName(product.categoryId)}
              {product.subcategoryId && (
                <>
                  <ChevronRight className="size-4 text-muted-foreground"  />
                  <span className="text-muted-foreground">
                    {subcategoryName(product.subcategoryId)}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* ── Precio y estado ──────────────────────────────────────── */}
          <div className="flex items-center gap-x-2">
            <p className="font-heading text-xl font-medium">{formatPrice(product.basePrice)}</p>
            <StatusBadge status={product.status} />
          </div>

          {/* Variantes */}
          {variantCount > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Variantes ({product.variants?.length})</p>
              <div className="flex flex-wrap gap-1.5">
                {product.variants!.map((v) => (
                  <div
                    key={v.id}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full font-heading border border-border bg-muted",
                      "px-2.5 py-1.75 text-xs leading-none",
                    )}
                  >
                    {v.label} -
                    {v.priceOverride && (
                      <p className="text-muted-foreground">
                        {formatPrice(v.priceOverride)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ────────────────────────────────────────── */}
        {/* <div className="flex items-center justify-between border-t border-border bg-muted/30 px-5 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="rounded-full text-muted-foreground"
          >
            Cerrar
          </Button>
          <Button
            size="sm"
            onClick={goToDetail}
            className="rounded-full gap-1.5"
          >
            Ver detalle
          </Button>
        </div> */}

        <DialogFooter className="gap-x-1 sm:justify-between pt-3 pb-8 px-8">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="px-3 rounded-full"
          >
            Cerrar
          </Button>
          <Button onClick={goToDetail} className="px-3 rounded-full">
            Ver detalle completo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
