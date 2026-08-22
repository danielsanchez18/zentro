"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { catalogCategories } from "@/lib/mock/catalog";
import { cn } from "@/lib/utils";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterGroup {
  label: string;
  options: FilterOption[];
  selected: string;
  onSelect: (value: string) => void;
}

interface FilterPopoverProps {
  /** Número total de filtros activos. */
  activeCount: number;
  /** Grupos de filtros a renderizar. */
  groups: FilterGroup[];
  /** Callback al limpiar todos los filtros. */
  onClear: () => void;
}

/**
 * Botón «Filtros» que abre un dialog con opciones de filtrado.
 * Muestra el conteo de filtros activos y permite limpiarlos.
 */
export const FilterPopover = ({
  activeCount,
  groups,
  onClear,
}: FilterPopoverProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className={cn(
          "py-2 h-fit rounded-lg px-3 transition-colors cursor-pointer",
          activeCount > 0
            ? "border-primary/50 text-primary hover:bg-primary/5"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <SlidersHorizontal className="size-3.5" />
        Filtros
        {activeCount > 0 && (
          <p className="rounded-full bg-primary leading-none h-4.5 w-4.5 text-xs flex items-center justify-center font-semibold text-primary-foreground">
            {activeCount}
          </p>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Filtros</DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            {groups.map((group) => (
              <div key={group.label}>
                <p className="text-sm font-medium mb-2">{group.label}</p>
                <div className="flex flex-wrap gap-2">
                  {group.options.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => group.onSelect(opt.value)}
                      className={cn(
                        "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer",
                        group.selected === opt.value
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground",
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="gap-x-1">
            {activeCount > 0 && (
              <Button
                variant="outline"
                onClick={() => {
                  onClear();
                  setOpen(false);
                }}
                className="px-3 rounded-full text-sm"
              >
                {/* <X className="size-3.5" /> */}
                Limpiar Filtros
              </Button>
            )}
            <Button
              variant="default"
              onClick={() => setOpen(false)}
              className="px-3 rounded-full"
            >
              Aplicar Filtros
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};