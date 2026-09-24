"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Clock3, LayoutDashboard, User } from "lucide-react";
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

  const filtered = useMemo(() => {
    setPage(1);
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

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <h2 className="text-sm font-medium">Historial de sesiones</h2>
        <div className="flex items-center gap-3">
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
          {/* <span className="text-sm text-muted-foreground font-heading">
            {filtered.length} {filtered.length === 1 ? "sesión" : "sesiones"}
          </span> */}
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
          <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3 font-heading">
            {paginated.map((session) => (
              <article
                key={session.id}
                onClick={() =>
                  router.push(`/app/${params.slug}/caja/sesiones/${session.id}`)
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
                        {session.status === "cerrada" ? "Diferencia" : "Estado"}
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
          <div className="px-5 pb-3">
            <Paginator
              totalResults={filtered.length}
              pageSize={PAGE_SIZE}
              currentPage={page}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </section>
  );
}
