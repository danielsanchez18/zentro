"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeftRight,
  Banknote,
  Coins,
  CreditCard,
  Smartphone,
  Trash2,
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import type { PosPaymentMethod } from "../shared/types";

export interface Payment {
  id: string;
  method: PosPaymentMethod;
  amount: number;
  reference: string;
}

const money = (value: number) =>
  new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(value);

const paymentMethodsConfig: {
  id: PosPaymentMethod;
  label: string;
  shortLabel: string;
  icon: typeof Banknote;
  referencePlaceholder?: string;
}[] = [
  {
    id: "efectivo",
    label: "Efectivo",
    shortLabel: "Efectivo",
    icon: Banknote,
  },
  {
    id: "tarjeta",
    label: "Tarjeta",
    shortLabel: "Tarjeta",
    icon: CreditCard,
    referencePlaceholder: "Últimos 4 dígitos o lote",
  },
  {
    id: "yape",
    label: "Yape",
    shortLabel: "Yape",
    icon: Smartphone,
    referencePlaceholder: "Código de aprobación o N° celular",
  },
  {
    id: "plin",
    label: "Plin",
    shortLabel: "Plin",
    icon: Smartphone,
    referencePlaceholder: "N° de operación",
  },
  {
    id: "transferencia",
    label: "Transferencia",
    shortLabel: "Transf.",
    icon: ArrowLeftRight,
    referencePlaceholder: "N° de operación bancaria",
  },
];

export function CheckoutDialog({
  open,
  total,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  total: number;
  onOpenChange: (open: boolean) => void;
  onConfirm: (
    payments: Payment[],
    receipt: "boleta" | "factura",
    document: string,
  ) => void;
}) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [method, setMethod] = useState<PosPaymentMethod>("efectivo");
  const [amount, setAmount] = useState(total.toFixed(2));
  const [reference, setReference] = useState("");
  const [receipt, setReceipt] = useState<"boleta" | "factura">("boleta");
  const [document, setDocument] = useState("");

  const paidSoFar = useMemo(
    () => payments.reduce((sum, item) => sum + item.amount, 0),
    [payments],
  );
  const remaining = Math.max(0, total - paidSoFar);
  const currentReceived = Number(amount) || 0;

  // Si no hay pagos agregados aún, el monto actual ingresado es el pago total
  const effectiveTotalPaid =
    payments.length === 0
      ? currentReceived
      : paidSoFar + (remaining > 0 ? currentReceived : 0);

  // Vuelto o cambio (solo relevante si el último pago o pago actual es en efectivo)
  const isCashActive =
    method === "efectivo" ||
    (payments.length > 0 && payments.some((p) => p.method === "efectivo"));
  const change = isCashActive ? Math.max(0, effectiveTotalPaid - total) : 0;

  // Sugerencias rápidas de billetes en efectivo
  const cashSuggestions = useMemo(() => {
    const target = remaining > 0 ? remaining : total;
    if (target <= 0) return [];
    const set = new Set<number>();
    set.add(target); // Monto exacto

    // Siguientes múltiplos de 10
    const next10 = Math.ceil(target / 10) * 10;
    if (next10 > target) set.add(next10);

    // Billetes estándar peruanos: 20, 50, 100, 200
    [20, 50, 100, 200].forEach((bill) => {
      if (bill >= target && bill <= target * 2 + 50) {
        set.add(bill);
      }
    });

    return Array.from(set)
      .sort((a, b) => a - b)
      .slice(0, 5);
  }, [remaining, total]);

  // Agregar un pago parcial a la lista de pagos divididos
  const handleAddPayment = () => {
    if (currentReceived <= 0) return;
    const newPayment: Payment = {
      id: `draft_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
      method,
      amount: currentReceived,
      reference: reference.trim(),
    };
    const nextPayments = [...payments, newPayment];
    setPayments(nextPayments);

    const nextPaid = nextPayments.reduce((s, p) => s + p.amount, 0);
    const nextRemaining = Math.max(0, total - nextPaid);
    setAmount(nextRemaining > 0 ? nextRemaining.toFixed(2) : "0.00");
    setReference("");
  };

  const handleRemovePayment = (id: string) => {
    const nextPayments = payments.filter((item) => item.id !== id);
    setPayments(nextPayments);
    const nextPaid = nextPayments.reduce((s, p) => s + p.amount, 0);
    setAmount(Math.max(0, total - nextPaid).toFixed(2));
  };

  // Validación de confirmación
  const isInvoiceValid = receipt === "boleta" || document.trim().length === 11;
  const hasPayment = payments.length > 0 || currentReceived > 0;
  const canConfirm = hasPayment && isInvoiceValid;

  const handleConfirmSale = () => {
    if (!canConfirm) return;

    let finalPayments = [...payments];
    if (finalPayments.length === 0) {
      finalPayments = [
        {
          id: `draft_${Date.now()}`,
          method,
          amount: currentReceived,
          reference: reference.trim(),
        },
      ];
    } else if (remaining > 0 && currentReceived > 0) {
      finalPayments.push({
        id: `draft_${Date.now()}`,
        method,
        amount: currentReceived,
        reference: reference.trim(),
      });
    }

    onConfirm(finalPayments, receipt, document.trim());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[95dvh] overflow-hidden flex flex-col">
        {/* Header */}
        <DialogHeader>
          <DialogTitle>Registrar pago</DialogTitle>
          <DialogDescription>
            Registra un adelanto, un pago parcial o el total. El saldo puede quedar pendiente.
          </DialogDescription>
        </DialogHeader>

        {/* Body Scrollable */}
        <div className="flex-1 overflow-y-auto space-y-5">
          {/* Card Resumen de Total y Saldo */}
          <div>
            <div className="grid grid-cols-2">
              <div className="border-r border-border text-center px-2">
                <p className="text-sm font-heading text-muted-foreground">
                  Total a cobrar
                </p>
                <p className="mt-0.5 text-xl font-medium tracking-tight text-foreground font-mono tabular-nums">
                  {money(total)}
                </p>
              </div>

              <div className="text-center px-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {remaining > 0 ? "Saldo pendiente" : "Total cubierto"}
                </p>
                <p
                  className={cn(
                    "mt-0.5 text-xl font-medium tracking-tight text-foreground font-mono tabular-nums",
                    remaining > 0
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-emerald-600 dark:text-emerald-400",
                  )}
                >
                  {remaining > 0 ? money(remaining) : "S/. 0.00"}
                </p>
              </div>
            </div>

            {/* Barra de progreso si hay pagos acumulados */}
            {payments.length > 0 && (
              <div className="mt-3 space-y-2 py-5 border-y border-border">
                <div className="flex justify-between text-sm text-muted-foreground tabular-nums font-mono font-medium">
                  <span>Pagado: {money(paidSoFar)}</span>
                  <span className="">
                    {Math.min(100, Math.round((paidSoFar / total) * 100))}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300 rounded-full"
                    style={{
                      width: `${Math.min(100, (paidSoFar / total) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Vuelto / Cambio a entregar */}
          {change > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-accent">
                  <Coins className="size-4.5" />
                </div>
                <div>
                  <p className="text-sm font-medium font-heading text-foreground">
                    Cambio / Vuelto a entregar
                  </p>
                  <p className="text-xs font-medium font-heading text-muted-foreground">
                    Pago con {money(effectiveTotalPaid)}
                  </p>
                </div>
              </div>
              <span className="font-heading text-lg font-medium tabular-nums">
                {money(change)}
              </span>
            </div>
          )}

          {/* Selector visual de Medios de Pago */}
          <div className="flex flex-col gap-y-2">
            <Label className="text-sm font-medium font-heading text-foreground">
              Medios de pago
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {paymentMethodsConfig.map((item) => {
                const Icon = item.icon;
                const isSelected = method === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setMethod(item.id);
                      if (item.id === "efectivo" && remaining > 0) {
                        setAmount(remaining.toFixed(2));
                      }
                    }}
                    className={cn(
                      "flex items-center justify-center gap-2 py-2 px-4 rounded-lg border text-sm font-medium transition-all cursor-pointer relative",
                      isSelected
                        ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/25 font-semibold"
                        : "border-border bg-card text-muted-foreground hover:border-border/80 hover:bg-accent/40 hover:text-foreground",
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-4 shrink-0",
                        isSelected ? "text-primary" : "text-muted-foreground",
                      )}
                    />
                    <span className="truncate">{item.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Monto e Input */}
          <div className="flex flex-col gap-y-2 font-heading">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="checkout-amount"
                className="text-sm font-medium text-foreground"
              >
                Monto recibido
              </Label>
              {remaining > 0 && payments.length > 0 && (
                <button
                  type="button"
                  onClick={() => setAmount(remaining.toFixed(2))}
                  className="text-sm text-primary hover:underline cursor-pointer font-medium"
                >
                  Llenar saldo ({money(remaining)})
                </button>
              )}
            </div>

            <div className="overflow-hidden relative flex h-9 w-full items-center rounded-lg border border-border bg-accent/50 pl-4 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20">
              <p className="text-sm font-medium mr-2 select-none">S/.</p>
              <Input
                id="checkout-amount"
                type="number"
                min="0"
                step="0.1"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className="h-full flex-1 border-0 shadow-none focus-visible:ring-0 p-0 text-base bg-transparent! font-medium tabular-nums [-webkit-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0.00"
              />
              {remaining > 0 && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddPayment}
                  disabled={currentReceived <= 0}
                  className="h-10 px-2.5 text-sm font-medium rounded-l-none! rounded-lg shrink-0 ml-2 cursor-pointer"
                  title="Registrar como pago parcial o dividido"
                >
                  Dividir pago
                </Button>
              )}
            </div>

            {/* Billetes rápidos en efectivo */}
            {method === "efectivo" && cashSuggestions.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-sm text-muted-foreground mr-1">
                  Billetes:
                </span>
                {cashSuggestions.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val.toFixed(2))}
                    className={cn(
                      "rounded-md border px-2 py-1.75 text-xs leading-none font-medium transition-colors cursor-pointer tabular-nums",
                      Number(amount) === val
                        ? "border-primary bg-primary text-primary-foreground font-semibold"
                        : "border-border bg-muted/50 hover:bg-muted text-foreground",
                    )}
                  >
                    {val === remaining ? `Exacto (${money(val)})` : money(val)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Campo de Referencia para pagos digitales */}
          {method !== "efectivo" && (
            <div className="flex flex-col gap-y-2 font-heading">
              <Label
                htmlFor="checkout-reference"
                className="text-sm font-medium text-foreground"
              >
                N° de referencia u operación{" "}
                <span className="text-sm text-muted-foreground font-normal">
                  (opcional)
                </span>
              </Label>
              <Input
                id="checkout-reference"
                placeholder={
                  paymentMethodsConfig.find((m) => m.id === method)
                    ?.referencePlaceholder ?? "N° de operación o referencia"
                }
                value={reference}
                onChange={(event) => setReference(event.target.value)}
                className="py-2 h-fit px-4"
              />
            </div>
          )}

          {/* Lista de pagos parciales ya agregados */}
          {payments.length > 0 && (
            <div className="flex flex-col gap-y-5 pt-5 border-t border-border">
              <div className="flex items-center justify-between font-heading">
                <p className="text-sm font-medium text-foreground">
                  Pagos registrados{" "}
                  <span className="tabular-nums">({payments.length})</span>
                </p>
                <span className="text-sm font-medium tabular-nums text-foreground">
                  Cubierto: {money(paidSoFar)}
                </span>
              </div>

              <div className="divide-y divide-border rounded-lg border border-border">
                {payments.map((payment) => {
                  const cfg = paymentMethodsConfig.find(
                    (c) => c.id === payment.method,
                  );
                  const Icon = cfg?.icon ?? Banknote;
                  return (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between px-3 py-2 text-sm transition-colors font-heading"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="size-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground capitalize truncate">
                            {payment.method}
                          </p>
                          {payment.reference && (
                            <p className="text-[11px] text-muted-foreground truncate">
                              Ref: {payment.reference}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-heading font-semibold text-sm tabular-nums text-foreground">
                          {money(payment.amount)}
                        </span>
                        <Button
                          size="icon-xs"
                          variant="ghost"
                          onClick={() => handleRemovePayment(payment.id)}
                          className="size-7 text-destructive/70 hover:text-destructive hover:bg-destructive/10 rounded-md cursor-pointer"
                          title="Quitar pago"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sección de Comprobante (Boleta / Factura) */}
          <div className="space-y-3 pt-3 border-t border-border font-heading">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-foreground">
                Tipo de comprobante
              </Label>
              <div className="flex rounded-lg border border-border bg-muted/40 p-1">
                <button
                  type="button"
                  onClick={() => setReceipt("boleta")}
                  className={cn(
                    "px-3 py-1 text-sm font-medium rounded-md transition-all cursor-pointer",
                    receipt === "boleta"
                      ? "bg-primary text-background"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Boleta
                </button>
                <button
                  type="button"
                  onClick={() => setReceipt("factura")}
                  className={cn(
                    "px-3 py-1 text-sm font-medium rounded-md transition-all cursor-pointer",
                    receipt === "factura"
                      ? "bg-primary text-background"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Factura
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-y-2 font-heading">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="checkout-doc"
                  className="text-sm font-medium text-foreground"
                >
                  {receipt === "factura"
                    ? "RUC de la empresa"
                    : "DNI / Documento del cliente"}
                </Label>
                <span
                  className={cn(
                    "text-sm",
                    receipt === "factura"
                      ? document.trim().length === 11
                        ? "text-emerald-600 font-medium"
                        : "text-destructive font-medium"
                      : "text-muted-foreground",
                  )}
                >
                  {receipt === "factura"
                    ? document.trim().length === 11
                      ? "✓ RUC válido"
                      : "*Obligatorio (11 dígitos)"
                    : "Opcional"}
                </span>
              </div>
              <Input
                id="checkout-doc"
                placeholder={
                  receipt === "factura"
                    ? "Ej: 20601234567"
                    : "Ej: 71234567 (opcional para boleta)"
                }
                value={document}
                maxLength={receipt === "factura" ? 11 : 12}
                onChange={(event) =>
                  setDocument(event.target.value.replace(/\D/g, ""))
                }
                className="px-3 h-9 text-sm tabular-nums"
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
            disabled={!canConfirm}
            className="rounded-full cursor-pointer"
            onClick={handleConfirmSale}
          >
            Registrar pago y abrir pedido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
