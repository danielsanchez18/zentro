"use client";

import { useState, useMemo, type FormEvent } from "react";
import {
  Boxes,
  CalendarDays,
  Check,
  ChevronsUpDown,
  Clock,
  CreditCard,
  FileText,
  Package,
  Receipt,
  Search,
  Truck,
  X,
} from "lucide-react";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { InventoryItem } from "@/lib/mock/inventory";
import type { InventorySupplier } from "@/lib/mock/inventory-suppliers";
import type { PurchaseLine, PurchaseOrder } from "@/lib/mock/purchases";
import { formatPurchaseMoney, purchaseTotal } from "@/lib/mock/purchases";
import { PurchaseFormSection } from "./PurchaseFormSection";
import { PurchaseLines } from "./PurchaseLines";

export interface PurchaseFormValues {
  supplierId: string;
  issuedAt: string;
  expectedAt: string;
  paymentTerms: string;
  reference: string;
  notes: string;
  lines: PurchaseLine[];
}

const today = new Date().toISOString().slice(0, 10);
const emptyLine: PurchaseLine = {
  id: "line_initial",
  inventoryItemId: "",
  productName: "",
  sku: "",
  quantity: 1,
  receivedQuantity: 0,
  unitCost: 0,
};

function parseLocalDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const parts = value.slice(0, 10).split("-").map(Number);
  if (
    parts.length < 3 ||
    isNaN(parts[0]) ||
    isNaN(parts[1]) ||
    isNaN(parts[2])
  ) {
    return undefined;
  }
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

function formatLocalDate(date?: Date): string {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(value?: string): string {
  const d = parseLocalDate(value);
  if (!d) return "Seleccionar fecha";
  return new Intl.DateTimeFormat("es-PE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function PurchaseForm({
  id,
  suppliers,
  items,
  initial,
  onSubmit,
}: {
  id: string;
  suppliers: InventorySupplier[];
  items: InventoryItem[];
  initial?: PurchaseOrder;
  onSubmit: (values: PurchaseFormValues) => void;
}) {
  const [values, setValues] = useState<PurchaseFormValues>({
    supplierId: initial?.supplierId ?? "",
    issuedAt: initial?.issuedAt.slice(0, 10) ?? today,
    expectedAt: initial?.expectedAt.slice(0, 10) ?? today,
    paymentTerms: initial?.paymentTerms ?? "Contado",
    reference: initial?.reference ?? "",
    notes: initial?.notes ?? "",
    lines: initial?.lines.map((line) => ({ ...line })) ?? [emptyLine],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Searchable Supplier combobox state
  const [openSupplier, setOpenSupplier] = useState(false);
  const [supplierSearch, setSupplierSearch] = useState("");

  // Shadcn Calendar date popovers state
  const [openIssued, setOpenIssued] = useState(false);
  const [openExpected, setOpenExpected] = useState(false);

  const supplier = suppliers.find(
    (candidate) => candidate.id === values.supplierId,
  );

  const distinctProducts = useMemo(
    () => values.lines.filter((line) => line.inventoryItemId).length,
    [values.lines],
  );
  const totalUnits = useMemo(
    () =>
      values.lines.reduce((sum, line) => sum + (Number(line.quantity) || 0), 0),
    [values.lines],
  );
  const totalAmount = useMemo(
    () => purchaseTotal(values.lines),
    [values.lines],
  );

  const filteredSuppliers = useMemo(() => {
    const list = suppliers.filter(
      (item) => item.status === "activo" || item.id === values.supplierId,
    );
    if (!supplierSearch.trim()) return list;
    const query = supplierSearch.toLowerCase().trim();
    return list.filter(
      (s) =>
        s.tradeName.toLowerCase().includes(query) ||
        s.documentNumber.toLowerCase().includes(query) ||
        (s.contactName && s.contactName.toLowerCase().includes(query)),
    );
  }, [suppliers, values.supplierId, supplierSearch]);

  const handleSelectSupplier = (supplierId: string) => {
    setValues((current) => ({ ...current, supplierId }));
    setOpenSupplier(false);
    setSupplierSearch("");
    if (errors.supplierId) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.supplierId;
        return next;
      });
    }
  };

  const handleClearSupplier = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValues((current) => ({ ...current, supplierId: "" }));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!values.supplierId) next.supplierId = "Selecciona un proveedor.";
    if (!values.issuedAt) next.issuedAt = "Selecciona la fecha de emisión.";
    if (!values.expectedAt || values.expectedAt < values.issuedAt)
      next.expectedAt = "La entrega debe ser igual o posterior a la emisión.";
    if (
      values.lines.some(
        (line) =>
          !line.inventoryItemId || line.quantity <= 0 || line.unitCost <= 0,
      )
    )
      next.lines = "Completa correctamente todos los productos.";
    setErrors(next);
    if (!Object.keys(next).length) onSubmit(values);
  };

  return (
    <form
      id={id}
      onSubmit={submit}
      className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(280px,.65fr)]"
    >
      <div className="flex flex-col gap-5">
        <PurchaseFormSection
          title="Información de la orden"
          description="Define el proveedor, las fechas y las condiciones comerciales."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Searchable Supplier Selector */}
            <div className="flex flex-col gap-y-2 sm:col-span-2">
              <Label>Proveedor</Label>
              <Popover open={openSupplier} onOpenChange={setOpenSupplier}>
                <PopoverTrigger
                  className={cn(
                    "flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-input bg-background px-3.5 py-2 text-sm font-heading text-foreground transition-all duration-150 outline-none hover:bg-accent/40 focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer min-w-0 overflow-hidden text-left",
                    !supplier && "text-muted-foreground",
                    errors.supplierId &&
                      "border-destructive focus:border-destructive focus:ring-destructive/15",
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
                    {supplier ? (
                      <>
                        <div className="size-6 rounded-md bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 font-heading">
                          {supplier.tradeName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden truncate text-foreground font-medium font-heading">
                          <span className="font-semibold text-foreground truncate min-w-0">
                            {supplier.tradeName}
                          </span>
                          <span className="text-muted-foreground font-normal text-xs shrink-0">
                            · {supplier.documentNumber}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                        <Truck className="size-4 shrink-0 text-muted-foreground" />
                        <p className="line-clamp-1 text-nowrap min-w-0 block">
                          Seleccionar proveedor...
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-auto">
                    {supplier && (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={handleClearSupplier}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            handleClearSupplier(
                              e as unknown as React.MouseEvent,
                            );
                          }
                        }}
                        className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        title="Quitar proveedor"
                      >
                        <X className="size-3.5" />
                      </span>
                    )}
                    <ChevronsUpDown className="size-4 text-muted-foreground/70 shrink-0" />
                  </div>
                </PopoverTrigger>

                <PopoverContent
                  align="start"
                  className="w-(--anchor-width) min-w-0 overflow-hidden rounded-xl p-0 shadow-lg border border-border"
                >
                  {/* Search Header */}
                  <div className="px-2 pt-2 pb-1">
                    <div className="flex items-center gap-2 border border-border px-3 py-2 bg-muted/20 rounded-lg">
                      <Search className="size-4 text-muted-foreground shrink-0" />
                      <input
                        type="text"
                        value={supplierSearch}
                        onChange={(e) => setSupplierSearch(e.target.value)}
                        placeholder="Buscar proveedor..."
                        className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground font-heading"
                        autoFocus
                      />
                      {supplierSearch && (
                        <button
                          type="button"
                          onClick={() => setSupplierSearch("")}
                          className="text-muted-foreground hover:text-foreground text-xs cursor-pointer"
                        >
                          <X className="size-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Options List */}
                  <div className="max-h-65 overflow-y-auto p-1 flex flex-col gap-1">
                    {filteredSuppliers.length === 0 ? (
                      <div className="py-6 text-center text-sm text-muted-foreground font-heading">
                        No se encontraron proveedores para &quot;
                        {supplierSearch}&quot;.
                      </div>
                    ) : (
                      filteredSuppliers.map((item) => {
                        const isSelected = item.id === values.supplierId;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelectSupplier(item.id)}
                            className={cn(
                              "w-full flex items-center justify-between gap-3 px-2.5 py-2 rounded-lg text-left text-sm transition-colors cursor-pointer font-heading",
                              isSelected
                                ? "bg-primary/5 text-primary font-semibold"
                                : "hover:bg-accent text-foreground",
                            )}
                          >
                            <div className="flex items-center gap-2.5 truncate min-w-0">
                              <div
                                className={cn(
                                  "size-7 rounded-md flex items-center justify-center font-semibold text-xs shrink-0 font-heading",
                                  isSelected
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-primary/10 text-primary",
                                )}
                              >
                                {item.tradeName.charAt(0).toUpperCase()}
                              </div>
                              <div className="truncate flex flex-col min-w-0">
                                <span className="truncate font-medium">
                                  {item.tradeName}
                                </span>
                                <span className="text-xs text-muted-foreground truncate">
                                  {item.documentNumber}
                                  {item.contactName
                                    ? ` · ${item.contactName}`
                                    : ""}
                                </span>
                              </div>
                            </div>
                            {isSelected && (
                              <Check className="size-4 shrink-0 text-primary" />
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                </PopoverContent>
              </Popover>
              {errors.supplierId && (
                <p className="text-xs text-destructive">{errors.supplierId}</p>
              )}
            </div>

            {/* Fecha de emisión using Shadcn Calendar */}
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="issuedAt">Fecha de emisión</Label>
              <Popover open={openIssued} onOpenChange={setOpenIssued}>
                <PopoverTrigger
                  id="issuedAt"
                  className={cn(
                    "flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-input bg-background px-3.5 py-2 text-sm font-heading text-foreground transition-all duration-150 outline-none hover:bg-accent/40 focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer min-w-0 text-left",
                    !values.issuedAt && "text-muted-foreground",
                    errors.issuedAt &&
                      "border-destructive focus:border-destructive focus:ring-destructive/15",
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0 truncate">
                    <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
                    <span
                      className={cn(
                        "truncate",
                        !values.issuedAt
                          ? "text-muted-foreground font-normal"
                          : "font-medium text-foreground",
                      )}
                    >
                      {values.issuedAt
                        ? formatDisplayDate(values.issuedAt)
                        : "Seleccionar fecha"}
                    </span>
                  </div>
                  <ChevronsUpDown className="size-4 text-muted-foreground/70 shrink-0" />
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="w-auto p-0 rounded-xl overflow-hidden shadow-lg border border-border bg-popover"
                >
                  <Calendar
                    mode="single"
                    selected={parseLocalDate(values.issuedAt)}
                    onSelect={(date) => {
                      if (date) {
                        const formatted = formatLocalDate(date);
                        setValues((current) => ({
                          ...current,
                          issuedAt: formatted,
                          ...(current.expectedAt &&
                          current.expectedAt < formatted
                            ? { expectedAt: formatted }
                            : {}),
                        }));
                        setOpenIssued(false);
                        if (errors.issuedAt) {
                          setErrors((prev) => {
                            const next = { ...prev };
                            delete next.issuedAt;
                            return next;
                          });
                        }
                      }
                    }}
                    locale={es}
                    defaultMonth={parseLocalDate(values.issuedAt)}
                  />
                </PopoverContent>
              </Popover>
              {errors.issuedAt && (
                <p className="text-xs text-destructive">{errors.issuedAt}</p>
              )}
            </div>

            {/* Entrega estimada using Shadcn Calendar */}
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="expectedAt">Entrega estimada</Label>
              <Popover open={openExpected} onOpenChange={setOpenExpected}>
                <PopoverTrigger
                  id="expectedAt"
                  className={cn(
                    "flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-input bg-background px-3.5 py-2 text-sm font-heading text-foreground transition-all duration-150 outline-none hover:bg-accent/40 focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer min-w-0 text-left",
                    !values.expectedAt && "text-muted-foreground",
                    errors.expectedAt &&
                      "border-destructive focus:border-destructive focus:ring-destructive/15",
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0 truncate">
                    <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
                    <span
                      className={cn(
                        "truncate",
                        !values.expectedAt
                          ? "text-muted-foreground font-normal"
                          : "font-medium text-foreground",
                      )}
                    >
                      {values.expectedAt
                        ? formatDisplayDate(values.expectedAt)
                        : "Seleccionar fecha"}
                    </span>
                  </div>
                  <ChevronsUpDown className="size-4 text-muted-foreground/70 shrink-0" />
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="w-auto p-0 rounded-xl overflow-hidden shadow-lg border border-border bg-popover"
                >
                  <Calendar
                    mode="single"
                    selected={parseLocalDate(values.expectedAt)}
                    disabled={
                      values.issuedAt
                        ? { before: parseLocalDate(values.issuedAt)! }
                        : undefined
                    }
                    onSelect={(date) => {
                      if (date) {
                        const formatted = formatLocalDate(date);
                        setValues((current) => ({
                          ...current,
                          expectedAt: formatted,
                        }));
                        setOpenExpected(false);
                        if (errors.expectedAt) {
                          setErrors((prev) => {
                            const next = { ...prev };
                            delete next.expectedAt;
                            return next;
                          });
                        }
                      }
                    }}
                    locale={es}
                    defaultMonth={parseLocalDate(values.expectedAt)}
                  />
                </PopoverContent>
              </Popover>
              {errors.expectedAt && (
                <p className="text-xs text-destructive">{errors.expectedAt}</p>
              )}
            </div>

            {/* Condición de pago */}
            <div className="flex flex-col gap-y-2">
              <Label>Condición de pago</Label>
              <Select
                value={values.paymentTerms}
                onValueChange={(value) =>
                  setValues((current) => ({
                    ...current,
                    paymentTerms: String(value),
                  }))
                }
              >
                <SelectTrigger className="h-10 w-full rounded-lg px-3.5 py-2 text-sm font-heading">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Contado",
                    "Crédito a 15 días",
                    "Crédito a 30 días",
                    "Crédito a 45 días",
                  ].map((term) => (
                    <SelectItem key={term} value={term}>
                      {term}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Referencia */}
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="reference">Referencia</Label>
              <Input
                id="reference"
                value={values.reference}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    reference: event.target.value,
                  }))
                }
                placeholder="Cotización o documento"
                className="h-10 rounded-lg px-3.5 py-2 text-sm font-heading"
              />
            </div>
          </div>
        </PurchaseFormSection>
        <PurchaseLines
          lines={values.lines}
          items={items}
          error={errors.lines}
          onChange={(lines) => setValues((current) => ({ ...current, lines }))}
        />
      </div>
      <aside className="flex flex-col gap-5 xl:sticky xl:top-5">
        <PurchaseFormSection
          title="Resumen"
          description="Totales calculados desde las líneas de la orden."
        >
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Proveedor</span>
              <span className="max-w-40 truncate font-medium">
                {supplier?.tradeName ?? "Sin seleccionar"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Productos</span>
              <span className="font-medium">
                {values.lines.filter((line) => line.inventoryItemId).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Unidades</span>
              <span className="font-medium">
                {values.lines.reduce(
                  (sum, line) => sum + (line.quantity || 0),
                  0,
                )}
              </span>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base">
              <span>Total</span>
              <span className="font-semibold text-primary">
                {formatPurchaseMoney(purchaseTotal(values.lines))}
              </span>
            </div>
          </div>
        </PurchaseFormSection>
        <PurchaseFormSection
          title="Notas"
          description="Información adicional para esta compra."
        >
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="notes">Observaciones</Label>
            <Textarea
              id="notes"
              value={values.notes}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  notes: event.target.value,
                }))
              }
              placeholder="Indicaciones de entrega u observaciones internas"
            />
          </div>
        </PurchaseFormSection>
      </aside>
    </form>
  );
}
