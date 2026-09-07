"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const reasons = [
  "Solicitud del cliente",
  "Producto sin disponibilidad",
  "No fue posible confirmar el pago",
  "Problema con la dirección de entrega",
  "Otro motivo",
];

export function CancelOrderDialog({
  open,
  onOpenChange,
  orderNumber,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderNumber: string;
  onConfirm: (reason: string, note?: string) => void;
}) {
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");

  const close = (value: boolean) => {
    onOpenChange(value);
    if (!value) {
      setReason("");
      setNote("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancelar pedido</DialogTitle>
          <DialogDescription>
            {orderNumber} saldrá del flujo operativo. El motivo quedará en el
            timeline.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-y-2">
          <label className="text-sm font-medium">Motivo</label>
          <Select
            value={reason}
            onValueChange={(value) => setReason(value as string)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona un motivo" />
            </SelectTrigger>
            <SelectContent>
              {reasons.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-y-2">
          <label htmlFor="cancellation-note" className="text-sm font-medium">
            Nota{" "}
            <span className="font-normal text-muted-foreground">
              (opcional)
            </span>
          </label>
          <Textarea
            id="cancellation-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Agrega contexto para el equipo."
            className="min-h-24 resize-none"
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => close(false)}
            className="rounded-full"
          >
            Volver
          </Button>
          <Button
            variant="destructive"
            disabled={!reason}
            onClick={() => onConfirm(reason, note.trim() || undefined)}
            className="rounded-full"
          >
            Cancelar pedido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
