"use client";

import { useState, type ReactNode } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  SearchX,
  SlidersHorizontal,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Tipos de configuración                                             */
/* ------------------------------------------------------------------ */

export interface ListColumn {
  /** Id de la columna. */
  key: string;
  label: string;
  /** Alineación u clase extra del <th> y celdas de esa columna. */
  className?: string;
  /** Oculta la columna en pantallas móviles (puro estético). */
  srOnlyLabel?: boolean;
}

export interface ListFilterField {
  id: string;
  label: string;
  value: string;
  defaultValue: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

interface ListProps<T> {
  /** Etiqueta del recurso (singular) para textos: "miembro", "rol". */
  itemLabel: string;
  itemsLabel: string;
  /** Icono del empty state (default Users). */
  emptyIcon?: LucideIcon;
  /** Total de items tras aplicar filtros (para paginación/contador). */
  total: number;
  /** Arreglo de la página actual (ya paginado). */
  items: T[];
  columns: ListColumn[];
  renderRow: (item: T) => ReactNode;
  /* Búsqueda */
  search: string;
  onSearchChange: (value: string) => void;
  /* Filtros */
  filters: ListFilterField[];
  /** Callback opcional llamado desde el EmptyState cuando hay filtros activos. */
  onClearFilters?: () => void;
  /* Paginación */
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  pageSize: number;
}

/* ------------------------------------------------------------------ */
/* Utilidades de rango de paginación                                  */
/* ------------------------------------------------------------------ */

function getPageList(page: number, pageCount: number): (number | "…")[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1);
  const pages = new Set<number>([1, pageCount, page - 1, page, page + 1]);
  const list: (number | "…")[] = [];
  let prev = 0;
  for (const p of [...pages].filter((n) => n >= 1 && n <= pageCount).sort((a, b) => a - b)) {
    if (p - prev > 1) list.push("…");
    list.push(p);
    prev = p;
  }
  return list;
}

/**
 * Componente `List` reutilizable: Toolbar (búsqueda + filtros), Tabla y
 * Paginación. Con 0 resultados muestra el EmptyState en lugar de la tabla.
 */
export function List<T>({
  itemLabel,
  itemsLabel,
  emptyIcon = Users,
  total,
  items,
  columns,
  renderRow,
  search,
  onSearchChange,
  filters,
  onClearFilters,
  page,
  pageCount,
  onPageChange,
  pageSize,
}: ListProps<T>) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeFilterCount = filters.filter((f) => f.value !== f.defaultValue).length;
  const showEmpty = items.length === 0;
  const isFiltered = search.trim() !== "" || activeFilterCount > 0;
  const canClearFilters = isFiltered && onClearFilters !== undefined;

  /* ------------------- Renders condicionales ------------------- */
  if (showEmpty) {
    return (
      <EmptyState
        icon={isFiltered ? SearchX : emptyIcon}
        title={isFiltered ? "Sin resultados" : `Sin ${itemsLabel}`}
        description={
          isFiltered
            ? `No encontramos ${itemsLabel} que coincidan con tu búsqueda o filtros.`
            : `Todavía no hay ${itemsLabel} registrados.`
        }
        actionLabel={canClearFilters ? "Limpiar filtros" : undefined}
        onAction={onClearFilters}
      />
    );
  }

  return (
    <section className="rounded-xl border border-border bg-card">
      {/* Toolbar: búsqueda + filtros */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
        <div className="relative min-w-52 flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={`Buscar ${itemLabel}…`}
            className="pl-8"
          />
        </div>

        {/* Botón de filtros */}
        <div className="relative">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setFiltersOpen((o) => !o)}
            className={cn("gap-1.5", activeFilterCount > 0 && "border-primary/40 text-primary")}
          >
            <SlidersHorizontal className="size-4" />
            Filtros
            {activeFilterCount > 0 && (
              <span className="ml-0.5 inline-flex min-w-4 items-center justify-center rounded-full bg-primary px-1 py-0.5 text-[10px] font-medium text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </Button>

          {filtersOpen && (
            <div className="absolute right-0 top-full z-40 mt-1.5 w-64 rounded-lg bg-popover p-2 shadow-md ring-1 ring-foreground/10">
              <div className="mb-1 flex items-center justify-between px-1">
                <p className="text-xs font-medium text-muted-foreground">Filtros</p>
                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Cerrar filtros"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="space-y-2.5">
                {filters.map((f) => (
                  <div key={f.id} className="space-y-1">
                    <label className="block text-xs font-medium">{f.label}</label>
                    <Select
                      value={f.value}
                      onValueChange={(v) => {
                        f.onChange(String(v));
                        void v;
                      }}
                      items={f.options}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {f.options.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabla */}
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((col) => (
              <TableHead key={col.key} className={col.className}>
                {col.srOnlyLabel ? <span className="sr-only">{col.label}</span> : col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>{items.map(renderRow)}</TableBody>
      </Table>

      {/* Paginación: "10 de 10 miembros" < 1 2 3 > */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">
            {Math.min(page * pageSize, total)}
          </span>{" "}
          de{" "}
          <span className="font-semibold text-foreground">{total}</span> {itemsLabel}
        </p>

        {pageCount > 1 && (
          <nav className="flex items-center gap-1" aria-label="Paginación">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              aria-label="Página anterior"
            >
              <ChevronLeft className="size-4" />
            </Button>

            {getPageList(page, pageCount).map((p, i) =>
              p === "…" ? (
                <span key={`gap-${i}`} className="px-1 text-sm text-muted-foreground">
                  …
                </span>
              ) : (
                <Button
                  key={p}
                  type="button"
                  variant={p === page ? "default" : "ghost"}
                  size="icon-sm"
                  onClick={() => onPageChange(p)}
                  aria-current={p === page ? "page" : undefined}
                >
                  {p}
                </Button>
              ),
            )}

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={page >= pageCount}
              onClick={() => onPageChange(page + 1)}
              aria-label="Página siguiente"
            >
              <ChevronRight className="size-4" />
            </Button>
          </nav>
        )}
      </div>
    </section>
  );
}