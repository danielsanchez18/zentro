"use client";

import { useState } from "react";
import { Check, Clock, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { catalogProducts } from "@/lib/mock/catalog";
import { inventoryItems } from "@/lib/mock/inventory";
import type { PurchaseOrder } from "@/lib/mock/purchases";
import { formatPurchaseMoney } from "@/lib/mock/purchases";

const INITIAL_VISIBLE_COUNT = 3;

export function PurchaseProducts({ order }: { order: PurchaseOrder }) {
  const [expanded, setExpanded] = useState(false);

  const totalQuantity = order.lines.reduce(
    (acc, l) => acc + (Number(l.quantity) || 0),
    0,
  );

  const visibleLines = expanded
    ? order.lines
    : order.lines.slice(0, INITIAL_VISIBLE_COUNT);
  const canToggle = order.lines.length > INITIAL_VISIBLE_COUNT;

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-medium">Productos de la orden</h2>
        <span className="rounded-full bg-muted px-2.5 py-2 leading-none text-xs font-medium font-heading">
          {order.lines.length} productos · {totalQuantity} uds.
        </span>
      </div>

      {order.lines.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Sin productos en la orden"
          description="Esta orden de compra todavía no tiene productos registrados."
        />
      ) : (
        <div className="divide-y divide-border px-4">
          {visibleLines.map((line) => {
            const pending = Math.max(0, line.quantity - line.receivedQuantity);
            const isFullyReceived =
              line.quantity > 0 && line.receivedQuantity >= line.quantity;
            const isPartiallyReceived =
              line.receivedQuantity > 0 &&
              line.receivedQuantity < line.quantity;

            const inventoryItem = inventoryItems.find(
              (item) => item.id === line.inventoryItemId,
            );
            const catalogProduct = catalogProducts.find(
              (p) =>
                p.id === inventoryItem?.productId ||
                p.name.toLowerCase() === line.productName.toLowerCase(),
            );

            return (
              <article
                key={line.id}
                className="flex flex-col gap-4 py-4 transition-colors hover:bg-muted/20 sm:flex-row sm:items-center"
              >
                {/* Thumbnail / Imagen del producto */}
                <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/70 bg-muted/40 text-muted-foreground sm:size-22">
                  {catalogProduct?.image ? (
                    <img
                      src={catalogProduct.image}
                      alt={line.productName}
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
                      title={line.productName}
                    >
                      {line.productName}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Cantidad solicitada
                    </p>
                    <p className="text-sm font-semibold tabular-nums text-foreground">
                      {line.quantity} uds.
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Costo unitario
                    </p>
                    <p className="text-sm font-semibold tabular-nums text-foreground">
                      {formatPurchaseMoney(line.unitCost)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">SKU</p>
                    <p className="truncate font-sans text-sm font-medium text-muted-foreground">
                      {line.sku}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Recepción</p>
                    <p className="text-sm font-semibold tabular-nums text-foreground">
                      {line.receivedQuantity} recibidas{" "}
                      {pending > 0 ? (
                        <span className="text-muted-foreground font-normal">
                          · {pending} pend.
                        </span>
                      ) : (
                        ""
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Subtotal</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold tabular-nums text-foreground">
                        {formatPurchaseMoney(line.quantity * line.unitCost)}
                      </p>
                      {isFullyReceived ? (
                        <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-500">
                          <Check className="size-3" />
                          Completo
                        </span>
                      ) : isPartiallyReceived ? (
                        <span className="inline-flex items-center gap-0.5 rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[11px] font-semibold text-amber-500">
                          <Clock className="size-3" />
                          Parcial
                        </span>
                      ) : null}
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
