"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Check,
  Package,
  Search,
  Tags,
  Trash2,
} from "lucide-react";
import {
  catalogCategories,
  catalogProducts,
  categoryName,
  type CatalogCategory,
  type CatalogProduct,
} from "@/lib/mock/catalog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FormSection } from "./FormSection";
import type { PromotionFormValues } from "./types";

function formatItemPrice(basePrice?: number): string {
  if (basePrice === undefined) return "S/. 0.00";
  const price = basePrice >= 100 ? basePrice / 100 : basePrice;
  return `S/. ${price.toFixed(2)}`;
}

export function PromotionScopeSection({
  values,
  errors,
  onChange,
  onToggleTarget,
}: {
  values: PromotionFormValues;
  errors: Record<string, string>;
  onChange: (
    field: keyof PromotionFormValues,
    value: string | string[] | Record<string, number>,
  ) => void;
  onToggleTarget: (id: string) => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogSearch, setDialogSearch] = useState("");
  const [stagedIds, setStagedIds] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!showSuggestions) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSuggestions]);

  const isProducts = values.scope === "productos";

  // Active categories for categories view
  const activeCategories = useMemo<CatalogCategory[]>(() => {
    return catalogCategories.filter((cat) => cat.status === "activo");
  }, []);

  // Active products for products view
  const activeProducts = useMemo<CatalogProduct[]>(() => {
    return catalogProducts.filter((p) => p.status === "activo");
  }, []);

  // Products selected in the form
  const selectedProducts = useMemo<CatalogProduct[]>(() => {
    return values.targetIds
      .map((id) => activeProducts.find((p) => p.id === id))
      .filter((p): p is CatalogProduct => Boolean(p));
  }, [values.targetIds, activeProducts]);

  // Dialog handlers
  const handleOpenDialog = () => {
    setStagedIds([...values.targetIds]);
    setDialogSearch("");
    setShowSuggestions(false);
    setDialogOpen(true);
  };

  const handleConfirmDialog = () => {
    onChange("targetIds", stagedIds);

    // Initialize units to 1 for newly added products if not yet set
    const currentUnits = { ...(values.targetUnits ?? {}) };
    stagedIds.forEach((id) => {
      if (!currentUnits[id]) {
        currentUnits[id] = 1;
      }
    });
    onChange("targetUnits", currentUnits);
    setDialogOpen(false);
  };

  const handleRemoveProduct = (id: string) => {
    onChange(
      "targetIds",
      values.targetIds.filter((targetId) => targetId !== id),
    );
    if (values.targetUnits && values.targetUnits[id]) {
      const nextUnits = { ...values.targetUnits };
      delete nextUnits[id];
      onChange("targetUnits", nextUnits);
    }
  };

  const handleUnitChange = (id: string, newUnits: number) => {
    const currentUnits = values.targetUnits ?? {};
    onChange("targetUnits", {
      ...currentUnits,
      [id]: Math.max(1, newUnits),
    });
  };

  // Filter available products inside the dialog (excluding already staged)
  const filteredAvailableInDialog = useMemo(() => {
    const query = dialogSearch.trim().toLowerCase();
    return activeProducts.filter((item) => {
      if (stagedIds.includes(item.id)) return false;
      if (!query) return true;
      const cat = categoryName(item.categoryId).toLowerCase();
      return item.name.toLowerCase().includes(query) || cat.includes(query);
    });
  }, [activeProducts, stagedIds, dialogSearch]);

  // Products staged inside the dialog
  const stagedItems = useMemo<CatalogProduct[]>(() => {
    return stagedIds
      .map((id) => activeProducts.find((p) => p.id === id))
      .filter((p): p is CatalogProduct => Boolean(p));
  }, [stagedIds, activeProducts]);

  const handleStageItem = (id: string) => {
    if (!stagedIds.includes(id)) {
      setStagedIds((prev) => [...prev, id]);
    }
    setDialogSearch("");
    setShowSuggestions(false);
    searchInputRef.current?.blur();
  };

  const handleUnstageItem = (id: string) => {
    setStagedIds((prev) => prev.filter((itemId) => itemId !== id));
  };

  // Quick actions for categories
  const handleSelectAllCategories = () => {
    onChange(
      "targetIds",
      activeCategories.map((c) => c.id),
    );
  };

  const handleClearCategories = () => {
    onChange("targetIds", []);
  };

  return (
    <FormSection
      title="Aplicar a "
      description="Selecciona dónde estará disponible la promoción."
    >
      <div className="grid gap-5">
        {/* 1. Selector de Alcance (Tabs con rounded-lg) */}
        <div>
          <div className="flex w-fit items-center gap-1">
            <button
              type="button"
              onClick={() => {
                if (values.scope !== "productos") {
                  onChange("scope", "productos");
                  onChange("targetIds", []);
                  onChange("targetUnits", {});
                }
              }}
              className={cn(
                "flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-all",
                isProducts
                  ? "bg-primary font-medium text-primary-foreground"
                  : "bg-primary/8 text-foreground/70 hover:text-foreground",
              )}
            >
              <Package className="size-4" />
              <span>Productos</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (values.scope !== "categorias") {
                  onChange("scope", "categorias");
                  onChange("targetIds", []);
                  onChange("targetUnits", {});
                }
              }}
              className={cn(
                "flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-all",
                !isProducts
                  ? "bg-primary font-medium text-primary-foreground"
                  : "bg-primary/8 text-foreground/70 hover:text-foreground",
              )}
            >
              <Tags className="size-4" />
              <span>Categorías</span>
            </button>
          </div>
        </div>

        {/* 2. Sección de PRODUCTOS */}
        {isProducts && (
          <div>
            {selectedProducts.length === 0 ? (
              /* Placeholder cuando no hay productos seleccionados */
              <div className="">
                <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
                  <div className="mb-3 flex size-11 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Package className="size-5" />
                  </div>
                  <h4 className="font-sans font-medium text-foreground">
                    No has seleccionado ningún producto
                  </h4>
                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    Añade los productos específicos a los que se les aplicará el
                    beneficio de esta promoción.
                  </p>
                  <Button
                    type="button"
                    onClick={handleOpenDialog}
                    className="mt-4 rounded-full"
                  >
                    <span>Agregar producto</span>
                  </Button>
                </div>
              </div>
            ) : (
              /* Lista de productos con estilo de SupplierProducts */
              <section className="">
                <div className="divide-y divide-border">
                  {selectedProducts.map((product) => (
                    <article
                      key={product.id}
                      className="flex items-center justify-between gap-4 py-3 transition-colors hover:bg-muted/10"
                    >
                      <div className="flex min-w-0 flex-1 items-start gap-3.5">
                        {/* Thumbnail / Icono del producto */}
                        <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/50 text-muted-foreground">
                          <Package className="size-6 stroke-[1.5]" />
                        </div>

                        {/* Contenido: Nombre, Descripción, Precio y Unidades */}
                        <div className="min-w-0 flex-1 mt-1">
                          <p className="font-heading truncate text-sm font-medium text-foreground">
                            {product.name}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {product.description ||
                              categoryName(product.categoryId)}
                          </p>

                          {/* Precio y Unidades */}
                          <div className="flex items-center gap-2 mt-3">
                            <span className="text-sm font-medium text-foreground font-mono tabular-nums">
                              {formatItemPrice(product.basePrice)}
                            </span>
                            <input
                              type="number"
                              min={1}
                              value={values.targetUnits?.[product.id] ?? 1}
                              onChange={(e) =>
                                handleUnitChange(
                                  product.id,
                                  parseInt(e.target.value, 10) || 1,
                                )
                              }
                              className="ml-5 h-fit py-1.5 w-12 rounded-md border border-input bg-background text-center text-sm font-medium text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            />
                            <span className="text-sm text-muted-foreground">
                              uds.
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Botón para remover */}
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(product.id)}
                        className="cursor-pointer shrink-0 rounded-lg p-1.5 text-destructive/80 transition-colors hover:bg-destructive/10 hover:text-destructive"
                        title="Remover producto"
                      >
                        <Trash2 className="size-4.5" />
                      </button>
                    </article>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleOpenDialog}
                  className="w-full mt-5 h-fit py-2"
                >
                  <span>Agregar producto</span>
                </Button>
              </section>
            )}
          </div>
        )}

        {/* 3. Sección de CATEGORÍAS (Mini Cards con icono, nombre y productos afectados) */}
        {!isProducts && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm">
                Selecciona las categorías que recibirán el beneficio:
              </span>
              <div className="flex items-center gap-2 text-sm">
                {values.targetIds.length < activeCategories.length && (
                  <button
                    type="button"
                    onClick={handleSelectAllCategories}
                    className="cursor-pointer px-3 py-2 leading-none rounded-lg bg-primary/20 hover:bg-accent/80 text-primary font-medium"
                  >
                    Seleccionar todas
                  </button>
                )}
                {values.targetIds.length > 0 && (
                  <>
                    <button
                      type="button"
                      onClick={handleClearCategories}
                      className="cursor-pointer px-3 py-2 leading-none rounded-lg bg-primary/20 hover:bg-accent/80 text-primary font-medium"
                    >
                      Deseleccionar
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {activeCategories.map((category) => {
                const isSelected = values.targetIds.includes(category.id);
                const associatedProducts = activeProducts.filter(
                  (p) => p.categoryId === category.id,
                );

                return (
                  <div
                    key={category.id}
                    onClick={() => onToggleTarget(category.id)}
                    className={cn(
                      "group relative flex cursor-pointer items-start gap-3.5 rounded-xl border p-3.5 text-left transition-all",
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary/25"
                        : "border-border bg-card hover:border-border/80 hover:bg-accent/40",
                    )}
                  >
                    {/* Icono de categoría */}
                    <div
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-lg border transition-colors",
                        isSelected
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-border bg-muted/60 text-muted-foreground group-hover:text-foreground",
                      )}
                    >
                      <Tags className="size-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate font-heading text-sm font-semibold text-foreground">
                          {category.name}
                        </p>
                        <div
                          className={cn(
                            "flex size-4.5 shrink-0 items-center justify-center rounded border transition-colors",
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground/30 bg-background group-hover:border-primary/60",
                          )}
                        >
                          {isSelected && <Check className="size-3 stroke-3" />}
                        </div>
                      </div>

                      {/* Productos asociados afectados */}
                      <p className="mt-1 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground font-heading">
                          {associatedProducts.length}{" "}
                          {associatedProducts.length === 1
                            ? "producto afectado"
                            : "productos afectados"}
                        </span>
                        <div className="line-clamp-1">
                          {associatedProducts.length > 0 && (
                            <span className="block text-muted-foreground font-heading">
                              {associatedProducts.map((p) => p.name).join(", ")}
                            </span>
                          )}
                        </div>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Error de validación */}
        {errors.targetIds && (
          <p className="text-xs font-normal text-destructive">
            {errors.targetIds}
          </p>
        )}

        {/* 4. Dialog para Seleccionar Productos */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent initialFocus={false} className="gap-4 sm:max-w-lg">
            <DialogHeader className="p-0">
              <DialogTitle>Agregar productos</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Contenedor del Buscador y Sugerencias */}
              <div ref={searchContainerRef} className="space-y-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    ref={searchInputRef}
                    value={dialogSearch}
                    onChange={(e) => {
                      setDialogSearch(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onClick={() => setShowSuggestions(true)}
                    placeholder="Buscar producto por nombre o categoría..."
                    className="h-10 rounded-lg pl-9 pr-8 text-sm"
                  />
                  {dialogSearch && (
                    <button
                      type="button"
                      onClick={() => setDialogSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Sugerencias / Resultados disponibles (solo cuando se dio clic al input) */}
                {showSuggestions && (
                  <div>
                    {filteredAvailableInDialog.length > 0 ? (
                      <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-border/60 bg-muted/20 p-1.5">
                        {filteredAvailableInDialog.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleStageItem(item.id)}
                            className="group flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg p-2 text-left transition-colors hover:bg-accent"
                          >
                            <div className="flex min-w-0 flex-1 items-start gap-2.5">
                              <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted text-muted-foreground group-hover:text-foreground">
                                {item.image ? (
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={40}
                                    height={40}
                                    className="size-full object-cover"
                                  />
                                ) : (
                                  <Package className="size-5 stroke-[1.5]" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                                  {item.name}
                                </p>
                                <p className="truncate text-sm text-muted-foreground line-clamp-1">
                                  {item.description ||
                                    categoryName(item.categoryId)}
                                </p>
                              </div>
                            </div>
                            <span className="shrink-0 text-sm font-medium tabular-nums text-foreground">
                              {formatItemPrice(item.basePrice)}
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : dialogSearch.trim() ? (
                      <p className="py-2.5 text-center text-xs text-muted-foreground">
                        No se encontraron productos que coincidan con &ldquo;
                        {dialogSearch}&rdquo;.
                      </p>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Lista de productos staged listos para agregar o Empty State */}
              <div>
                {stagedItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center px-4 py-8 text-center border rounded-xl border-dashed border-border/70">
                    <div className="mb-3 flex size-11 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <Package className="size-5" />
                    </div>
                    <h4 className="font-sans font-medium text-foreground">
                      No has seleccionado ningún producto
                    </h4>
                    <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                      Haz clic en los productos de arriba para agregarlos a la
                      promoción.
                    </p>
                  </div>
                ) : (
                  <div className="max-h-56 space-y-2 overflow-y-auto pr-0.5">
                    <p className="text-sm font-medium text-muted-foreground mb-5">
                      Productos seleccionados ({stagedItems.length}):
                    </p>
                    {stagedItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 p-2.5 transition-all"
                      >
                        <div className="flex min-w-0 flex-1 items-start gap-2.5">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={40}
                                height={40}
                                className="size-full rounded-lg object-cover"
                              />
                            ) : (
                              <Package className="size-5 stroke-[1.5]" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">
                              {item.name}
                            </p>
                            <p className="truncate text-sm text-muted-foreground line-clamp-1">
                              {item.description ||
                                categoryName(item.categoryId)}{" "}
                              · {formatItemPrice(item.basePrice)}
                            </p>
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUnstageItem(item.id)}
                          className="h-7 px-2 text-xs font-medium text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          Remover
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer con botones Cerrar y Agregar */}
            <DialogFooter className="flex flex-row items-center justify-end gap-2 border-t border-border pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="px-3 rounded-full"
              >
                Cerrar
              </Button>
              <Button
                type="button"
                onClick={handleConfirmDialog}
                className="px-3 rounded-full"
              >
                Agregar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </FormSection>
  );
}
