"use client";

import { useMemo } from "react";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  Banknote,
  BanknoteX,
  CalendarClock,
  CircleDollarSign,
  Clock3,
  TrendingDown,
  User,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import {
  cashMovementTypeLabel,
  cashPaymentMethodLabel,
  type CashPaymentMethod,
} from "@/lib/mock/cash";
import { useCashStore } from "@/stores/cash-store";
import { expectedCash } from "../overview/CashKpis";

const money = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

const methods: CashPaymentMethod[] = [
  "efectivo",
  "tarjeta",
  "yape",
  "plin",
  "transferencia",
];

export function CashSessionDetailPage({
  slug,
  sessionId,
}: {
  slug: string;
  sessionId: string;
}) {
  const router = useRouter();

  const sessions = useCashStore((state) => state.sessions);
  const allMovements = useCashStore((state) => state.movements);

  const session = useMemo(
    () => sessions.find((item) => item.id === sessionId),
    [sessions, sessionId],
  );

  // Memoizar el filtrado de movimientos para evitar el error getSnapshot de Zustand / React
  const movements = useMemo(
    () => allMovements.filter((item) => item.sessionId === sessionId),
    [allMovements, sessionId],
  );

  const back = `/app/${slug}/caja`;

  if (!session) {
    return (
      <div className="w-full px-5 py-7 md:px-7 xl:px-10 font-heading">
        <Button
          type="button"
          variant="link"
          className="px-0 h-fit cursor-pointer"
          onClick={() => router.push(back)}
        >
          Regresar a caja
        </Button>
        <p className="mt-6 text-sm text-muted-foreground">
          No encontramos esta sesión de caja.
        </p>
      </div>
    );
  }

  const gross = movements
    .filter((item) => item.direction === "entrada")
    .reduce((sum, item) => sum + item.amount, 0);
  const out = movements
    .filter((item) => item.direction === "salida")
    .reduce((sum, item) => sum + item.amount, 0);
  const expected = session.expectedCash ?? expectedCash(session, movements);

  return (
    <div className="w-full space-y-7 px-5 py-7 md:px-7 xl:px-10 font-heading">
      {/* Header institucional */}
      <header className="space-y-1">
        <Button
          type="button"
          variant="link"
          className="h-fit gap-1.5 px-0 text-sm cursor-pointer"
          onClick={() => router.push(back)}
        >
          Regresar a caja
        </Button>
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-medium tracking-tight text-foreground">
                {session.terminalName}
              </h1>
              <StatusBadge
                status={session.status === "abierta" ? "activa" : "finalizada"}
                label={session.status === "abierta" ? "Abierta" : "Cerrada"}
              />
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {session.locationName} · {session.openedByName}
            </p>
          </div>
        </div>
      </header>

      {/* KPIs de la sesión */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Fondo inicial",
            value: money.format(session.openingAmount),
            subtitle: "Apertura en efectivo",
            icon: Banknote,
          },
          {
            title: "Entradas",
            value: money.format(gross),
            subtitle: "Cobros e ingresos de sesión",
            icon: CircleDollarSign,
          },
          {
            title: "Salidas",
            value: money.format(out),
            subtitle: "Retiros y gastos de sesión",
            icon: TrendingDown,
          },
          {
            title:
              session.status === "cerrada"
                ? "Efectivo contado"
                : "Efectivo esperado",
            value: money.format(session.countedCash ?? expected),
            subtitle:
              session.status === "cerrada"
                ? "Arqueo registrado al cierre"
                : "Fondo y cobros en efectivo",
            icon: Banknote,
          },
        ].map(({ title, value, subtitle, icon: Icon }) => (
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

      {/* Conciliación por método y panel de información */}
      <div className="grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
        <section className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <h2 className="text-sm font-medium text-foreground">
              Resumen por método de pago
            </h2>
          </div>
          <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3 font-heading">
            {methods.map((method) => {
              const items = movements.filter((item) => item.method === method);
              const incoming = items
                .filter((item) => item.direction === "entrada")
                .reduce((sum, item) => sum + item.amount, 0);
              const outgoing = items
                .filter((item) => item.direction === "salida")
                .reduce((sum, item) => sum + item.amount, 0);

              return (
                <article
                  key={method}
                  className="rounded-xl border border-border p-4 flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3 font-heading">
                    <div className="bg-accent rounded-md p-2.5">
                      <CircleDollarSign className="size-4.5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {cashPaymentMethodLabel(method)}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {items.length}{" "}
                        {items.length === 1 ? "movimiento" : "movimientos"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2">
                    <div className="flex items-center gap-1">
                      <ArrowUpRight className="size-4 min-w-4 text-muted-foreground" />
                      <p className="text-sm font-medium w-13 text-muted-foreground mr-5">
                        Entradas:
                      </p>
                      <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        {money.format(incoming)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <ArrowDownRight className="size-4 min-w-4 text-muted-foreground" />
                      <p className="text-sm font-medium w-13 text-muted-foreground mr-5">
                        Salidas:
                      </p>
                      <p className="text-sm font-medium text-rose-600 dark:text-rose-400">
                        {money.format(outgoing)}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="h-fit rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-3">
            <h2 className="text-sm font-medium text-foreground">
              Información de sesión
            </h2>
          </div>
          <dl className="flex flex-col gap-4 p-5 text-sm">
            <div className="space-y-2">
              <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                Responsable
              </dt>
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-full bg-accent"></div>
                <dd className="mt-1 font-medium text-foreground">
                  {session.openedByName}
                </dd>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <dt className="text-sm text-muted-foreground">Apertura:</dt>
              <dd className="text-foreground">
                {new Intl.DateTimeFormat("es-PE", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(session.openedAt))}
              </dd>
            </div>
            {session.closedAt && (
              <div className="flex items-center gap-2">
                <dt className="text-sm text-muted-foreground">Cierre:</dt>
                <dd className="text-foreground">
                  {new Intl.DateTimeFormat("es-PE", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(session.closedAt))}
                </dd>
              </div>
            )}
            {session.status === "cerrada" && (
              <>
                <div className="border-t border-border pt-5 flex items-center justify-between">
                  <dt className="text-sm text-muted-foreground">
                    Efectivo esperado:
                  </dt>
                  <dd className="font-medium text-foreground">
                    {money.format(expected)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-sm text-muted-foreground">Diferencia:</dt>
                  <dd
                    className={`font-medium ${
                      (session.difference ?? 0) < 0
                        ? "text-rose-600 dark:text-rose-400"
                        : (session.difference ?? 0) > 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-foreground"
                    }`}
                  >
                    {(session.difference ?? 0) > 0
                      ? `+${money.format(session.difference!)}`
                      : money.format(session.difference ?? 0)}
                  </dd>
                </div>
              </>
            )}
            {session.notes && (
              <div className="border-t border-border pt-3">
                <dt className="text-xs text-muted-foreground">Observaciones</dt>
                <dd className="mt-1 text-xs text-muted-foreground leading-relaxed bg-muted/30 p-2.5 rounded-lg">
                  {session.notes}
                </dd>
              </div>
            )}
          </dl>
        </aside>
      </div>

      {/* Movimientos de la sesión */}
      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-3">
          <h2 className="text-sm font-medium text-foreground">
            Movimientos de la sesión
          </h2>
        </div>
        {movements.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8">
            <span className="flex items-center justify-center w-fit mx-auto rounded-lg bg-muted p-3 text-foreground">
              <BanknoteX className="size-5" />
            </span>
            <p className="mt-3 font-medium text-foreground">
              No hay movimientos
            </p>
            <p className="text-center text-sm text-muted-foreground mt-0.5">
              Esta sesión todavía no tiene movimientos registrados.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border px-5 py-1">
            {movements.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 py-4"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {item.concept}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {cashMovementTypeLabel(item.type)} · {item.responsibleName}{" "}
                    ·{" "}
                    {new Intl.DateTimeFormat("es-PE", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(item.createdAt))}
                  </p>
                </div>
                <p
                  className={`shrink-0 text-sm font-medium ${
                    item.direction === "entrada"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {item.direction === "entrada" ? "+" : "−"}
                  {money.format(item.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
