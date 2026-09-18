"use client";

import { useEffect, useRef } from "react";
import {
  CheckCircle2,
  Eye,
  MoreHorizontal,
  PlayCircle,
  UserX,
  XCircle,
} from "lucide-react";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Appointment, AppointmentStatus } from "@/lib/mock/agenda";

interface AgendaDayViewProps {
  appointments: Appointment[];
  date: string;
  onDateChange: (date: string) => void;
  onOpen: (appointment: Appointment) => void;
  onTransition: (appointment: Appointment, status: AppointmentStatus) => void;
}

const HOUR_HEIGHT = 80;
const MIN_CARD_HEIGHT = 60;
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const formatHour = (hour: number) => {
  if (hour === 0) return "12 AM";
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return "12 PM";
  return `${hour - 12} PM`;
};

const formatTimeRange = (startsAt: string, endsAt: string) => {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  const fmt = (d: Date) =>
    new Intl.DateTimeFormat("es-PE", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(d);
  return `${fmt(start)} – ${fmt(end)}`;
};

const colorSchemeByService: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  service_1: {
    bg: "bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100/80 dark:hover:bg-sky-950/70",
    text: "text-sky-900 dark:text-sky-200",
    border: "border-l-sky-500",
  },
  service_2: {
    bg: "bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100/80 dark:hover:bg-emerald-950/70",
    text: "text-emerald-900 dark:text-emerald-200",
    border: "border-l-emerald-500",
  },
  service_3: {
    bg: "bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100/80 dark:hover:bg-amber-950/70",
    text: "text-amber-900 dark:text-amber-200",
    border: "border-l-amber-500",
  },
  service_4: {
    bg: "bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100/80 dark:hover:bg-rose-950/70",
    text: "text-rose-900 dark:text-rose-200",
    border: "border-l-rose-500",
  },
};

const defaultColorScheme = {
  bg: "bg-primary/5 dark:bg-primary/10 hover:bg-primary/10 dark:hover:bg-primary/15",
  text: "text-primary dark:text-primary-foreground",
  border: "border-l-primary",
};

export function AgendaDayView({
  appointments,
  date,
  onDateChange,
  onOpen,
  onTransition,
}: AgendaDayViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse current date & compute the 7 days of the surrounding week
  const currentDate = new Date(`${date}T12:00:00`);
  const dayOfWeek = (currentDate.getDay() + 6) % 7; // 0=Lun, 6=Dom
  const monday = new Date(currentDate);
  monday.setDate(currentDate.getDate() - dayOfWeek);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const key = [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0"),
    ].join("-");
    return {
      date: d,
      key,
      dayNum: d.getDate(),
      shortName: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"][i],
      singleLetter: ["L", "M", "M", "J", "V", "S", "D"][i],
      isCurrent: key === date,
    };
  });

  // Appointments for the selected day
  const dayAppointments = appointments.filter(
    (app) => app.startsAt.slice(0, 10) === date,
  );

  // Overlap clustering algorithm: ensures minimum readable height & splits overlapping events into columns
  const items = dayAppointments
    .map((app) => {
      const start = new Date(app.startsAt);
      const startM = start.getHours() * 60 + start.getMinutes();
      const visualMinutes = Math.max(
        app.durationMinutes,
        (MIN_CARD_HEIGHT / HOUR_HEIGHT) * 60,
      );
      const endM = startM + visualMinutes;
      const top = (startM / 60) * HOUR_HEIGHT;
      const height = Math.max(
        (app.durationMinutes / 60) * HOUR_HEIGHT,
        MIN_CARD_HEIGHT,
      );
      return { appointment: app, startM, endM, top, height };
    })
    .sort((a, b) => a.startM - b.startM);

  const clusters: (typeof items)[] = [];
  let currentCluster: typeof items = [];
  let clusterEndM = 0;

  for (const item of items) {
    if (currentCluster.length === 0) {
      currentCluster.push(item);
      clusterEndM = item.endM;
    } else if (item.startM < clusterEndM) {
      currentCluster.push(item);
      clusterEndM = Math.max(clusterEndM, item.endM);
    } else {
      clusters.push(currentCluster);
      currentCluster = [item];
      clusterEndM = item.endM;
    }
  }
  if (currentCluster.length > 0) {
    clusters.push(currentCluster);
  }

  const layoutAppointments: {
    appointment: Appointment;
    top: number;
    height: number;
    leftStyle: string;
    widthStyle: string;
  }[] = [];

  for (const cluster of clusters) {
    const colEnds: number[] = [];
    const assignments: { item: (typeof items)[0]; col: number }[] = [];

    for (const item of cluster) {
      let colIdx = -1;
      for (let c = 0; c < colEnds.length; c++) {
        if (colEnds[c] <= item.startM) {
          colIdx = c;
          colEnds[c] = item.endM;
          break;
        }
      }
      if (colIdx === -1) {
        colIdx = colEnds.length;
        colEnds.push(item.endM);
      }
      assignments.push({ item, col: colIdx });
    }

    const totalCols = colEnds.length;
    for (const { item, col } of assignments) {
      let leftStyle = "8px";
      let widthStyle = "calc(100% - 16px)";

      if (totalCols > 1) {
        const colWidthPercent = 100 / totalCols;
        const colLeftPercent = col * colWidthPercent;
        leftStyle = `calc(${colLeftPercent}% + 8px)`;
        widthStyle = `calc(${colWidthPercent}% - 12px)`;
      }

      layoutAppointments.push({
        appointment: item.appointment,
        top: item.top,
        height: item.height,
        leftStyle,
        widthStyle,
      });
    }
  }

  // Red time indicator calculation (10:15 in the prototype day)
  const isToday = date === "2026-09-12";
  const now = new Date();
  const currentMinutesFromMidnight = now.getHours() * 60 + now.getMinutes();
  const currentIndicatorTop = (currentMinutesFromMidnight / 60) * HOUR_HEIGHT;

  // Auto-scroll to around 8:00 AM on initial mount
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 7.5 * HOUR_HEIGHT;
    }
  }, [date]);

  return (
    <div className="flex flex-col select-none font-heading">
      {/* Franja superior de días de la semana (Lunes a Domingo) */}
      <header className="border-b border-border bg-card relative z-20">
        <div className="flex items-center">
          {/* Columna de zona horaria */}
          <div className="w-16 sm:w-20 shrink-0 border-r border-border py-2 text-center text-sm font-medium text-muted-foreground uppercase">
            GMT-5
          </div>

          {/* Días de la semana interactivos */}
          <div className="grid flex-1 grid-cols-7">
            {weekDays.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => onDateChange(item.key)}
                className={cn(
                  "relative flex flex-col items-center justify-center py-2 transition-colors hover:bg-muted/40 cursor-pointer",
                  item.isCurrent && "font-semibold text-foreground",
                )}
              >
                {/* Desktop: Lun 12 */}
                <div className="hidden sm:flex items-center gap-1.5 text-sm">
                  <span
                    className={cn(
                      item.isCurrent
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground",
                    )}
                  >
                    {item.shortName}
                  </span>
                  {item.isCurrent && (
                    <span className="text-foreground font-semibold">
                      {item.dayNum}
                    </span>
                  )}
                </div>

                {/* Mobile: L o S 12 */}
                <div className="flex sm:hidden items-center gap-1 text-sm">
                  <span
                    className={cn(
                      item.isCurrent
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground",
                    )}
                  >
                    {item.singleLetter}
                  </span>
                  {item.isCurrent && (
                    <span className="text-foreground font-semibold">
                      {item.dayNum}
                    </span>
                  )}
                </div>

                {/* Línea activa inferior */}
                {item.isCurrent && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Fila Todo el día (All-day) */}
        <div className="flex items-center border-t border-border bg-muted/15 text-xs text-muted-foreground">
          <div className="w-16 sm:w-20 shrink-0 border-r border-border py-2 px-2 text-right text-sm font-medium">
            Todo
          </div>
          <div className="flex-1 px-3 py-1.5 min-h-8.5 flex items-center text-sm text-muted-foreground">
            Sin eventos de jornada completa
          </div>
        </div>
      </header>

      {/* Grilla horaria con scroll */}
      <div
        ref={containerRef}
        className="pt-5 relative max-h-160 overflow-y-auto overflow-x-hidden"
      >
        <div
          className="relative flex"
          style={{ height: `${HOURS.length * HOUR_HEIGHT}px` }}
        >
          {/* Columna de etiquetas de horas */}
          <div className="w-16 sm:w-20 shrink-0 border-r border-border bg-card/40">
            {HOURS.map((hour) => (
              <div
                key={hour}
                style={{ height: `${HOUR_HEIGHT}px` }}
                className="relative pr-2.5 sm:pr-3 text-right"
              >
                <span className="relative -top-2 text-xs font-medium text-muted-foreground/80 tracking-tight">
                  {formatHour(hour)}
                </span>
              </div>
            ))}
          </div>

          {/* Columna principal del día */}
          <div className="relative flex-1">
            {/* Líneas divisorias horizontales por cada hora */}
            {HOURS.map((hour) => (
              <div
                key={hour}
                style={{ height: `${HOUR_HEIGHT}px` }}
                className="border-b border-border/50 transition-colors hover:bg-muted/10"
              />
            ))}

            {/* Línea roja indicadora de la hora actual */}
            {isToday && (
              <div
                className="absolute left-0 right-0 z-20 flex items-center pointer-events-none"
                style={{ top: `${currentIndicatorTop}px` }}
              >
                <div className="size-2.5 rounded-full bg-red-500 ring-2 ring-background -ml-1.5 shrink-0" />
                <div className="h-0.5 w-full bg-red-500 shadow-xs" />
              </div>
            )}

            {/* Bloques de Citas programadas */}
            {layoutAppointments.map(
              ({ appointment: app, top, height, leftStyle, widthStyle }) => {
                const color =
                  colorSchemeByService[app.serviceId] ?? defaultColorScheme;
                const isCompact = height <= 72;

                return (
                  <div
                    key={app.id}
                    onClick={() => onOpen(app)}
                    style={{
                      top: `${top}px`,
                      height: `${height}px`,
                      left: leftStyle,
                      width: widthStyle,
                    }}
                    className={cn(
                      "absolute z-10 cursor-pointer rounded-sm border-l-5 px-3 py-1.5 transition-all hover:z-30",
                      color.bg,
                      color.border,
                      color.text,
                    )}
                  >
                    {isCompact ? (
                      /* Layout Adaptativo Compacto (para citas de 5m a 45m): 2 filas optimizadas */
                      <div className="flex h-full flex-col text-primary">
                        {/* Fila 1: Servicio + Horario + Badge + Menú */}
                        <div className="flex items-center justify-between gap-1.5 min-w-0">
                          <div className="flex items-center gap-1.5 min-w-0 truncate">
                            <h4 className="truncate text-sm font-medium leading-tight">
                              {app.serviceName}
                            </h4>
                            <p className="max-sm:hidden text-sm opacity-85 shrink-0">
                              ({formatTimeRange(app.startsAt, app.endsAt)})
                            </p>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="size-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              onClick={(e) => e.stopPropagation()}
                              className="w-48"
                            >
                              <DropdownMenuItem onClick={() => onOpen(app)}>
                                <Eye />
                                Ver detalle
                              </DropdownMenuItem>
                              {app.status === "pendiente_confirmacion" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    onTransition(app, "confirmada")
                                  }
                                >
                                  <CheckCircle2 />
                                  Confirmar cita
                                </DropdownMenuItem>
                              )}
                              {app.status === "confirmada" && (
                                <DropdownMenuItem
                                  onClick={() => onTransition(app, "en_curso")}
                                >
                                  <PlayCircle />
                                  Iniciar atención
                                </DropdownMenuItem>
                              )}
                              {app.status === "en_curso" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    onTransition(app, "completada")
                                  }
                                >
                                  <CheckCircle2 />
                                  Completar cita
                                </DropdownMenuItem>
                              )}
                              {![
                                "completada",
                                "cancelada",
                                "no_asistio",
                              ].includes(app.status) && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    variant="destructive"
                                    onClick={() =>
                                      onTransition(app, "cancelada")
                                    }
                                  >
                                    <XCircle />
                                    Cancelar cita
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    variant="destructive"
                                    onClick={() =>
                                      onTransition(app, "no_asistio")
                                    }
                                  >
                                    <UserX />
                                    Marcar no asistió
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Fila 2: Cliente + Responsable + Duración */}
                        <div className="flex items-center justify-between gap-1.5 text-xs min-w-0">
                          <p className="truncate font-medium opacity-90">
                            {app.customerName}
                            {app.responsibleName && (
                              <span className="opacity-75">
                                {" "}
                                · {app.responsibleName}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* Layout Amplio (para citas largas > 45m): 3 filas con aire */
                      <div className="flex h-full flex-col py-0.5 text-primary">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <h4 className="truncate text-sm font-medium leading-tight">
                                {app.serviceName}
                              </h4>
                              <span className="text-sm font-normal opacity-85">
                                ({formatTimeRange(app.startsAt, app.endsAt)})
                              </span>
                            </div>

                            <p className="mt-1 truncate text-xs font-medium opacity-85">
                              {app.customerName}
                              {app.responsibleName && (
                                <span className="opacity-75">
                                  {" "}
                                  · {app.responsibleName}
                                </span>
                              )}
                            </p>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="size-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              onClick={(e) => e.stopPropagation()}
                              className="w-48"
                            >
                              <DropdownMenuItem onClick={() => onOpen(app)}>
                                <Eye />
                                Ver detalle
                              </DropdownMenuItem>
                              {app.status === "pendiente_confirmacion" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    onTransition(app, "confirmada")
                                  }
                                >
                                  <CheckCircle2 />
                                  Confirmar cita
                                </DropdownMenuItem>
                              )}
                              {app.status === "confirmada" && (
                                <DropdownMenuItem
                                  onClick={() => onTransition(app, "en_curso")}
                                >
                                  <PlayCircle />
                                  Iniciar atención
                                </DropdownMenuItem>
                              )}
                              {app.status === "en_curso" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    onTransition(app, "completada")
                                  }
                                >
                                  <CheckCircle2 />
                                  Completar cita
                                </DropdownMenuItem>
                              )}
                              {![
                                "completada",
                                "cancelada",
                                "no_asistio",
                              ].includes(app.status) && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    variant="destructive"
                                    onClick={() =>
                                      onTransition(app, "cancelada")
                                    }
                                  >
                                    <XCircle />
                                    Cancelar cita
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    variant="destructive"
                                    onClick={() =>
                                      onTransition(app, "no_asistio")
                                    }
                                  >
                                    <UserX />
                                    Marcar no asistió
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    )}
                  </div>
                );
              },
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
