"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Clock3, LayoutDashboard, LayoutGrid, List, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import { Paginator } from "@/components/app/shared/Paginator";
import { DateRangeFilter } from "@/components/app/inventory/movements/overview/DateRangeFilter";
import type { CashSession } from "@/lib/mock/cash";
import { cn } from "@/lib/utils";

const money = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

const PAGE_SIZE = 6;

export function CashSessionsHistory({ sessions }: { sessions: CashSession[] }) {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"tabla" | "cards">("cards");

  const filtered = useMemo(() => {
    if (!dateFrom && !dateTo) return sessions;
    return sessions.filter((session) => {
      const sessionDate = new Date(session.openedAt);
      let match = true;
      if (dateFrom) {
        const from = new Date(`${dateFrom}T00:00:00`);
        match = match && sessionDate >= from;
      }
      if (dateTo) {
        const to = new Date(`${dateTo}T23:59:59`);
        match = match && sessionDate <= to;
      }
      return match;
    });
  }, [sessions, dateFrom, dateTo]);

  const maxPage = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, maxPage);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  return (
    <section className="rounded-xl border border-border bg-card p-5 space-y-5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between font-heading">
        <h2 className="text-sm font-medium">Historial de sesiones</h2>
        <div className="flex items-center justify-between sm:justify-end gap-2">
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

      {filtered.length === 0 ? (
        <div className="p-10 text-center font-heading">
          <span className="flex items-center justify-center w-fit mx-auto rounded-lg bg-muted p-2 text-muted-foreground">
            <LayoutDashboard className="size-5" />
          </span>
          <p className="mt-3 font-medium">No hay sesiones registradas</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Las sesiones de caja completadas o activas aparecerán aquí.
          </p>
        </div>
      ) : (
        <>
          {view === "cards" ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 font-heading">
              {paginated.map((session) => (
                <article
                  key={session.id}
                  onClick={() =>
                    router.push(
                      `/app/${params.slug}/caja/sesiones/${session.id}`,
                    )
                  }
                  className="rounded-xl border border-border p-4 flex flex-col justify-between cursor-pointer hover:bg-muted/30 transition-colors"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {session.terminalName}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {session.locationName}
                        </p>
                      </div>
                      <StatusBadge
                        status={
                          session.status === "abierta" ? "activa" : "finalizada"
                        }
                        label={
                          session.status === "abierta" ? "Abierta" : "Cerrada"
                        }
                      />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 border-y border-border py-3">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Fondo inicial
                        </p>
                        <p className="mt-1 text-sm font-medium text-foreground">
                          {money.format(session.openingAmount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {session.status === "cerrada"
                            ? "Diferencia"
                            : "Estado"}
                        </p>
                        <p
                          className={cn(
                            "mt-1 text-sm font-medium",
                            session.status === "cerrada"
                              ? (session.difference ?? 0) < 0
                                ? "text-rose-500 dark:text-rose-400"
                                : (session.difference ?? 0) > 0
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-foreground"
                              : "text-emerald-600 dark:text-emerald-400",
                          )}
                        >
                          {session.status === "cerrada"
                            ? (session.difference ?? 0) > 0
                              ? `+${money.format(session.difference!)}`
                              : money.format(session.difference ?? 0)
                            : "En curso"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <User className="size-4 shrink-0 text-muted-foreground" />
                        <span className="truncate">{session.openedByName}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock3 className="size-4 shrink-0 text-muted-foreground" />
                        <span className="truncate">
                          {new Intl.DateTimeFormat("es-PE", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }).format(new Date(session.openedAt))}
                        </span>
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4 rounded-full w-full font-sans cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(
                        `/app/${params.slug}/caja/sesiones/${session.id}`,
                      );
                    }}
                  >
                    Ver detalle
                  </Button>
                </article>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto font-heading">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-accent">
                    {[
                      "Terminal",
                      "Estado",
                      "Responsable",
                      "Apertura",
                      "Fondo inicial",
                      "Diferencia",
                    ].map((label, idx) => (
                      <th
                        key={idx}
                        className="px-4 py-3 text-xs font-semibold uppercase text-nowrap whitespace-nowrap"
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginated.map((session) => (
                    <tr
                      key={session.id}
                      onClick={() =>
                        router.push(
                          `/app/${params.slug}/caja/sesiones/${session.id}`,
                        )
                      }
                      className="hover:bg-muted/30 cursor-pointer"
                    >
                      <td className="px-4 py-3 text-nowrap">
                        <p className="text-sm font-medium text-foreground text-nowrap truncate max-w-50">
                          {session.terminalName}
                        </p>
                        <p className="text-xs text-muted-foreground text-nowrap truncate max-w-50">
                          {session.locationName}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-sm text-nowrap whitespace-nowrap">
                        <StatusBadge
                          status={
                            session.status === "abierta"
                              ? "activa"
                              : "finalizada"
                          }
                          label={
                            session.status === "abierta" ? "Abierta" : "Cerrada"
                          }
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-nowrap whitespace-nowrap">
                        {session.openedByName}
                      </td>
                      <td className="px-4 py-3 text-sm text-nowrap whitespace-nowrap">
                        {new Intl.DateTimeFormat("es-PE", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(new Date(session.openedAt))}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-nowrap whitespace-nowrap">
                        {money.format(session.openingAmount)}
                      </td>
                      <td
                        className={cn(
                          "px-4 py-3 text-sm font-medium text-nowrap whitespace-nowrap",
                          session.status === "cerrada"
                            ? (session.difference ?? 0) < 0
                              ? "text-rose-500 dark:text-rose-400"
                              : (session.difference ?? 0) > 0
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-foreground"
                            : "text-emerald-600 dark:text-emerald-400",
                        )}
                      >
                        {session.status === "cerrada"
                          ? (session.difference ?? 0) > 0
                            ? `+${money.format(session.difference!)}`
                            : money.format(session.difference ?? 0)
                          : "En curso"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
