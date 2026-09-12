"use client";

import { useState, type ReactNode } from "react";
import {
  CalendarClock,
  Check,
  ChevronDown,
  CircleArrowRight,
  MapPin,
  Package,
  Search,
  ShoppingBag,
  Store,
} from "lucide-react";
import { Paginator } from "@/components/app/shared/Paginator";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  formatOrderMoney,
  orderServiceLabel,
  orderTimeline,
  type CustomerOrder,
} from "@/lib/mock/orders";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 5;

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

interface CustomerOrdersProps {
  orders: CustomerOrder[];
  onOpen: (id: string) => void;
}

export function CustomerOrders({ orders, onOpen }: CustomerOrdersProps) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "completed" | "pending"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.number.toLowerCase().includes(search.toLowerCase()) ||
      order.lines?.some((line) =>
        line.name.toLowerCase().includes(search.toLowerCase()),
      );

    if (!matchesSearch) return false;

    if (filterStatus === "completed") {
      return order.status === "entregado";
    }
    if (filterStatus === "pending") {
      return order.status !== "entregado" && order.status !== "cancelado";
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  const completedCount = orders.filter((o) => o.status === "entregado").length;

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card font-heading">
      {/* Cabecera: Título "Pedidos del cliente" */}
      <div className="border-b border-border px-5 py-3">
        <h2 className="text-sm font-medium text-foreground">
          Pedidos del cliente
        </h2>
      </div>

      {/* Barra de Filtros y Buscador */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 pt-4 pb-0">
        {/* Botones de filtro rápido */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setFilterStatus("all");
              setCurrentPage(1);
            }}
            className={cn(
              "flex cursor-pointer items-center gap-x-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium leading-none transition-colors hover:bg-primary/5 hover:text-foreground",
              filterStatus === "all" ? "bg-accent text-primary" : "",
            )}
          >
            Todos
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 p-1.5 text-xs font-semibold tabular-nums text-foreground">
              {orders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setFilterStatus("completed");
              setCurrentPage(1);
            }}
            className={cn(
              "flex cursor-pointer items-center gap-x-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium leading-none transition-colors hover:bg-primary/5 hover:text-foreground",
              filterStatus === "completed" ? "bg-accent text-primary" : "",
            )}
          >
            Completados
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 p-1.5 text-xs font-semibold tabular-nums text-foreground">
              {completedCount}
            </span>
          </button>
        </div>

        {/* Input Buscador */}
        <div className="relative w-full md:max-w-xs">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Buscar por número o producto..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-border py-2 pr-4 pl-9 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Contenido dentro de la sección */}
      <div className="p-5 space-y-5">
        {paginatedOrders.length > 0 ? (
          <>
            <div className="flex flex-col gap-5">
              {paginatedOrders.map((order) => (
                <SingleOrderMainCard
                  key={order.id}
                  order={order}
                  onOpen={onOpen}
                />
              ))}
            </div>

            {/* Paginación si hay resultados */}
            <div className="pt-2">
              <Paginator
                totalResults={filteredOrders.length}
                pageSize={PAGE_SIZE}
                currentPage={safePage}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-10 text-center">
            <div className="flex size-12 items-center justify-center rounded-xl bg-accent text-primary">
              <ShoppingBag className="size-5" />
            </div>
            <p className="mt-3 font-medium text-foreground">
              {search
                ? "No se encontraron pedidos con ese término"
                : "Este cliente no tiene pedidos registrados"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {search
                ? "Intenta buscar por otro número de orden o producto."
                : "Los pedidos asociados aparecerán automáticamente aquí."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function SingleOrderMainCard({
  order,
  onOpen,
}: {
  order: CustomerOrder;
  onOpen: (id: string) => void;
}) {
  const [showProducts, setShowProducts] = useState(false);
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
      {/* Resumen superior en 4 columnas */}
      <div className="grid grid-cols-2 gap-4 bg-muted/45 px-5 py-4 xl:grid-cols-4">
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
        {/* Entrega estimada y dirección */}
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
        <div className="hidden border-b border-border py-5 md:block lg:hidden xl:block">
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
                      "flex items-center gap-1.5 truncate text-xs font-medium",
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
        <div className="border-b border-border py-5 md:hidden lg:block xl:hidden">
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

        {/* Lista de productos con acordeón (oculta por defecto) */}
        {showProducts && (
          <div className="divide-y divide-border border-b border-border animate-in fade-in-50 duration-200">
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
                      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                        {line.notes}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:flex">
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
        )}

        {/* Footer con acordeón de productos y el botón "Ver detalle" */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-4 text-sm">
          <button
            type="button"
            onClick={() => setShowProducts((prev) => !prev)}
            className="group/acc inline-flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 -ml-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Store className="size-4 text-primary" />
            <span>
              {showProducts
                ? `Ocultar ${order.lines.length} ${order.lines.length === 1 ? "producto" : "productos"}`
                : `Mostrar ${order.lines.length} ${order.lines.length === 1 ? "producto" : "productos"}`}
            </span>
            <ChevronDown
              className={cn(
                "size-4 transition-transform duration-200 text-muted-foreground group-hover/acc:text-foreground",
                showProducts && "rotate-180 text-foreground",
              )}
            />
          </button>
          <Button variant="outline" onClick={() => onOpen(order.id)}>
            Ver detalle
          </Button>
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
