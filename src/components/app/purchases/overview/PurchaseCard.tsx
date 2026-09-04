import { CalendarDays, PackageOpen, Truck } from "lucide-react";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import type { PurchaseOrder } from "@/lib/mock/purchases";
import { formatPurchaseMoney, purchaseProgress } from "@/lib/mock/purchases";

const date = (value: string) =>
  new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "short" }).format(
    new Date(value),
  );

export function PurchaseCard({
  order,
  onOpen,
}: {
  order: PurchaseOrder;
  onOpen: (order: PurchaseOrder) => void;
}) {
  const progress = purchaseProgress(order);
  return (
    <article
      onClick={() => onOpen(order)}
      className="group cursor-pointer rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/35"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
            <Truck className="size-4.5" />
          </span>
          <div>
            <p className="font-heading text-sm font-semibold">{order.number}</p>
            <p className="text-xs text-muted-foreground">
              {order.supplierName}
            </p>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <div className="my-4 grid grid-cols-2 gap-3 border-y border-border py-3 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Entrega estimada</p>
          <p className="mt-1 inline-flex items-center gap-1.5 font-medium">
            <CalendarDays className="size-3.5 text-primary" />
            {date(order.expectedAt)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="mt-1 font-medium tabular-nums">
            {formatPurchaseMoney(order.total)}
          </p>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <PackageOpen className="size-3.5" />
            {order.receivedUnits} de {order.orderedUnits} recibidas
          </span>
          <span className="font-medium text-primary">{progress}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </article>
  );
}
