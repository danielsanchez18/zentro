"use client";

import {
  ArrowRight,
  KeyRound,
  Lock,
  MailCheck,
  Pencil,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { MemberAuditType, TeamMember } from "@/lib/mock/team";

const AUDIT_ICONS: Record<MemberAuditType, LucideIcon> = {
  rol: KeyRound,
  acceso: Lock,
  invitacion: MailCheck,
  ingreso: ArrowRight,
  perfil: Pencil,
};

const MONTHS_SHORT = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

const formatDate = (iso: string) => {
  if (!iso) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    const [year, month, day] = iso.split("-").map(Number);
    return `${day} ${MONTHS_SHORT[month - 1]} ${year}`;
  }
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const day = d.getDate();
  const month = MONTHS_SHORT[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
};

const formatTime = (iso: string) => {
  try {
    return new Intl.DateTimeFormat("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(iso));
  } catch {
    return "";
  }
};

/**
 * Timeline de actividad del miembro (estilo CRM / CustomerHistory).
 * Muestra el historial operativo con nodo de eje, badge circular y fecha formateada.
 */
export const MemberActivity = ({ member }: { member: TeamMember }) => {
  const events = [...(member.auditLog ?? [])].sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime(),
  );

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card font-heading">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <h2 className="text-sm font-medium text-foreground">
          Última actividad
        </h2>
      </div>

      {events.length > 0 ? (
        <div className="flex flex-col p-5">
          {events.map((event, index) => {
            const Icon = AUDIT_ICONS[event.type] ?? ArrowRight;
            const isLast = index === events.length - 1;

            return (
              <div key={event.id} className="flex items-start gap-3">
                {/* Columna Izquierda: Eje del timeline con nodo y badge */}
                <div className="flex w-8 shrink-0 flex-col items-center self-stretch">
                  {/* Nodo circular pequeño alineado con la fecha */}
                  <span className="flex size-2 max-h-2 max-w-2 min-h-2 min-w-2 shrink-0 items-center justify-center rounded-full border border-border bg-muted/80 mt-0.5" />

                  {/* Línea vertical corta que conecta el nodo pequeño con el badge */}
                  <span className="h-2 w-px shrink-0 bg-border/80" />

                  {/* Badge circular grande con icono */}
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border/80 bg-muted/40 text-muted-foreground shadow-2xs">
                    <Icon className="size-4" />
                  </span>

                  {/* Línea vertical conectora hacia el siguiente evento */}
                  {!isLast && (
                    <span className="my-1 min-h-1 w-px flex-1 bg-border/80" />
                  )}
                </div>

                {/* Columna Derecha: Contenido del evento */}
                <div className={cn("min-w-0 flex-1", !isLast && "pb-8")}>
                  {/* Fecha en formato '30 jun 2025' */}
                  <p className="text-xs font-medium leading-none text-muted-foreground">
                    {formatDate(event.at)}
                  </p>

                  {/* Bloque principal alineado con el badge */}
                  <div className="mt-2.5 min-w-0">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        {event.actor}
                      </span>{" "}
                      {event.description}{" "}
                      <span className="ml-1 text-xs text-muted-foreground">
                        • {formatTime(event.at)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center text-sm text-muted-foreground">
          No hay actividad registrada.
        </div>
      )}
    </section>
  );
};
