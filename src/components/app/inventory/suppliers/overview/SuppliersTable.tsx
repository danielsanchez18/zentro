import { Building2 } from "lucide-react";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import type { InventorySupplier } from "@/lib/mock/inventory-suppliers";

export function SuppliersTable({
  suppliers,
  onOpen,
}: {
  suppliers: InventorySupplier[];
  onOpen: (supplier: InventorySupplier) => void;
}) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-200 w-full">
        <thead>
          <tr className="bg-accent">
            {[
              "Proveedor",
              "Contacto",
              "Productos",
              "Entrega",
              "Condición de pago",
              "Estado",
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
          {suppliers.map((supplier) => (
            <tr
              key={supplier.id}
              onClick={() => onOpen(supplier)}
              className="cursor-pointer hover:bg-muted/30"
            >
              <td className="px-5 py-3 text-sm text-nowrap">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent">
                    <Building2 className="size-4" />
                  </span>
                  <div>
                    <span className="font-medium">{supplier.tradeName}</span>
                    <span className="block font-sans text-sm text-muted-foreground">
                      RUC {supplier.documentNumber}
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-5 py-3 text-sm text-nowrap">
                <span>{supplier.contactName}</span>
                <span className="block font-sans text-sm text-muted-foreground">
                  {supplier.email}
                </span>
              </td>
              <td className="px-5 py-3 text-sm font-medium tabular-nums text-nowrap">
                {supplier.productCount}
              </td>
              <td className="px-5 py-3 text-sm text-nowrap">
                {supplier.leadTimeDays}{" "}
                {supplier.leadTimeDays === 1 ? "día" : "días"}
              </td>
              <td className="px-5 py-3 text-sm text-muted-foreground text-nowrap">
                {supplier.paymentTerms}
              </td>
              <td className="px-5 py-3 text-sm text-nowrap">
                <StatusBadge status={supplier.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
