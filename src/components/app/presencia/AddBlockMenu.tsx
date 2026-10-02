"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { BLOCK_DEFS, type BlockType } from "@/lib/mock/web-presence";

interface AddBlockMenuProps {
  onSelect: (type: BlockType) => void;
}

/**
 * Menú de bloques disponibles. El prototipo no implementa drag & drop, así que
 * el alta es explícita desde este desplegable.
 */
export const AddBlockMenu = ({ onSelect }: AddBlockMenuProps) => {
  const [open, setOpen] = useState(false);
  const types = Object.keys(BLOCK_DEFS) as BlockType[];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
      >
        <Plus className="size-4" />
        Agregar bloque
        {open ? (
          <ChevronDown className="size-3.5" />
        ) : (
          <ChevronRight className="size-3.5" />
        )}
      </button>

      {open && (
        <div className="mt-2 grid gap-1 rounded-lg border border-border bg-card p-2 shadow-sm sm:grid-cols-2">
          {types.map((type) => {
            const def = BLOCK_DEFS[type];
            return (
              <button
                key={type}
                type="button"
                onClick={() => {
                  onSelect(type);
                  setOpen(false);
                }}
                className="cursor-pointer rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted/50"
              >
                <span className="block text-sm font-medium text-foreground">
                  {def.label}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {def.description}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};