"use client";

import { useMemo, useState } from "react";
import { LayoutGrid, List, SearchX } from "lucide-react";
import { Search } from "@/components/app/shared/Search";
import { FilterPopover } from "@/components/app/shared/FilterPopover";
import { Paginator } from "@/components/app/shared/Paginator";
import { DateRangeFilter } from "@/components/app/inventory/movements/overview/DateRangeFilter";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import {
  cashMovementTypeLabel,
  cashPaymentMethodLabel,
  type CashMovement,
  type CashMovementType,
  type CashPaymentMethod,
  type CashSession,
} from "@/lib/mock/cash";

const PAGE_SIZE = 10;

const money = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});
const types = [
  { label: "Todos", value: "all" },
  ...(
    [
      "venta",
      "ingreso",
      "retiro",
      "gasto",
      "reembolso",
      "ajuste",
    ] as CashMovementType[]
  ).map((value) => ({ label: cashMovementTypeLabel(value), value })),
];
const methods = [
  { label: "Todos", value: "all" },
  ...(
    [
      "efectivo",
      "tarjeta",
      "yape",
      "plin",
      "transferencia",
    ] as CashPaymentMethod[]
  ).map((value) => ({ label: cashPaymentMethodLabel(value), value })),
];

export function CashMovements({
  movements,
  sessions,
}: {
  movements: CashMovement[];
  sessions: CashSession[];
}) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [method, setMethod] = useState("all");
  const [session, setSession] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"tabla" | "cards">("tabla");

  const sessionOptions = [
    { label: "Todas", value: "all" },
    ...sessions.map((s) => ({ label: s.terminalName, value: s.id })),
  ];

  const filtered = useMemo(() => {
    setPage(1);
    return movements.filter((item) => {
      const matchesSearch =
        `${item.concept} ${item.orderNumber ?? ""} ${item.responsibleName} ${item.reference ?? ""}`
          .toLowerCase()
          .includes(query.toLowerCase());
      const matchesType = type === "all" || item.type === type;
      const matchesMethod = method === "all" || item.method === method;
      const matchesSession = session === "all" || item.sessionId === session;

      let matchesDate = true;
      if (dateFrom || dateTo) {
        const itemDate = new Date(item.createdAt);
        if (dateFrom) {
          const from = new Date(`${dateFrom}T00:00:00`);
          matchesDate = matchesDate && itemDate >= from;
        }
        if (dateTo) {
          const to = new Date(`${dateTo}T23:59:59`);
          matchesDate = matchesDate && itemDate <= to;
        }
      }

      return (
        matchesSearch &&
        matchesType &&
        matchesMethod &&
        matchesSession &&
        matchesDate
      );
    });
  }, [movements, query, type, method, session, dateFrom, dateTo]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const activeFilterCount =
    Number(type !== "all") +
    Number(method !== "all") +
    Number(session !== "all") +
    Number(dateFrom !== "") +
    Number(dateTo !== "");

  const sessionName = (id: string) =>
    sessions.find((item) => item.id === id)?.terminalName ?? "Terminal";

  return (
    <section className="space-y-5 rounded-xl border border-border bg-card p-5">
      <div className="flex flex-col gap-3 font-heading">
        <h2 className="text-sm font-medium">Movimientos recientes</h2>
        <Search
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar pedido, referencia o responsable"
          className="w-full"
        />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <DateRangeFilter
              from={dateFrom}
              to={dateTo}
              onFromChange={setDateFrom}
              onToChange={setDateTo}
              onClear={() => {
                setDateFrom("");
                setDateTo("");
              }}
            />
            <FilterPopover
              activeCount={activeFilterCount}
              onClear={() => {
                setType("all");
                setMethod("all");
                setSession("all");
              }}
              groups={[
                {
                  label: "Terminal",
                  options: sessionOptions,
                  selected: session,
                  onSelect: setSession,
                },
                {
                  label: "Tipo",
                  options: types,
                  selected: type,
                  onSelect: setType,
                },
                {
                  label: "Método",
                  options: methods,
                  selected: method,
                  onSelect: setMethod,
                },
              ]}
            />
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
            {[
              { id: "tabla" as const, icon: List, label: "Tabla" },
              { id: "cards" as const, icon: LayoutGrid, label: "Tarjetas" },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setView(id)}
                aria-label={`Vista ${label}`}
                title={`Vista ${label}`}
                className={cn(
                  "cursor-pointer rounded-md p-1.5 transition-colors",
                  view === id
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
              </button>
            ))}
          </div>
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border font-heading">
          <EmptyState
            icon={SearchX}
            title="Sin movimientos coincidentes"
            description="Prueba otra búsqueda o limpia los filtros."
          />
        </div>
      ) : (
        <>
          {view === "tabla" ? (
            <div className="overflow-x-auto font-heading">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-accent">
                    {[
                      "Concepto",
                      "Terminal",
                      "Método",
                      "Responsable",
                      "Fecha",
                      "Importe",
                    ].map((label) => (
                      <th
                        key={label}
                        className="px-4 py-3 text-xs font-semibold uppercase text-nowrap whitespace-nowrap"
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginated.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 max-w-[280px]">
                        <p className="text-sm font-medium text-nowrap truncate">
                          {item.concept}
                        </p>
                        <p className="text-xs text-muted-foreground text-nowrap truncate">
                          {item.orderNumber ?? cashMovementTypeLabel(item.type)}
                          {item.reference ? ` · ${item.reference}` : ""}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-sm text-nowrap whitespace-nowrap">
                        {sessionName(item.sessionId)}
                      </td>
                      <td className="px-4 py-3 text-sm text-nowrap whitespace-nowrap">
                        {cashPaymentMethodLabel(item.method)}
                      </td>
                      <td className="px-4 py-3 text-sm text-nowrap whitespace-nowrap">
                        {item.responsibleName}
                      </td>
                      <td className="px-4 py-3 text-sm text-nowrap whitespace-nowrap">
                        {new Intl.DateTimeFormat("es-PE", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(new Date(item.createdAt))}
                      </td>
                      <td
                        className={cn(
                          "px-4 py-3 text-sm font-medium text-nowrap whitespace-nowrap",
                          item.direction === "entrada"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-500 dark:text-rose-400",
                        )}
                      >
                        {item.direction === "entrada" ? "+" : "−"}
                        {money.format(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 font-heading">
              {paginated.map((item) => (
                <article
                  key={item.id}
                  className="rounded-xl border border-border p-4 flex flex-col justify-between hover:bg-muted/20 transition-colors"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground text-nowrap truncate">
                          {item.concept}
                        </p>
                        <p className="text-xs text-muted-foreground text-nowrap truncate mt-0.5">
                          {item.orderNumber ?? cashMovementTypeLabel(item.type)}
                          {item.reference ? ` · ${item.reference}` : ""}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "text-sm font-medium text-nowrap whitespace-nowrap shrink-0",
                          item.direction === "entrada"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-500 dark:text-rose-400",
                        )}
                      >
                        {item.direction === "entrada" ? "+" : "−"}
                        {money.format(item.amount)}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs border-y border-border py-2.5">
                      <div className="min-w-0">
                        <span className="text-muted-foreground block text-[11px]">
                          Terminal
                        </span>
                        <span className="font-medium text-foreground text-nowrap truncate block">
                          {sessionName(item.sessionId)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <span className="text-muted-foreground block text-[11px]">
                          Método
                        </span>
                        <span className="font-medium text-foreground text-nowrap truncate block">
                          {cashPaymentMethodLabel(item.method)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="text-nowrap truncate mr-2">
                        {item.responsibleName}
                      </span>
                      <span className="text-nowrap whitespace-nowrap shrink-0">
                        {new Intl.DateTimeFormat("es-PE", {
                          dateStyle: "short",
                          timeStyle: "short",
                        }).format(new Date(item.createdAt))}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
          <Paginator
            totalResults={filtered.length}
            pageSize={PAGE_SIZE}
            currentPage={page}
            onPageChange={setPage}
          />
        </>
      )}
    </section>
  );
}
