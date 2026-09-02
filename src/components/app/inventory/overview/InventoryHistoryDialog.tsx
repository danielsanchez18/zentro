"use client";

import { History } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CommonDialogProps, InventoryMovement } from "./types";

interface InventoryHistoryDialogProps extends CommonDialogProps {
  movements: InventoryMovement[];
}

export function InventoryHistoryDialog({
  item,
  open,
  onOpenChange,
  movements,
}: InventoryHistoryDialogProps) {
  if (!item) return null;
  const records = movements.filter((movement) => movement.itemId === item.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg ">
        <DialogHeader>
          <DialogTitle>Historial de movimientos</DialogTitle>
          <DialogDescription>
            {item.productName} · {item.sku}
          </DialogDescription>
        </DialogHeader>

        {records.length ? (
          <div className="max-h-80 divide-y divide-border overflow-y-auto rounded-xl border border-border">
            {records.map((movement) => (
              <div
                key={movement.id}
                className="flex items-center justify-between gap-4 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-accent">
                    <History className="size-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium capitalize">
                      {movement.type} de stock
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(movement.createdAt).toLocaleString("es-PE")}
                    </p>
                    {movement.reason && <p className="mt-1 text-xs text-muted-foreground">{movement.reason}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium tabular-nums">
                    {movement.type === "salida" || movement.quantity < 0 ? "−" : "+"}
                    {Math.abs(movement.quantity)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {movement.previousStock !== undefined ? `${movement.previousStock} → ` : "Saldo "}{movement.resultingStock}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-8 text-center bg-primary/2">
            <History className="mx-auto size-5 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium">Aún no hay movimientos</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Las entradas y salidas registradas aparecerán aquí.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
