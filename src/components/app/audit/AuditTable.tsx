"use client";

import { useState } from "react";
import { User, MapPin, ChevronRight } from "lucide-react";
import {
  auditTypeIcon,
  findAuditEventType,
  AUDIT_SEVERITY_LABELS,
  type AuditEvent,
} from "@/lib/mock/audit";
import { PERMISSION_MODULES } from "@/lib/mock/team";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import { AuditDetailDialog } from "./AuditDetailDialog";

interface AuditTableProps {
  events: AuditEvent[];
  /** Nombre legible de la ubicación (id → nombre). */
  locationName: (locationId?: string | null) => string | null;
  /** Callback opcional al seleccionar un evento */
  onSelectEvent?: (event: AuditEvent) => void;
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const dateStr = d.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const timeStr = d.toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { dateStr, timeStr };
};

const moduleLabel = (key: AuditEvent["module"]) =>
  PERMISSION_MODULES.find((m) => m.key === key)?.label ?? key;

/**
 * Tabla del registro de auditoría con diseño estándar de Zentro.
 * Al hacer clic en cualquier fila se abre el diálogo con el detalle completo del evento.
 */
export const AuditTable = ({
  events,
  locationName,
  onSelectEvent,
}: AuditTableProps) => {
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);

  const handleRowClick = (event: AuditEvent) => {
    setSelectedEvent(event);
    onSelectEvent?.(event);
  };

  return (
    <>
      <div className="w-full overflow-x-auto">
        <table className="min-w-full font-heading">
          <thead>
            <tr className="bg-accent">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-nowrap">
                Fecha y hora
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-nowrap">
                Actor
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-nowrap">
                Acción / Evento
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-nowrap">
                Módulo
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-nowrap">
                Ubicación
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-nowrap">
                Gravedad
              </th>
              <th className="px-5 py-3 text-right" aria-label="Acciones" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {events.map((event) => {
              const TypeIcon = auditTypeIcon(event.type);
              const place = locationName(event.locationId);
              const { dateStr, timeStr } = formatDate(event.at);

              return (
                <tr
                  key={event.id}
                  onClick={() => handleRowClick(event)}
                  className="group cursor-pointer hover:bg-muted/30 transition-colors"
                >
                  {/* Fecha y hora */}
                  <td className="px-5 py-3 text-sm text-nowrap">
                    <span className="font-medium text-foreground block">
                      {dateStr}
                    </span>
                    <span className="text-xs text-muted-foreground block">
                      {timeStr}
                    </span>
                  </td>

                  {/* Actor */}
                  <td className="px-5 py-3 text-sm text-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="bg-accent flex justify-center items-center size-8 shrink-0 overflow-hidden rounded-full text-muted-foreground">
                        <User className="size-4" />
                      </div>
                      <div>
                        <span className="font-medium text-foreground block">
                          {event.actor}
                        </span>
                        {event.actorRole && (
                          <span className="text-xs text-muted-foreground block">
                            {event.actorRole}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Acción / Evento */}
                  <td className="px-5 py-3 text-sm min-w-64">
                    <div className="flex items-start gap-2.5">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-primary mt-0.5">
                        <TypeIcon className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground line-clamp-1">
                          {event.description}
                        </p>
                        <p className="text-xs text-muted-foreground text-nowrap">
                          {findAuditEventType(event.type).label}
                          {event.target ? ` · ${event.target}` : ""}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Módulo */}
                  <td className="px-5 py-3 text-sm text-nowrap">
                    <span className="font-medium text-foreground">
                      {moduleLabel(event.module)}
                    </span>
                  </td>

                  {/* Ubicación */}
                  <td className="px-5 py-3 text-sm text-nowrap text-muted-foreground">
                    {place ? (
                      <span className="inline-flex items-center gap-1.5 text-foreground">
                        <MapPin className="size-3.5 text-muted-foreground shrink-0" />
                        <span>{place}</span>
                      </span>
                    ) : (
                      <span>—</span>
                    )}
                  </td>

                  {/* Gravedad */}
                  <td className="px-5 py-3 text-sm text-nowrap">
                    {event.severity === "sensitive" ? (
                      <StatusBadge
                        status="warning"
                        label={AUDIT_SEVERITY_LABELS.sensitive}
                      />
                    ) : (
                      <StatusBadge
                        status="default"
                        label={AUDIT_SEVERITY_LABELS.routine}
                      />
                    )}
                  </td>

                  {/* Chevron de navegación */}
                  <td className="px-5 py-3 text-right text-muted-foreground text-nowrap">
                    <ChevronRight className="size-4 inline-block transition-transform group-hover:translate-x-0.5" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal de Detalle */}
      <AuditDetailDialog
        event={selectedEvent}
        locationName={locationName}
        open={selectedEvent !== null}
        onOpenChange={(open) => !open && setSelectedEvent(null)}
      />
    </>
  );
};