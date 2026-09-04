import { CalendarDays } from "lucide-react";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import type { PurchaseOrder } from "@/lib/mock/purchases";
import { formatPurchaseMoney, purchaseProgress } from "@/lib/mock/purchases";
import { PurchaseActionsMenu } from "./PurchaseActionsMenu";

const date = (value: string) =>
  new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

export function PurchaseTable({
  orders,
  onOpen,
  slug,
}: {
  orders: PurchaseOrder[];
  onOpen: (order: PurchaseOrder) => void;
  slug?: string;
}) {
  return (
    <div className="hidden w-full overflow-x-auto md:block">
      <table className="min-w-full">
        <thead>
          <tr className="bg-accent">
            {[
              "Orden",
              "Proveedor",
              "Entrega",
              "Recepción",
              "Total",
              "Estado",
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
          {orders.map((order) => (
            <tr
              key={order.id}
              onClick={() => onOpen(order)}
              className="cursor-pointer hover:bg-muted/30"
            >
              <td className="px-5 py-3">
                <p className="font-heading text-sm font-medium">
                  {order.number}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Emitida {date(order.issuedAt)}
                </p>
              </td>
              <td className="px-5 py-3">
                <p className="text-sm font-medium">{order.supplierName}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {order.itemCount} productos · {order.orderedUnits} unidades
                </p>
              </td>
              <td className="px-5 py-3">
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground text-nowrap">
                  <CalendarDays className="size-3.5" />
                  {date(order.expectedAt)}
                </span>
              </td>
              <td className="px-5 py-3">
                <div className="min-w-28">
                  <div className="flex justify-between text-xs">
                    <span>
                      {order.receivedUnits}/{order.orderedUnits}
                    </span>
                    <span className="text-muted-foreground">
                      {purchaseProgress(order)}%
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${purchaseProgress(order)}%` }}
                    />
                  </div>
                </div>
              </td>
              <td className="px-5 py-3 text-sm font-medium tabular-nums text-nowrap">
                {formatPurchaseMoney(order.total)}
              </td>
              <td className="px-5 py-3">
                <StatusBadge status={order.status} />
              </td>
              <td className="px-5 py-3 text-right">
                <PurchaseActionsMenu slug={slug} order={order} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
