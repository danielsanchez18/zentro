"use client";

import { History, ShieldAlert, Users, Clock3 } from "lucide-react";
import type { AuditEvent } from "@/lib/mock/audit";

interface AuditKPIProps {
  events: AuditEvent[];
}

const formatDateTime = (iso: string | null) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-CL", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * KPIs del módulo Auditoría, calculados desde los eventos de la organización.
 * Mismo lenguaje visual que `team/KPIS.tsx`.
 */
export const AuditKPI = ({ events }: AuditKPIProps) => {
  const sensitive = events.filter((e) => e.severity === "sensitive").length;
  const uniqueActors = new Set(events.map((e) => e.actor)).size;
  const lastEventAt = events.length > 0 ? events[0].at : null;

  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div className="border border-border bg-card rounded-xl px-5 py-4 font-heading">
        <div className="space-y-2">
          <div className="flex justify-between text-primary/70 items-center">
            <p className="text-sm">Eventos registrados</p>
            <History className="size-4.5" />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-xl">{events.length}</p>
            <p className="text-xs text-primary/70">En el periodo visible</p>
          </div>
        </div>
      </div>

      <div className="border border-border bg-card rounded-xl px-5 py-4 font-heading">
        <div className="space-y-2">
          <div className="flex justify-between text-primary/70 items-center">
            <p className="text-sm">Acciones sensibles</p>
            <ShieldAlert className="size-4.5" />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-xl">
              {sensitive}{" "}
              <span className="text-sm">
                {sensitive === 1 ? "acción" : "acciones"}
              </span>
            </p>
            <p className="text-xs text-primary/70">
              Requieren permiso especial
            </p>
          </div>
        </div>
      </div>

      <div className="border border-border bg-card rounded-xl px-5 py-4 font-heading">
        <div className="space-y-2">
          <div className="flex justify-between text-primary/70 items-center">
            <p className="text-sm">Actores únicos</p>
            <Users className="size-4.5" />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-xl">
              {uniqueActors}{" "}
              <span className="text-sm">
                {uniqueActors === 1 ? "persona" : "personas"}
              </span>
            </p>
            <p className="text-xs text-primary/70">Han generado actividad</p>
          </div>
        </div>
      </div>

      <div className="border border-border bg-card rounded-xl px-5 py-4 font-heading">
        <div className="space-y-2">
          <div className="flex justify-between text-primary/70 items-center">
            <p className="text-sm">Último evento</p>
            <Clock3 className="size-4.5" />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-xl">{formatDateTime(lastEventAt)}</p>
            <p className="text-xs text-primary/70">Más reciente registrado</p>
          </div>
        </div>
      </div>
    </div>
  );
};