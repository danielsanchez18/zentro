import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { InventoryItem } from "@/lib/mock/inventory";
import type { PurchaseLine } from "@/lib/mock/purchases";
import { formatPurchaseMoney } from "@/lib/mock/purchases";
import { PurchaseFormSection } from "./PurchaseFormSection";

export function PurchaseLines({
  lines,
  items,
  error,
  onChange,
}: {
  lines: PurchaseLine[];
  items: InventoryItem[];
  error?: string;
  onChange: (lines: PurchaseLine[]) => void;
}) {
  const update = (index: number, changes: Partial<PurchaseLine>) =>
    onChange(
      lines.map((line, current) =>
        current === index ? { ...line, ...changes } : line,
      ),
    );

  const add = () =>
    onChange([
      ...lines,
      {
        id: `line_${Date.now()}`,
        inventoryItemId: "",
        productName: "",
        sku: "",
        quantity: 1,
        receivedQuantity: 0,
        unitCost: 0,
      },
    ]);

  const totalUnits = lines.reduce(
    (sum, l) => sum + (Number(l.quantity) || 0),
    0,
  );

  return (
    <PurchaseFormSection
      title="Productos"
      description="Agrega los productos, cantidades y costos acordados con el proveedor."
    >
      <div className="grid gap-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground font-heading">
            Productos ({lines.length})
          </label>
          <span className="text-sm text-muted-foreground font-heading">
            Total:{" "}
            <strong className="text-foreground font-semibold">
              {totalUnits} unidades
            </strong>
          </span>
        </div>

        {/* Dedicated Card Container with auto height */}
        <div className="rounded-xl border border-border bg-card p-3 shadow-xs space-y-3">
          {/* Column Headers */}
          <div className="hidden sm:grid grid-cols-[1fr_95px_110px_105px_38px] gap-2.5 text-xs uppercase font-medium text-foreground font-heading">
            <span>Producto</span>
            <span className="text-center">Cantidad</span>
            <span className="text-center">Costo S/.</span>
            <span className="text-right">Subtotal</span>
            <span />
          </div>

          {/* List of product rows with auto height */}
          <div className="h-auto space-y-2.5">
            {lines.map((line, index) => (
              <div
                key={line.id}
                className="flex flex-col sm:grid sm:grid-cols-[1fr_95px_110px_105px_38px] gap-2.5 items-center bg-muted/20 sm:bg-transparent p-2.5 sm:p-0 rounded-lg"
              >
                {/* Product Selector */}
                <div className="w-full min-w-0">
                  <Select
                    value={line.inventoryItemId}
                    onValueChange={(rawValue) => {
                      const value = String(rawValue);
                      const item = items.find(
                        (candidate) => candidate.id === value,
                      );
                      update(index, {
                        inventoryItemId: value,
                        productName: item?.productName ?? "",
                        sku: item?.sku ?? "",
                        unitCost: item?.unitCost ?? 0,
                      });
                    }}
                  >
                    <SelectTrigger className="w-full h-fit rounded-lg px-3.5 py-2 text-sm font-heading">
                      <SelectValue placeholder="Selecciona producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {items.map((item) => (
                        <SelectItem
                          key={item.id}
                          value={item.id}
                          disabled={lines.some(
                            (candidate, candidateIndex) =>
                              candidateIndex !== index &&
                              candidate.inventoryItemId === item.id,
                          )}
                        >
                          {item.productName} ({item.sku})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:contents">
                  {/* Quantity */}
                  <div className="flex-1 sm:w-auto">
                    <Input
                      type="number"
                      min={1}
                      value={line.quantity}
                      onChange={(event) =>
                        update(index, {
                          quantity: Number(event.target.value),
                        })
                      }
                      placeholder="Cant."
                      className="h-fit px-3 py-2 text-sm text-center rounded-lg font-heading"
                    />
                  </div>

                  {/* Unit Cost */}
                  <div className="flex-1 sm:w-auto">
                    <Input
                      type="number"
                      min={0.01}
                      step="0.01"
                      value={line.unitCost || ""}
                      onChange={(event) =>
                        update(index, {
                          unitCost: Number(event.target.value),
                        })
                      }
                      placeholder="S/. Costo"
                      className="h-fit px-3 py-2 text-sm text-center rounded-lg font-heading"
                    />
                  </div>

                  {/* Subtotal */}
                  <div className="flex-1 sm:w-auto text-right font-medium text-sm font-heading tabular-nums px-1">
                    <span className="sm:hidden text-xs text-muted-foreground mr-1">
                      Subtotal:
                    </span>
                    <span>
                      {formatPurchaseMoney(line.quantity * line.unitCost)}
                    </span>
                  </div>

                  {/* Delete row */}
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    disabled={lines.length === 1}
                    onClick={() =>
                      onChange(lines.filter((_, current) => current !== index))
                    }
                    className="size-9 shrink-0 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                    title="Eliminar fila"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={add}
            className="w-full h-fit py-2.5 cursor-pointer leading-none"
          >
            <span>Agregar otro producto</span>
          </Button>
        </div>

        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    </PurchaseFormSection>
  );
}
