"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CommonDialogProps } from "./types";

interface MinimumStockDialogProps extends CommonDialogProps {
  onSubmit: (minimum: number) => void;
}

export function MinimumStockDialog({
  item,
  open,
  onOpenChange,
  onSubmit,
}: MinimumStockDialogProps) {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md font-heading">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const value = Number(
              new FormData(event.currentTarget).get("minimum")
            );
            if (Number.isInteger(value) && value >= 0) onSubmit(value);
          }}
          className="space-y-5"
        >
          <DialogHeader>
            <DialogTitle>Editar stock mínimo</DialogTitle>
            <DialogDescription>
              Define cuándo {item.productName} debe marcarse con stock bajo.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-y-2">
            <label htmlFor="minimum-stock" className="text-sm font-medium">
              Unidades mínimas
            </label>
            <Input
              key={item.id}
              id="minimum-stock"
              name="minimum"
              type="number"
              min={0}
              defaultValue={item.minimumStock}
              required
              className="px-4 py-2.25 h-fit"
            />
          </div>

          <DialogFooter className="gap-x-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-full px-3"
            >
              Cancelar
            </Button>
            <Button type="submit" className="rounded-full px-3">
              Guardar límite
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
