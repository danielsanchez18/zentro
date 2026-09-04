"use client";

import { useState } from "react";
import { Check, Package, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toastMsg } from "@/components/ui/toast-message";
import { cn } from "@/lib/utils";
import { catalogProducts } from "@/lib/mock/catalog";
import { inventoryItems } from "@/lib/mock/inventory";
import type { PurchaseOrder } from "@/lib/mock/purchases";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import { useInventoryStore } from "@/stores/inventory-store";
import { usePurchasesStore } from "@/stores/purchases-store";

export function ReceivePurchaseDialog({
  order,
  open,
  onOpenChange,
}: {
  order: PurchaseOrder;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const items = useInventoryStore((state) => state.items);
  const updateItem = useInventoryStore((state) => state.updateItem);
  const addMovement = useInventoryStore((state) => state.addMovement);
  const receive = usePurchasesStore((state) => state.receive);

  const totalSelectedUnits = order.lines.reduce(
    (sum, line) => sum + (Number(quantities[line.id]) || 0),
    0,
  );

  const totalPendingUnits = order.lines.reduce(
    (sum, line) => sum + Math.max(0, line.quantity - line.receivedQuantity),
    0,
  );

  const handleReceiveAll = () => {
    const next: Record<string, number> = {};
    order.lines.forEach((line) => {
      const pending = Math.max(0, line.quantity - line.receivedQuantity);
      if (pending > 0) {
        next[line.id] = pending;
      }
    });
    setQuantities(next);
  };

  const handleClearAll = () => {
    setQuantities({});
  };

  const confirm = () => {
    const selected = order.lines.filter(
      (line) => (quantities[line.id] ?? 0) > 0,
    );
    if (!selected.length) {
      toastMsg.error(
        "Recepción vacía",
        "Ingresa al menos una cantidad recibida.",
      );
      return;
    }
    const now = new Date().toISOString();
    selected.forEach((line) => {
      const quantity = quantities[line.id];
      const item = items.find(
        (candidate) => candidate.id === line.inventoryItemId,
      );
      if (!item) return;
      const resultingStock = item.currentStock + quantity;
      updateItem(item.id, {
        currentStock: resultingStock,
        unitCost: line.unitCost,
        updatedAt: now,
      });
      addMovement({
        id: `mov_${Date.now()}_${line.id}`,
        itemId: item.id,
        type: "entrada",
        quantity,
        previousStock: item.currentStock,
        resultingStock,
        createdAt: now,
        reason: "Recepción de compra",
        documentRef: order.number,
        notes: `Proveedor: ${order.supplierName}`,
      });
    });
    receive(order.id, quantities);
    toastMsg.success(
      "Recepción registrada",
      `${selected.reduce((sum, line) => sum + quantities[line.id], 0)} unidades ingresaron al inventario.`,
    );
    setQuantities({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl gap-0">
        <DialogHeader className="gap-1">
          <div className="flex items-center gap-2.5">
            <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <PackageCheck className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-medium text-foreground">
                Registrar recepción de mercadería
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Orden {order.number} · Proveedor: {order.supplierName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Mini stats & bulk action bar */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-2.5 border-y border-border py-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>
              Pendientes totales:{" "}
              <strong className="text-foreground font-medium">
                {totalPendingUnits} uds.
              </strong>
            </span>
            <span>·</span>
            <span>
              A ingresar:{" "}
              <strong className="text-primary font-medium">
                {totalSelectedUnits} uds.
              </strong>
            </span>
          </div>

          {totalPendingUnits > 0 && (
            <div className="flex items-center gap-2">
              {totalSelectedUnits > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClearAll}
                  className="cursor-pointer"
                >
                  Limpiar
                </Button>
              )}
              <Button
                type="button"
                variant="secondary"
                onClick={handleReceiveAll}
                className="cursor-pointer"
              >
                Recibir todo pendiente
              </Button>
            </div>
          )}
        </div>

        {/* Products list */}
        <div className="mb-5 max-h-[50vh] overflow-y-auto divide-y divide-border">
          {order.lines.map((line) => {
            const pending = Math.max(0, line.quantity - line.receivedQuantity);
            const isCompleted = pending === 0;

            const inventoryItem =
              items.find((i) => i.id === line.inventoryItemId) ||
              inventoryItems.find((i) => i.id === line.inventoryItemId);
            const catalogProduct = catalogProducts.find(
              (p) =>
                p.id === inventoryItem?.productId ||
                p.name.toLowerCase() === line.productName.toLowerCase(),
            );

            return (
              <div
                key={line.id}
                className={cn(
                  "flex flex-col gap-3 py-3.5 transition-colors sm:flex-row sm:items-center sm:justify-between",
                  isCompleted ? "bg-muted/10 opacity-70" : "hover:bg-muted/20",
                )}
              >
                {/* Left: Thumbnail & Info */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/70 bg-muted/40 text-muted-foreground">
                    {catalogProduct?.image ? (
                      <img
                        src={catalogProduct.image}
                        alt={line.productName}
                        className="size-full object-cover"
                      />
                    ) : (
                      <Package className="size-5 stroke-[1.5] text-muted-foreground/60" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className="truncate text-sm font-heading font-medium text-foreground"
                      title={line.productName}
                    >
                      {line.productName}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 text-sm text-muted-foreground font-sans">
                      <span className="font-mono">{line.sku}</span>
                      <span>·</span>
                      <span>
                        Solicitado:{" "}
                        <strong className="text-foreground font-medium">
                          {line.quantity}
                        </strong>
                      </span>
                      <span>·</span>
                      <span>
                        Recibido:{" "}
                        <strong className="text-emerald-500 font-medium">
                          {line.receivedQuantity}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions & Input */}
                <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-2 sm:pt-0 border-t border-border/40 sm:border-t-0">
                  {isCompleted ? (
                    <StatusBadge status="completado" />
                  ) : (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setQuantities((current) => ({
                            ...current,
                            [line.id]: pending,
                          }))
                        }
                        className="h-8 cursor-pointer font-sans"
                      >
                        Todo ({pending})
                      </Button>

                      <div className="flex items-center gap-1.5">
                        <Input
                          id={`receive-${line.id}`}
                          type="number"
                          min={0}
                          max={pending}
                          value={quantities[line.id] ?? 0}
                          onChange={(event) => {
                            const val = Math.min(
                              pending,
                              Math.max(0, Number(event.target.value) || 0),
                            );
                            setQuantities((current) => ({
                              ...current,
                              [line.id]: val,
                            }));
                          }}
                          className="h-8 w-14 px-2 text-center font-semibold tabular-nums text-sm rounded-lg [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                        <span className="text-sm select-none">/ {pending}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-full px-4 font-sans cursor-pointer text-sm"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={confirm}
            disabled={totalSelectedUnits === 0}
            className="rounded-full px-4 font-sans cursor-pointer text-sm gap-2"
          >
            <PackageCheck className="size-4" />
            Confirmar recepción{" "}
            {totalSelectedUnits > 0 ? `(${totalSelectedUnits} uds.)` : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
