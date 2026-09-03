import type { InventoryMovementRecord } from "@/lib/mock/inventory-movements";
import { StatusBadge } from "@/components/app/shared/StatusBadge";

export function MovementTable({
  movements,
  onOpen,
}: {
  movements: InventoryMovementRecord[];
  onOpen: (movement: InventoryMovementRecord) => void;
}) {
  return (
    <div className="hidden w-full overflow-x-auto md:block">
      <table className="min-w-full">
        <thead>
          <tr className="bg-accent">
            {[
              "Movimiento",
              "Producto",
              "Motivo / documento",
              "Cantidad",
              "Stock",
              "Responsable",
              "Fecha",
            ].map((label) => (
              <th
                key={label}
                className="px-5 py-3 text-left text-xs font-semibold uppercase text-nowrap font-heading"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {movements.map((movement) => (
            <tr
              key={movement.id}
              tabIndex={0}
              onClick={() => onOpen(movement)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ")
                  onOpen(movement);
              }}
              className="cursor-pointer transition-colors hover:bg-accent/50 focus-visible:bg-accent/50 focus-visible:outline-none"
            >
              <td className="px-5 py-3">
                  <StatusBadge status={movement.type} />
              </td>
              <td className="px-5 py-3">
                <p className="max-w-56 truncate text-sm font-medium">
                  {movement.productName}
                </p>
                <p className="text-xs text-muted-foreground">{movement.sku}</p>
              </td>
              <td className="px-5 py-3">
                <p className="text-sm">{movement.reason}</p>
                <p className="text-xs text-muted-foreground">
                  {movement.documentRef ?? "Sin documento"}
                </p>
              </td>
              <td
                className={`px-5 py-3 text-sm font-semibold tabular-nums ${movement.quantity < 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}
              >
                {movement.quantity > 0 ? "+" : "−"}
                {Math.abs(movement.quantity)}
              </td>
              <td className="px-5 py-3 text-sm tabular-nums text-nowrap">
                {movement.previousStock} → {movement.resultingStock}
              </td>
              <td className="px-5 py-3 text-sm text-muted-foreground text-nowrap">
                {movement.responsible}
              </td>
              <td className="px-5 py-3 text-sm text-muted-foreground text-nowrap">
                {new Date(movement.createdAt).toLocaleDateString("es-PE", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
