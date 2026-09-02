import { AlertTriangle, Boxes, CircleDollarSign, PackageX } from "lucide-react";
import type { InventoryItem } from "@/lib/mock/inventory";
import { availableStock, inventoryStatus } from "@/lib/mock/inventory";

export function InventoryKpis({ items }: { items: InventoryItem[] }) {
  const stats = [
    {
      title: "Unidades disponibles",
      value: items.reduce((sum, item) => sum + availableStock(item), 0),
      suffix: "unidades",
      subtitle: "Stock listo para venta",
      icon: Boxes,
    },
    {
      title: "Stock bajo",
      value: items.filter((item) => inventoryStatus(item) === "bajo").length,
      suffix: "productos",
      subtitle: "Requieren reposición",
      icon: AlertTriangle,
    },
    {
      title: "Productos agotados",
      value: items.filter((item) => inventoryStatus(item) === "agotado").length,
      suffix: "productos",
      subtitle: "Sin unidades disponibles",
      icon: PackageX,
    },
    {
      title: "Valor del inventario",
      value: new Intl.NumberFormat("es-PE", {
        style: "currency",
        currency: "PEN",
        maximumFractionDigits: 0,
      }).format(items.reduce((sum, item) => sum + item.currentStock * item.unitCost, 0)),
      subtitle: "Calculado al costo unitario",
      icon: CircleDollarSign,
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <article
          key={item.title}
          className="rounded-xl border border-border bg-card px-5 py-4 font-heading"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between text-primary/70">
              <p className="text-sm">{item.title}</p>
              <item.icon className="size-4.5" />
            </div>

            <div className="space-y-1">
              <p className="text-xl font-medium">
                {typeof item.value === "number"
                  ? item.value.toLocaleString("es-PE")
                  : item.value}{" "}
                {item.suffix && (
                  <span className="text-sm">
                    {item.value === 1 ? item.suffix.replace(/s$/, "") : item.suffix}
                  </span>
                )}
              </p>
              <p className="text-xs text-primary/70">{item.subtitle}</p>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
