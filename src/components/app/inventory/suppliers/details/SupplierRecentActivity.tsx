"use client";

import { useState } from "react";
import { ArrowDownToLine, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { catalogProducts } from "@/lib/mock/catalog";
import type { InventoryMovementRecord } from "@/lib/mock/inventory-movements";

const INITIAL_VISIBLE_COUNT = 3;

const formatDate = (isoStr: string) => {
  try {
    const date = new Date(isoStr);
    if (isNaN(date.getTime())) return isoStr;
    return new Intl.DateTimeFormat("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch {
    return isoStr;
  }
};

export function SupplierRecentActivity({
  movements,
}: {
  movements: InventoryMovementRecord[];
}) {
  const [expanded, setExpanded] = useState(false);
  const visibleMovements = expanded
    ? movements
    : movements.slice(0, INITIAL_VISIBLE_COUNT);
  const canToggle = movements.length > INITIAL_VISIBLE_COUNT;

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-medium">Entradas recientes</h2>
        <span className="rounded-lg bg-muted px-2.5 py-2 leading-none text-xs font-medium font-heading">
          {movements.length}{" "}
          {movements.length === 1 ? "registrada" : "registradas"}
        </span>
      </div>

      {movements.length === 0 ? (
        <EmptyState
          icon={History}
          title="Sin actividad reciente"
          description="Aún no hay entradas asociadas a este proveedor."
        />
      ) : (
        <div className="divide-y divide-border px-4">
          {visibleMovements.map((movement) => {
            const catalogProduct = catalogProducts.find(
              (p) =>
                p.id === movement.itemId || p.name === movement.productName,
            );

            return (
              <article
                key={movement.id}
                className="flex flex-col gap-4 py-4 transition-colors hover:bg-muted/20 sm:flex-row sm:items-center"
              >
                {/* Thumbnail / Icono de entrada */}
                <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/70 bg-muted/40 text-muted-foreground sm:size-22">
                  {catalogProduct?.image ? (
                    <img
                      src={catalogProduct.image}
                      alt={movement.productName}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                      <ArrowDownToLine className="size-5" />
                    </div>
                  )}
                </div>

                {/* Grilla de atributos ordenados */}
                <div className="grid flex-1 min-w-0 grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Producto</p>
                    <p
                      className="truncate text-sm font-semibold text-foreground"
                      title={movement.productName}
                    >
                      {movement.productName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Cantidad ingresada
                    </p>
                    <p className="text-sm font-semibold tabular-nums text-emerald-600">
                      +{movement.quantity} uds.
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Fecha de entrada
                    </p>
                    <p className="text-sm font-semibold tabular-nums text-foreground">
                      {formatDate(movement.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Comprobante / SKU
                    </p>
                    <p className="truncate font-sans text-sm font-medium text-muted-foreground">
                      {movement.documentRef ?? "Sin comprobante"} ·{" "}
                      {movement.sku}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Motivo</p>
                    <p className="truncate text-sm font-medium text-muted-foreground">
                      {movement.reason}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Responsable</p>
                    <p className="truncate text-sm font-medium text-muted-foreground">
                      {movement.responsible}
                    </p>
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
