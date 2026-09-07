"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Package, Tag, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  catalogCategories,
  catalogProducts,
  type CatalogProduct,
} from "@/lib/mock/catalog";
import type { Promotion } from "@/lib/mock/promotions";
import { promotionBenefit } from "@/lib/mock/promotions";

const PAGE_SIZE = 6;

const money = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});

interface PromotionTargetsProps {
  promotion: Promotion;
  slug?: string;
}

export function PromotionTargets({ promotion, slug }: PromotionTargetsProps) {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const isProducts = promotion.scope === "productos";

  const totalItems = promotion.targetNames.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const visibleNames = promotion.targetNames.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE,
  );

  const getDiscountedPrice = (basePrice: number) => {
    if (promotion.type === "porcentaje") {
      const discount = basePrice * (promotion.value / 100);
      return Math.max(0, basePrice - discount);
    }
    if (promotion.type === "monto_fijo") {
      return Math.max(0, basePrice - promotion.value);
    }
    if (promotion.type === "precio_fijo") {
      return promotion.value;
    }
    return basePrice;
  };

  const getCategoryName = (categoryId: string) => {
    const found = catalogCategories.find((c) => c.id === categoryId);
    return found?.name ?? "General";
  };

  const handleOpenItem = (name: string) => {
    if (!slug) return;
    if (isProducts) {
      const product = catalogProducts.find(
        (p) => p.name.toLowerCase() === name.toLowerCase(),
      );
      if (product) router.push(`/app/${slug}/catalogo/producto/${product.id}`);
    } else {
      const category = catalogCategories.find(
        (c) => c.name.toLowerCase() === name.toLowerCase(),
      );
      if (category)
        router.push(`/app/${slug}/catalogo/categoria/${category.id}`);
    }
  };

  return (
    <section className="flex min-h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
      <header className="flex items-center justify-between gap-4 border-b border-border px-5 py-3">
        <div className="min-w-0">
          <h2 className="text-sm font-medium">
            {isProducts ? "Productos incluidos" : "Categorías incluidas"}
          </h2>
        </div>

        {totalPages > 1 && (
          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden text-xs text-muted-foreground sm:inline">
              {page + 1} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              disabled={page === 0}
              onClick={() => setPage((v) => v - 1)}
              aria-label="Anteriores"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              disabled={page === totalPages - 1}
              onClick={() => setPage((v) => v + 1)}
              aria-label="Siguientes"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        )}
      </header>

      <div className="flex-1 p-5">
        {totalItems === 0 ? (
          <div className="min-h-72 rounded-xl border border-dashed border-border">
            <EmptyState
              icon={isProducts ? Package : Tags}
              title={
                isProducts
                  ? "Sin productos incluidos"
                  : "Sin categorías incluidas"
              }
              description="Esta promoción todavía no tiene elementos específicos asignados."
            />
          </div>
        ) : isProducts ? (
          /* Cards de productos incluidos en grid (igual a ProductsRelated) */
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibleNames.map((name) => {
              const product = catalogProducts.find(
                (p) => p.name.toLowerCase() === name.toLowerCase(),
              );
              const basePrice = product?.basePrice ?? 25;
              const promoPrice = getDiscountedPrice(basePrice);
              const catName = product
                ? getCategoryName(product.categoryId)
                : "Menú";

              return (
                <div
                  key={name}
                  onClick={() => handleOpenItem(name)}
                  className="group cursor-pointer rounded-xl border border-border p-4 transition-all hover:border-primary flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Thumbnail / Icono + Badge de Beneficio */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-accent text-muted-foreground group-hover:text-foreground">
                        {product?.image ? (
                          <Image
                            src={product.image}
                            alt={name}
                            width={56}
                            height={56}
                            className="size-full object-cover"
                          />
                        ) : (
                          <Package className="size-6 text-muted-foreground group-hover:text-foreground" />
                        )}
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1.5 leading-none text-xs font-medium text-primary">
                        <Tag className="size-3" />
                        {promotionBenefit(promotion)}
                      </span>
                    </div>

                    <div className="mt-3 space-y-1">
                      <p className="truncate text-sm font-heading font-medium text-foreground group-hover:text-primary transition-colors">
                        {name}
                      </p>
                      <span className="block text-muted-foreground text-sm font-sans line-clamp-1">
                        {product?.description ?? catName}
                      </span>
                    </div>
                  </div>

                  {/* Precios: Regular tachado y Promocional */}
                  <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-3 text-sm">
                    <span className="text-sm text-muted-foreground font-heading">
                      {catName}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-muted-foreground line-through">
                        {money.format(basePrice)}
                      </span>
                      <span className="font-mono font-medium text-primary">
                        {money.format(promoPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Cards de categorías incluidas en grid */
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibleNames.map((name) => {
              const category = catalogCategories.find(
                (c) => c.name.toLowerCase() === name.toLowerCase(),
              );
              const associatedProducts: CatalogProduct[] = category
                ? catalogProducts.filter((p) => p.categoryId === category.id)
                : [];

              return (
                <div
                  key={name}
                  onClick={() => handleOpenItem(name)}
                  className="group cursor-pointer rounded-xl border border-border p-4 transition-all hover:border-primary flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Icono + Badge de Beneficio */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                        <Tags className="size-6" />
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-1.5 text-xs font-medium text-primary">
                        {promotionBenefit(promotion)}
                      </span>
                    </div>

                    <div className="mt-3 space-y-1">
                      <p className="truncate text-sm font-heading font-medium text-foreground group-hover:text-primary transition-colors">
                        {name}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {category?.description || "Categoría completa"}
                      </p>
                    </div>
                  </div>

                  {/* Detalle de productos afectados */}
                  <div className="mt-4 border-t border-border/70 pt-3 text-sm text-muted-foreground">
                    <p className="font-heading font-medium text-foreground">
                      {associatedProducts.length > 0
                        ? `${associatedProducts.length} ${
                            associatedProducts.length === 1
                              ? "producto afectado"
                              : "productos afectados"
                          }`
                        : "Todos los productos asociados"}
                    </p>
                    {associatedProducts.length > 0 && (
                      <p className="mt-0.5 truncate font-heading text-muted-foreground">
                        {associatedProducts.map((p) => p.name).join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
