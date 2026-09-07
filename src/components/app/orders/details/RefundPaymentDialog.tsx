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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatOrderMoney } from "@/lib/mock/orders";

export function RefundPaymentDialog({
  open,
  onOpenChange,
  refundable,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refundable: number;
  onConfirm: (amount: number, reason: string) => void;
}) {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const numericAmount = Number(amount);
  const close = (value: boolean) => {
    onOpenChange(value);
    if (!value) {
      setAmount("");
      setReason("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar reembolso</DialogTitle>
          <DialogDescription>
            Disponible para reembolsar: {formatOrderMoney(refundable)}.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="refund-amount" className="text-sm font-medium">
              Monto
            </label>
            <button
              type="button"
              className="text-xs font-medium text-primary hover:underline"
              onClick={() => setAmount(refundable.toFixed(2))}
            >
              Usar total
            </button>
          </div>
          <Input
            id="refund-amount"
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="0.00"
          />
        </div>
        <div className="flex flex-col gap-y-2">
          <label htmlFor="refund-reason" className="text-sm font-medium">
            Motivo
          </label>
          <Textarea
            id="refund-reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Indica por qué se devuelve el pago."
            className="min-h-24 resize-none"
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => close(false)}
            className="rounded-full"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            disabled={
              !reason.trim() || numericAmount <= 0 || numericAmount > refundable
            }
            onClick={() => onConfirm(numericAmount, reason)}
            className="rounded-full"
          >
            Confirmar reembolso
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
