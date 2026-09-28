"use client";

import { AlertTriangle, Package, ShieldCheck, Wallet } from "lucide-react";
import type { InventorySnapshot } from "@/lib/mock/reportes";
import { inventoryStatus } from "@/lib/mock/inventory";
import { catalogProducts } from "@/lib/mock/catalog";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import { ReportSection, money } from "./shared";

export interface InventorySectionProps {
  inventory: InventorySnapshot;
}

export function InventorySection({ inventory }: InventorySectionProps) {
  const isHealthy = inventory.critical.length === 0;

  return (
    <ReportSection
      title="Inventario al momento"
      subtitle="Valorización y stock crítico"
    >
      {/* 3 Micro-KPIs superiores */}
      <div className="grid sm:grid-cols-2 gap-2.5 mb-5">
        {/* Valor de almacén */}
        <div className="flex flex-col gap-1 rounded-lg border border-border/60 bg-muted/30 p-3 px-4">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground justify-between">
            <span className="truncate">Valor total</span>
            <Wallet className="size-4" />
          </div>
          <span className="text-xl font-medium tabular-nums text-foreground truncate">
            {money(inventory.value)}
          </span>
          <span className="text-xs text-muted-foreground truncate">
            {inventory.items} valorizados
          </span>
        </div>

        {/* Alerta de stock */}
        <div className="flex flex-col gap-1 rounded-lg border border-border/60 bg-muted/30 p-3 px-4">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground justify-between">
            <span className="truncate">Stock bajo</span>
            <AlertTriangle className="size-4" />
          </div>
          <span className="text-xl font-medium tabular-nums">
            {inventory.outCount}
            <span className="text-sm ml-1">agotados</span>
          </span>
          <span className="text-xs text-muted-foreground truncate">
            {inventory.lowCount} por reponer
          </span>
        </div>
      </div>

      {/* Tabla de productos con stock crítico */}
      {isHealthy ? (
        <div className="flex flex-1 items-center justify-center my-auto w-full min-h-55">
          <EmptyState
            icon={ShieldCheck}
            title="Inventario saludable"
            description="Todos los productos cuentan con stock suficiente en este momento."
            className="py-6 my-auto"
          />
        </div>
      ) : (
        <div className="w-full min-w-0 max-w-full overflow-hidden">
          <div className="w-full min-w-0 max-w-full overflow-x-auto">
            <table className="w-full min-w-115 text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-accent/40 text-xs font-heading font-semibold uppercase text-muted-foreground">
                  <th className="px-4 py-3 text-nowrap">Producto</th>
                  <th className="px-4 py-3 text-nowrap">Stock / Mín</th>
                  <th className="px-4 py-3 text-nowrap text-right">Estado</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {inventory.critical.slice(0, 6).map((item) => {
                  const status = inventoryStatus(item);
                  const isOut = status === "agotado";
                  const pct =
                    item.minimumStock > 0
                      ? Math.min(
                          100,
                          Math.round(
                            (item.currentStock / item.minimumStock) * 100,
                          ),
                        )
                      : 0;

                  const catalogProduct = catalogProducts.find(
                    (p) =>
                      p.id === item.productId ||
                      p.name.toLowerCase() === item.productName.toLowerCase(),
                  );

                  return (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      {/* Producto: Imagen + Nombre + SKU */}
                      <td className="px-4 py-3 text-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/70 bg-accent text-muted-foreground">
                            {catalogProduct?.image ? (
                              <img
                                src={catalogProduct.image}
                                alt={item.productName}
                                className="size-full object-cover"
                              />
                            ) : (
                              <Package className="size-5 text-muted-foreground/70" />
                            )}
                          </div>

                          <div className="min-w-0 max-w-44 sm:max-w-xs">
                            <p
                              className="font-heading font-medium text-foreground truncate text-sm"
                              title={item.productName}
                            >
                              {item.productName}
                            </p>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <span className="font-mono">{item.sku}</span>
                              {item.brand && (
                                <>
                                  <span>·</span>
                                  <span className="truncate">{item.brand}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Stock: Cifras + Barra de nivel */}
                      <td className="px-4 py-3 text-nowrap">
                        <div className="flex flex-col gap-1 min-w-22">
                          <span className="text-xs font-medium tabular-nums text-foreground">
                            {item.currentStock}{" "}
                            <span className="font-normal text-muted-foreground">
                              / {item.minimumStock} und.
                            </span>
                          </span>
                          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-300",
                                isOut ? "bg-rose-500" : "bg-amber-500",
                              )}
                              style={{
                                width: `${Math.max(isOut ? 0 : 5, pct)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Estado: StatusBadge */}
                      <td className="px-4 py-3 text-nowrap text-right">
                        <div className="flex justify-end">
                          <StatusBadge status={status} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </ReportSection>
  );
}
