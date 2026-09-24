import {
  Banknote,
  CircleDollarSign,
  Monitor,
  TrendingDown,
} from "lucide-react";
import type { CashMovement, CashSession } from "@/lib/mock/cash";

const money = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});
export function expectedCash(session: CashSession, movements: CashMovement[]) {
  return (
    session.openingAmount +
    movements
      .filter(
        (item) => item.sessionId === session.id && item.method === "efectivo",
      )
      .reduce(
        (sum, item) =>
          sum + (item.direction === "entrada" ? item.amount : -item.amount),
        0,
      )
  );
}

export function CashKpis({
  sessions,
  movements,
}: {
  sessions: CashSession[];
  movements: CashMovement[];
}) {
  const active = sessions.filter((item) => item.status === "abierta");
  const today = movements.filter(
    (item) =>
      new Date(item.createdAt).toDateString() === new Date().toDateString(),
  );
  const stats = [
    {
      title: "Cajas abiertas",
      value: String(active.length),
      subtitle: "Terminales operando",
      icon: Monitor,
    },
    {
      title: "Efectivo esperado",
      value: money.format(
        active.reduce((sum, item) => sum + expectedCash(item, movements), 0),
      ),
      subtitle: "Fondo y movimientos en efectivo",
      icon: Banknote,
    },
    {
      title: "Cobrado hoy",
      value: money.format(
        today
          .filter((item) => item.direction === "entrada")
          .reduce((sum, item) => sum + item.amount, 0),
      ),
      subtitle: "Todos los métodos",
      icon: CircleDollarSign,
    },
    {
      title: "Salidas de hoy",
      value: money.format(
        today
          .filter((item) => item.direction === "salida")
          .reduce((sum, item) => sum + item.amount, 0),
      ),
      subtitle: "Retiros, gastos y reembolsos",
      icon: TrendingDown,
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
