import {
  Boxes,
  CircleDollarSign,
  ClipboardClock,
  PackageCheck,
} from "lucide-react";
import type { CustomerOrder } from "@/lib/mock/orders";
import { formatOrderMoney } from "@/lib/mock/orders";

export function OrdersKpis({ orders }: { orders: CustomerOrder[] }) {
  const validOrders = orders.filter((order) => order.status !== "cancelado");
  const stats = [
    {
      title: "Pedidos nuevos",
      value: orders.filter((order) => order.status === "nuevo").length,
      suffix: "pedidos",
      subtitle: "Pendientes de confirmar",
      icon: ClipboardClock,
    },
    {
      title: "En preparación",
      value: orders.filter((order) => order.status === "en_preparacion").length,
      suffix: "pedidos",
      subtitle: "En preparación o empaque",
      icon: Boxes,
    },
    {
      title: "Listos",
      value: orders.filter((order) => order.status === "listo").length,
      suffix: "pedidos",
      subtitle: "Listos para entrega o retiro",
      icon: PackageCheck,
    },
    {
      title: "Ventas registradas",
      value: formatOrderMoney(
        validOrders.reduce((sum, order) => sum + order.total, 0),
      ),
      subtitle: "Pedidos no cancelados",
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
