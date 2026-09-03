"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpDown,
  Check,
  LayoutGrid,
  SearchX,
  Table2,
} from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Search } from "@/components/app/shared/Search";
import { FilterPopover } from "@/components/app/shared/FilterPopover";
import { Paginator } from "@/components/app/shared/Paginator";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type {
  InventoryMovementRecord,
  InventoryMovementType,
} from "@/lib/mock/inventory-movements";
import { MovementCard } from "./MovementCard";
import { MovementTable } from "./MovementTable";
import { MovementPreviewDialog } from "./MovementPreviewDialog";
import { DateRangeFilter } from "./DateRangeFilter";

const PAGE_SIZE = 10;

export function MovementsList({
  movements,
  initialItemId,
}: {
  movements: InventoryMovementRecord[];
  initialItemId?: string;
}) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<InventoryMovementType | "all">("all");
  const [itemId, setItemId] = useState(initialItemId ?? "all");
  const [view, setView] = useState<"table" | "cards">("table");
  const [page, setPage] = useState(1);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest" | null>(null);
  const [sortOpen, setSortOpen] = useState(false);
  const [selected, setSelected] = useState<InventoryMovementRecord | null>(
    null,
  );
  const products = useMemo(
    () =>
      Array.from(
        new Map(
          movements.map((movement) => [
            movement.itemId,
            { label: movement.productName, value: movement.itemId },
          ]),
        ).values(),
      ),
    [movements],
  );
  const filtered = useMemo(
    () =>
      movements
        .filter(
          (movement) =>
            `${movement.productName} ${movement.sku} ${movement.documentRef ?? ""} ${movement.reason}`
              .toLowerCase()
              .includes(query.trim().toLowerCase()) &&
            (type === "all" || movement.type === type) &&
            (itemId === "all" || movement.itemId === itemId) &&
            (!from ||
              new Date(movement.createdAt) >= new Date(`${from}T00:00:00`)) &&
            (!to || new Date(movement.createdAt) <= new Date(`${to}T23:59:59`)),
        )
        .sort((a, b) =>
          sort === "oldest"
            ? Date.parse(a.createdAt) - Date.parse(b.createdAt)
            : Date.parse(b.createdAt) - Date.parse(a.createdAt),
        ),
    [movements, query, type, itemId, from, to, sort],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const activeCount =
    Number(type !== "all") +
    Number(itemId !== "all") +
    Number(Boolean(from || to));
  const sortLabel =
    sort === "newest"
      ? "Más recientes"
      : sort === "oldest"
        ? "Más antiguos"
        : "Ordenar por";
  const sortOptions: { id: "newest" | "oldest"; label: string }[] = [
    { id: "newest", label: "Más recientes" },
    { id: "oldest", label: "Más antiguos" },
  ];

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
            placeholder="Buscar producto, SKU, motivo o documento"
          />
        </div>
        <div className="flex items-center gap-2">
          <FilterPopover
            activeCount={activeCount}
            onClear={() => {
              setType("all");
              setItemId("all");
              setFrom("");
              setTo("");
              setPage(1);
            }}
            groups={[
              {
                label: "Tipo de movimiento",
                options: [
                  { label: "Todos", value: "all" },
                  { label: "Entradas", value: "entrada" },
                  { label: "Salidas", value: "salida" },
                  { label: "Mermas", value: "merma" },
                  { label: "Ajustes", value: "ajuste" },
                ],
                selected: type,
                onSelect: (value) => {
                  setType(value as InventoryMovementType | "all");
                  setPage(1);
                },
              },
              {
                label: "Producto",
                options: [{ label: "Todos", value: "all" }, ...products],
                selected: itemId,
                onSelect: (value) => {
                  setItemId(value);
                  setPage(1);
                },
              },
            ]}
          />
          <DateRangeFilter
            from={from}
            to={to}
            onFromChange={(value) => {
              setFrom(value);
              setPage(1);
            }}
            onToChange={(value) => {
              setTo(value);
              setPage(1);
            }}
            onClear={() => {
              setFrom("");
              setTo("");
              setPage(1);
            }}
          />
          <Popover open={sortOpen} onOpenChange={setSortOpen}>
            <PopoverTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="h-fit rounded-lg px-3 py-2"
                />
              }
            >
              <ArrowUpDown className="size-3.5" />
              <span className="hidden sm:inline">{sortLabel}</span>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-40 p-0">
              <div className="py-1 px-1">
                {sortOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setSort(sort === option.id ? null : option.id);
                      setPage(1);
                      setSortOpen(false);
                    }}
                    className="flex w-full cursor-pointer items-center rounded-lg px-2.5 py-2 text-sm hover:bg-accent"
                  >
                    <span className="flex-1 text-left">{option.label}</span>
                    {sort === option.id && (
                      <Check className="size-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
            {[
              { id: "table" as const, label: "Vista tabla", icon: Table2 },
              { id: "cards" as const, label: "Vista cards", icon: LayoutGrid },
            ].map(({ id, label, icon: Icon }) => (
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
      {activeCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {type !== "all" && (
            <FilterChip label={type} onClear={() => setType("all")} />
          )}
          {itemId !== "all" && (
            <FilterChip
              label={
                products.find((product) => product.value === itemId)?.label ??
                "Producto"
              }
              onClear={() => setItemId("all")}
            />
          )}
          {(from || to) && (
            <FilterChip
              label={`${from || "Inicio"} — ${to || "Hoy"}`}
              onClear={() => {
                setFrom("");
                setTo("");
              }}
            />
          )}
        </div>
      )}
      {pageItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border">
          <EmptyState
            icon={SearchX}
            title="Sin movimientos coincidentes"
            description="Prueba otra búsqueda o limpia los filtros."
          />
        </div>
      ) : (
        <>
          {view === "table" ? (
            <>
              <MovementTable movements={pageItems} onOpen={setSelected} />
              <div className="grid gap-3 md:hidden">
                {pageItems.map((movement) => (
                  <MovementCard
                    key={movement.id}
                    movement={movement}
                    onOpen={setSelected}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {pageItems.map((movement) => (
                <MovementCard
                  key={movement.id}
                  movement={movement}
                  onOpen={setSelected}
                />
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
      <MovementPreviewDialog
        movement={selected}
        open={Boolean(selected)}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </section>
  );
}

function FilterChip({
  label,
  onClear,
}: {
  label: string;
  onClear: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClear}
      className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium capitalize text-primary hover:bg-primary/10"
    >
      {label}
      <span className="ml-0.5 text-primary/60">×</span>
    </button>
  );
}
