import { Tag } from "lucide-react";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import type { InventoryBrand } from "@/lib/mock/inventory-brands";
import { BrandActionsMenu } from "./BrandActionsMenu";

interface BrandsTableProps {
  brands: InventoryBrand[];
  onOpen: (brand: InventoryBrand) => void;
  onEdit: (brand: InventoryBrand) => void;
  onToggleStatus: (brand: InventoryBrand) => void;
  onDelete: (brand: InventoryBrand) => void;
}

export function BrandsTable({
  brands,
  onOpen,
  onEdit,
  onToggleStatus,
  onDelete,
}: BrandsTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-200 w-full">
        <thead>
          <tr className="bg-accent">
            {[
              "Marca",
              "Origen",
              "Productos",
              "Unidades",
              "Valor del inventario",
              "Estado",
            ].map((label) => (
              <th
                key={label}
                className="px-5 py-3 text-left text-xs font-semibold uppercase text-nowrap font-heading"
              >
                {label}
              </th>
            ))}
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {brands.map((brand) => (
            <tr
              key={brand.id}
              onClick={() => onOpen(brand)}
              className="cursor-pointer hover:bg-muted/30"
            >
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent">
                    <Tag className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">{brand.name}</p>
                    <p className="max-w-64 truncate font-sans text-xs text-muted-foreground">
                      {brand.description}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-3 text-sm text-muted-foreground text-nowrap">
                {brand.origin}
              </td>
              <td className="px-5 py-3 text-sm font-medium tabular-nums">
                {brand.productCount}
              </td>
              <td className="px-5 py-3 text-sm tabular-nums">
                {brand.unitsInStock}
              </td>
              <td className="px-5 py-3 text-sm font-medium tabular-nums text-nowrap">
                S/ {brand.inventoryValue.toLocaleString("es-PE")}
              </td>
              <td className="px-5 py-3">
                <StatusBadge status={brand.status} />
              </td>
              <td className="px-5 py-3 text-right">
                <BrandActionsMenu
                  brand={brand}
                  onOpen={onOpen}
                  onEdit={onEdit}
                  onToggleStatus={onToggleStatus}
                  onDelete={onDelete}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
