import {
  ChevronRight,
  CreditCard,
  Mail,
  Map,
  MapPin,
  Phone,
  ReceiptText,
  ShoppingBag,
} from "lucide-react";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import type { CustomerOrder } from "@/lib/mock/orders";
import {
  formatOrderMoney,
  orderChannelLabel,
  orderPaymentMethodLabel,
  orderServiceLabel,
} from "@/lib/mock/orders";

export function OrderCustomerInfo({ order }: { order: CustomerOrder }) {
  const initials = order.customerName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const ordersCount = order.customerOrdersCount ?? 1;

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card font-heading">
      <header className="flex items-center justify-between border-b border-border px-5 py-3">
        <h2 className="text-sm font-semibold text-foreground">Cliente</h2>
      </header>

      <div className="p-2 space-y-4">
        <div className="space-y-2">
          {/* Customer Profile Row */}
          <button className="flex w-full items-center justify-between gap-3 rounded-xl p-3 transition-colors hover:bg-muted">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {initials}
              </span>
              <p className="truncate text-sm font-medium text-foreground">
                {order.customerName}
              </p>
            </div>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground/60" />
          </button>

          <div className="px-3">
            <div className="h-[0.5px] bg-border w-full" />
          </div>

          {/* Orders Summary Row */}
          <button className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-muted">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-foreground">
                <ShoppingBag className="size-3.5" />
              </span>
              <p className="text-sm font-medium text-foreground">
                {ordersCount}{" "}
                {ordersCount === 1
                  ? "pedido registrado"
                  : "pedidos registrados"}
              </p>
            </div>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground/60" />
          </button>
        </div>

        <div className="px-3">
          <div className="h-px bg-border w-full" />
        </div>

        {/* Contact info */}
        <div className="px-3">
          <p className="text-sm font-medium text-foreground">
            Información de contacto
          </p>
          <div className="mt-2.5 space-y-2 text-sm">
            {order.customerEmail && (
              <a
                href={`mailto:${order.customerEmail}`}
                className="flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-primary"
              >
                <Mail className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate underline underline-offset-2">
                  {order.customerEmail}
                </span>
              </a>
            )}
            {order.customerPhone ? (
              <a
                href={`https://wa.me/${order.customerPhone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 font-mono text-muted-foreground transition-colors hover:text-primary"
                title="Contactar por WhatsApp"
              >
                <Phone className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="underline underline-offset-2">
                  {order.customerPhone}
                </span>
              </a>
            ) : (
              <p className="flex items-center gap-2.5 text-muted-foreground/60">
                <Phone className="size-3.5 shrink-0" />
                <span>Sin teléfono registrado</span>
              </p>
            )}
          </div>
        </div>

        <div className="px-3">
          <div className="h-[0.5px] bg-border w-full" />
        </div>

        {/* Shipping address / Ubicación */}
        <div className="px-3">
          <p className="text-sm font-medium text-foreground">
            {order.serviceType === "delivery"
              ? "Dirección de entrega"
              : "Lugar de atención"}
          </p>
          <div className="mt-2 text-sm space-y-1">
            <p className="font-medium text-foreground">
              {order.deliveryAddress ??
                order.tableName ??
                "Mostrador / En tienda"}
            </p>
            <p className="text-muted-foreground">
              {orderServiceLabel(order.serviceType)} ·{" "}
              {orderChannelLabel(order.channel)}
            </p>
            {(order.deliveryAddress || order.tableName) && (
              <div className="pt-1">
                <span className="inline-flex cursor-pointer items-center gap-1.5 font-medium text-primary hover:underline">
                  <Map className="size-3.5" />
                  Ver mapa
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="px-3">
          <div className="h-[0.5px] bg-border w-full" />
        </div>

        {/* Payment and Totals */}
        <div className="px-3 pb-3">
          <p className="text-sm font-medium text-foreground">Pago y totales</p>

          <div className="mt-2.5 flex items-center gap-2 font-medium text-muted-foreground">
            <CreditCard className="size-4" />
            <span className="text-sm tabular-nums font-mono">
              {order.paymentReference ?? "Sin referencia de operación"}
            </span>
          </div>

          <div className="mt-3 space-y-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-medium tabular-nums text-foreground">
                {formatOrderMoney(order.subtotal)}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>
                  Descuento{" "}
                  {order.promotionName ? `(${order.promotionName})` : ""}
                </span>
                <span className="font-medium tabular-nums">
                  -{formatOrderMoney(order.discount)}
                </span>
              </div>
            )}
            {order.deliveryFee > 0 && (
              <div className="flex justify-between text-muted-foreground">
                <span>Costo de envío</span>
                <span className="font-medium tabular-nums text-foreground">
                  {formatOrderMoney(order.deliveryFee)}
                </span>
              </div>
            )}
            <div className="flex justify-between border-t border-border pt-3 text-base font-medium text-foreground">
              Total
              <span className="font-medium tabular-nums text-primary">
                {formatOrderMoney(order.total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
