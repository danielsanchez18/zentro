import {
  CalendarClock,
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

export function OrderTable({
  orders,
  onOpen,
}: {
  orders: CustomerOrder[];
  onOpen: (order: CustomerOrder) => void;
}) {
  return (
    <div className="hidden w-full overflow-x-auto md:block">
      <table className="min-w-full">
        <thead>
          <tr className="bg-accent">
            {[
              "Pedido",
              "Atención",
              "Productos",
              "Hora",
              "Total",
              "Estado",
              "Pago",
            ].map((label) => (
              <th
                key={label}
                className="px-5 py-3 text-left font-heading text-xs font-semibold uppercase text-nowrap"
              >
                {label}
              </th>
            ))}
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {orders.map((order) => {
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
            const units = order.lines.reduce(
              (sum, item) => sum + item.quantity,
              0,
            );
            return (
              <tr
                key={order.id}
                onClick={() => onOpen(order)}
                className="cursor-pointer hover:bg-muted/30"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                      <ServiceIcon className="size-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium">{order.number}</p>
                      <p className="text-sm text-muted-foreground text-nowrap">
                        {order.customerName}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <p className="text-sm font-medium">
                    {orderServiceLabel(order.serviceType)}
                  </p>
                  <p className="text-sm text-muted-foreground text-nowrap">
                    {order.tableName
                      ? `${orderChannelLabel(order.channel)} · ${order.tableName}`
                      : orderChannelLabel(order.channel)}
                  </p>
                </td>
                <td className="px-5 py-3">
                  <p className="text-sm text-nowrap">
                    {order.lines.length} productos
                  </p>
                  <p className="text-sm text-muted-foreground text-nowrap">
                    {units} unidades
                  </p>
                </td>
                <td className="px-5 py-3">
                  <p className="inline-flex items-center gap-1.5 text-sm">
                    <CalendarClock className="size-4 text-muted-foreground" />
                    {time(order.createdAt)}
                  </p>
                  <p className="text-sm text-muted-foreground text-nowrap">
                    Prometido {time(order.promisedAt)}
                  </p>
                </td>
                <td className="px-5 py-3 text-sm font-medium tabular-nums text-nowrap">
                  {formatOrderMoney(order.total)}
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={order.paymentStatus} />
                </td>
                <td className="px-5 py-3 text-right">
                  <OrderActionsMenu order={order} onOpen={onOpen} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
