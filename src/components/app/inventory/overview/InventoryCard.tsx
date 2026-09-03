import {
  Boxes,
  Package,
  PackageCheck,
  ShieldAlert,
  Tag,
  Truck,
} from "lucide-react";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import type { InventoryItem } from "@/lib/mock/inventory";
import { availableStock, inventoryStatus } from "@/lib/mock/inventory";
import { InventoryItemActions } from "./InventoryItemActions";

interface InventoryCardProps {
  item: InventoryItem;
  onOpen: (item: InventoryItem) => void;
  onRegisterEntry: (item: InventoryItem) => void;
  onRegisterOutput: (item: InventoryItem) => void;
  onRegisterWaste: (item: InventoryItem) => void;
  onEditMinStock: (item: InventoryItem) => void;
  onAdjustStock: (item: InventoryItem) => void;
  onViewHistory: (item: InventoryItem) => void;
}

/** Vista card del inventario — mantiene la composición visual de ProductCard. */
export function InventoryCard({
  item,
  onOpen,
  onRegisterEntry,
  onRegisterOutput,
  onRegisterWaste,
  onEditMinStock,
  onAdjustStock,
  onViewHistory,
}: InventoryCardProps) {
  const available = availableStock(item);

  return (
    <article
      onClick={() => onOpen(item)}
      className="group cursor-pointer rounded-xl border border-border p-4 transition-all hover:border-primary"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-accent">
          <Package className="size-6 text-muted-foreground group-hover:text-foreground" />
        </div>

        <InventoryItemActions
          item={item}
          onPreview={onOpen}
          onRegisterEntry={onRegisterEntry}
          onRegisterOutput={onRegisterOutput}
          onRegisterWaste={onRegisterWaste}
          onEditMinStock={onEditMinStock}
          onAdjustStock={onAdjustStock}
          onViewHistory={onViewHistory}
        />
      </div>

      <div className="mt-3 space-y-1">
        <p className="truncate text-sm font-medium font-heading">
          {item.productName}
        </p>
        <span className="block truncate font-sans text-sm text-muted-foreground">
          {item.sku}
        </span>
      </div>

      <div className="my-3 border-t border-border" />

      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex min-w-0 items-center gap-2">
          <Tag className="size-3.5 shrink-0" />
          <span className="truncate">{item.brand}</span>
        </div>

        <div className="flex min-w-0 items-center gap-2">
          <Truck className="size-3.5 shrink-0" />
          <span className="truncate">{item.supplier}</span>
        </div>
      </div>

      <div className="my-3 border-t border-border" />

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <PackageCheck className="size-4 text-muted-foreground" />
          <p className="font-medium">
            {available}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              disponibles
            </span>
          </p>
        </div>
        <StatusBadge status={inventoryStatus(item)} />
      </div>

      <div className="my-3 border-t border-border" />

      <div className="grid grid-cols-3 gap-2">
        <StockStat icon={Boxes} label="En stock" value={item.currentStock} />
        <StockStat
          icon={Package}
          label="Reservado"
          value={item.reservedStock}
        />
        <StockStat
          icon={ShieldAlert}
          label="Mínimo"
          value={item.minimumStock}
        />
      </div>
    </article>
  );
}

function StockStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Boxes;
  label: string;
  value: number;
}) {
  return (
    <div className="flex min-w-0 items-center justify-center gap-2 rounded-lg bg-accent/50 p-1 text-center">
      <Icon className="size-3.5 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="font-medium tabular-nums">{value}</p>
        <p className="truncate text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
