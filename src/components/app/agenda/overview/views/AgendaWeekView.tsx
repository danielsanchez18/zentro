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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Appointment, AppointmentStatus } from "@/lib/mock/agenda";

interface AgendaWeekViewProps {
  appointments: Appointment[];
  date: string;
  onDateChange?: (date: string) => void;
  onOpen: (appointment: Appointment) => void;
  onTransition: (appointment: Appointment, status: AppointmentStatus) => void;
}

const HOUR_HEIGHT = 80;
const MIN_CARD_HEIGHT = 50;
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const dateKey = (d: Date) =>
  [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");

const startOfWeek = (value: string) => {
  const d = new Date(`${value}T12:00:00`);
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  return d;
};

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

export function AgendaWeekView({
  appointments,
  date,
  onDateChange,
  onOpen,
  onTransition,
}: AgendaWeekViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Compute the 7 days of current week (Monday to Sunday)
  const monday = startOfWeek(date);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const key = dateKey(d);
    return {
      date: d,
      key,
      dayNum: d.getDate(),
      shortName: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"][i],
      singleLetter: ["L", "M", "M", "J", "V", "S", "D"][i],
      isCurrent: key === date,
      isToday: key === "2026-09-12",
    };
  });

  // Indicator top calculation
  const currentMinutesFromMidnight = 10 * 60 + 15; // 10:15 AM
  const currentIndicatorTop = (currentMinutesFromMidnight / 60) * HOUR_HEIGHT;

  // Auto-scroll to morning hours
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 7.5 * HOUR_HEIGHT;
    }
  }, [date]);

  // Compute layout appointments per day column with overlap resolution
  const getDayLayoutAppointments = (dayKey: string) => {
    const dayApps = appointments.filter(
      (app) => app.startsAt.slice(0, 10) === dayKey,
    );

    const items = dayApps
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

    const layoutApps: {
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
        let leftStyle = "4px";
        let widthStyle = "calc(100% - 8px)";

        if (totalCols > 1) {
          const colWidthPercent = 100 / totalCols;
          const colLeftPercent = col * colWidthPercent;
          leftStyle = `calc(${colLeftPercent}% + 2px)`;
          widthStyle = `calc(${colWidthPercent}% - 4px)`;
        }

        layoutApps.push({
          appointment: item.appointment,
          top: item.top,
          height: item.height,
          leftStyle,
          widthStyle,
        });
      }
    }

    return layoutApps;
  };

  return (
    <div className="flex flex-col select-none font-heading overflow-x-auto">
      <div className="min-w-215">
        {/* Franja superior de días de la semana (Lunes a Domingo) */}
        <header className="border-b border-border bg-card relative z-20">
          <div className="flex items-center">
            {/* Columna de zona horaria */}
            <div className="w-16 sm:w-20 shrink-0 border-r border-border py-2 text-center text-sm font-medium text-muted-foreground uppercase">
              GMT-5
            </div>

            {/* Días de la semana */}
            <div className="grid flex-1 grid-cols-7 divide-x divide-border">
              {weekDays.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onDateChange?.(item.key)}
                  className={cn(
                    "relative flex flex-col items-center justify-center py-2 transition-colors hover:bg-muted/40 cursor-pointer",
                    item.isCurrent && "font-semibold text-foreground",
                  )}
                >
                  <div className="flex items-center gap-1.5 text-sm">
                    <span
                      className={cn(
                        item.isCurrent
                          ? "text-foreground font-semibold"
                          : "text-muted-foreground",
                      )}
                    >
                      {item.shortName}
                    </span>
                    <span
                      className={cn(
                        item.isCurrent
                          ? "text-foreground font-semibold"
                          : "text-muted-foreground font-normal",
                      )}
                    >
                      {item.dayNum}
                    </span>
                  </div>

                  {/* Línea activa inferior para el día seleccionado */}
                  {item.isCurrent && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Fila Todo el día */}
          <div className="flex items-center border-t border-border bg-muted/15 text-xs text-muted-foreground">
            <div className="w-16 sm:w-20 shrink-0 border-r border-border py-2 px-2 text-right text-sm font-medium">
              Todo
            </div>
            <div className="grid flex-1 grid-cols-7 divide-x divide-border min-h-8.5">
              {weekDays.map((item) => (
                <div key={item.key} className="p-1" />
              ))}
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

            {/* Grilla de 7 columnas para los días */}
            <div className="relative grid flex-1 grid-cols-7 divide-x divide-border">
              {/* Líneas horizontales de horas de fondo a lo largo de todas las columnas */}
              <div className="absolute inset-0 pointer-events-none">
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    style={{ height: `${HOUR_HEIGHT}px` }}
                    className="border-b border-border/50"
                  />
                ))}
              </div>

              {/* Línea roja de hora actual */}
              <div
                className="absolute left-0 right-0 z-20 flex items-center pointer-events-none"
                style={{ top: `${currentIndicatorTop}px` }}
              >
                <div className="size-2.5 rounded-full bg-red-500 ring-2 ring-background -ml-1.5 shrink-0" />
                <div className="h-0.5 w-full bg-red-500 shadow-xs" />
              </div>

              {/* Columnas de cada día con sus citas */}
              {weekDays.map((day) => {
                const dayLayout = getDayLayoutAppointments(day.key);

                return (
                  <div key={day.key} className="relative h-full">
                    {dayLayout.map(
                      ({
                        appointment: app,
                        top,
                        height,
                        leftStyle,
                        widthStyle,
                      }) => {
                        const color =
                          colorSchemeByService[app.serviceId] ??
                          defaultColorScheme;

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
                              "absolute z-10 cursor-pointer rounded-sm border-l-5 px-2 py-1 transition-all hover:z-30",
                              color.bg,
                              color.border,
                              color.text,
                            )}
                          >
                            <div className="flex h-full flex-col">
                              {/* Fila superior: Título y Menú */}
                              <div className="flex items-start justify-between gap-1 min-w-0">
                                <h4 className="text-sm font-medium leading-tight line-clamp-2 flex-1">
                                  {app.serviceName}
                                </h4>
                              </div>

                              {/* Fila de Cliente (si la tarjeta tiene altura suficiente) */}
                              {height > 58 && (
                                <p className="truncate text-xs font-medium opacity-90">
                                  {app.customerName}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
