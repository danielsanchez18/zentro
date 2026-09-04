"use client";

import {
  CalendarDays,
  CircleDollarSign,
  CreditCard,
  FileText,
  PackageOpen,
  Truck,
} from "lucide-react";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PurchaseOrder } from "@/lib/mock/purchases";
import { formatPurchaseMoney, purchaseProgress } from "@/lib/mock/purchases";
import { cn } from "@/lib/utils";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

const PAYMENT_BADGES: Record<
  string,
  { label: string; textColor: string; bgColor: string }
> = {
  pendiente: {
    label: "Pago pendiente",
    textColor: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-400",
  },
  parcial: {
    label: "Pago parcial",
    textColor: "text-sky-600 dark:text-sky-400",
    bgColor: "bg-sky-400",
  },
  pagado: {
    label: "Pagado",
    textColor: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-400",
  },
};

export function PurchasePreviewDialog({
  order,
  open,
  onOpenChange,
  onView,
}: {
  order: PurchaseOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onView: () => void;
}) {
  if (!order) return null;

  const progress = purchaseProgress(order);
  const paymentInfo = PAYMENT_BADGES[order.paymentStatus] ?? {
    label: order.paymentStatus,
    textColor: "text-muted-foreground",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="font-heading sm:max-w-lg">
        {/* Header con icono y estado */}
        <DialogHeader className="space-y-0">
          <div className="flex items-start justify-between gap-3 pr-6">
            <div className="flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary">
                <FileText className="size-5" />
              </span>
              <div>
                <p className="text-xs font-sans text-muted-foreground">
                  Orden de compra
                </p>
                <DialogTitle className="text-lg font-medium tracking-tight">
                  {order.number}
                </DialogTitle>
              </div>
            </div>
            <StatusBadge status={order.status} />
          </div>
        </DialogHeader>

        {/* Tarjeta destacada: Total y Entrega */}
        <div className="grid grid-cols-2 divide-x divide-border rounded-xl border border-border bg-muted/30 px-4">
          <div className="pr-4 py-4">
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <CircleDollarSign className="size-4 text-primary" />
              Total de la orden
            </span>
            <p className="my-1 text-xl font-medium tabular-nums text-foreground">
              {formatPurchaseMoney(order.total)}
            </p>
            <div className="flex items-center gap-x-1.5">
              <span
                className={cn("w-1.5 h-1.5 rounded-full", paymentInfo.bgColor)}
              />
              <span className={cn("font-medium", paymentInfo.textColor)}>
                {paymentInfo.label}
              </span>
            </div>
          </div>

          <div className="pl-4 py-4">
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <CalendarDays className="size-4 text-primary" />
              Entrega estimada
            </span>
            <p className="my-1 text-xl font-medium text-foreground">
              {formatDate(order.expectedAt)}
            </p>
            <p className="text-sm text-muted-foreground">
              Emisión:{" "}
              <span className="font-medium text-foreground">
                {formatDate(order.issuedAt)}
              </span>
            </p>
          </div>
        </div>

        {/* Progreso de recepción */}
        <div className="space-y-2.5 border-y border-border bg-card py-5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">
              Progreso de recepción
            </span>
            <span className="font-semibold text-primary">{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                progress === 100 ? "bg-emerald-500" : "bg-primary",
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {order.receivedUnits} de {order.orderedUnits} unidades recibidas
            </span>
            <span>{order.itemCount} productos</span>
          </div>
        </div>

        {/* Grid de detalles estructurados */}
        <div className="text-sm space-y-3 py-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Truck className="size-4" />
              Proveedor
            </span>
            <span className="font-medium text-foreground">
              {order.supplierName}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-muted-foreground">
              <FileText className="size-4" />
              Comprobante / Referencia
            </span>
            <span className="font-sans font-medium text-foreground">
              {order.reference ?? "Sin documento"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-muted-foreground">
              <PackageOpen className="size-4" />
              Artículos solicitados
            </span>
            <span className="font-medium text-foreground">
              {order.itemCount} productos ({order.orderedUnits} uds.)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-muted-foreground">
              <CreditCard className="size-4" />
              Estado del pago
            </span>
            <div className="flex items-center gap-x-1.5">
              <span
                className={cn("w-1.5 h-1.5 rounded-full", paymentInfo.bgColor)}
              />
              <span className={cn("font-medium", paymentInfo.textColor)}>
                {paymentInfo.label}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter>
          <Button type="button" onClick={onView} className="w-full rounded-full px-3 sm:w-auto">Ver detalle</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full rounded-full font-sans px-3 py-2 leading-none h-fit sm:w-auto"
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
