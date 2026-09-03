import type { InventoryMovementRecord } from "@/lib/mock/inventory-movements";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/app/shared/StatusBadge";

export function MovementPreviewDialog({
  movement,
  open,
  onOpenChange,
}: {
  movement: InventoryMovementRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!movement) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div>
            <StatusBadge status={movement.type} />
          </div>
          <DialogTitle className="pt-2 font-heading">
            {movement.productName}
          </DialogTitle>
          <DialogDescription className="font-heading">
            {movement.id} ·{" "}
            {new Date(movement.createdAt).toLocaleString("es-PE")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-3">
          <Summary label="Stock anterior" value={movement.previousStock} />
          <Summary
            label="Movimiento"
            value={`${movement.quantity > 0 ? "+" : "−"}${Math.abs(movement.quantity)}`}
          />
          <Summary label="Stock resultante" value={movement.resultingStock} />
        </div>
        <dl className="grid gap-3 font-heading border-t border-border p-4 px-2 text-sm sm:grid-cols-2">
          <Info label="Motivo" value={movement.reason} />
          <Info label="Responsable" value={movement.responsible} />
          <Info
            label="Documento"
            value={movement.documentRef ?? "Sin documento"}
          />
          <Info label="SKU" value={movement.sku} />
          {movement.notes && (
            <div className="sm:col-span-2">
              <Info label="Observaciones" value={movement.notes} />
            </div>
          )}
        </dl>
      </DialogContent>
    </Dialog>
  );
}
function Summary({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex min-w-0 items-center justify-center gap-2 rounded-lg bg-accent/50 p-2 text-center">
      <div className="min-w-0">
        <p className="text-lg font-medium tabular-nums">{value}</p>
        <p className="truncate text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  );
}
