import { BadgeCheck, CircleDollarSign, ShoppingBag, Users } from "lucide-react";
import { crmMoney, type CrmCustomer } from "@/lib/mock/crm";

export function CustomersKpis({ customers }: { customers: CrmCustomer[] }) {
  const active = customers.filter((customer) => customer.status === "activo");
  const stats = [
    {
      title: "Clientes",
      value: customers.length.toLocaleString("es-PE"),
      subtitle: "Perfiles registrados",
      icon: Users,
    },
    {
      title: "Clientes activos",
      value: active.length.toLocaleString("es-PE"),
      subtitle: "Disponibles para nuevas ventas",
      icon: BadgeCheck,
    },
    {
      title: "Pedidos acumulados",
      value: customers
        .reduce((sum, customer) => sum + customer.totalOrders, 0)
        .toLocaleString("es-PE"),
      subtitle: "Historial de los clientes",
      icon: ShoppingBag,
    },
    {
      title: "Valor acumulado",
      value: crmMoney(
        customers.reduce((sum, customer) => sum + customer.totalSpent, 0),
      ),
      subtitle: "Ventas atribuidas",
      icon: CircleDollarSign,
    },
  ];
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(({ title, value, subtitle, icon: Icon }) => (
        <article
          key={title}
          className="border border-border bg-card rounded-xl px-5 py-4 font-heading"
        >
          <div className="flex items-center justify-between text-primary/70">
            <p className="text-sm">{title}</p>
            <Icon className="size-4.5" />
          </div>
          <p className="mt-2 text-xl font-medium tabular-nums">{value}</p>
          <p className="mt-1 text-xs text-primary/70">{subtitle}</p>
        </article>
      ))}
    </section>
  );
}
