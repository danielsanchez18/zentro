import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DiscountDialog({
  open,
  subtotal,
  value,
  onOpenChange,
  onApply,
}: {
  open: boolean;
  subtotal: number;
  value: number;
  onOpenChange: (open: boolean) => void;
  onApply: (value: number, reason: string) => void;
}) {
  const [amount, setAmount] = useState(String(value || ""));
  const [reason, setReason] = useState("");
  const valid =
    Number(amount) >= 0 &&
    Number(amount) <= subtotal &&
    reason.trim().length >= 3;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Descuento directo</DialogTitle>
          <DialogDescription>
            Requiere un importe válido y un motivo para conservar trazabilidad.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="discount">Importe</Label>
            <Input
              id="discount"
              type="number"
              min="0"
              max={subtotal}
              step="0.1"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="discount-reason">Motivo</Label>
            <Input
              id="discount-reason"
              placeholder="Ej. cortesía autorizada"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-full"
          >
            Cancelar
          </Button>
          <Button
            disabled={!valid}
            onClick={() => onApply(Number(amount), reason.trim())}
            className="rounded-full"
          >
            Aplicar descuento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
