"use client";

import { useState } from "react";
import { PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import type { PurchaseReceipt } from "@/lib/mock/purchases";

const INITIAL_VISIBLE_COUNT = 3;

const formatDate = (isoStr: string) => {
  try {
    const date = new Date(isoStr);
    if (isNaN(date.getTime())) return isoStr;
    return new Intl.DateTimeFormat("es-PE", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return isoStr;
  }
};

export function PurchaseReceipts({
  receipts,
}: {
  receipts: PurchaseReceipt[];
}) {
  const [expanded, setExpanded] = useState(false);
  const visibleReceipts = expanded
    ? receipts
    : receipts.slice(0, INITIAL_VISIBLE_COUNT);
  const canToggle = receipts.length > INITIAL_VISIBLE_COUNT;

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-medium">Historial de recepciones</h2>
        <span className="rounded-lg bg-muted px-2.5 py-2 leading-none text-xs font-medium font-heading">
          {receipts.length} {receipts.length === 1 ? "entrega" : "entregas"}
        </span>
      </div>

      {receipts.length === 0 ? (
        <EmptyState
          icon={PackageCheck}
          title="Sin recepciones registradas"
          description="Las entregas confirmadas de mercadería aparecerán aquí."
        />
      ) : (
        <div className="divide-y divide-border px-4">
          {visibleReceipts.map((receipt) => {
            const totalUnits = receipt.lines.reduce(
              (sum, line) => sum + line.quantity,
              0,
            );

            return (
              <article
                key={receipt.id}
                className="flex flex-col gap-4 py-4 transition-colors hover:bg-muted/20 sm:flex-row sm:items-start"
              >
                {/* Thumbnail / Icono de recepción */}
                <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/70 bg-muted/40 text-muted-foreground sm:size-22">
                  <div className="flex size-11 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                    <PackageCheck className="size-6 stroke-[1.5]" />
                  </div>
                </div>

                {/* Grilla de atributos ordenados */}
                <div className="grid flex-1 min-w-0 grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Entrega</p>
                    <p className="mt-1 truncate text-sm font-medium text-foreground">
                      +{totalUnits} uds. recibidas
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Fecha de recepción
                    </p>
                    <p className="mt-1 text-sm font-medium tabular-nums">
                      {formatDate(receipt.createdAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Responsable</p>
                    <p className="mt-1 truncate text-sm font-medium text-foreground">
                      {receipt.responsible}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Guía / Comprobante
                    </p>
                    <p className="mt-1 truncate font-sans text-sm font-medium">
                      {receipt.documentRef || "Sin comprobante"}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-sm text-muted-foreground">
                      Productos ingresados
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      {receipt.lines.map((line) => (
                        <span
                          key={line.lineId}
                          className="inline-flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-sm text-foreground font-medium"
                        >
                          <span className="font-semibold text-emerald-500">
                            +{line.quantity}
                          </span>
                          <span className="truncate max-w-44">
                            {line.productName}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {receipt.notes && (
                    <div className="col-span-2 sm:col-span-3 pt-0.5">
                      <p className="text-sm text-muted-foreground">
                        “{receipt.notes}”
                      </p>
                    </div>
                  )}
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
