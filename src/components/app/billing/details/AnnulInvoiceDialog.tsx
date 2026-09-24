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

const annulReasons = [
  "Error en RUC o DNI del cliente",
  "Error en descripción o cantidad de ítems",
  "Devolución total del pedido",
  "Comprobante duplicado",
  "Operación comercial no realizada",
  "Otro motivo",
];

interface AnnulInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceNumber: string;
  onConfirm: (reason: string, note?: string) => void;
}

export function AnnulInvoiceDialog({
  open,
  onOpenChange,
  invoiceNumber,
  onConfirm,
}: AnnulInvoiceDialogProps) {
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");

  const close = (value: boolean) => {
    onOpenChange(value);
    if (!value) {
      setReason("");
      setNote("");
    }
  };

  const handleConfirm = () => {
    if (!reason) return;
    onConfirm(reason, note.trim() ? note.trim() : undefined);
    close(false);
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-md font-heading">
        <DialogHeader>
          <DialogTitle>Anular comprobante</DialogTitle>
          <DialogDescription>
            {invoiceNumber} se dará de baja en el sistema. Se generará el
            registro de anulación para trazabilidad tributaria.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex flex-col gap-y-2">
            <label className="text-sm font-medium">
              Motivo de anulación <span className="text-rose-500">*</span>
            </label>
            <Select
              value={reason}
              onValueChange={(val) => setReason(val as string)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un motivo" />
              </SelectTrigger>
              <SelectContent>
                {annulReasons.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-y-2">
            <label htmlFor="annul-note" className="text-sm font-medium">
              Detalle adicional{" "}
              <span className="font-normal text-muted-foreground">
                (opcional)
              </span>
            </label>
            <Textarea
              id="annul-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Explica brevemente la razón de la baja..."
              className="resize-none h-20"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => close(false)}
            className="rounded-full cursor-pointer"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={!reason}
            onClick={handleConfirm}
            className="rounded-full cursor-pointer"
          >
            Anular comprobante
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
