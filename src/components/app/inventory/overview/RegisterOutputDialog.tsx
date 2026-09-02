"use client";

import { useState, type FormEvent } from "react";
import { PackageMinus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { availableStock } from "@/lib/mock/inventory";
import type { CommonDialogProps } from "./types";
import type { MovementMetadata } from "./types";

const OUTPUT_REASONS = ["Salida manual", "Merma", "Vencimiento", "Consumo interno", "Devolución a proveedor"];

interface RegisterOutputDialogProps extends CommonDialogProps {
  onSubmit: (quantity: number, metadata: MovementMetadata) => void;
}

export function RegisterOutputDialog({
  item,
  open,
  onOpenChange,
  onSubmit,
}: RegisterOutputDialogProps) {
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState(OUTPUT_REASONS[0]);
  if (!item) return null;
  const maximum = availableStock(item);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = Number(quantity);
    if (!Number.isInteger(value) || value < 1 || value > maximum) return;
    const data = new FormData(event.currentTarget);
    onSubmit(value, { reason, notes: String(data.get("notes") ?? "").trim() || undefined });
    setQuantity("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) setQuantity("");
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="sm:max-w-md font-heading">
        <form onSubmit={submit} className="space-y-5">
          <DialogHeader>
            <DialogTitle>Registrar salida</DialogTitle>
            <DialogDescription>
              {item.productName} · {maximum} unidades disponibles.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-y-2">
            <label htmlFor="output-quantity" className="text-sm font-medium">
              Cantidad
            </label>
            <Input
              id="output-quantity"
              type="number"
              min={1}
              max={maximum}
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              placeholder="0"
              required
              className="px-4 py-2.25 h-fit"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-y-2">
              <label htmlFor="output-reason" className="text-sm font-medium">Motivo</label>
              <Select value={reason} onValueChange={(value) => setReason(value as string)} items={OUTPUT_REASONS.map((option) => ({ label: option, value: option }))}>
                <SelectTrigger id="output-reason" className="h-10 w-full px-3"><SelectValue placeholder="Selecciona un motivo" /></SelectTrigger>
                <SelectContent>{OUTPUT_REASONS.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-y-2">
              <label htmlFor="output-notes" className="text-sm font-medium">Observación</label>
              <Input id="output-notes" name="notes" placeholder="Opcional" className="h-10 px-3" />
            </div>
          </div>

          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <p>
              La salida no puede usar unidades reservadas. El stock resultante
              será{" "}
              {Math.max(
                item.reservedStock,
                item.currentStock - (Number(quantity) || 0)
              )}
              .
            </p>
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
            <Button type="submit" disabled={maximum === 0} className="rounded-full px-3 gap-1.5">
              <PackageMinus className="size-4" />
              <span>Registrar salida</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
