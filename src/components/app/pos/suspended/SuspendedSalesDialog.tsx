"use client";

import { Clock, Package, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { SuspendedSale } from "../shared/types";

const formatMoney = (value: number) =>
  new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(value);

function formatSaleTime(isoDate?: string) {
  if (!isoDate) return "";
  try {
    const d = new Date(isoDate);
    return d.toLocaleTimeString("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export function SuspendedSalesDialog({
  open,
  sales,
  onOpenChange,
  onResume,
  onDiscard,
}: {
  open: boolean;
  sales: SuspendedSale[];
  onOpenChange: (open: boolean) => void;
  onResume: (id: string) => void;
  onDiscard: (id: string) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg font-sans">
        <DialogHeader>
          <DialogTitle>Ventas suspendidas</DialogTitle>
          <DialogDescription>
            No reservan stock ni registran cobros.
          </DialogDescription>
        </DialogHeader>

        {sales.length ? (
          <div className="space-y-2.5 max-h-[60vh] overflow-y-auto">
            {sales.map((sale) => {
              const totalAmount = sale.lines.reduce(
                (sum, line) => sum + line.unitPrice * line.quantity,
                0,
              );
              const totalUnits = sale.lines.reduce(
                (sum, line) => sum + line.quantity,
                0,
              );
              const productsSummary = sale.lines
                .map((l) => `${l.quantity}× ${l.name}`)
                .join(", ");

              return (
                <article
                  key={sale.id}
                  className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3.5 transition-all hover:border-border/80 hover:bg-muted/15 font-heading"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <Clock className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium first-letter:capitalize text-foreground truncate font-heading">
                          {sale.name}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {totalUnits}{" "}
                          {totalUnits === 1 ? "unidad" : "unidades"}
                          {productsSummary ? ` (${productsSummary})` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-sm font-medium tabular-nums text-foreground">
                        {formatMoney(totalAmount)}
                      </p>
                      <p className="text-sm text-muted-foreground font-sans">
                        {formatSaleTime(sale.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-border/50 pt-2 mt-2">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Package className="size-4" />
                      <span className="text-sm">
                        {sale.lines.length}{" "}
                        {sale.lines.length === 1 ? "producto" : "productos"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 font-sans">
                      <Button
                        variant="outline"
                        className="text-destructive leading-none py-2"
                        onClick={() => onDiscard(sale.id)}
                      >
                        Descartar
                      </Button>
                      <Button
                        className="leading-none py-2"
                        onClick={() => onResume(sale.id)}
                      >
                        Recuperar
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border flex flex-col gap-2.5 items-center justify-center py-14 px-4 text-center">
            <div className="rounded-xl bg-muted p-3 flex items-center justify-center text-muted-foreground">
              <PackageSearch className="size-6" />
            </div>
            <div>
              <p className="font-medium text-base text-foreground">
                No hay ventas suspendidas
              </p>
              <p className="text-sm text-muted-foreground">
                Las ventas que pauses en el POS aparecerán aquí.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
