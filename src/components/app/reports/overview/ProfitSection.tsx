"use client";

import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowUp,
  ArrowUpRight,
  ChevronsUpDown,
  Package,
  SearchX,
  TrendingUp,
} from "lucide-react";
import type { ProductMargin } from "@/lib/mock/reportes";
import { EmptyState } from "@/components/ui/empty-state";
import { Search } from "@/components/app/shared/Search";
import { Paginator } from "@/components/app/shared/Paginator";
import { cn } from "@/lib/utils";
import { ReportSection, money } from "./shared";

type SortField = "item" | "change" | "price" | "sold" | "sales";
type SortDirection = "asc" | "desc";

const PAGE_SIZE = 7;

export function ProfitSection({ products }: { products: ProductMargin[] }) {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("sales");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products;
    if (q) {
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }

    return [...list].sort((a, b) => {
      let diff = 0;
      switch (sortField) {
        case "item":
          diff = a.name.localeCompare(b.name);
          break;
        case "change":
          diff = a.marginRate - b.marginRate;
          break;
        case "price": {
          const priceA = a.unitsSold > 0 ? a.revenue / a.unitsSold : 0;
          const priceB = b.unitsSold > 0 ? b.revenue / b.unitsSold : 0;
          diff = priceA - priceB;
          break;
        }
        case "sold":
          diff = a.unitsSold - b.unitsSold;
          break;
        case "sales":
        default:
          diff = a.revenue - b.revenue;
          break;
      }
      return sortDirection === "asc" ? diff : -diff;
    });
  }, [products, query, sortField, sortDirection]);

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="size-3 text-muted-foreground/60" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="size-3 text-primary" />
    ) : (
      <ArrowDown className="size-3 text-primary" />
    );
  };

  return (
    <ReportSection
      title="Rentabilidad · Top productos"
      subtitle="Margen bruto estimado (venta − costo unitario)"
      contentClassName={products.length === 0 ? undefined : "px-0 py-5"}
      // action={
      //   products.length > 0 ? (
      //     <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
      //       {products.length} productos
      //     </span>
      //   ) : undefined
      // }
    >
      {products.length === 0 ? (
        <div className="flex flex-1 items-center justify-center my-auto w-full h-full min-h-65">
          <EmptyState
            icon={TrendingUp}
            title="Sin productos con margen calculado"
            description="No hay productos vendidos con margen calculable en este período."
            className="py-6 my-auto"
          />
        </div>
      ) : (
        <div className="w-full space-y-5">
          {/* Barra de búsqueda y contador */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5">
            <Search
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Buscar producto por nombre..."
              className="w-full sm:max-w-md"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-1 items-center justify-center my-auto w-full min-h-55 p-5">
              <EmptyState
                icon={SearchX}
                title="Sin productos coincidentes"
                description="Prueba con otra búsqueda o limpia el filtro."
                className="py-6 my-auto"
              />
            </div>
          ) : (
            <>
              <div className="w-full min-w-0 max-w-full overflow-x-auto">
                <table className="w-full min-w-140 text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-accent/40 text-xs font-heading font-semibold uppercase text-muted-foreground">
                      <th
                        onClick={() => handleSort("item")}
                        className="cursor-pointer select-none px-5 py-3 transition-colors hover:text-foreground text-nowrap"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Producto</span>
                          {renderSortIcon("item")}
                        </div>
                      </th>

                      <th
                        onClick={() => handleSort("change")}
                        className="cursor-pointer select-none px-5 py-3 transition-colors hover:text-foreground text-nowrap"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Margen</span>
                          {renderSortIcon("change")}
                        </div>
                      </th>

                      <th
                        onClick={() => handleSort("price")}
                        className="cursor-pointer select-none px-5 py-3 transition-colors hover:text-foreground text-nowrap"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Precio</span>
                          {renderSortIcon("price")}
                        </div>
                      </th>

                      <th
                        onClick={() => handleSort("sold")}
                        className="cursor-pointer select-none px-5 py-3 transition-colors hover:text-foreground text-nowrap"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Vendidos</span>
                          {renderSortIcon("sold")}
                        </div>
                      </th>

                      <th
                        onClick={() => handleSort("sales")}
                        className="cursor-pointer select-none px-5 py-3 transition-colors hover:text-foreground text-nowrap text-right"
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <span>Ventas</span>
                          {renderSortIcon("sales")}
                        </div>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                    {pageItems.map((product) => {
                      const unitPrice =
                        product.unitsSold > 0
                          ? product.revenue / product.unitsSold
                          : 0;
                      const unitCost =
                        product.cost > 0 && product.unitsSold > 0
                          ? product.cost / product.unitsSold
                          : 0;

                      return (
                        <tr
                          key={product.productId}
                          className="transition-colors hover:bg-muted/30"
                        >
                          {/* Item: Thumbnail + Nombre */}
                          <td className="px-5 py-3.5 text-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-muted text-muted-foreground">
                                <Package className="size-5" />
                              </div>
                              <div className="min-w-0 max-w-xs sm:max-w-sm">
                                <p className="truncate font-medium text-foreground">
                                  {product.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Costo u. {money(unitCost)}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Change: Margen % + Indicador de tendencia */}
                          <td className="px-5 py-3.5 text-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="font-medium tabular-nums text-foreground">
                                {Math.round(product.marginRate)}%
                              </span>
                              <span
                                className={cn(
                                  "inline-flex items-center gap-0.5 text-xs font-semibold tabular-nums",
                                  product.marginRate >= 0
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-rose-600 dark:text-rose-400",
                                )}
                              >
                                {Math.abs(product.marginRate).toFixed(1)}%
                                {product.marginRate >= 0 ? (
                                  <ArrowUpRight className="size-3.5" />
                                ) : (
                                  <ArrowDownRight className="size-3.5" />
                                )}
                              </span>
                            </div>
                          </td>

                          {/* Price: Precio de venta promedio */}
                          <td className="px-5 py-3.5 text-nowrap">
                            <span className="font-medium tabular-nums text-foreground">
                              {money(unitPrice)}
                            </span>
                          </td>

                          {/* Sold: Unidades vendidas */}
                          <td className="px-5 py-3.5 text-nowrap">
                            <span className="font-medium tabular-nums text-foreground">
                              {product.unitsSold.toLocaleString("es-PE")}
                            </span>
                          </td>

                          {/* Sales: Total ingresos en negrita + Margen bruto */}
                          <td className="px-5 py-3.5 text-right text-nowrap">
                            <div>
                              <p className="font-semibold tabular-nums text-foreground">
                                {money(product.revenue)}
                              </p>
                              <p className="text-xs text-muted-foreground tabular-nums">
                                Margen {money(product.margin)}
                              </p>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Paginación si supera el tamaño de página */}
              {filtered.length > PAGE_SIZE && (
                <div className="px-5">
                  <Paginator
                    totalResults={filtered.length}
                    pageSize={PAGE_SIZE}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </ReportSection>
  );
}
