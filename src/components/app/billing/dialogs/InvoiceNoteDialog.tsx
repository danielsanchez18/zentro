"use client";

import { useEffect, useState } from "react";
import { FileMinus, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useBillingStore } from "@/stores/billing-store";
import type { InvoiceNote, Invoice } from "@/lib/mock/billing";
import { toastMsg } from "@/components/ui/toast-message";

interface InvoiceNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice;
}

const reasonOptions = {
  credito: [
    { value: "descuento", label: "Descuento" },
    { value: "devolucion", label: "Devolución" },
    { value: "anulacion", label: "Anulación del comprobante" },
  ],
  debito: [
    { value: "recargo", label: "Recargo" },
    { value: "intereses", label: "Intereses" },
    { value: "penalidades", label: "Penalidades" },
  ],
};

export function InvoiceNoteDialog({
  open,
  onOpenChange,
  invoice,
}: InvoiceNoteDialogProps) {
  const config = useBillingStore((state) => state.config);
  const addNote = useBillingStore((state) => state.addNote);
  const updateConfig = useBillingStore((state) => state.updateConfig);
  const updateInvoiceStatus = useBillingStore(
    (state) => state.updateInvoiceStatus,
  );

  const [noteType, setNoteType] = useState<"credito" | "debito">("credito");
  const [reason, setReason] = useState("descuento");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  // Limpiar el formulario cada vez que se abre el diálogo
  useEffect(() => {
    if (open) {
      setNoteType("credito");
      setReason("descuento");
      setAmount("");
      setNotes("");
    }
  }, [open]);

  const maxAmount =
    noteType === "credito" ? invoice.total : invoice.total * 0.3;

  const handleSubmit = () => {
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0 || numAmount > maxAmount) return;

    const sequence =
      noteType === "credito"
        ? config.sequences.notaCredito
        : config.sequences.notaDebito;
    const prefix = noteType === "credito" ? "NC001" : "ND001";
    const number = `${prefix}-${String(sequence).padStart(4, "0")}`;

    const note: InvoiceNote = {
      id: `note_${crypto.randomUUID()}`,
      number,
      type: noteType,
      reason: reason as InvoiceNote["reason"],
      invoiceId: invoice.id,
      invoiceNumber: invoice.number,
      amount: numAmount,
      notes: notes || undefined,
      issuedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    addNote(note);

    // Avanzar la secuencia correlativa de notas (no se puede reutilizar un número)
    if (noteType === "credito") {
      updateConfig({
        sequences: {
          ...config.sequences,
          notaCredito: config.sequences.notaCredito + 1,
        },
      });
    } else {
      updateConfig({
        sequences: {
          ...config.sequences,
          notaDebito: config.sequences.notaDebito + 1,
        },
      });
    }

    if (noteType === "credito" && reason === "anulacion") {
      updateInvoiceStatus(invoice.id, "anulado", notes);
    }

    toastMsg.success("Nota emitida", `${number} generada correctamente.`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Emitir nota</DialogTitle>
          <DialogDescription>
            Selecciona el tipo de nota para el comprobante {invoice.number}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 font-heading">
          {/* Tipo de nota */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={noteType === "credito" ? "default" : "outline"}
              onClick={() => {
                setNoteType("credito");
                setReason("descuento");
              }}
              className="cursor-pointer"
            >
              <FileMinus className="size-4" />
              Nota de crédito
            </Button>
            <Button
              type="button"
              variant={noteType === "debito" ? "default" : "outline"}
              onClick={() => {
                setNoteType("debito");
                setReason("recargo");
              }}
              className="cursor-pointer"
            >
              <FilePlus className="size-4" />
              Nota de débito
            </Button>
          </div>

          {/* Motivo */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Motivo</label>
            <div className="flex flex-wrap gap-2">
              {reasonOptions[noteType].map((opt) => (
                <Button
                  key={opt.value}
                  type="button"
                  variant={reason === opt.value ? "default" : "outline"}
                  onClick={() => setReason(opt.value)}
                  className="cursor-pointer"
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Monto */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Monto (Máximo S/ {maxAmount.toFixed(2)})
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.01"
              max={maxAmount}
              step="0.01"
              placeholder="0.00"
              className="px-4 h-fit py-2"
            />
          </div>

          {/* Observaciones */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Observaciones (opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Motivo de la nota..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 min-h-20"
            />
          </div>
        </div>

        <DialogFooter className="gap-x-1">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-full"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={
              !amount || Number(amount) <= 0 || Number(amount) > maxAmount
            }
            onClick={handleSubmit}
            className="rounded-full"
          >
            Emitir nota
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
