import {
  CalendarDays,
  Clock,
  CreditCard,
  FileText,
  MessageSquare,
  Package,
  Truck,
} from "lucide-react";
import type { PurchaseOrder } from "@/lib/mock/purchases";
import { formatPurchaseMoney, purchaseProgress } from "@/lib/mock/purchases";
import { cn } from "@/lib/utils";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("es-PE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

export function PurchaseInfo({ order }: { order: PurchaseOrder }) {
  const progress = purchaseProgress(order);

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card font-heading lg:w-sm">
      {/* Header */}
      <div className="border-b border-border px-5 py-3">
        <h2 className="text-sm font-medium text-foreground">
          Resumen de la orden
        </h2>
      </div>

      <div className="p-5 space-y-5">
        {/* Total Highlight Banner */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total acordado</span>
            <span className="inline-flex items-center bg-primary/10 px-2 py-1.5 rounded-full leading-none text-xs font-medium text-primary">
              PEN S/.
            </span>
          </div>

          <p className="text-3xl font-medium tracking-tight text-foreground tabular-nums">
            {formatPurchaseMoney(order.total)}
          </p>

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CreditCard className="size-4 shrink-0 text-muted-foreground" />
            <span>Condición de pago:</span>
            <span className="font-medium text-foreground">
              {order.paymentTerms ?? "No indicada"}
            </span>
          </div>
        </div>

        {/* Reception Progress */}
        <div className="border-y border-border py-5 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <Package className="size-4 text-primary" />
              Recepción en almacén
            </span>
            <span className="font-semibold tabular-nums text-foreground">
              {progress}%
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                progress === 100 ? "bg-emerald-500" : "bg-primary",
              )}
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-sm text-muted-foreground text-right tabular-nums">
            {order.receivedUnits} de {order.orderedUnits} unidades recibidas
          </p>
        </div>

        {/* Specifications Breakdown */}
        <div className="space-y-5 text-sm">
          <p className="text-sm font-medium">Datos del proveedor</p>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Truck className="size-4 shrink-0 text-muted-foreground" />
                Proveedor
              </span>
              <span className="font-medium text-foreground truncate max-w-44 text-right">
                {order.supplierName}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-muted-foreground">
                <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
                Fecha de emisión
              </span>
              <span className="font-medium text-foreground">
                {formatDate(order.issuedAt)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Clock className="size-3.5 shrink-0 text-muted-foreground" />
                Entrega estimada
              </span>
              <span className="font-medium text-foreground">
                {formatDate(order.expectedAt)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-muted-foreground">
                <FileText className="size-3.5 shrink-0 text-muted-foreground" />
                Referencia
              </span>
              <span className="font-medium text-foreground truncate max-w-44 text-right">
                {order.reference || "Sin documento"}
              </span>
            </div>
          </div>
        </div>

        {/* Observaciones / Notas si existen */}
        {order.notes && (
          <div className="space-y-1.5 rounded-lg border border-border/60 bg-muted/20 p-3 text-xs">
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <MessageSquare className="size-3.5 text-muted-foreground" />
              Observaciones
            </div>
            <p className="text-muted-foreground leading-relaxed pl-5">
              {order.notes}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
