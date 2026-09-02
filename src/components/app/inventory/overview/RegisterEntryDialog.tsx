"use client";

import { useEffect, useState, useMemo, type FormEvent } from "react";
import {
  Package,
  PackagePlus,
  Boxes,
  Plus,
  Trash2,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toastMsg } from "@/components/ui/toast-message";
import { cn } from "@/lib/utils";
import type { InventoryItem } from "@/lib/mock/inventory";

const REASON_OPTIONS = [
  { label: "Compra a proveedor", value: "compra" },
  { label: "Ajuste por sobrante", value: "ajuste" },
  { label: "Devolución de cliente", value: "devolucion" },
  { label: "Traspaso de sucursal", value: "traspaso" },
];

export type EntryMode = "single" | "batch";

interface BatchRow {
  id: string;
  itemId: string;
  quantity: string;
  unitCost: string;
}

interface RegisterEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: InventoryItem[];
  preselectedItem?: InventoryItem | null;
  onSuccess?: (itemId: string, addedStock: number) => void;
}

export function RegisterEntryDialog({
  open,
  onOpenChange,
  items,
  preselectedItem,
  onSuccess,
}: RegisterEntryDialogProps) {
  const [entryMode, setEntryMode] = useState<EntryMode>("single");

  // Single mode state
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("10");
  const [reason, setReason] = useState<string>("compra");
  const [unitCost, setUnitCost] = useState<string>("");
  const [documentRef, setDocumentRef] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // Batch mode state
  const [batchRows, setBatchRows] = useState<BatchRow[]>([]);

  useEffect(() => {
    if (open) {
      setEntryMode("single");
      if (preselectedItem) {
        setSelectedItemId(preselectedItem.id);
      } else if (items.length > 0) {
        setSelectedItemId(items[0].id);
      }
      setQuantity("10");
      setReason("compra");
      setUnitCost("");
      setDocumentRef("");
      setNotes("");

      // Initialize batch rows
      const defaultItemId = preselectedItem?.id || items[0]?.id || "";
      setBatchRows([
        {
          id: "row_1",
          itemId: defaultItemId,
          quantity: "10",
          unitCost: "",
        },
      ]);
    }
  }, [open, preselectedItem, items]);

  const currentItem = useMemo(() => {
    return items.find((i) => i.id === selectedItemId) || preselectedItem || items[0];
  }, [items, selectedItemId, preselectedItem]);

  const productItems = useMemo(() => {
    return items.map((item) => ({
      label: `${item.productName} (${item.sku})`,
      value: item.id,
    }));
  }, [items]);

  // Batch helper functions
  const handleAddBatchRow = () => {
    const nextId = `row_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const defaultItemId = items[0]?.id || "";
    setBatchRows((prev) => [
      ...prev,
      { id: nextId, itemId: defaultItemId, quantity: "5", unitCost: "" },
    ]);
  };

  const handleRemoveBatchRow = (rowId: string) => {
    if (batchRows.length <= 1) return;
    setBatchRows((prev) => prev.filter((r) => r.id !== rowId));
  };

  const handleUpdateBatchRow = (
    rowId: string,
    field: keyof BatchRow,
    value: string
  ) => {
    setBatchRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, [field]: value } : r))
    );
  };

  const totalBatchUnits = useMemo(() => {
    return batchRows.reduce((acc, row) => {
      const q = parseInt(row.quantity, 10);
      return acc + (isNaN(q) ? 0 : q);
    }, 0);
  }, [batchRows]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (entryMode === "single") {
      const addedStock = parseInt(quantity, 10);
      if (isNaN(addedStock) || addedStock <= 0) {
        toastMsg.error("Cantidad inválida", "Ingresa una cantidad mayor a 0.");
        return;
      }

      if (!currentItem) {
        toastMsg.error("Producto no seleccionado", "Selecciona un producto válido.");
        return;
      }

      onSuccess?.(currentItem.id, addedStock);

      toastMsg.success(
        "Entrada registrada",
        `Se agregaron +${addedStock} unidades a "${currentItem.productName}".`
      );
    } else {
      // Batch mode submission
      if (batchRows.length === 0) {
        toastMsg.error("Lote vacío", "Agrega al menos un producto al lote.");
        return;
      }

      let totalAdded = 0;
      let validCount = 0;

      batchRows.forEach((row) => {
        const addedStock = parseInt(row.quantity, 10);
        if (!isNaN(addedStock) && addedStock > 0 && row.itemId) {
          onSuccess?.(row.itemId, addedStock);
          totalAdded += addedStock;
          validCount += 1;
        }
      });

      toastMsg.success(
        "Entrada por lote registrada",
        `Se ingresaron existencias para ${validCount} productos (${totalAdded} unidades en total).`
      );
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-md font-heading", entryMode === "batch" && "sm:max-w-2xl")}>
        <DialogHeader className="m-1 font-heading">
          <DialogTitle>Registrar entrada</DialogTitle>
          <div className="flex items-center gap-x-2 text-sm text-muted-foreground">
            <p>
              Incrementa las existencias en el inventario.
            </p>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-5 font-heading">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-1 border-b border-border">
            
            <button
              type="button"
              onClick={() => setEntryMode("single")}
              className={cn(
                "flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
                entryMode === "single"
                  ? "border-b border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Package className="size-3.5" />
              <span>Por producto</span>
            </button>

            <button
              type="button"
              onClick={() => setEntryMode("batch")}
              className={cn(
                "flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
                entryMode === "batch"
                  ? "border-b border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Boxes className="size-3.5" />
              <span>Por lotes (múltiples)</span>
            </button>
          </div>

          {/* MODE 1: SINGLE PRODUCT */}
          {entryMode === "single" && (
            <>
              {/* Producto */}
              <div className="grid gap-2 mx-1">
                <label htmlFor="entry-product" className="text-sm font-medium">
                  Producto
                </label>
                <Select
                  value={selectedItemId}
                  onValueChange={(value) => setSelectedItemId(value as string)}
                  items={productItems}
                >
                  <SelectTrigger
                    id="entry-product"
                    className="w-full h-fit rounded-lg px-4 py-2"
                  >
                    <SelectValue placeholder="Selecciona un producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {items.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.productName} ({item.sku})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {currentItem && (
                  <p className="text-sm text-muted-foreground">
                    Stock actual en sistema:{" "}
                    <span className="font-medium text-foreground">
                      {currentItem.currentStock} unidades
                    </span>
                  </p>
                )}
              </div>

              {/* Cantidad y Motivo */}
              <div className="grid grid-cols-2 gap-3 mx-1">
                <div className="grid gap-2">
                  <label htmlFor="entry-quantity" className="text-sm font-medium">
                    Cantidad a ingresar
                  </label>
                  <div className="relative w-full">
                    <PackagePlus className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="entry-quantity"
                      type="number"
                      min="1"
                      required
                      placeholder="10"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="h-fit pl-10 pr-4 py-2 text-sm"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="entry-reason" className="text-sm font-medium">
                    Motivo
                  </label>
                  <Select
                    value={reason}
                    onValueChange={(value) => setReason(value as string)}
                    items={REASON_OPTIONS}
                  >
                    <SelectTrigger
                      id="entry-reason"
                      className="w-full h-fit rounded-lg px-3 py-2"
                    >
                      <SelectValue placeholder="Motivo" />
                    </SelectTrigger>
                    <SelectContent>
                      {REASON_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Costo unitario y N° Guía */}
              <div className="grid grid-cols-2 gap-3 mx-1">
                <div className="grid gap-2">
                  <label htmlFor="entry-cost" className="text-sm font-medium">
                    Costo unitario (opcional)
                  </label>
                  <div className="relative w-full">
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      S/.
                    </span>
                    <Input
                      id="entry-cost"
                      type="text"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={unitCost}
                      onChange={(e) => setUnitCost(e.target.value)}
                      className="h-fit pl-4 pr-10 py-2 text-sm"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="entry-doc" className="text-sm font-medium">
                    N° Guía / Factura
                  </label>
                  <div className="relative w-full">
                    <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="entry-doc"
                      type="text"
                      placeholder="F001-00248"
                      value={documentRef}
                      onChange={(e) => setDocumentRef(e.target.value)}
                      className="h-fit pl-10 pr-4 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* MODE 2: BATCH MULTIPLE PRODUCTS */}
          {entryMode === "batch" && (
            <>
              <div className="grid gap-3 mx-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">
                    Productos del lote ({batchRows.length})
                  </label>
                  <span className="text-sm text-muted-foreground font-heading">
                    Total: <strong className="text-foreground font-semibold">{totalBatchUnits} unidades</strong>
                  </span>
                </div>

                {/* Dedicated Card Container for Batch List with Internal Scroll */}
                <div className="rounded-xl border border-border bg-card p-3 shadow-xs space-y-3">
                  {/* Column Headers for Batch Table */}
                  <div className="hidden sm:grid grid-cols-[1fr_95px_105px_38px] gap-2.5 text-xs uppercase font-medium text-foreground font-heading">
                    <span>Producto</span>
                    <span className="text-center">Cantidad</span>
                    <span className="text-center">Costo S/.</span>
                    <span />
                  </div>

                  {/* Scrollable list of product rows */}
                  <div className="max-h-30 overflow-y-auto space-y-2.5 pr-1">
                    {batchRows.map((row) => (
                      <div
                        key={row.id}
                        className="flex flex-col sm:grid sm:grid-cols-[1fr_95px_105px_38px] gap-2.5 items-center bg-muted/20 sm:bg-transparent p-2 sm:p-0 rounded-lg"
                      >
                        {/* Product Selector */}
                        <div className="w-full min-w-0">
                          <Select
                            value={row.itemId}
                            onValueChange={(val) =>
                              handleUpdateBatchRow(row.id, "itemId", val as string)
                            }
                            items={productItems}
                          >
                            <SelectTrigger className="w-full h-fit rounded-lg px-3.5 py-2 text-sm">
                              <SelectValue placeholder="Selecciona producto" />
                            </SelectTrigger>
                            <SelectContent>
                              {items.map((item) => (
                                <SelectItem key={item.id} value={item.id}>
                                  {item.productName} ({item.sku})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center gap-2.5 w-full sm:w-auto">
                          {/* Quantity */}
                          <div className="flex-1 sm:w-24 min-w-24 shrink-0">
                            <Input
                              type="number"
                              min="1"
                              required
                              value={row.quantity}
                              onChange={(e) =>
                                handleUpdateBatchRow(row.id, "quantity", e.target.value)
                              }
                              placeholder="Cant."
                              className="h-fit px-3 py-2 text-sm text-center rounded-lg"
                            />
                          </div>

                          {/* Unit Cost (Optional) */}
                          <div className="flex-1 sm:w-26 min-w-26 shrink-0">
                            <Input
                              type="text"
                              inputMode="decimal"
                              value={row.unitCost}
                              onChange={(e) =>
                                handleUpdateBatchRow(row.id, "unitCost", e.target.value)
                              }
                              placeholder="S/. Costo"
                              className="h-fit px-3 py-2 text-sm text-center rounded-lg"
                            />
                          </div>

                          {/* Delete row */}
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            disabled={batchRows.length <= 1}
                            onClick={() => handleRemoveBatchRow(row.id)}
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
                    onClick={handleAddBatchRow}
                    className="w-full h-fit py-1.5"
                  >
                    {/* <Plus className="size-3.5" /> */}
                    <span>Agregar otro producto al lote</span>
                  </Button>
                </div>
              </div>

              {/* Shared Batch Metadata: Motivo & N° Guía */}
              <div className="grid grid-cols-2 gap-3 mx-1">
                <div className="grid gap-2">
                  <label htmlFor="batch-reason" className="text-sm font-medium">
                    Motivo de lote
                  </label>
                  <Select
                    value={reason}
                    onValueChange={(value) => setReason(value as string)}
                    items={REASON_OPTIONS}
                  >
                    <SelectTrigger
                      id="batch-reason"
                      className="w-full h-fit rounded-lg px-4 py-2 text-sm"
                    >
                      <SelectValue placeholder="Motivo" />
                    </SelectTrigger>
                    <SelectContent>
                      {REASON_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="batch-doc" className="text-sm font-medium">
                    N° Guía / Factura
                  </label>
                  <Input
                    id="batch-doc"
                    type="text"
                    placeholder="F001-00248"
                    value={documentRef}
                    onChange={(e) => setDocumentRef(e.target.value)}
                    className="h-fit px-4 py-2 text-sm rounded-lg"
                  />
                </div>
              </div>
            </>
          )}

          {/* Observaciones */}
          <div className="grid gap-2 mx-1">
            <label htmlFor="entry-notes" className="text-sm font-medium">
              Observaciones
            </label>
            <textarea
              id="entry-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Agrega una nota u observación (opcional)…"
              className="resize-none h-fit px-4 py-2 w-full rounded-lg border border-input bg-transparent text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            />
          </div>

          <DialogFooter className="gap-x-1 px-5">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-3 rounded-full"
            >
              Cancelar
            </Button>
            <Button type="submit" className="px-3 rounded-full gap-1.5">
              <PackagePlus className="size-4" />
              <span>
                {entryMode === "single"
                  ? "Registrar entrada"
                  : `Registrar lote (${batchRows.length})`}
              </span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
