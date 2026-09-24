"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, Building2, CreditCard, ReceiptText } from "lucide-react";
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
import type { BillingConfig, Invoice, InvoiceItem } from "@/lib/mock/billing";
import { useBillingStore } from "@/stores/billing-store";
import { useOrdersStore } from "@/stores/orders-store";
import { IssueReceiptDialog } from "./IssueReceiptDialog";
import { RefundPaymentDialog } from "./RefundPaymentDialog";

type PaymentMethod = NonNullable<CustomerOrder["paymentMethod"]>;

const methods: PaymentMethod[] = [
  "efectivo",
  "tarjeta",
  "yape",
  "plin",
  "transferencia",
];

export function OrderPaymentInfo({ order }: { order: CustomerOrder }) {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const [open, setOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const registerPayment = useOrdersStore((state) => state.registerPayment);
  const refundPayment = useOrdersStore((state) => state.refundPayment);
  const issueReceipt = useOrdersStore((state) => state.issueReceipt);
  const addInvoice = useBillingStore((state) => state.addInvoice);
  const invoices = useBillingStore((state) => state.invoices);
  const config = useBillingStore((state) => state.config);
  const updateConfig = useBillingStore((state) => state.updateConfig);
  const linkedInvoice = useMemo(
    () => invoices.find((inv) => inv.orderId === order.id),
    [invoices, order.id],
  );
  const paid = useMemo(() => getPaidAmount(order), [order]);
  const refunded = useMemo(
    () =>
      order.refunds?.reduce((sum, refund) => sum + refund.amount, 0) ??
      (order.paymentStatus === "reembolsado" ? paid : 0),
    [order, paid],
  );
  const balance = Math.max(0, order.total - paid);
  const refundable = Math.max(0, paid - refunded);
  const promotionDiscount = Math.max(
    0,
    order.discount - (order.manualDiscount ?? 0),
  );
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
        <StatusBadge
          status={order.paymentStatus}
          label={
            refunded > 0 && refundable > 0 ? "Reembolso parcial" : undefined
          }
        />
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
          {promotionDiscount > 0 && (
            <Row
              label={`Promoción${order.promotionName ? ` · ${order.promotionName}` : ""}`}
              value={`-${formatOrderMoney(promotionDiscount)}`}
              tone="success"
            />
          )}
          {(order.manualDiscount ?? 0) > 0 && (
            <Row
              label="Descuento directo"
              value={`-${formatOrderMoney(order.manualDiscount ?? 0)}`}
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
          {refunded > 0 && (
            <Row
              label="Reembolsado"
              value={`-${formatOrderMoney(refunded)}`}
              tone="warning"
            />
          )}
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

        {order.receipt && (
          <div className="mt-5 border-t border-border pt-4 font-heading">
            <Button
              variant="link"
              className="h-auto w-full justify-start gap-3 p-0"
              onClick={() =>
                router.push(
                  linkedInvoice
                    ? `/app/${params.slug}/facturacion/${linkedInvoice.id}`
                    : `/app/${params.slug}/facturacion`,
                )
              }
            >
              {order.receipt.type === "factura" ? (
                <span className="p-2.5 rounded-lg bg-accent text-foreground">
                  <Building2 className="size-4" />
                </span>
              ) : (
                <span className="p-2.5 rounded-lg bg-accent text-foreground">
                  <ReceiptText className="size-4" />
                </span>
              )}
              <span className="min-w-0 flex-1 text-left">
                <span className="block text-sm font-medium capitalize text-foreground">
                  Detalle de {order.receipt.type}
                </span>
                <span className="block truncate font-mono text-xs tabular-nums text-muted-foreground">
                  {order.receipt.number}
                </span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
            </Button>
          </div>
        )}

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <Button
            variant="outline"
            onClick={() => setOpen(true)}
            disabled={!canRegister}
            className="rounded-full"
          >
            {balance > 0 ? "Registrar pago" : "Pago completado"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setRefundOpen(true)}
            disabled={refundable <= 0}
            className="rounded-full"
          >
            Reembolsar
          </Button>
          {!order.receipt && (
            <Button
              className="sm:col-span-2 rounded-full"
              variant="outline"
              onClick={() => setReceiptOpen(true)}
              disabled={paid <= 0}
            >
              Emitir comprobante
            </Button>
          )}
        </div>
      </div>

      <PaymentDialog
        open={open}
        onOpenChange={setOpen}
        balance={balance}
        onSubmit={submitPayment}
      />
      <RefundPaymentDialog
        open={refundOpen}
        onOpenChange={setRefundOpen}
        refundable={refundable}
        onConfirm={(amount, reason) => {
          if (refundPayment(order.id, amount, reason)) {
            toastMsg.success("Reembolso registrado", formatOrderMoney(amount));
            setRefundOpen(false);
          }
        }}
      />
      <IssueReceiptDialog
        open={receiptOpen}
        onOpenChange={setReceiptOpen}
        order={order}
        config={config}
        onConfirm={(receipt) => {
          const isFactura = receipt.type === "factura";
          const seqKey = isFactura ? "factura" : "boleta";
          const prefix = isFactura ? "F001" : "B001";
          const next = config.sequences[seqKey] + 1;
          const number = `${prefix}-${String(next).padStart(4, "0")}`;
          if (issueReceipt(order.id, { ...receipt, number })) {
            addInvoice(buildInvoice(order, receipt, number, config));
            updateConfig({
              sequences: { ...config.sequences, [seqKey]: next },
            });
            toastMsg.success(
              "Comprobante emitido",
              `${number} · ${order.number}`,
            );
            setReceiptOpen(false);
          }
        }}
      />
    </section>
  );
}

function buildInvoice(
  order: CustomerOrder,
  receipt: {
    type: "boleta" | "factura";
    customerDocument?: string;
    businessName?: string;
    customerName?: string;
    customerAddress?: string;
    customerEmail?: string;
  },
  number: string,
  config: BillingConfig,
): Invoice {
  const round2 = (value: number) => Math.round(value * 100) / 100;
  const isFactura = receipt.type === "factura";
  const now = new Date().toISOString();
  const items: InvoiceItem[] = order.lines.map((line, index) => {
    const subtotal = round2(line.unitPrice * line.quantity - line.discount);
    return {
      id: `item_${Date.now()}_${index}`,
      productId: line.productId,
      productName: line.name,
      sku: line.productId,
      quantity: line.quantity,
      unitPrice: line.unitPrice,
      discount: line.discount,
      subtotal,
      igv: round2(subtotal * config.igvRate),
    };
  });
  const subtotal = round2(items.reduce((sum, item) => sum + item.subtotal, 0));
  const igv = round2(items.reduce((sum, item) => sum + item.igv, 0));

  return {
    id: `inv_${Date.now()}`,
    number,
    type: receipt.type,
    status: "emitido",
    orderId: order.id,
    orderNumber: order.number,
    // Snapshot de la config fiscal del negocio al momento de emitir (reglas 44-45)
    fiscalSnapshot: {
      businessName: config.businessName,
      ruc: config.ruc,
      address: config.address,
      igvRate: config.igvRate,
    },
    customer: {
      documentType: isFactura ? "ruc" : "dni",
      documentNumber: receipt.customerDocument ?? "",
      name: isFactura
        ? (receipt.businessName ?? order.customerName)
        : (receipt.customerName ?? order.customerName),
      tradeName: isFactura ? receipt.businessName : undefined,
      address: receipt.customerAddress,
      email: receipt.customerEmail ?? order.customerEmail,
    },
    items,
    subtotal,
    igv,
    total: round2(subtotal + igv),
    currency: "PEN",
    issuedAt: now,
    createdAt: now,
  };
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
  if (order.paidAmount !== undefined) return order.paidAmount;
  if (order.payments) {
    return order.payments.reduce((sum, payment) => sum + payment.amount, 0);
  }
  if (["pagado", "reembolsado"].includes(order.paymentStatus))
    return order.total;
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
