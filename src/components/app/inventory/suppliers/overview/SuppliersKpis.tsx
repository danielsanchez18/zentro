import { Building2, Clock3, PackageCheck, Truck } from "lucide-react";
import type { InventorySupplier } from "@/lib/mock/inventory-suppliers";

export function SuppliersKpis({ suppliers }: { suppliers: InventorySupplier[] }) {
  const active = suppliers.filter((supplier) => supplier.status === "activo");
  const averageLeadTime = active.length
    ? Math.round(active.reduce((sum, supplier) => sum + supplier.leadTimeDays, 0) / active.length)
    : 0;
  const stats = [
    { title: "Proveedores activos", value: active.length, suffix: "proveedores", subtitle: "Disponibles para abastecer", icon: Building2 },
    { title: "Productos vinculados", value: active.reduce((sum, supplier) => sum + supplier.productCount, 0), suffix: "productos", subtitle: "Relaciones comerciales activas", icon: PackageCheck },
    { title: "Tiempo de entrega", value: averageLeadTime, suffix: averageLeadTime === 1 ? "día" : "días", subtitle: "Promedio de proveedores activos", icon: Clock3 },
    { title: "Entradas del mes", value: suppliers.reduce((sum, supplier) => sum + supplier.monthlyEntries, 0), suffix: "entradas", subtitle: "Recepciones registradas", icon: Truck },
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
                {item.value.toLocaleString("es-PE")}{" "}
                <span className="text-sm">
                  {item.value === 1
                    ? item.suffix.replace(/s$/, "")
                    : item.suffix}
                </span>
              </p>
              <p className="text-xs text-primary/70">{item.subtitle}</p>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
