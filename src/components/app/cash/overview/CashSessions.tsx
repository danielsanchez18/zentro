import { Clock3, LayoutDashboard, User, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import type { CashMovement, CashSession } from "@/lib/mock/cash";
import { expectedCash } from "./CashKpis";

const money = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});
export function CashSessions({
  sessions,
  movements,
  onClose,
}: {
  sessions: CashSession[];
  movements: CashMovement[];
  onClose: (session: CashSession) => void;
}) {
  const active = sessions.filter((item) => item.status === "abierta");
  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <h2 className="text-sm font-medium">Sesiones abiertas</h2>
        <span className="text-sm text-muted-foreground font-heading">
          {active.length} activas
        </span>
      </div>
      {active.length === 0 ? (
        <div className="p-10 text-center">
          <span className="flex items-center justify-center w-fit mx-auto rounded-lg bg-muted p-2 text-muted-foreground">
            <LayoutDashboard className="size-5" />
          </span>
          <p className="mt-3 font-medium">No hay cajas abiertas</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Abre una terminal cuando necesites controlar cobros.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3 font-heading">
          {active.map((session) => (
            <article
              key={session.id}
              className="rounded-xl border border-border p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{session.terminalName}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {session.locationName}
                  </p>
                </div>
                <StatusBadge status="activa" label="Abierta" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 border-y border-border py-3">
                <div>
                  <p className="text-xs text-muted-foreground">Fondo inicial</p>
                  <p className="mt-1 text-sm font-medium">
                    {money.format(session.openingAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Efectivo esperado
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {money.format(expectedCash(session, movements))}
                  </p>
                </div>
              </div>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <User className="size-4" />
                  {session.openedByName}
                </p>
                <p className="flex items-center gap-2">
                  <Clock3 className="size-4" />
                  Abierta{" "}
                  {new Intl.DateTimeFormat("es-PE", {
                    hour: "numeric",
                    minute: "2-digit",
                  }).format(new Date(session.openedAt))}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="mt-4 rounded-full w-full font-sans"
                onClick={() => onClose(session)}
              >
                Cerrar y arquear
              </Button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
