"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { toastMsg } from "@/components/ui/toast-message";
import { ProductCard } from "@/components/app/catalog/products/overview/ProductCard";
import type { CatalogProduct } from "@/lib/mock/catalog";

interface ProductsRelatedProps {
  /** Productos que pertenecen a la categoría actual. */
  products: CatalogProduct[];
  /** Slug del tenant usado para construir los enlaces de detalle. */
  slug: string;
}

const PAGE_SIZE = 6;

export function ProductsRelated({ products, slug }: ProductsRelatedProps) {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const visible = products.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const openProduct = (product: CatalogProduct) => {
    router.push(`/app/${slug}/catalogo/producto/${product.id}`);
  };

  return (
    <section className="flex min-h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
      <header className="flex items-center justify-between gap-4 border-b border-border px-5 py-3">
        <div className="min-w-0">
          <h2 className="text-sm font-medium">Productos relacionados</h2>
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
              onClick={() => setPage((value) => value - 1)}
              aria-label="Productos anteriores"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              disabled={page === totalPages - 1}
              onClick={() => setPage((value) => value + 1)}
              aria-label="Productos siguientes"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        )}
      </header>

      <div className="flex-1 p-5">
        {visible.length === 0 ? (
          <div className="min-h-72 rounded-xl border border-dashed border-border">
            <EmptyState
              icon={Package}
              title="Sin productos asociados"
              description="Los productos asignados a esta categoría aparecerán aquí."
            />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPreview={openProduct}
                onEdit={openProduct}
                onRequestToggleStatus={(selected) =>
                  toastMsg.info(
                    selected.status === "activo" ? "Desactivar producto" : "Activar producto",
                    "Esta acción se conectará al CRUD de productos.",
                  )
                }
                onRequestRemove={(selected) =>
                  toastMsg.info(
                    `Eliminar ${selected.name}`,
                    "Esta acción se conectará al CRUD de productos.",
                  )
                }
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
