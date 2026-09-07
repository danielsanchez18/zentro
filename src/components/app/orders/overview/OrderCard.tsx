import {
  CalendarClock,
  Package,
  ShoppingBag,
  Store,
  Truck,
  UtensilsCrossed,
} from "lucide-react";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import type { CustomerOrder } from "@/lib/mock/orders";
import {
  formatOrderMoney,
  orderChannelLabel,
  orderServiceLabel,
} from "@/lib/mock/orders";
import { OrderActionsMenu } from "./OrderActionsMenu";

const time = (value: string) =>
  new Intl.DateTimeFormat("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

export function OrderCard({
  order,
  onOpen,
}: {
  order: CustomerOrder;
  onOpen: (order: CustomerOrder) => void;
}) {
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
  return (
    <article
      onClick={() => onOpen(order)}
      className="group cursor-pointer rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
            <ServiceIcon className="size-4.5" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold">{order.number}</p>
            <p className="truncate text-xs text-muted-foreground">
              {order.customerName}
            </p>
          </div>
        </div>
        <OrderActionsMenu order={order} onOpen={onOpen} />
      </div>
      <div className="my-4 flex flex-wrap gap-2">
        <StatusBadge status={order.status} />
        <StatusBadge status={order.paymentStatus} />
      </div>
      <div className="grid grid-cols-2 gap-3 border-y border-border py-3 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Atención</p>
          <p className="mt-1 font-medium">
            {orderServiceLabel(order.serviceType)}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {order.tableName
              ? `${orderChannelLabel(order.channel)} · ${order.tableName}`
              : orderChannelLabel(order.channel)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="mt-1 font-semibold tabular-nums">
            {formatOrderMoney(order.total)}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Package className="size-4" />
          {units} {units === 1 ? "unidad" : "unidades"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CalendarClock className="size-4" />
          Prometido {time(order.promisedAt)}
        </span>
      </div>
    </article>
  );
}
