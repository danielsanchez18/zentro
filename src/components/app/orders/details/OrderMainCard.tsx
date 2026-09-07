import {
  CalendarClock,
  Check,
  CircleArrowRight,
  MapPin,
  Package,
  Store,
} from "lucide-react";
import type { ReactNode } from "react";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import type { CustomerOrder } from "@/lib/mock/orders";
import {
  formatOrderMoney,
  orderServiceLabel,
  orderTimeline,
} from "@/lib/mock/orders";
import { cn } from "@/lib/utils";

const date = (value: string) =>
  new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
const dateTime = (value: string) =>
  new Intl.DateTimeFormat("es-PE", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

export function OrderMainCard({ order }: { order: CustomerOrder }) {
  const timeline = orderTimeline(order);
  const currentIndex = timeline.findIndex((event) => event.current);
  const currentEvent =
    currentIndex >= 0 ? timeline[currentIndex] : timeline[timeline.length - 1];
  const nextEvent =
    currentIndex >= 0 && currentIndex < timeline.length - 1
      ? timeline[currentIndex + 1]
      : null;

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card font-heading">
      <div className="grid gap-4 bg-muted/45 px-5 py-4 grid-cols-2 xl:grid-cols-4">
        <Summary label="Estado">
          <StatusBadge status={order.status} />
        </Summary>
        <Summary label="Número de pedido">
          <p className="mt-2 font-mono text-sm font-medium">{order.number}</p>
        </Summary>
        <Summary label="Fecha del pedido">
          <p className="mt-2 text-sm font-medium">{date(order.createdAt)}</p>
        </Summary>
        <Summary label="Total">
          <p className="mt-2 text-sm font-medium tabular-nums">
            {formatOrderMoney(order.total)}
          </p>
        </Summary>
      </div>
      <div className="px-5">
        <div className="flex flex-col gap-3 border-b border-border py-5">
          <p className="inline-flex items-center gap-2 text-sm">
            <CalendarClock className="size-4 text-primary" />
            <span className="text-muted-foreground">Entrega estimada:</span>
            <span className="font-medium text-foreground">
              {dateTime(order.promisedAt)}
            </span>
          </p>
          <p className="inline-flex items-start gap-2 text-sm">
            <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>
              {order.deliveryAddress ??
                order.tableName ??
                orderServiceLabel(order.serviceType)}
            </span>
          </p>
        </div>

        {/* Línea de tiempo - Pantallas grandes */}
        <div className="hidden border-b border-border py-5 md:block">
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${timeline.length}, minmax(0, 1fr))`,
            }}
          >
            {timeline.map((event) => {
              const isPastCompleted = event.completed && !event.current;
              const isCurrent = event.current;
              const isFilled = event.completed || event.current;

              return (
                <div key={event.status} className="flex flex-col gap-2">
                  <div
                    className={cn(
                      "flex items-center gap-1.5 text-xs font-medium truncate",
                      isCurrent
                        ? "font-semibold text-foreground"
                        : isPastCompleted
                          ? "text-foreground"
                          : "text-muted-foreground/60",
                    )}
                  >
                    {isPastCompleted ? (
                      <Check className="size-3.5 shrink-0 stroke-[2.5]" />
                    ) : isCurrent ? (
                      <span className="size-1.5 shrink-0 rounded-full bg-foreground" />
                    ) : null}
                    <span className="truncate">{event.label}</span>
                  </div>
                  <div
                    className={cn(
                      "h-1 w-full rounded-full transition-colors",
                      isFilled ? "bg-foreground" : "bg-muted",
                    )}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Línea de tiempo - Pantallas responsive */}
        <div className="border-b border-border py-5 md:hidden">
          <p className="text-sm font-semibold text-foreground">
            Estado del pedido
          </p>
          <div className="mt-2.5 flex items-center justify-between gap-3 text-sm">
            <div className="flex min-w-0 items-center gap-1.5 font-medium text-foreground">
              <span className="size-1.5 shrink-0 rounded-full bg-foreground" />
              <span className="truncate">{currentEvent.label}</span>
            </div>
            {nextEvent && (
              <div className="flex shrink-0 items-center gap-1 text-muted-foreground">
                <CircleArrowRight className="size-3.5 shrink-0" />
                <span className="truncate">{nextEvent.label}</span>
              </div>
            )}
          </div>
          <div className="mt-2.5 flex gap-2">
            {timeline.map((event) => (
              <div
                key={event.status}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  event.completed || event.current
                    ? "bg-foreground"
                    : "bg-muted",
                )}
              />
            ))}
          </div>
        </div>
        <div className="divide-y divide-border">
          {order.lines.map((line) => (
            <article
              key={line.id}
              className="grid gap-4 py-5 sm:grid-cols-[minmax(0,1fr)_auto]"
            >
              <div className="flex items-center gap-4">
                <span className="flex size-16 items-center justify-center rounded-xl bg-accent text-primary">
                  <Package className="size-6" />
                </span>
                <div className="min-w-0">
                  <div className="line-clamp-2">
                    <p className="text-sm font-medium">{line.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatOrderMoney(line.unitPrice)} por unidad
                    </p>
                  </div>
                  {line.notes && (
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                      {line.notes}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 sm:flex gap-4">
                <div className="sm:w-27.5">
                  <p className="text-sm text-muted-foreground">Cantidad</p>
                  <p className="mt-1 text-sm font-medium">{line.quantity}</p>
                </div>
                <div className="sm:w-22.5 sm:text-right">
                  <p className="text-sm text-muted-foreground">Importe</p>
                  <p className="mt-1 text-sm font-semibold tabular-nums">
                    {formatOrderMoney(line.total)}
                  </p>
                  {line.discount > 0 && (
                    <p className="mt-1 text-xs text-emerald-600">
                      -{formatOrderMoney(line.discount)}
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="flex items-center gap-2 border-t border-border py-4 text-sm text-muted-foreground">
          <Store className="size-4" />
          {order.lines.length}{" "}
          {order.lines.length === 1 ? "producto" : "productos"} en este pedido
        </div>
      </div>
    </section>
  );
}

function Summary({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium font-heading text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  );
}
