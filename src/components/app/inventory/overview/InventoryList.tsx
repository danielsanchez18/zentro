"use client";

import { useMemo, useState } from "react";
import { LayoutGrid, SearchX, Table2 } from "lucide-react";
import { Search } from "@/components/app/shared/Search";
import { FilterPopover } from "@/components/app/shared/FilterPopover";
import { Paginator } from "@/components/app/shared/Paginator";
import { EmptyState } from "@/components/ui/empty-state";
import { toastMsg } from "@/components/ui/toast-message";
import { cn } from "@/lib/utils";
import { catalogCategories } from "@/lib/mock/catalog";
import type { InventoryItem, InventoryStatus } from "@/lib/mock/inventory";
import { inventoryStatus } from "@/lib/mock/inventory";
import { InventoryCard } from "./InventoryCard";
import { InventoryTable } from "./InventoryTable";
import { InventoryPreviewDialog } from "./InventoryPreviewDialog";
import { RegisterOutputDialog } from "./RegisterOutputDialog";
import { MinimumStockDialog } from "./MinimumStockDialog";
import { InventoryHistoryDialog } from "./InventoryHistoryDialog";
import { StockAdjustmentDialog } from "./StockAdjustmentDialog";
import type { InventoryMovement } from "./types";

const PAGE_SIZE = 10;
type InventoryView = "tabla" | "cards";

const VIEWS: { id: InventoryView; label: string; icon: typeof Table2 }[] = [
  { id: "tabla", label: "Vista tabla", icon: Table2 },
  { id: "cards", label: "Vista cards", icon: LayoutGrid },
];

export function InventoryList({
  items,
  onRegisterEntry,
  onUpdateItem,
  movements,
  onAddMovement,
}: {
  items: InventoryItem[];
  onRegisterEntry: (item: InventoryItem) => void;
  onUpdateItem: (itemId: string, changes: Partial<InventoryItem>) => void;
  movements: InventoryMovement[];
  onAddMovement: (movement: InventoryMovement) => void;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<InventoryStatus | "all">("all");
  const [categoryId, setCategoryId] = useState("all");
  const [page, setPage] = useState(1);
  const [view, setView] = useState<InventoryView>("tabla");
  const [previewItem, setPreviewItem] = useState<InventoryItem | null>(null);
  const [outputItem, setOutputItem] = useState<InventoryItem | null>(null);
  const [minimumItem, setMinimumItem] = useState<InventoryItem | null>(null);
  const [historyItem, setHistoryItem] = useState<InventoryItem | null>(null);
  const [adjustmentItem, setAdjustmentItem] = useState<InventoryItem | null>(null);
  const filtered = useMemo(() => items.filter((item) => {
    const text = `${item.productName} ${item.sku} ${item.brand} ${item.supplier}`.toLowerCase();
    return text.includes(query.trim().toLowerCase()) && (status === "all" || inventoryStatus(item) === status) && (categoryId === "all" || item.categoryId === categoryId);
  }), [items, query, status, categoryId]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const activeFilterCount = (status !== "all" ? 1 : 0) + (categoryId !== "all" ? 1 : 0);
  const actionProps = {
    onOpen: setPreviewItem,
    onRegisterEntry,
    onRegisterOutput: setOutputItem,
    onEditMinStock: setMinimumItem,
    onAdjustStock: setAdjustmentItem,
    onViewHistory: setHistoryItem,
  };
  const clearFilters = () => {
    setStatus("all");
    setCategoryId("all");
    setPage(1);
  };

  return (
    <section className="space-y-5 font-heading sm:rounded-xl sm:border sm:border-border sm:bg-card sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-60 w-full flex-1 md:max-w-md">
          <Search
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Buscar producto, SKU, marca o proveedor"
          />
        </div>

        <div className="flex items-center gap-x-2">
          <FilterPopover
            activeCount={activeFilterCount}
            onClear={clearFilters}
            groups={[
              {
                label: "Estado del stock",
                options: [
                  { label: "Todos", value: "all" },
                  { label: "Disponible", value: "disponible" },
                  { label: "Stock bajo", value: "bajo" },
                  { label: "Agotado", value: "agotado" },
                ],
                selected: status,
                onSelect: (value) => {
                  setStatus(value as InventoryStatus | "all");
                  setPage(1);
                },
              },
              {
                label: "Categoría",
                options: [
                  { label: "Todas", value: "all" },
                  ...catalogCategories.map((category) => ({
                    label: category.name,
                    value: category.id,
                  })),
                ],
                selected: categoryId,
                onSelect: (value) => {
                  setCategoryId(value);
                  setPage(1);
                },
              },
            ]}
          />

          <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
            {VIEWS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setView(id)}
                aria-label={label}
                aria-pressed={view === id}
                className={cn(
                  "cursor-pointer rounded-md p-1.5 transition-colors",
                  view === id
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {status !== "all" && (
            <button type="button" onClick={() => setStatus("all")} className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10">
              {status === "bajo" ? "Stock bajo" : status === "agotado" ? "Agotado" : "Disponible"}
              <span className="ml-0.5 text-primary/60">×</span>
            </button>
          )}
          {categoryId !== "all" && (
            <button type="button" onClick={() => setCategoryId("all")} className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10">
              {catalogCategories.find((category) => category.id === categoryId)?.name}
              <span className="ml-0.5 text-primary/60">×</span>
            </button>
          )}
        </div>
      )}

      {pageItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border">
          <EmptyState icon={SearchX} title="Sin existencias coincidentes" description="Prueba con otra búsqueda o limpia los filtros." />
        </div>
      ) : (
        <>
          {view === "tabla" ? (
            <>
              <InventoryTable items={pageItems} {...actionProps} />
              <div className="grid gap-3 md:hidden">
                {pageItems.map((item) => (
                  <InventoryCard key={item.id} item={item} {...actionProps} />
                ))}
              </div>
            </>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {pageItems.map((item) => (
                <InventoryCard key={item.id} item={item} {...actionProps} />
              ))}
            </div>
          )}

          <Paginator
            totalResults={filtered.length}
            pageSize={PAGE_SIZE}
            currentPage={currentPage}
            onPageChange={setPage}
          />
        </>
      )}
      <InventoryPreviewDialog item={previewItem} open={Boolean(previewItem)} onOpenChange={(open) => !open && setPreviewItem(null)} />
      <RegisterOutputDialog item={outputItem} open={Boolean(outputItem)} onOpenChange={(open) => !open && setOutputItem(null)} onSubmit={(quantity, metadata) => {
        if (!outputItem) return;
        const resultingStock = outputItem.currentStock - quantity;
        onUpdateItem(outputItem.id, { currentStock: resultingStock, updatedAt: new Date().toISOString() });
        onAddMovement({ id: `mov_${Date.now()}`, itemId: outputItem.id, type: "salida", quantity, previousStock: outputItem.currentStock, resultingStock, createdAt: new Date().toISOString(), ...metadata });
        toastMsg.success("Salida registrada", `Se retiraron ${quantity} unidades de ${outputItem.productName}.`);
        setOutputItem(null);
      }} />
      <MinimumStockDialog item={minimumItem} open={Boolean(minimumItem)} onOpenChange={(open) => !open && setMinimumItem(null)} onSubmit={(minimumStock) => {
        if (!minimumItem) return;
        onUpdateItem(minimumItem.id, { minimumStock, updatedAt: new Date().toISOString() });
        toastMsg.success("Límite actualizado", `El stock mínimo ahora es ${minimumStock}.`);
        setMinimumItem(null);
      }} />
      <InventoryHistoryDialog item={historyItem} open={Boolean(historyItem)} onOpenChange={(open) => !open && setHistoryItem(null)} movements={movements} />
      <StockAdjustmentDialog item={adjustmentItem} open={Boolean(adjustmentItem)} onOpenChange={(open) => !open && setAdjustmentItem(null)} onSubmit={(newStock, reason) => {
        if (!adjustmentItem) return;
        const difference = newStock - adjustmentItem.currentStock;
        onUpdateItem(adjustmentItem.id, { currentStock: newStock, updatedAt: new Date().toISOString() });
        onAddMovement({ id: `mov_${Date.now()}`, itemId: adjustmentItem.id, type: "ajuste", quantity: difference, previousStock: adjustmentItem.currentStock, resultingStock: newStock, reason, createdAt: new Date().toISOString() });
        toastMsg.success("Stock ajustado", `${adjustmentItem.productName} ahora tiene ${newStock} unidades.`);
        setAdjustmentItem(null);
      }} />
    </section>
  );
}
