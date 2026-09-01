"use client";

import { useMemo, useState } from "react";
import { LayoutGrid, SearchX, Table2 } from "lucide-react";
import { toastMsg } from "@/components/ui/toast-message";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import { Search } from "@/components/app/shared/Search";
import { Paginator } from "@/components/app/shared/Paginator";
import { ProductCard } from "./ProductCard";
import { ProductTable } from "./ProductTable";
import { FilterPopover } from "./FilterPopover";
import { ProductPreviewDialog } from "./ProductPreviewDialog";
import { ConfirmDialog } from "@/components/app/team/ConfirmDialog";
import {
  catalogProducts,
  catalogCategories,
  type CatalogProduct,
} from "@/lib/mock/catalog";

const PAGE_SIZE = 10;

type ProductView = "tabla" | "cards";

interface ProductListProps {
  initialProducts?: CatalogProduct[];
  slug: string;
}

const VIEWS: { id: ProductView; label: string; icon: typeof Table2 }[] = [
  { id: "tabla", label: "Vista tabla", icon: Table2 },
  { id: "cards", label: "Vista cards", icon: LayoutGrid },
];

/**
 * Lista de productos del módulo Catálogo.
 * Orquesta búsqueda, filtros, paginación, vistas (tabla/cards) y acciones (mock).
 *
 * Sigue el mismo patrón que el módulo Equipo:
 *  - Estado de productos con mutaciones (toggle status, remove)
 *  - Preview → dialog resumen → "Ver detalle completo" navega a la página
 *  - ConfirmDialog para activar/desactivar y eliminar
 */
export const ProductList = ({
  initialProducts = catalogProducts,
  slug,
}: ProductListProps) => {
  const [products, setProducts] =
    useState<CatalogProduct[]>(initialProducts);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [view, setView] = useState<ProductView>("cards");

  // Producto cuyo preview se muestra (null = cerrado).
  const [previewProduct, setPreviewProduct] = useState<CatalogProduct | null>(null);
  // Confirmación de activar/desactivar.
  const [toggleStatusProduct, setToggleStatusProduct] = useState<CatalogProduct | null>(null);
  // Confirmación de eliminar.
  const [removeProduct, setRemoveProduct] = useState<CatalogProduct | null>(null);

  const activeFilterCount =
    (categoryFilter !== "all" ? 1 : 0) + (statusFilter !== "all" ? 1 : 0);

  const filtered = useMemo(() => {
    let result = products;

    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    if (categoryFilter !== "all") {
      result = result.filter((p) => p.categoryId === categoryFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter);
    }

    return result;
  }, [products, query, categoryFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const handleToggleStatus = (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const activating = target.status === "inactivo";
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: activating ? "activo" : "inactivo" }
          : p,
      ),
    );
    toastMsg.success(
      activating ? "Producto activado" : "Producto desactivado",
      `${target.name} ahora está ${activating ? "activo" : "inactivo"}.`,
    );
  };

  const handleRemove = (id: string) => {
    const name = products.find((p) => p.id === id)?.name ?? "Producto";
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toastMsg.info(
      `${name} eliminado del catálogo`,
      "Mockup: se enviará confirmación antes de borrar de verdad.",
    );
  };

  const clearFilters = () => {
    setCategoryFilter("all");
    setStatusFilter("all");
    setPage(1);
  };

  return (
    <div className="sm:p-5 font-heading sm:rounded-xl sm:border sm:border-border sm:bg-card space-y-5">
      {/* Barra de búsqueda + filtros + vista */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="w-full md:max-w-md flex-1 min-w-60">
          <Search
            placeholder="Buscar por nombre"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-x-2">
          <FilterPopover
            activeCount={activeFilterCount}
            onClear={clearFilters}
            groups={[
              {
                label: "Categoría",
                options: [
                  { label: "Todas", value: "all" },
                  ...catalogCategories.map((c) => ({
                    label: c.name,
                    value: c.id,
                  })),
                ],
                selected: categoryFilter,
                onSelect: (v) => {
                  setCategoryFilter(v);
                  setPage(1);
                },
              },
              {
                label: "Estado",
                options: [
                  { label: "Todos", value: "all" },
                  { label: "Activo", value: "activo" },
                  { label: "Inactivo", value: "inactivo" },
                ],
                selected: statusFilter,
                onSelect: (v) => {
                  setStatusFilter(v);
                  setPage(1);
                },
              },
            ]}
          />

          {/* Toggle tabla / cards */}
          <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
            {VIEWS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setView(id)}
                aria-label={label}
                aria-pressed={view === id}
                className={cn(
                  "rounded-md p-1.5 transition-colors cursor-pointer",
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

      {/* Filtros activos (chips) */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {categoryFilter !== "all" && (
            <button
              type="button"
              onClick={() => setCategoryFilter("all")}
              className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 cursor-pointer"
            >
              {catalogCategories.find((c) => c.id === categoryFilter)?.name}
              <span className="ml-0.5 text-primary/60">×</span>
            </button>
          )}
          {statusFilter !== "all" && (
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 cursor-pointer"
            >
              {statusFilter === "activo" ? "Activo" : "Inactivo"}
              <span className="ml-0.5 text-primary/60">×</span>
            </button>
          )}
        </div>
      )}

      {pageItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border">
          <EmptyState
            icon={SearchX}
            title="Sin resultados"
            description={`No encontramos productos que coincidan con "${query}".`}
          />
        </div>
      ) : (
        <>
          {view === "tabla" ? (
            <ProductTable
              products={pageItems}
              onPreview={setPreviewProduct}
              onEdit={() => {}}
              onRequestToggleStatus={setToggleStatusProduct}
              onRequestRemove={setRemoveProduct}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {pageItems.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPreview={setPreviewProduct}
                  onEdit={() => {}}
                  onRequestToggleStatus={setToggleStatusProduct}
                  onRequestRemove={setRemoveProduct}
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

      {/* ── Dialogs ─────────────────────────────────────────────── */}

      <ProductPreviewDialog
        product={previewProduct}
        slug={slug}
        open={previewProduct !== null}
        onOpenChange={(open) => !open && setPreviewProduct(null)}
      />

      <ConfirmDialog
        open={toggleStatusProduct !== null}
        onOpenChange={(open) => !open && setToggleStatusProduct(null)}
        title={
          toggleStatusProduct?.status === "inactivo"
            ? "Activar producto"
            : "Desactivar producto"
        }
        description={
          toggleStatusProduct?.status === "inactivo"
            ? `${toggleStatusProduct?.name} volverá a estar visible en el POS.`
            : `${toggleStatusProduct?.name} no será visible en el POS mientras esté desactivado.`
        }
        confirmLabel={
          toggleStatusProduct?.status === "inactivo" ? "Activar" : "Desactivar"
        }
        onConfirm={() => {
          if (toggleStatusProduct) handleToggleStatus(toggleStatusProduct.id);
        }}
      />

      <ConfirmDialog
        open={removeProduct !== null}
        onOpenChange={(open) => !open && setRemoveProduct(null)}
        title="Eliminar producto"
        description={`${removeProduct?.name} será eliminado del catálogo permanentemente. Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        onConfirm={() => {
          if (removeProduct) handleRemove(removeProduct.id);
        }}
      />
    </div>
  );
};
