"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroup {
  label: string;
  options: FilterOption[];
  selected: string;
  onSelect: (value: string) => void;
}

export interface FilterSheetProps {
  /** Número total de filtros activos. */
  activeCount: number;
  /** Grupos de filtros a renderizar. */
  groups: FilterGroup[];
  /** Callback al limpiar todos los filtros. */
  onClear: () => void;
  /** Título del sheet (por defecto "Filtros"). */
  title?: string;
  /** Descripción del sheet. */
  description?: string;
  className?: string;
}

/**
 * Componente «FilterSheet»: Panel lateral deslizable para filtros con múltiples opciones
 * y categorías, ideal para módulos con alta densidad de opciones (agenda, inventario, etc.).
 */
export function FilterSheet({
  activeCount,
  groups,
  onClear,
  title = "Filtros",
  description = "Refina la vista seleccionando las opciones deseadas.",
  className,
}: FilterSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Botón Disparador */}
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className={cn(
          "py-2 h-fit rounded-lg px-3 transition-colors cursor-pointer gap-2",
          activeCount > 0
            ? "border-primary/50 text-primary hover:bg-primary/5 font-medium"
            : "text-muted-foreground hover:text-foreground",
          className,
        )}
      >
        <SlidersHorizontal className="size-3.5" />
        <span>Filtros</span>
        {activeCount > 0 && (
          <span className="rounded-full bg-primary leading-none h-4.5 w-4.5 text-xs flex items-center justify-center font-semibold text-primary-foreground">
            {activeCount}
          </span>
        )}
      </Button>

      {/* Sheet Lateral */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="sm:max-w-md w-full flex flex-col p-0 gap-0"
        >
          {/* Cabecera */}
          <SheetHeader className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-base font-medium">{title}</SheetTitle>
              {activeCount > 0 && (
                <span className="rounded-full bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5">
                  {activeCount} activo{activeCount > 1 ? "s" : ""}
                </span>
              )}
            </div>
            {description && (
              <SheetDescription className="text-sm mt-0.5">
                {description}
              </SheetDescription>
            )}
          </SheetHeader>

          {/* Cuerpo Scrollable con Grupos de Filtros */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {groups.map((group) => {
              const isGroupFiltered =
                group.selected !== "all" && Boolean(group.selected);

              return (
                <div key={group.label} className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground font-heading">
                      {group.label}
                    </span>
                    {isGroupFiltered && (
                      <button
                        type="button"
                        onClick={() => group.onSelect("all")}
                        className="text-sm text-primary font-medium hover:underline cursor-pointer"
                      >
                        Limpiar
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {group.options.map((opt) => {
                      const isSelected = group.selected === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => group.onSelect(opt.value)}
                          className={cn(
                            "cursor-pointer rounded-lg border px-2.5 py-1.5 text-sm font-medium transition-colors text-left",
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground font-semibold shadow-xs"
                              : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50",
                          )}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pie de Acciones */}
          <SheetFooter className="border-t border-border flex-row items-center justify-between gap-2 p-4 mt-auto">
            {activeCount > 0 ? (
              <Button
                type="button"
                variant="outline"
                onClick={onClear}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 px-3 cursor-pointer"
              >
                Limpiar filtros ({activeCount})
              </Button>
            ) : (
              <div />
            )}

            <Button
              type="button"
              onClick={() => setOpen(false)}
              className="px-3 cursor-pointer"
            >
              Listo
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
