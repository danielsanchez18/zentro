import {
  CircleDollarSign,
  ClipboardClock,
  PackageOpen,
  Truck,
} from "lucide-react";
import type { PurchaseOrder } from "@/lib/mock/purchases";
import { formatPurchaseMoney } from "@/lib/mock/purchases";

export function PurchasesKpis({ orders }: { orders: PurchaseOrder[] }) {
  const open = orders.filter((order) =>
    ["borrador", "enviada", "parcial"].includes(order.status),
  );
  const stats = [
    {
      title: "Órdenes abiertas",
      value: open.length,
      suffix: "órdenes",
      subtitle: "Requieren seguimiento",
      icon: ClipboardClock,
    },
    {
      title: "Por recibir",
      value: orders.filter((order) =>
        ["enviada", "parcial"].includes(order.status),
      ).length,
      suffix: "órdenes",
      subtitle: "Pendientes de inventario",
      icon: Truck,
    },
    {
      title: "Unidades pendientes",
      value: open.reduce(
        (sum, order) => sum + order.orderedUnits - order.receivedUnits,
        0,
      ),
      suffix: "unidades",
      subtitle: "Aún no recepcionadas",
      icon: PackageOpen,
    },
    {
      title: "Compras registradas",
      value: formatPurchaseMoney(
        orders
          .filter((order) => order.status !== "cancelada")
          .reduce((sum, order) => sum + order.total, 0),
      ),
      subtitle: "Periodo del prototipo",
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
          <div className="flex items-center justify-between text-primary/70">
            <p className="text-sm">{item.title}</p>
            <item.icon className="size-4.5" />
          </div>
          <p className="mt-2 text-xl font-medium">
            {typeof item.value === "number"
              ? item.value.toLocaleString("es-PE")
              : item.value}{" "}
            {item.suffix && <span className="text-sm">{item.suffix}</span>}
          </p>
          <p className="mt-1 text-xs text-primary/70">{item.subtitle}</p>
        </article>
      ))}
    </section>
  );
}
