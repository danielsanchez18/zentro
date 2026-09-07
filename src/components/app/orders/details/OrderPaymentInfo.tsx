"use client";

import { useMemo, useState } from "react";
import { CreditCard, Plus, ReceiptText } from "lucide-react";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toastMsg } from "@/components/ui/toast-message";
import {
  formatOrderMoney,
  orderPaymentMethodLabel,
  type CustomerOrder,
} from "@/lib/mock/orders";
import { useOrdersStore } from "@/stores/orders-store";

type PaymentMethod = NonNullable<CustomerOrder["paymentMethod"]>;

const methods: PaymentMethod[] = [
  "efectivo",
  "tarjeta",
  "yape",
  "plin",
  "transferencia",
];

export function OrderPaymentInfo({ order }: { order: CustomerOrder }) {
  const [open, setOpen] = useState(false);
  const registerPayment = useOrdersStore((state) => state.registerPayment);
  const paid = useMemo(() => getPaidAmount(order), [order]);
  const balance = Math.max(0, order.total - paid);
  const canRegister = balance > 0 && order.paymentStatus !== "reembolsado";

  const submitPayment = (payment: {
    amount: number;
    method: PaymentMethod;
    reference?: string;
  }) => {
    if (registerPayment(order.id, payment)) {
      toastMsg.success(
        "Pago registrado",
        `${formatOrderMoney(payment.amount)} aplicado a ${order.number}.`,
      );
      setOpen(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card">
      <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
        <h2 className="text-sm font-medium">Pago y totales</h2>
        <StatusBadge status={order.paymentStatus} />
      </header>
      <div className="p-5">
        <div className="pb-4 border-b border-border mb-4 flex items-start gap-3">
          <CreditCard className="mt-0.5 size-4 shrink-0 text-primary" />
          <div className="min-w-0">
            <p className="text-sm font-medium">
              {orderPaymentMethodLabel(order.paymentMethod)}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {order.paymentReference ?? "Sin referencia de operación"}
            </p>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <Row label="Subtotal" value={formatOrderMoney(order.subtotal)} />
          {order.discount > 0 && (
            <Row
              label={`Descuento${order.promotionName ? ` · ${order.promotionName}` : ""}`}
              value={`-${formatOrderMoney(order.discount)}`}
              tone="success"
            />
          )}
          {order.deliveryFee > 0 && (
            <Row label="Envío" value={formatOrderMoney(order.deliveryFee)} />
          )}
          <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
            <span className="inline-flex items-center gap-2">Total</span>
            <span className="text-primary">
              {formatOrderMoney(order.total)}
            </span>
          </div>
          <Row label="Pagado" value={formatOrderMoney(paid)} />
          <Row
            label="Saldo pendiente"
            value={formatOrderMoney(balance)}
            tone={balance > 0 ? "warning" : undefined}
          />
        </div>

        {order.payments && order.payments.length > 0 && (
          <div className="mt-5 border-t border-border pt-4">
            <p className="text-sm font-medium text-muted-foreground">
              Abonos registrados
            </p>
            <div className="mt-3 space-y-2">
              {order.payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">
                      {orderPaymentMethodLabel(payment.method)}
                    </p>
                    <p className="mt-0.5 truncate text-muted-foreground">
                      {payment.reference ?? "Sin referencia"}
                    </p>
                  </div>
                  <p className="shrink-0 font-medium tabular-nums">
                    {formatOrderMoney(payment.amount)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button
          className="mt-5 w-full rounded-full"
          variant="outline"
          onClick={() => setOpen(true)}
          disabled={!canRegister}
        >
          {/* <Plus data-icon="inline-start" /> */}
          {balance > 0 ? "Registrar pago" : "Pago completado"}
        </Button>
      </div>

      <PaymentDialog
        open={open}
        onOpenChange={setOpen}
        balance={balance}
        onSubmit={submitPayment}
      />
    </section>
  );
}

function PaymentDialog({
  open,
  onOpenChange,
  balance,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  balance: number;
  onSubmit: (payment: {
    amount: number;
    method: PaymentMethod;
    reference?: string;
  }) => void;
}) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("efectivo");
  const [reference, setReference] = useState("");
  const numericAmount = Number(amount);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar pago</DialogTitle>
          <DialogDescription>
            Saldo pendiente: {formatOrderMoney(balance)}.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-y-2">
          <label className="text-sm font-medium" htmlFor="payment-amount">
            Monto
          </label>
          <Input
            id="payment-amount"
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-y-2">
          <label className="text-sm font-medium">Método de pago</label>
          <Select
            value={method}
            onValueChange={(value) => setMethod(value as PaymentMethod)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {methods.map((item) => (
                <SelectItem key={item} value={item}>
                  {orderPaymentMethodLabel(item)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-y-2">
          <label className="text-sm font-medium" htmlFor="payment-reference">
            Referencia{" "}
            <span className="font-normal text-muted-foreground">
              (opcional)
            </span>
          </label>
          <Input
            id="payment-reference"
            placeholder="N.º de operación o últimos dígitos"
            value={reference}
            onChange={(event) => setReference(event.target.value)}
          />
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
            disabled={!amount || numericAmount <= 0 || numericAmount > balance}
            onClick={() =>
              onSubmit({
                amount: numericAmount,
                method,
                reference: reference.trim() || undefined,
              })
            }
            className="rounded-full"
          >
            Confirmar pago
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function getPaidAmount(order: CustomerOrder) {
  if (order.payments) {
    return order.payments.reduce((sum, payment) => sum + payment.amount, 0);
  }
  if (order.paymentStatus === "pagado") return order.total;
  if (order.paymentStatus === "pago_parcial") return order.total / 2;
  return 0;
}

function Row({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "success" | "warning";
}) {
  return (
    <div
      className={`flex justify-between gap-3 ${tone === "success" ? "text-emerald-600 dark:text-emerald-400" : tone === "warning" ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}`}
    >
      <span>{label}</span>
      <span className="font-medium tabular-nums text-foreground">{value}</span>
    </div>
  );
}
