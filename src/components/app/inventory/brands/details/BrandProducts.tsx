"use client";

import { useState } from "react";
import Image from "next/image";
import { Package } from "lucide-react";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { catalogProducts } from "@/lib/mock/catalog";
import type { InventoryItem } from "@/lib/mock/inventory";
import { availableStock, inventoryStatus } from "@/lib/mock/inventory";

const money = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

const INITIAL_VISIBLE_COUNT = 3;

export function BrandProducts({ items }: { items: InventoryItem[] }) {
  const [expanded, setExpanded] = useState(false);
  const visibleItems = expanded ? items : items.slice(0, INITIAL_VISIBLE_COUNT);
  const canToggle = items.length > INITIAL_VISIBLE_COUNT;

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-medium">Productos de la marca</h2>
        <span className="rounded-lg bg-muted px-2.5 py-2 leading-none text-xs font-medium font-heading">
          {items.length} {items.length === 1 ? "producto" : "productos"}
        </span>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Sin productos asociados"
          description="Esta marca todavía no se utiliza en productos del inventario."
        />
      ) : (
        <div className="divide-y divide-border px-4">
          {visibleItems.map((item) => {
            const catalogProduct = catalogProducts.find(
              (p) => p.id === item.productId,
            );

            return (
              <article
                key={item.id}
                className="flex flex-col gap-4 py-4 transition-colors hover:bg-muted/20 sm:flex-row sm:items-center"
              >
                {/* Thumbnail / Imagen del producto */}
                <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/70 bg-muted/40 text-muted-foreground sm:size-22">
                  {catalogProduct?.image ? (
                    <Image
                      src={catalogProduct.image}
                      alt={item.productName}
                      fill
                      sizes="88px"
                      className="size-full object-cover"
                    />
                  ) : (
                    <Package className="size-8 stroke-[1.5] text-muted-foreground/60" />
                  )}
                </div>

                {/* Grilla de atributos ordenados */}
                <div className="grid flex-1 min-w-0 grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Producto</p>
                    <p
                      className="truncate text-sm font-semibold text-foreground"
                      title={item.productName}
                    >
                      {item.productName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Stock disponible
                    </p>
                    <p className="text-sm font-semibold tabular-nums text-foreground">
                      {availableStock(item)} uds.
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Costo unitario
                    </p>
                    <p className="text-sm font-semibold tabular-nums text-foreground">
                      {money.format(item.unitCost)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      SKU / Proveedor
                    </p>
                    <p className="truncate font-sans text-sm font-medium text-muted-foreground">
                      {item.sku} · {item.supplier}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Stock reservado
                    </p>
                    <p className="text-sm font-semibold tabular-nums text-foreground">
                      {item.reservedStock} uds.
                    </p>
                  </div>
                  <div>
                    <div className="mt-0.5">
                      <StatusBadge status={inventoryStatus(item)} />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {canToggle && (
        <div className="flex justify-center p-4 bg-card border-t border-border">
          <Button
            type="button"
            variant="link"
            onClick={() => setExpanded((prev) => !prev)}
            className="h-fit p-0"
          >
            {expanded ? <>Ver menos</> : <>Ver más</>}
          </Button>
        </div>
      )}
    </section>
  );
}
