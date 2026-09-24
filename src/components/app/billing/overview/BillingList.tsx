"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LayoutGrid, List, SearchX } from "lucide-react";
import { Search } from "@/components/app/shared/Search";
import { FilterPopover } from "@/components/app/shared/FilterPopover";
import { Paginator } from "@/components/app/shared/Paginator";
import { DateRangeFilter } from "@/components/app/inventory/movements/overview/DateRangeFilter";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import {
  invoiceTypeLabel,
  invoiceStatusLabel,
  type Invoice,
  type InvoiceType,
  type InvoiceStatus,
} from "@/lib/mock/billing";
import {
  cashMovementsMock,
  cashSessionsMock,
  cashPaymentMethodLabel,
  type CashPaymentMethod,
} from "@/lib/mock/cash";

const money = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

const types = [
  { label: "Todos", value: "all" },
  ...(["boleta", "factura"] as InvoiceType[]).map((value) => ({
    label: invoiceTypeLabel(value),
    value,
  })),
];

const statuses = [
  { label: "Todos", value: "all" },
  ...(["emitido", "enviado", "pagado", "anulado"] as InvoiceStatus[]).map(
    (value) => ({ label: invoiceStatusLabel(value), value }),
  ),
];

// Filtros por método de pago y sesión de caja (integración con Caja, reglas 36-38)
const methods = [
  { label: "Todos", value: "all" },
  ...(["efectivo", "tarjeta", "yape", "plin", "transferencia"] as CashPaymentMethod[]).map(
    (value) => ({ label: cashPaymentMethodLabel(value), value }),
  ),
];

const sessions = [
  { label: "Todas", value: "all" },
  { label: "Sin sesión", value: "none" },
  ...cashSessionsMock.map((session) => ({
    label: `#${session.id.slice(-1)} · ${session.terminalName}`,
    value: session.id,
  })),
];

/** Método de pago del comprobante, derivado de su movimiento de caja. */
const invoicePaymentMethod = (invoice: Invoice) =>
  cashMovementsMock.find((m) => m.id === invoice.cashMovementId)?.method;

const PAGE_SIZE = 10;

export function BillingList({ invoices }: { invoices: Invoice[] }) {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [method, setMethod] = useState("all");
  const [session, setSession] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"tabla" | "cards">("tabla");

  const filtered = useMemo(() => {
    return invoices.filter((item) => {
      const matchesSearch =
        `${item.number} ${item.orderNumber} ${item.customer.name} ${item.customer.documentNumber}`
          .toLowerCase()
          .includes(query.toLowerCase());
      const matchesType = type === "all" || item.type === type;
      const matchesStatus = status === "all" || item.status === status;
      const matchesMethod =
        method === "all" || invoicePaymentMethod(item) === method;
      const matchesSession =
        session === "all" ||
        (session === "none"
          ? !item.sessionId
          : item.sessionId === session);

      let matchesDate = true;
      if (dateFrom || dateTo) {
        const itemDate = new Date(item.issuedAt);
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
        matchesStatus &&
        matchesMethod &&
        matchesSession &&
        matchesDate
      );
    });
  }, [invoices, query, type, status, method, session, dateFrom, dateTo]);

  const maxPage = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, maxPage);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const activeFilterCount =
    Number(type !== "all") +
    Number(status !== "all") +
    Number(method !== "all") +
    Number(session !== "all") +
    Number(dateFrom !== "") +
    Number(dateTo !== "");

  const statusVariant = (status: InvoiceStatus) => {
    switch (status) {
      case "pagado":
        return "success";
      case "emitido":
        return "warning";
      case "enviado":
        return "info";
      case "anulado":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <section className="space-y-5 rounded-xl border border-border bg-card p-5">
      <div className="flex flex-col gap-3 font-heading">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <Search
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Buscar número, pedido o cliente"
            className="w-full md:min-w-56 md:max-w-90 md:flex-1"
          />
          <div className="flex w-full items-center justify-between gap-2 md:w-auto md:justify-end">
            <div className="flex flex-wrap items-center gap-2">
              <DateRangeFilter
                from={dateFrom}
                to={dateTo}
                onFromChange={(val) => {
                  setDateFrom(val);
                  setPage(1);
                }}
                onToChange={(val) => {
                  setDateTo(val);
                  setPage(1);
                }}
                onClear={() => {
                  setDateFrom("");
                  setDateTo("");
                  setPage(1);
                }}
              />
              <FilterPopover
                activeCount={activeFilterCount}
                onClear={() => {
                  setType("all");
                  setStatus("all");
                  setMethod("all");
                  setSession("all");
                  setPage(1);
                }}
                groups={[
                  {
                    label: "Tipo",
                    options: types,
                    selected: type,
                    onSelect: (val) => {
                      setType(val);
                      setPage(1);
                    },
                  },
                  {
                    label: "Estado",
                    options: statuses,
                    selected: status,
                    onSelect: (val) => {
                      setStatus(val);
                      setPage(1);
                    },
                  },
                  {
                    label: "Método de pago",
                    options: methods,
                    selected: method,
                    onSelect: (val) => {
                      setMethod(val);
                      setPage(1);
                    },
                  },
                  {
                    label: "Sesión de caja",
                    options: sessions,
                    selected: session,
                    onSelect: (val) => {
                      setSession(val);
                      setPage(1);
                    },
                  },
                ]}
              />
            </div>

            <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1 shrink-0">
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
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border font-heading">
          <EmptyState
            icon={SearchX}
            title="Sin comprobantes"
            description="No se encontraron comprobantes con los filtros aplicados."
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
                      "Número",
                      "Tipo",
                      "Cliente",
                      "Pedido",
                      "Estado",
                      "Fecha",
                      "Total",
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
                    <tr
                      key={item.id}
                      className="cursor-pointer hover:bg-muted/30"
                      onClick={() =>
                        router.push(
                          `/app/${params.slug}/facturacion/${item.id}`,
                        )
                      }
                    >
                      <td className="px-4 py-3 text-sm font-medium text-nowrap whitespace-nowrap">
                        {item.number}
                      </td>
                      <td className="px-4 py-3 text-sm text-nowrap whitespace-nowrap">
                        {invoiceTypeLabel(item.type)}
                      </td>
                      <td className="px-4 py-3 text-nowrap max-w-60">
                        <p className="text-sm font-medium text-foreground truncate text-nowrap">
                          {item.customer.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate text-nowrap">
                          {item.customer.documentType.toUpperCase()}{" "}
                          {item.customer.documentNumber}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-sm text-nowrap whitespace-nowrap">
                        {item.orderNumber}
                      </td>
                      <td className="px-4 py-3 text-sm text-nowrap whitespace-nowrap">
                        <StatusBadge
                          status={statusVariant(item.status)}
                          label={invoiceStatusLabel(item.status)}
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-nowrap whitespace-nowrap">
                        {new Intl.DateTimeFormat("es-PE", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(new Date(item.issuedAt))}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-nowrap whitespace-nowrap">
                        {money.format(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 font-heading">
              {paginated.map((item) => (
                <article
                  key={item.id}
                  className="rounded-xl border border-border p-4 cursor-pointer hover:bg-muted/20 transition-colors flex flex-col justify-between"
                  onClick={() =>
                    router.push(`/app/${params.slug}/facturacion/${item.id}`)
                  }
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground text-nowrap truncate">
                          {item.number}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground text-nowrap truncate">
                          {invoiceTypeLabel(item.type)} · {item.orderNumber}
                        </p>
                      </div>
                      <StatusBadge
                        status={statusVariant(item.status)}
                        label={invoiceStatusLabel(item.status)}
                      />
                    </div>

                    <div className="mt-3 border-y border-border py-2 text-xs">
                      <p className="font-medium text-foreground text-nowrap truncate">
                        {item.customer.name}
                      </p>
                      <p className="text-muted-foreground text-nowrap truncate mt-0.5">
                        {item.customer.documentType.toUpperCase()}:{" "}
                        {item.customer.documentNumber}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground pt-0.5">
                    <span className="text-nowrap whitespace-nowrap">
                      {new Intl.DateTimeFormat("es-PE", {
                        dateStyle: "medium",
                      }).format(new Date(item.issuedAt))}
                    </span>
                    <span className="text-sm font-medium text-foreground text-nowrap whitespace-nowrap">
                      {money.format(item.total)}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}

          <Paginator
            totalResults={filtered.length}
            pageSize={PAGE_SIZE}
            currentPage={currentPage}
            onPageChange={setPage}
          />
        </>
      )}
    </section>
  );
}
