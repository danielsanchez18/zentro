"use client";

import { useEffect, useState } from "react";
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
import { toastMsg } from "@/components/ui/toast-message";
import { cn } from "@/lib/utils";
import {
  agendaMoney,
  type Appointment,
  type AppointmentPaymentStatus,
} from "@/lib/mock/agenda";

export function AppointmentPaymentDialog({
  appointment,
  open,
  onOpenChange,
  onSave,
}: {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (paidAmount: number, status: AppointmentPaymentStatus) => void;
}) {
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (!open) return;
    // Reinicia el importe al abrir el diálogo.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAmount("");
  }, [open]);

  if (!appointment) return null;

  const pending = Math.max(0, appointment.price - appointment.paidAmount);

  const save = () => {
    const increment = Number(amount);
    if (!Number.isFinite(increment) || increment <= 0) {
      toastMsg.error("Importe inválido", "Ingresa un importe mayor a cero.");
      return;
    }
    if (increment > pending) {
      toastMsg.error(
        "Importe excedido",
        `El saldo pendiente es ${agendaMoney(pending)}.`,
      );
      return;
    }
    const paidAmount = appointment.paidAmount + increment;
    onSave(
      paidAmount,
      paidAmount >= appointment.price ? "pagado" : "adelanto",
    );
    onOpenChange(false);
  };

  const percentPaid =
    appointment.price > 0
      ? Math.min(100, Math.round((appointment.paidAmount / appointment.price) * 100))
      : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[95dvh] overflow-hidden flex flex-col">
        {/* Header */}
        <DialogHeader>
          <DialogTitle>Registrar pago</DialogTitle>
          <DialogDescription>
            Registra un adelanto, un pago parcial o el total. El saldo puede quedar pendiente.
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto space-y-5 py-1">
          {/* Card Resumen de Total y Saldo (Estilo CheckoutDialog) */}
          <div>
            <div className="grid grid-cols-2">
              <div className="border-r border-border text-center px-2">
                <p className="text-sm font-heading text-muted-foreground">
                  Pagado
                </p>
                <p className="mt-0.5 text-xl font-medium tracking-tight text-foreground font-mono tabular-nums">
                  {agendaMoney(appointment.paidAmount)}
                </p>
              </div>

              <div className="text-center px-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {pending > 0 ? "Saldo pendiente" : "Total cubierto"}
                </p>
                <p
                  className={cn(
                    "mt-0.5 text-xl font-medium tracking-tight text-foreground font-mono tabular-nums",
                    pending > 0
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-emerald-600 dark:text-emerald-400",
                  )}
                >
                  {pending > 0 ? agendaMoney(pending) : "S/. 0.00"}
                </p>
              </div>
            </div>

            {/* Barra de progreso de pago */}
            <div className="mt-3 space-y-2 py-3 border-y border-border">
              <div className="flex justify-between text-sm text-muted-foreground tabular-nums font-mono font-medium">
                <span>Total cita: {agendaMoney(appointment.price)}</span>
                <span>{percentPaid}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-border overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 rounded-full"
                  style={{
                    width: `${percentPaid}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Monto e Input (Estilo CheckoutDialog) */}
          <div className="flex flex-col gap-y-2 font-heading">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="appointment-payment"
                className="text-sm font-medium text-foreground"
              >
                Importe recibido
              </Label>
              {pending > 0 && (
                <button
                  type="button"
                  onClick={() => setAmount(pending.toFixed(2))}
                  className="text-sm text-primary hover:underline cursor-pointer font-medium"
                >
                  Llenar saldo ({agendaMoney(pending)})
                </button>
              )}
            </div>

            <div className="overflow-hidden relative flex h-9 w-full items-center rounded-lg border border-border bg-accent/50 pl-4 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20">
              <p className="text-sm font-medium mr-2 select-none text-muted-foreground">
                S/.
              </p>
              <Input
                id="appointment-payment"
                type="number"
                min="0"
                step="0.1"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className="h-full flex-1 border-0 shadow-none focus-visible:ring-0 p-0 text-base bg-transparent! font-medium tabular-nums [-webkit-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0.00"
                autoFocus
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="rounded-full cursor-pointer"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="rounded-full cursor-pointer"
            onClick={save}
          >
            Registrar pago
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
