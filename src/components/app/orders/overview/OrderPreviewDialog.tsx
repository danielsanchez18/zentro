"use client";

import { useParams, useRouter } from "next/navigation";
import {
  Boxes,
  CalendarClock,
  CheckCheck,
  Package,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Store,
  Truck,
  UserRound,
  UtensilsCrossed,
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
import { toastMsg } from "@/components/ui/toast-message";
import type { CustomerOrder, OrderStatus } from "@/lib/mock/orders";
import {
  formatOrderMoney,
  orderChannelLabel,
  orderServiceLabel,
} from "@/lib/mock/orders";
import { useOrdersStore } from "@/stores/orders-store";

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

const nextActions: Partial<
  Record<
    OrderStatus,
    { status: OrderStatus; label: string; icon: typeof ShieldCheck }
  >
> = {
  nuevo: { status: "confirmado", label: "Confirmar pedido", icon: ShieldCheck },
  confirmado: {
    status: "en_preparacion",
    label: "Iniciar preparación",
    icon: Boxes,
  },
  en_preparacion: {
    status: "listo",
    label: "Marcar como listo",
    icon: PackageCheck,
  },
  listo: { status: "entregado", label: "Completar entrega", icon: CheckCheck },
};

export function OrderPreviewDialog({
  order,
  open,
  onOpenChange,
}: {
  order: CustomerOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const transitionOrder = useOrdersStore((state) => state.transitionOrder);

  if (!order) return null;

  const isRestaurantTable =
    order.serviceType === "mesa" &&
    Boolean(order.tableName?.toLowerCase().includes("mesa"));
  const ServiceIcon =
    order.serviceType === "delivery"
      ? Truck
      : order.serviceType === "recojo"
        ? ShoppingBag
        : isRestaurantTable
          ? UtensilsCrossed
          : Store;

  const units = order.lines.reduce((sum, item) => sum + item.quantity, 0);
  const next = nextActions[order.status];

  const handleNextAction = () => {
    if (!next) return;
    if (transitionOrder(order.id, next.status)) {
      toastMsg.success(next.label, order.number);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[95dvh] flex-col font-heading sm:max-w-lg">
        {/* Header fijo */}
        <DialogHeader className="shrink-0 space-y-0 ">
          <div className="flex flex-col gap-5 pr-6">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                <ServiceIcon className="size-4.5" />
              </span>
              <div className="min-w-0">
                <DialogTitle className="truncate text-base font-semibold tracking-tight text-foreground">
                  {order.number}
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  {formatDateTime(order.createdAt)} ·{" "}
                  {orderChannelLabel(order.channel)}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-1.5">
              <StatusBadge status={order.status} />
              <StatusBadge status={order.paymentStatus} />
            </div>
          </div>
        </DialogHeader>

        {/* Body scrollable con max-h según el viewport */}
        <div className="flex-1 overflow-y-auto">
          {/* Total & Atención */}
          <div className="border-y border-border py-3.5">
            <div>
              <p className="text-xs text-muted-foreground">Total del pedido</p>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="mt-0.5 font-heading text-lg font-medium tracking-tight text-primary tabular-nums">
                  {formatOrderMoney(order.total)}
                </p>
                <span className="inline-flex items-center rounded-md bg-accent px-2 py-2 leading-none text-xs font-medium text-foreground/85">
                  {orderServiceLabel(order.serviceType)}
                </span>
              </div>
            </div>
            {order.promotionName && (
              <p className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                Promoción aplicada: {order.promotionName} (-
                {formatOrderMoney(order.discount)})
              </p>
            )}
          </div>

          {/* Meta Info: Cliente & Compromiso */}
          <div className="grid grid-cols-2 gap-4 border-b border-border py-3.5 text-sm">
            <div>
              <p className="flex items-center gap-1.5 font-medium text-muted-foreground">
                <UserRound className="size-4 shrink-0" />
                Cliente
              </p>
              <p className="mt-1 truncate font-medium text-foreground">
                {order.customerName}
              </p>
              {order.customerPhone && (
                <a
                  href={`https://wa.me/${order.customerPhone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground underline underline-offset-2 hover:text-primary transition-colors"
                  title="Contactar por WhatsApp"
                >
                  <span>{order.customerPhone}</span>
                </a>
              )}
            </div>
            <div>
              <p className="flex items-center gap-1.5 font-medium text-muted-foreground">
                <CalendarClock className="size-4 shrink-0" />
                Compromiso
              </p>
              <p className="mt-1 font-medium text-foreground">
                {formatDateTime(order.promisedAt)}
              </p>
              {(order.deliveryAddress || order.tableName) && (
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {order.deliveryAddress ?? order.tableName}
                </p>
              )}
            </div>
          </div>

          {/* Items del pedido */}
          <div className="space-y-2 border-b border-border py-3.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium text-muted-foreground">
                <Package className="size-4 shrink-0" />
                Productos ({units} {units === 1 ? "unidad" : "unidades"})
              </span>
              <span className="text-sm text-muted-foreground">
                {order.lines.length}{" "}
                {order.lines.length === 1 ? "ítem" : "ítems"}
              </span>
            </div>

            <div className="space-y-1">
              {order.lines.map((line) => (
                <div key={line.id} className="flex items-center gap-3 py-2">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-accent text-muted-foreground/60">
                    <Package className="size-4" />
                  </div>
                  <div className="min-w-0 line-clamp-2">
                    <p className="text-sm font-medium text-foreground">
                      <span className="mr-1.5 font-medium text-primary">
                        {line.quantity}×
                      </span>
                      {line.name}
                    </p>
                    {line.notes && (
                      <p className="mt-0.5 font-sans text-xs text-muted-foreground">
                        {line.notes}
                      </p>
                    )}
                  </div>
                  <p className="ml-auto shrink-0 text-sm font-medium tabular-nums text-foreground">
                    {formatOrderMoney(line.total)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen financiero */}
          <div className="space-y-3 pt-3.5 pb-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-foreground tabular-nums">
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
              <div className="flex justify-between">
                <span>Costo de envío</span>
                <span className="font-medium text-foreground tabular-nums">
                  {formatOrderMoney(order.deliveryFee)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-base font-medium text-foreground">
              <span className="flex items-center gap-1.5">Total liquidado</span>
              <span className="font-medium text-primary tabular-nums">
                {formatOrderMoney(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer fijo */}
        <DialogFooter className="shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/app/${slug}/pedidos/${order.id}`)}
            className="h-fit w-full cursor-pointer rounded-full font-sans px-3 py-2 leading-none sm:w-auto"
          >
            Ver detalle
          </Button>
          {next && (
            <Button
              type="button"
              onClick={handleNextAction}
              className="h-fit w-full cursor-pointer rounded-full font-sans px-3 py-2 leading-none sm:w-auto"
            >
              <next.icon className="size-3.5" />
              {next.label}
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-fit w-full cursor-pointer rounded-full font-sans px-3 py-2 leading-none sm:w-auto"
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
