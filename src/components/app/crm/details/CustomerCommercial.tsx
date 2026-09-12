import {
  CircleDollarSign,
  ShoppingBag,
  TrendingUp,
  Receipt,
  Sparkles,
} from "lucide-react";
import { crmMoney, type CrmCustomer } from "@/lib/mock/crm";
import { cn } from "@/lib/utils";

export function CustomerCommercial({ customer }: { customer: CrmCustomer }) {
  const avgTicket =
    customer.totalOrders > 0 ? customer.totalSpent / customer.totalOrders : 0;

  // Determinar el nivel de fidelidad
  // 0-1 pedidos: Nuevo (Nivel 1)
  // 2-4 pedidos: Ocasional (Nivel 2)
  // 5-9 pedidos: Frecuente (Nivel 3)
  // 10+ pedidos: VIP (Nivel 4)
  const level =
    customer.totalOrders >= 10
      ? 4
      : customer.totalOrders >= 5
        ? 3
        : customer.totalOrders >= 2
          ? 2
          : 1;

  const levelNames = [
    {
      id: 1,
      label: "Nuevo",
      color: "bg-rose-500",
      text: "text-rose-500",
      desc: "1er pedido",
    },
    {
      id: 2,
      label: "Ocasional",
      color: "bg-orange-500",
      text: "text-orange-500",
      desc: "2-4 pedidos",
    },
    {
      id: 3,
      label: "Frecuente",
      color: "bg-yellow-400",
      text: "text-yellow-500",
      desc: "5-9 pedidos",
    },
    {
      id: 4,
      label: "VIP",
      color: "bg-teal-400",
      text: "text-teal-500",
      desc: "10+ pedidos",
    },
  ];

  const positionPercent = (() => {
    if (customer.totalOrders <= 1) return 6;
    if (customer.totalOrders <= 4) {
      return 26 + ((customer.totalOrders - 2) / 2) * 16;
    }
    if (customer.totalOrders <= 9) {
      return 58 + ((customer.totalOrders - 5) / 4) * 16;
    }
    return Math.min(96, 88 + ((customer.totalOrders - 10) / 10) * 8);
  })();

  const currentLevel = levelNames.find((l) => l.id === level) ?? levelNames[0];

  const stats = [
    {
      title: "Total gastado",
      value: crmMoney(customer.totalSpent),
      suffix: "",
      subtitle: "Facturación acumulada",
      icon: CircleDollarSign,
    },
    {
      title: "Total pedidos",
      value: customer.totalOrders.toLocaleString("es-PE"),
      suffix: customer.totalOrders === 1 ? "pedido" : "pedidos",
      subtitle: customer.lastOrderAt
        ? `Último: ${new Intl.DateTimeFormat("es-PE", { dateStyle: "short" }).format(new Date(customer.lastOrderAt))}`
        : "Sin pedidos registrados",
      icon: ShoppingBag,
    },
    {
      title: "Ticket promedio",
      value: crmMoney(avgTicket),
      suffix: "",
      subtitle: "Consumo medio por pedido",
      icon: Receipt,
    },
  ];

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card">
      {/* Cabecera de la sección Sales */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
        <h2 className="text-sm font-medium text-foreground">
          Métricas comerciales
        </h2>
      </div>

      <div className="p-5 flex flex-col gap-5">
        {/* 3 Tarjetas de estadísticas (estilo idéntico a PromotionsKpis) */}
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3">
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
                {item.value}{" "}
                {item.suffix && <span className="text-sm">{item.suffix}</span>}
              </p>
              <p className="mt-1 text-xs text-primary/70 line-clamp-1">
                {item.subtitle}
              </p>
            </article>
          ))}
        </div>

        {/* Barra de Fidelidad / Nivel de cliente (Multi-segmento idéntico al gauge de la imagen) */}
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground">
            Nivel de fidelidad comercial
          </h3>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xl font-medium">{currentLevel.desc}</p>

            <div className="hidden sm:flex lg:hidden xl:flex items-center gap-1 text-xs font-medium font-heading p-2 leading-none bg-muted rounded-lg">
              <span>
                {level === 4
                  ? "Máximo nivel de beneficios"
                  : `${10 - customer.totalOrders} pedidos para alcanzar nivel VIP`}
              </span>
            </div>
          </div>

          {/* Barra continua con degradado y cursor indicador vertical (estilo exacto de la imagen) */}
          <div className="mt-4 space-y-2.5">
            {/* Leyenda superior */}
            <div className="flex items-center justify-between text-sm font-medium">
              {levelNames.map((lvl) => (
                <div key={lvl.id} className="flex items-center gap-1.5">
                  <span
                    className={cn("h-3 w-1.5 rounded-full shrink-0", lvl.color)}
                  />
                  <span className="text-foreground">{lvl.label}</span>
                </div>
              ))}
            </div>

            {/* Barra con gradiente continuo y cursor */}
            <div className="relative flex items-center py-1">
              <div className="h-2 w-full rounded-full bg-linear-to-r from-rose-500 via-yellow-400 to-teal-400" />

              {/* Cursor indicador vertical */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-300 pointer-events-none"
                style={{ left: `${positionPercent}%` }}
              >
                <div
                  className={cn(
                    "h-4.5 w-2 rounded-full ring-2 ring-background shadow-xs",
                    currentLevel.color,
                  )}
                />
              </div>
            </div>
          </div>

          <div className="w-fit mt-5 sm:hidden flex lg:flex xl:hidden items-center gap-1 text-xs font-medium font-heading p-2 leading-none bg-muted rounded-lg">
            <span>
              {level === 4
                ? "Máximo nivel de beneficios"
                : `${10 - customer.totalOrders} pedidos para alcanzar nivel VIP`}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
