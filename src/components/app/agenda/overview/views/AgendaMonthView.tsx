"use client";

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

interface AgendaMonthViewProps {
  appointments: Appointment[];
  date: string;
  onDateChange?: (date: string) => void;
  onOpen: (appointment: Appointment) => void;
  onTransition: (appointment: Appointment, status: AppointmentStatus) => void;
}

const dateKey = (d: Date) =>
  [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");

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

const monthsShort = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Oct",
  "Nov",
  "Dic",
];

const weekDayNames = [
  { short: "Lun", single: "L" },
  { short: "Mar", single: "M" },
  { short: "Mié", single: "M" },
  { short: "Jue", single: "J" },
  { short: "Vie", single: "V" },
  { short: "Sáb", single: "S" },
  { short: "Dom", single: "D" },
];

export function AgendaMonthView({
  appointments,
  date,
  onDateChange,
  onOpen,
  onTransition,
}: AgendaMonthViewProps) {
  const currentDate = new Date(`${date}T12:00:00`);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // First day of current month
  const firstDay = new Date(year, month, 1);
  const startDayOffset = (firstDay.getDay() + 6) % 7; // Monday = 0

  const gridStartDate = new Date(firstDay);
  gridStartDate.setDate(firstDay.getDate() - startDayOffset);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((startDayOffset + daysInMonth) / 7) * 7;

  const calendarDays = Array.from({ length: totalCells }, (_, i) => {
    const d = new Date(gridStartDate);
    d.setDate(gridStartDate.getDate() + i);
    const key = dateKey(d);
    return {
      date: d,
      key,
      dayNum: d.getDate(),
      isCurrentMonth: d.getMonth() === month,
      isToday: key === "2026-09-12",
      isSelected: key === date,
    };
  });

  return (
    <div className="flex flex-col select-none font-heading w-full overflow-x-auto">
      <div className="min-w-199 w-full">
        {/* Cabecera de días de la semana */}
        <header className="grid grid-cols-7 border-b border-border bg-card">
          {weekDayNames.map((d, index) => (
            <div
              key={index}
              className="py-2 sm:py-2.5 text-center text-xs sm:text-sm font-medium text-muted-foreground"
            >
              <span>{d.short}</span>
            </div>
          ))}
        </header>

        {/* Grilla mensual de días */}
        <div className="grid grid-cols-7 divide-x divide-y divide-border border-b border-border">
          {calendarDays.map((day) => {
            const dayAppointments = appointments.filter(
              (app) => app.startsAt.slice(0, 10) === day.key,
            );
            const MAX_VISIBLE = 2;
            const visibleAppointments = dayAppointments.slice(0, MAX_VISIBLE);
            const remainingCount = dayAppointments.length - MAX_VISIBLE;

            return (
              <div
                key={day.key}
                onClick={() => onDateChange?.(day.key)}
                className={cn(
                  "min-h-33.75 p-2 flex flex-col transition-colors hover:bg-muted/15 cursor-pointer",
                  !day.isCurrentMonth && "bg-muted/10 opacity-45",
                  day.isSelected && day.isCurrentMonth && "bg-muted/20",
                )}
              >
                {/* Cabecera de celda: Día alineado a la derecha */}
                <div className="flex items-center justify-end mb-1">
                  {day.isToday ? (
                    <span className="flex size-6 items-center justify-center rounded-full bg-foreground text-background font-semibold text-xs shadow-xs">
                      {day.dayNum}
                    </span>
                  ) : (
                    <span
                      className={cn(
                        "text-sm font-medium",
                        day.isCurrentMonth
                          ? "text-foreground"
                          : "text-muted-foreground/40",
                      )}
                    >
                      {day.dayNum === 1 && day.isCurrentMonth
                        ? `${monthsShort[month]} 1`
                        : day.dayNum}
                    </span>
                  )}
                </div>

                {/* Lista de citas del día */}
                <div className="flex flex-col gap-1.5 my-1">
                  {visibleAppointments.map((app) => {
                    const color =
                      colorSchemeByService[app.serviceId] ?? defaultColorScheme;

                    return (
                      <div
                        key={app.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpen(app);
                        }}
                        className={cn(
                          "group relative rounded-sm border-l-4 px-2 py-1 transition-all hover:z-20 cursor-pointer",
                          color.bg,
                          color.border,
                          color.text,
                        )}
                      >
                        <div className="flex items-start gap-1 min-w-0">
                          <h5 className="line-clamp-2 text-xs sm:text-sm font-medium leading-tight flex-1">
                            {app.serviceName}
                          </h5>
                        </div>

                        {/* <p className="truncate text-xs opacity-80 leading-tight mt-0.5">
                          {formatTimeRange(app.startsAt, app.endsAt)}
                        </p> */}
                      </div>
                    );
                  })}
                </div>

                {/* Indicador de más citas */}
                <div className="min-h-4">
                  {remainingCount > 0 && (
                    <span className="text-sm font-medium text-muted-foreground hover:text-foreground">
                      + {remainingCount} más
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
