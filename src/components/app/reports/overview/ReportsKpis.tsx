"use client";

import { CircleDollarSign, ReceiptText, Users, Wallet } from "lucide-react";
import { money } from "./shared";

export function ReportsKpis({
  total,
  count,
  avgTicket,
  clients,
}: {
  total: number;
  count: number;
  avgTicket: number;
  clients: number;
}) {
  const stats = [
    {
      title: "Ventas totales",
      value: money(total),
      subtitle: "Pedidos con pago registrado",
      icon: CircleDollarSign,
    },
    {
      title: "Pedidos",
      value: String(count),
      subtitle: "En el período",
      icon: ReceiptText,
    },
    {
      title: "Ticket promedio",
      value: money(avgTicket),
      subtitle: "Por pedido pagado",
      icon: Wallet,
    },
    {
      title: "Clientes activos",
      value: String(clients),
      subtitle: "Con historial en CRM",
      icon: Users,
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(({ title, value, subtitle, icon: Icon }) => (
        <article
          key={title}
          className="rounded-xl border border-border bg-card px-5 py-4 font-heading"
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