"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Package,
  PackagePlus,
  Pencil,
  SearchX,
  ShoppingBag,
  Tag,
  Trash2,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Search } from "@/components/app/shared/Search";
import { Paginator } from "@/components/app/shared/Paginator";
import {
  catalogCategories,
  catalogProducts,
  catalogSubcategories,
} from "@/lib/mock/catalog";

const PAGE_SIZE = 12;

/** Cuenta productos por categoría. */
const countByCategory = (catId: string) =>
  catalogProducts.filter((p) => p.categoryId === catId).length;

/** Subcategorías de una categoría. */
const subcatsOf = (catId: string) =>
  catalogSubcategories.filter((s) => s.parentId === catId);


interface CategoriesTabProps {
  slug: string;
}

/** Tab de Categorías del módulo Catálogo. */
export const CategoriesTab = ({ slug }: CategoriesTabProps) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return catalogCategories;
    return catalogCategories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q),
    );
  }, [query]);

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

  return (
    <div className="sm:p-5 font-heading sm:rounded-xl sm:border sm:border-border sm:bg-card space-y-5">
      {/* Buscador */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="w-full md:max-w-md flex-1 min-w-60">
          <Search
            placeholder="Buscar por nombre o slug"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
          />
        </div>
      </div>

      {/* Cards */}
      {pageItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border">
          <EmptyState
            icon={SearchX}
            title="Sin resultados"
            description={`No encontramos categorías que coincidan con "${query}".`}
          />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {/* Card: Nueva categoría */}
            <button
              type="button"
              onClick={() =>
                router.push(`/app/${slug}/catalogo/agregar-categoria`)
              }
              className={cn(
                "group flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border p-5",
                "transition-all duration-200 cursor-pointer min-h-50",
                "hover:border-primary hover:bg-primary/5",
              )}
            >
              <div className="flex size-12 items-center justify-center rounded-xl bg-muted/50 transition-colors group-hover:bg-primary/10">
                <PackagePlus className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground transition-colors group-hover:text-foreground">
                  Nueva categoría
                </p>
                <p className="text-sm text-muted-foreground">
                  Agregar al catálogo
                </p>
              </div>
            </button>

            {/* Cards de categorías */}
            {pageItems.map((cat) => {
              const productCount = countByCategory(cat.id);
              const subs = subcatsOf(cat.id);

              return (
                <div
                  key={cat.id}
                  onClick={() => router.push(`/app/${slug}/catalogo/categoria/${cat.id}`)}
                  className={cn(
                    "group relative cursor-pointer rounded-xl border border-border p-5",
                    "transition-all duration-200",
                    "hover:border-primary",
                  )}
                >
                  {/* Header: ícono + acciones */}
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent",
                      )}
                    >
                      <Tag className="size-4 text-muted-foreground" />
                    </div>
                    
                    {/* Nombre + slug */}
                    <div className="flex-1">
                      <p className="truncate text-sm font-medium">
                        {cat.name}
                      </p>
                      <p className="line-clamp-2 text-sm text-muted-foreground font-sans">
                        {cat.description}
                      </p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger
                        onClick={(e) => e.stopPropagation()}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
                        aria-label={`Acciones de ${cat.name}`}
                      >
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem
                          className="py-1.5 px-2"
                          onClick={() => router.push(`/app/${slug}/catalogo/categoria/${cat.id}/editar`)}
                        >
                          <Pencil />
                          Editar categoría
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          className="py-1.5 px-2"
                        >
                          <Trash2 />
                          Eliminar categoría
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Métricas */}
                  <div className="flex flex-col gap-y-3">
                    <div className="mt-4 flex items-center gap-7">
                      <div className="flex items-center gap-1">
                        <Package className="size-4 text-muted-foreground" />
                        <p className="ml-1 text-sm font-medium">
                          {productCount}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {productCount === 1 ? "producto" : "productos"}
                        </p>
                      </div>
                      {subs.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Tag className="size-4 text-muted-foreground" />
                          <span className="ml-1 text-sm font-medium tabular-nums">
                            {subs.length}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {subs.length === 1 ? "subcategoría" : "subcategorías"}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-x-7 gap-y-3">
                      <div className="flex items-center gap-x-1">
                        <ShoppingBag className="size-4 text-muted-foreground" />
                        <p className="ml-1 text-sm font-medium">14</p>
                        <p className="text-sm text-muted-foreground">pedidos sem.</p>
                      </div>

                      <div className="flex items-center gap-x-1">
                        <Wallet className="size-4 text-muted-foreground" />
                        <p className="ml-1 text-sm font-medium">S/. 120.00</p>
                        <p className="text-sm text-muted-foreground">ventas sem.</p>
                      </div>
                    </div>

                  </div>

                  {/* Subcategorías chips */}
                  {subs.length > 0 && (
                    <div className="mt-3 border-t border-border/60 pt-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {subs.slice(0, 4).map((s) => (
                          <span
                            key={s.id}
                            className={cn(
                              "inline-flex items-center rounded-full border border-border bg-muted",
                              "px-2.5 py-1.5 text-[13px] leading-none",
                              "transition-colors group-hover:border-border group-hover:bg-muted",
                            )}
                          >
                            {s.name}
                          </span>
                        ))}
                        {subs.length > 4 && (
                          <span className="text-xs text-muted-foreground">
                            +{subs.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <Paginator
            totalResults={filtered.length}
            pageSize={PAGE_SIZE}
            currentPage={currentPage}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};
