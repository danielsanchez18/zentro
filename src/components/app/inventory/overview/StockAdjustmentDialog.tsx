"use client";

import { type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { CommonDialogProps } from "./types";

export function StockAdjustmentDialog({ item, open, onOpenChange, onSubmit }: CommonDialogProps & { onSubmit: (newStock: number, reason: string) => void }) {
  if (!item) return null;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newStock = Number(data.get("newStock"));
    const reason = String(data.get("reason") ?? "").trim();
    if (!Number.isInteger(newStock) || newStock < item.reservedStock || !reason) return;
    onSubmit(newStock, reason);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="font-heading sm:max-w-md">
        <form onSubmit={submit} className="space-y-5">
          <DialogHeader>
            <DialogTitle>Ajustar stock físico</DialogTitle>
            <DialogDescription>{item.productName} tiene {item.currentStock} unidades registradas y {item.reservedStock} reservadas.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-2">
            <label htmlFor="adjusted-stock" className="text-sm font-medium">Nuevo stock físico</label>
            <Input id="adjusted-stock" name="newStock" type="number" min={item.reservedStock} defaultValue={item.currentStock} required className="h-fit px-4 py-2.25" />
            <p className="text-xs text-muted-foreground">No puede ser menor que el stock reservado.</p>
          </div>
          <div className="flex flex-col gap-y-2">
            <label htmlFor="adjustment-reason" className="text-sm font-medium">Motivo del ajuste</label>
            <Input id="adjustment-reason" name="reason" placeholder="Ej. diferencia encontrada en conteo" required className="h-fit px-4 py-2.25" />
          </div>
          <DialogFooter className="gap-x-1">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-full px-3">Cancelar</Button>
            <Button type="submit" className="rounded-full px-3">Aplicar ajuste</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
