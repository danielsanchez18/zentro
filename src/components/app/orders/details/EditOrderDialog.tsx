"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowLeftRight,
  Check,
  Package,
  Plus,
  Search,
  Store,
  Trash2,
  X,
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toastMsg } from "@/components/ui/toast-message";
import {
  catalogProducts,
  categoryName,
  type CatalogProduct,
} from "@/lib/mock/catalog";
import { availableStock, inventoryItems } from "@/lib/mock/inventory";
import {
  formatOrderMoney,
  type CustomerOrder,
  type OrderLine,
} from "@/lib/mock/orders";
import { cn } from "@/lib/utils";

const reasons = [
  "Producto agotado",
  "Cambio solicitado por el cliente",
  "Error al registrar el pedido",
  "Ajuste comercial",
  "Otro motivo",
];

interface EditOrderDialogProps {
  order: CustomerOrder;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (lines: OrderLine[], discount: number, reason: string) => void;
}

export function EditOrderDialog({
  order,
  open,
  onOpenChange,
  onConfirm,
}: EditOrderDialogProps) {
  const [lines, setLines] = useState<OrderLine[]>(order.lines);
  const [discountType, setDiscountType] = useState<"amount" | "percentage">(
    "amount",
  );
  const [discountValue, setDiscountValue] = useState(
    String(order.manualDiscount ?? 0),
  );
  const [reason, setReason] = useState("");

  // Modal para agregar o reemplazar producto
  const [catalogModalOpen, setCatalogModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "replace">("add");
  const [targetReplaceLine, setTargetReplaceLine] = useState<OrderLine | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Subtotales y cálculos
  const subtotal = useMemo(
    () => lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0),
    [lines],
  );

  const promotionDiscount = Math.max(
    0,
    order.discount - (order.manualDiscount ?? 0),
  );
  const rawDiscount = Number(discountValue) || 0;
  const manualDiscount =
    discountType === "percentage"
      ? (subtotal * Math.min(100, rawDiscount)) / 100
      : rawDiscount;
  const safeDiscount = Math.min(
    Math.max(0, manualDiscount),
    Math.max(0, subtotal - promotionDiscount),
  );
  const total = Math.max(
    0,
    subtotal - promotionDiscount - safeDiscount + order.deliveryFee,
  );
  const changed =
    JSON.stringify(lines) !== JSON.stringify(order.lines) ||
    Math.abs(safeDiscount - (order.manualDiscount ?? 0)) > 0.001;

  // Lógica de inventario y stock máximo
  const getMaxStockForProduct = (productId: string) => {
    const inventory = inventoryItems.find(
      (item) => item.productId === productId,
    );
    if (!inventory) return 999;
    const originallyReserved =
      order.lines.find((item) => item.productId === productId)?.quantity ?? 0;
    return originallyReserved + availableStock(inventory);
  };

  const updateQuantity = (id: string, nextQty: number) => {
    setLines((current) =>
      current.map((line) => {
        if (line.id !== id) return line;
        const maximum = getMaxStockForProduct(line.productId);
        const validQty = Math.min(Math.max(1, nextQty), Math.max(1, maximum));
        return {
          ...line,
          quantity: validQty,
          total: validQty * line.unitPrice - (line.discount ?? 0),
        };
      }),
    );
  };

  const removeLine = (id: string) => {
    if (lines.length <= 1) {
      toastMsg.error(
        "No se puede eliminar",
        "El pedido debe tener al menos un producto.",
      );
      return;
    }
    setLines((current) => current.filter((line) => line.id !== id));
  };

  // Abrir modal en modo "Agregar"
  const handleOpenAdd = () => {
    setModalMode("add");
    setTargetReplaceLine(null);
    setSearchQuery("");
    setCatalogModalOpen(true);
  };

  // Abrir modal en modo "Reemplazar"
  const handleOpenReplace = (line: OrderLine) => {
    setModalMode("replace");
    setTargetReplaceLine(line);
    setSearchQuery("");
    setCatalogModalOpen(true);
  };

  // Selección en el modal de catálogo
  const handleSelectCatalogProduct = (product: CatalogProduct) => {
    if (modalMode === "replace" && targetReplaceLine) {
      const unitPrice = product.basePrice / 100;
      setLines((current) =>
        current.map((line) =>
          line.id === targetReplaceLine.id
            ? {
                ...line,
                productId: product.id,
                name: product.name,
                unitPrice,
                discount: 0,
                total: line.quantity * unitPrice,
                notes: undefined,
              }
            : line,
        ),
      );
      toastMsg.success(
        "Producto reemplazado",
        `${targetReplaceLine.name} fue reemplazado por ${product.name}.`,
      );
      setCatalogModalOpen(false);
    } else {
      // Modo "add"
      const existing = lines.find((l) => l.productId === product.id);
      if (existing) {
        updateQuantity(existing.id, existing.quantity + 1);
        toastMsg.info(
          "Cantidad incrementada",
          `Se sumó 1 unidad de ${product.name}.`,
        );
      } else {
        const unitPrice = product.basePrice / 100;
        const newLine: OrderLine = {
          id: `line_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
          productId: product.id,
          name: product.name,
          quantity: 1,
          unitPrice,
          discount: 0,
          total: unitPrice,
        };
        setLines((current) => [...current, newLine]);
        toastMsg.success("Producto agregado", product.name);
      }
      setCatalogModalOpen(false);
    }
  };

  // Filtrado de productos del catálogo
  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return catalogProducts
      .filter((product) => product.status === "activo")
      .filter((product) => {
        if (!query) return true;
        const cat = categoryName(product.categoryId).toLowerCase();
        return (
          product.name.toLowerCase().includes(query) ||
          cat.includes(query) ||
          (product.description &&
            product.description.toLowerCase().includes(query))
        );
      });
  }, [searchQuery]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-xl max-h-[95dvh] flex flex-col overflow-hidden">
          {/* Header */}
          <DialogHeader className="pr-6">
            <DialogTitle>Editar contenido del pedido</DialogTitle>
            <DialogDescription>
              Modifica productos, cantidades o descuentos. Todos los cambios
              quedan documentados en el historial de ajustes.
            </DialogDescription>
          </DialogHeader>

          {/* Body Scrollable */}
          <div className="flex-1 overflow-y-auto space-y-6">
            {/* Lista de productos */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">
                Productos del pedido ({lines.length})
              </p>

              {/* Items parecidos a OrderMainCard */}
              <div className="divide-y divide-border">
                {lines.map((line) => {
                  const catalogItem = catalogProducts.find(
                    (p) => p.id === line.productId,
                  );
                  const inventory = inventoryItems.find(
                    (i) => i.productId === line.productId,
                  );
                  const stock = inventory
                    ? availableStock(inventory)
                    : undefined;
                  const maxStock = getMaxStockForProduct(line.productId);

                  return (
                    <article
                      key={line.id}
                      className="py-4 transition-colors font-heading"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        {/* Producto info con thumbnail igual que OrderMainCard */}
                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                          <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-accent text-primary border border-border">
                            {catalogItem?.image ? (
                              <Image
                                src={catalogItem.image}
                                alt={line.name}
                                width={56}
                                height={56}
                                className="size-full object-cover"
                              />
                            ) : (
                              <Package className="size-6" />
                            )}
                          </div>
                          <div className="min-w-0 line-clamp-3">
                            <p className="text-sm font-medium text-foreground truncate">
                              {line.name}
                            </p>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {formatOrderMoney(line.unitPrice)} por unidad
                            </p>
                            {line.notes && (
                              <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                                {line.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Cantidad y Subtotal */}
                        <div className="flex justify-between sm:justify-end gap-5 shrink-0">
                          {/* Stepper Cantidad */}
                          <div className="flex flex-col gap-1 items-start sm:items-center">
                            <span className="text-sm font-medium text-muted-foreground">
                              Cantidad
                            </span>
                            <div className="flex h-8 items-center rounded-lg border border-border bg-background">
                              <button
                                type="button"
                                aria-label="Reducir cantidad"
                                className="h-full px-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-l-lg transition-colors disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                                onClick={() =>
                                  updateQuantity(line.id, line.quantity - 1)
                                }
                                disabled={line.quantity <= 1}
                              >
                                −
                              </button>
                              <span className="min-w-7 text-center text-sm font-medium tabular-nums text-foreground">
                                {line.quantity}
                              </span>
                              <button
                                type="button"
                                aria-label="Aumentar cantidad"
                                className="h-full px-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-r-lg transition-colors disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                                onClick={() =>
                                  updateQuantity(line.id, line.quantity + 1)
                                }
                                disabled={line.quantity >= maxStock}
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Importe */}
                          <div className="text-right sm:min-w-22">
                            <span className="text-sm font-medium text-muted-foreground">
                              Importe
                            </span>
                            <p className="mt-2 text-sm font-medium tabular-nums text-foreground">
                              {formatOrderMoney(line.quantity * line.unitPrice)}
                            </p>
                            {line.discount > 0 && (
                              <p className="text-xs text-emerald-600 font-medium tabular-nums">
                                -{formatOrderMoney(line.discount)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Barra de opciones por producto: Reemplazar y Quitar como opciones no invasivas */}
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          {stock !== undefined
                            ? stock > 0
                              ? `${stock} unidades en stock`
                              : "Stock agotado"
                            : ""}
                        </p>
                        <div className="flex items-center gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenReplace(line)}
                          >
                            <ArrowLeftRight />
                            Reemplazar
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeLine(line.id)}
                            disabled={lines.length === 1}
                            className=""
                          >
                            <Trash2 />
                            Quitar
                          </Button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Botón secundario para agregar producto si la lista es larga o vacía */}
              <Button
                type="button"
                variant="outline"
                onClick={handleOpenAdd}
                className="w-full border border-dashed border-border cursor-pointer h-fit py-2"
              >
                Agregar otro producto al pedido
              </Button>
            </div>

            {/* Inputs de Descuento directo y Motivo de ajuste perfectamente alineados */}
            <div className="grid gap-5 border-t border-border pt-5 sm:grid-cols-2 items-start">
              {/* Descuento directo */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">
                    Descuento directo
                  </label>
                  <span className="text-sm text-muted-foreground">
                    Opcional
                  </span>
                </div>
                <div className="relative flex h-9 w-full items-center rounded-lg border border-border overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20">
                  <Input
                    type="number"
                    min={0}
                    max={discountType === "percentage" ? 100 : undefined}
                    step="0.01"
                    value={discountValue}
                    onChange={(event) => setDiscountValue(event.target.value)}
                    className="h-full flex-1 border-0 shadow-none rounded-none focus-visible:ring-0 px-3 text-sm tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    placeholder="0.00"
                  />
                  <Select
                    value={discountType}
                    onValueChange={(value) =>
                      setDiscountType(value as "amount" | "percentage")
                    }
                  >
                    <SelectTrigger className="w-auto min-w-13.5 gap-1.5 rounded-none border-0 text-sm font-medium text-foreground shadow-none hover:bg-muted focus:ring-0 focus-visible:ring-0 [&>svg]:size-3.5 [&>svg]:opacity-60 cursor-pointer">
                      <span
                        data-slot="select-value"
                        className="text-sm font-medium"
                      >
                        {discountType === "amount" ? "S/." : "%"}
                      </span>
                    </SelectTrigger>
                    <SelectContent align="end" className="min-w-36">
                      <SelectItem
                        value="amount"
                        className="text-sm font-medium cursor-pointer"
                      >
                        S/. (Monto)
                      </SelectItem>
                      <SelectItem
                        value="percentage"
                        className="text-sm font-medium cursor-pointer"
                      >
                        % (Porcentaje)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Motivo del ajuste */}
              <div className="flex flex-col gap-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">
                    Motivo del ajuste
                  </label>
                  <span className="text-sm text-destructive font-medium">
                    *Requerido
                  </span>
                </div>
                <Select
                  value={reason}
                  onValueChange={(value) => setReason(value as string)}
                >
                  <SelectTrigger className="w-full h-9 text-sm">
                    <SelectValue placeholder="Selecciona un motivo obligatorio" />
                  </SelectTrigger>
                  <SelectContent>
                    {reasons.map((item) => (
                      <SelectItem key={item} value={item} className="text-sm">
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Totales alineados y claros */}
            <div className="border-t border-border font-heading pt-5">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Nuevo subtotal</span>
                  <span className="font-medium text-foreground tabular-nums text-sm">
                    {formatOrderMoney(subtotal)}
                  </span>
                </div>
                {promotionDiscount > 0 && (
                  <div className="flex justify-between items-center text-emerald-600">
                    <span>Promoción conservada</span>
                    <span className="font-medium tabular-nums text-sm">
                      -{formatOrderMoney(promotionDiscount)}
                    </span>
                  </div>
                )}
                {safeDiscount > 0 && (
                  <div className="flex justify-between items-center text-emerald-600">
                    <span>Descuento directo</span>
                    <span className="font-medium tabular-nums text-sm">
                      -{formatOrderMoney(safeDiscount)}
                    </span>
                  </div>
                )}
                {order.deliveryFee > 0 && (
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Costo de envío</span>
                    <span className="font-medium text-foreground tabular-nums text-sm">
                      {formatOrderMoney(order.deliveryFee)}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-2 flex flex-col gap-2 font-heading">
                {changed && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Anterior:
                    </span>
                    <span className="text-sm text-muted-foreground tabular-nums">
                      {formatOrderMoney(order.total)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Nuevo total
                  </span>
                  <span className="text-base font-medium text-foreground tabular-nums font-heading">
                    {formatOrderMoney(total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="font-sans">
            <Button
              variant="outline"
              className="rounded-full cursor-pointer"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              disabled={!changed || !reason || lines.length === 0}
              className="rounded-full cursor-pointer"
              onClick={() => onConfirm(lines, safeDiscount, reason)}
            >
              Guardar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal buscador de productos (inspirado en PromotionScope) */}
      <Dialog open={catalogModalOpen} onOpenChange={setCatalogModalOpen}>
        <DialogContent
          initialFocus={false}
          className="gap-4 sm:max-w-lg max-h-[95dvh] flex flex-col overflow-hidden"
        >
          <DialogHeader>
            <DialogTitle>
              {modalMode === "replace"
                ? `Reemplazar: ${targetReplaceLine?.name}`
                : "Agregar producto al pedido"}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-0.5">
              {modalMode === "replace"
                ? "Selecciona el artículo del catálogo que sustituirá a este producto."
                : "Busca productos disponibles en el catálogo para sumarlos a este pedido."}
            </DialogDescription>
          </DialogHeader>

          {/* Buscador */}
          <div className="">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, categoría o descripción..."
                className="h-9 rounded-lg pl-9 pr-8 text-xs"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer text-xs p-1"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Lista de productos encontrados */}
          <div className="flex-1 overflow-y-auto py-2 space-y-1.5 max-h-95 font-heading">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((item) => {
                const inventory = inventoryItems.find(
                  (inv) => inv.productId === item.id,
                );
                const stock = inventory ? availableStock(inventory) : 0;
                const isOutOfStock = stock <= 0;

                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => handleSelectCatalogProduct(item)}
                    className={cn(
                      "group flex w-full cursor-pointer items-center justify-between gap-3 py-2 text-left transition-all hover:bg-accent/50",
                      isOutOfStock &&
                        "opacity-50 cursor-not-allowed hover:bg-transparent",
                    )}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted text-muted-foreground group-hover:text-foreground">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={44}
                            height={44}
                            className="size-full object-cover"
                          />
                        ) : (
                          <Package className="size-5" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          {item.name}
                        </p>
                        <p className="truncate text-sm text-muted-foreground">
                          {categoryName(item.categoryId)}
                          {item.description ? ` · ${item.description}` : ""}
                        </p>
                        <span
                          className={cn(
                            "inline-block text-xs font-medium mt-0.5",
                            isOutOfStock
                              ? "text-destructive"
                              : stock <= 5
                                ? "text-amber-600"
                                : "text-muted-foreground",
                          )}
                        >
                          {isOutOfStock ? "Agotado" : `${stock} disponibles`}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-sm font-medium tabular-nums text-foreground block">
                        {formatOrderMoney(item.basePrice / 100)}
                      </span>
                      <span className="text-sm text-primary mt-1 inline-block underline font-sans">
                        {modalMode === "replace" ? "Reemplazar" : "Agregar"}
                      </span>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground mb-2">
                  <Package className="size-5" />
                </div>
                <p className="text-xs font-medium text-foreground">
                  No se encontraron productos
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Prueba buscando con otro término.
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="py-3">
            <Button
              type="button"
              variant="outline"
              className="rounded-full cursor-pointer"
              onClick={() => setCatalogModalOpen(false)}
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
