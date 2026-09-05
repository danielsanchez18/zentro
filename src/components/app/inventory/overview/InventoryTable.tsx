import { Package } from "lucide-react";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import type { InventoryItem } from "@/lib/mock/inventory";
import { availableStock, inventoryStatus } from "@/lib/mock/inventory";
import { InventoryItemActions } from "./InventoryItemActions";

interface InventoryTableProps {
  items: InventoryItem[];
  onOpen: (item: InventoryItem) => void;
  onRegisterEntry: (item: InventoryItem) => void;
  onRegisterOutput: (item: InventoryItem) => void;
  onRegisterWaste: (item: InventoryItem) => void;
  onEditMinStock: (item: InventoryItem) => void;
  onAdjustStock: (item: InventoryItem) => void;
  onViewHistory: (item: InventoryItem) => void;
}

/** Vista de tabla del inventario — mantiene el patrón visual de ProductTable. */
export function InventoryTable({
  items,
  onOpen,
  onRegisterEntry,
  onRegisterOutput,
  onRegisterWaste,
  onEditMinStock,
  onAdjustStock,
  onViewHistory,
}: InventoryTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-200 w-full">
        <thead>
          <tr className="bg-accent">
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-nowrap font-heading">
              Producto
            </th>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-nowrap font-heading">
              Marca / proveedor
            </th>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-nowrap font-heading">
              Stock
            </th>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-nowrap font-heading">
              Reservado
            </th>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-nowrap font-heading">
              Disponible
            </th>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-nowrap font-heading">
              Estado
            </th>
            <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-nowrap font-heading" />
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {items.map((item) => (
            <tr
              key={item.id}
              onClick={() => onOpen(item)}
              className="group cursor-pointer hover:bg-muted/30"
            >
              <td className="px-5 py-3 text-sm text-nowrap">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-accent">
                    <Package className="size-4.5" />
                  </div>
                  <div>
                    <span className="font-medium">{item.productName}</span>
                    <span className="block font-sans text-sm text-muted-foreground">
                      {item.sku}
                    </span>
                  </div>
                </div>
              </td>

              <td className="px-5 py-3 text-sm text-nowrap">
                <span>{item.brand}</span>
                <span className="block font-sans text-sm text-muted-foreground">
                  {item.supplier}
                </span>
              </td>

              <td className="px-5 py-3 text-sm font-medium tabular-nums text-nowrap">
                {item.currentStock}
              </td>
              <td className="px-5 py-3 text-sm text-muted-foreground tabular-nums text-nowrap">
                {item.reservedStock}
              </td>
              <td className="px-5 py-3 text-sm font-medium tabular-nums text-nowrap">
                {availableStock(item)}
              </td>
              <td className="px-5 py-3 text-sm text-nowrap">
                <StatusBadge status={inventoryStatus(item)} />
              </td>

              <td className="px-5 py-3 text-right text-nowrap">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
