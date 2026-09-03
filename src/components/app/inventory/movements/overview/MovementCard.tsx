import { CalendarDays, Package, UserRound } from "lucide-react";
import type { InventoryMovementRecord } from "@/lib/mock/inventory-movements";
import { StatusBadge } from "@/components/app/shared/StatusBadge";

export function MovementCard({
  movement,
  onOpen,
}: {
  movement: InventoryMovementRecord;
  onOpen: (movement: InventoryMovementRecord) => void;
}) {
  return (
    <article
      tabIndex={0}
      onClick={() => onOpen(movement)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onOpen(movement);
      }}
      className="cursor-pointer rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary focus-visible:border-primary focus-visible:outline-none"
    >
      <div className="flex items-start justify-between gap-3">
          <StatusBadge status={movement.type} />
        <span
          className={`text-lg font-semibold tabular-nums ${movement.quantity < 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}
        >
          {movement.quantity > 0 ? "+" : "−"}
          {Math.abs(movement.quantity)}
        </span>
      </div>
      <div className="mt-3">
        <p className="truncate text-sm font-medium">{movement.productName}</p>
        <p className="text-sm text-muted-foreground">{movement.sku}</p>
      </div>
      <div className="my-3 border-t border-border" />
      <div className="space-y-2 text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <Package className="size-3.5" />
          {movement.previousStock} → {movement.resultingStock} unidades
        </p>
        <p className="flex items-center gap-2">
          <UserRound className="size-3.5" />
          {movement.responsible}
        </p>
        <p className="flex items-center gap-2">
          <CalendarDays className="size-3.5" />
          {new Date(movement.createdAt).toLocaleString("es-PE")}
        </p>
      </div>
      <p className="mt-3 truncate text-sm">{movement.reason}</p>
    </article>
  );
}
