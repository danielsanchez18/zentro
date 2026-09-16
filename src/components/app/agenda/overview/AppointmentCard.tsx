"use client";

import {
  BadgeCheck,
  Check,
  CircleCheck,
  CircleX,
  Clock3,
  Eye,
  Map,
  MapPin,
  MoreHorizontal,
  Play,
  User,
  UserRound,
  UserX,
} from "lucide-react";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  appointmentModalityLabel,
  type Appointment,
  type AppointmentStatus,
} from "@/lib/mock/agenda";

const time = (value: string) =>
  new Intl.DateTimeFormat("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

export function AppointmentCard({
  appointment,
  compact = false,
  onOpen,
  onTransition,
}: {
  appointment: Appointment;
  compact?: boolean;
  onOpen: (appointment: Appointment) => void;
  onTransition: (appointment: Appointment, status: AppointmentStatus) => void;
}) {
  return (
    <article
      onClick={() => onOpen(appointment)}
      className="cursor-pointer rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 font-heading">
          <p className="text-xs font-medium text-primary">
            {time(appointment.startsAt)} – {time(appointment.endsAt)}
          </p>
          <h3 className="mt-3 truncate text-sm font-medium">
            {appointment.serviceName}
          </h3>
          <p className="truncate text-sm text-muted-foreground">
            {appointment.customerName}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            onClick={(event) => event.stopPropagation()}
            className="cursor-pointer rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            onClick={(event) => event.stopPropagation()}
            className="w-48"
          >
            <DropdownMenuItem onClick={() => onOpen(appointment)}>
              <Eye />
              Ver detalle
            </DropdownMenuItem>
            {appointment.status === "pendiente_confirmacion" && (
              <DropdownMenuItem
                onClick={() => onTransition(appointment, "confirmada")}
              >
                <BadgeCheck />
                Confirmar
              </DropdownMenuItem>
            )}
            {appointment.status === "confirmada" && (
              <DropdownMenuItem
                onClick={() => onTransition(appointment, "en_curso")}
              >
                <Play />
                Iniciar atención
              </DropdownMenuItem>
            )}
            {appointment.status === "en_curso" && (
              <DropdownMenuItem
                onClick={() => onTransition(appointment, "completada")}
              >
                <CircleCheck />
                Completar
              </DropdownMenuItem>
            )}
            {!["completada", "cancelada", "no_asistio"].includes(
              appointment.status,
            ) && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onTransition(appointment, "cancelada")}
                >
                  <CircleX />
                  Cancelar cita
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onTransition(appointment, "no_asistio")}
                >
                  <UserX />
                  Marcar no-show
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <StatusBadge status={appointment.status} />
      </div>
      {!compact && (
        <div className="mt-3 flex flex-col gap-2 border-t pt-3 text-sm text-muted-foreground font-heading">
          <span className="flex items-center gap-1">
            <User className="size-4" />
            {appointment.responsibleName ?? "Sin responsable"}
          </span>
          <span className="flex items-center gap-2">
            <Map className="size-4" />
            {appointment.locationName ??
              appointmentModalityLabel(appointment.modality)}
          </span>
          <span className="flex items-center gap-2">
            <Clock3 className="size-4" />
            {appointment.durationMinutes} min
          </span>
        </div>
      )}
    </article>
  );
}
