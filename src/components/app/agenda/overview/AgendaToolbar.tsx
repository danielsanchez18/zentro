"use client";

import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { es } from "date-fns/locale";
import { Search } from "@/components/app/shared/Search";
import { FilterSheet } from "@/components/app/shared/FilterSheet";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  agendaServices,
  type AppointmentModality,
  type AppointmentStatus,
} from "@/lib/mock/agenda";
import { teamMembers } from "@/lib/mock/team";

export type AgendaView = "day" | "week" | "month" | "list";

interface AgendaToolbarProps {
  query: string;
  onQuery: (value: string) => void;
  status: AppointmentStatus | "all";
  onStatus: (value: AppointmentStatus | "all") => void;
  service: string;
  onService: (value: string) => void;
  responsible: string;
  onResponsible: (value: string) => void;
  modality: AppointmentModality | "all";
  onModality: (value: AppointmentModality | "all") => void;
  date: string;
  onDate: (value: string) => void;
  view: AgendaView;
  onView: (view: AgendaView) => void;
  onMove: (days: number) => void;
  onAdd?: () => void;
}

const dateKey = (d: Date) =>
  [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");

const startOfWeek = (dateStrOrDate: string | Date) => {
  const d =
    typeof dateStrOrDate === "string"
      ? new Date(`${dateStrOrDate}T12:00:00`)
      : new Date(dateStrOrDate);
  const day = (d.getDay() + 6) % 7; // Monday = 0
  const monday = new Date(d);
  monday.setDate(d.getDate() - day);
  monday.setHours(12, 0, 0, 0);
  return monday;
};

const endOfWeek = (monday: Date) => {
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(12, 0, 0, 0);
  return sunday;
};

const months = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

const monthsShort = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "set",
  "oct",
  "nov",
  "dic",
];

const dayNames = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

export function AgendaToolbar({
  query,
  onQuery,
  status,
  onStatus,
  service,
  onService,
  responsible,
  onResponsible,
  modality,
  onModality,
  date,
  onDate,
  view,
  onView,
  onMove,
  onAdd,
}: AgendaToolbarProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const views = [
    { id: "day", label: "Día" },
    { id: "week", label: "Semana" },
    { id: "month", label: "Mes" },
    { id: "list", label: "Lista" },
  ] as const;

  const currentDate = new Date(`${date}T12:00:00`);

  // Compute week bounds for week view
  const weekMonday = startOfWeek(currentDate);
  const weekSunday = endOfWeek(weekMonday);

  // Formatted date string for title
  let formattedDate = "";
  if (view === "day") {
    formattedDate = `${dayNames[currentDate.getDay()]}, ${currentDate.getDate()} de ${months[currentDate.getMonth()]}, ${currentDate.getFullYear()}`;
  } else if (view === "week") {
    if (weekMonday.getMonth() === weekSunday.getMonth()) {
      formattedDate = `${weekMonday.getDate()} – ${weekSunday.getDate()} de ${months[weekMonday.getMonth()]}, ${weekMonday.getFullYear()}`;
    } else {
      formattedDate = `${weekMonday.getDate()} de ${monthsShort[weekMonday.getMonth()]} – ${weekSunday.getDate()} de ${monthsShort[weekSunday.getMonth()]}, ${weekSunday.getFullYear()}`;
    }
  } else if (view === "month") {
    formattedDate = `${months[currentDate.getMonth()].charAt(0).toUpperCase() + months[currentDate.getMonth()].slice(1)} ${currentDate.getFullYear()}`;
  } else {
    formattedDate = `${currentDate.getDate()} de ${months[currentDate.getMonth()]}, ${currentDate.getFullYear()}`;
  }

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-5 bg-card">
      {/* Fila superior: Vistas | Botón Calendario Picker | Botón + */}
      <div className="flex items-center justify-between gap-3">
        {/* Selector de vistas centralizado */}
        <div className="inline-flex items-center gap-0.5">
          {views.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => onView(id)}
              className={cn(
                "cursor-pointer px-2.5 py-2 h-8 text-sm font-medium rounded-lg transition-colors leading-none",
                view === id
                  ? "bg-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Botón de Calendario interactivo con Popover */}
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className={cn(
                    "size-8 rounded-lg shrink-0 cursor-pointer transition-colors",
                    calendarOpen && "border-primary text-primary bg-primary/5",
                  )}
                  title="Establecer fecha o rango"
                />
              }
            >
              <CalendarDays className="size-4" />
            </PopoverTrigger>

            <PopoverContent
              align="end"
              className="w-70 p-0 rounded-xl overflow-hidden shadow-lg border border-border bg-popover"
            >
              {/* Header del Popover con contexto según la vista */}
              <div className="border-b border-border px-4 py-2.5 bg-muted/20 flex flex-col">
                <span className="text-sm font-heading font-medium text-foreground">
                  {view === "day" && "Vista Día"}
                  {view === "week" && "Vista Semana"}
                  {view === "month" && "Vista Mes"}
                  {view === "list" && "Vista Lista"}
                </span>
                <span className="text-sm text-muted-foreground">
                  {view === "day" && "Seleccionar día"}
                  {view === "week" && "Seleccionar semana"}
                  {view === "month" && "Seleccionar mes"}
                  {view === "list" && "Seleccionar fecha"}
                </span>
              </div>

              {/* Calendario con el mismo tamaño y estilo que DateRangeFilter */}
              {view === "week" ? (
                <Calendar
                  mode="range"
                  selected={{ from: weekMonday, to: weekSunday }}
                  onSelect={(range, selectedDay) => {
                    const target = selectedDay ?? range?.from ?? range?.to;
                    if (target) {
                      onDate(dateKey(target));
                      setCalendarOpen(false);
                    }
                  }}
                  numberOfMonths={1}
                  locale={es}
                  defaultMonth={currentDate}
                  classNames={{
                    day: "relative size-9 p-0 text-center text-sm [&.rdp-selected]:bg-accent [&:has(.rdp-range_start)]:rounded-l-lg [&:has(.rdp-range_end)]:rounded-r-lg [&:has(.rdp-range_middle)]:bg-primary/15",
                    day_button:
                      "flex size-9 cursor-pointer items-center justify-center rounded-lg font-normal hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&.rdp-selected]:bg-primary [&.rdp-selected]:text-primary-foreground [&.rdp-range_start]:rounded-lg [&.rdp-range_start]:bg-primary [&.rdp-range_start]:text-primary-foreground [&.rdp-range_end]:rounded-lg [&.rdp-range_end]:bg-primary [&.rdp-range_end]:text-primary-foreground [&.rdp-range_middle]:rounded-none [&.rdp-range_middle]:bg-primary/20 [&.rdp-range_middle]:text-foreground",
                  }}
                />
              ) : (
                <Calendar
                  mode="single"
                  selected={currentDate}
                  onSelect={(day) => {
                    if (day) {
                      onDate(dateKey(day));
                      setCalendarOpen(false);
                    }
                  }}
                  numberOfMonths={1}
                  locale={es}
                  defaultMonth={currentDate}
                />
              )}

              {/* Footer con atajos rápidos */}
              <div className="border-t border-border p-3 flex items-center justify-between gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    onDate(dateKey(new Date()));
                    setCalendarOpen(false);
                  }}
                  className="rounded-full"
                >
                  {view === "week"
                    ? "Esta semana"
                    : view === "month"
                      ? "Este mes"
                      : "Hoy"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCalendarOpen(false)}
                  className="rounded-full"
                >
                  Cerrar
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Botón + para agregar cita rápido */}
          {onAdd ? (
            <Button
              type="button"
              onClick={onAdd}
              variant="outline"
              size="icon"
              className="size-8 rounded-lg shrink-0 cursor-pointer"
              title="Nueva cita"
            >
              <Plus className="size-4" />
            </Button>
          ) : (
            <div className="size-8" />
          )}
        </div>
      </div>

      {/* Fila de Título de fecha destacado y Navegación (< Hoy >) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-medium tracking-tight py-1 text-foreground">
          {formattedDate}
        </h2>

        {/* Navegación agrupada < Hoy >
        // <div className="inline-flex items-center rounded-lg border border-border p-1">
        //   <Button
        //     type="button"
        //     variant="ghost"
        //     size="icon"
        //     onClick={() => onMove(view === "week" ? -7 : -1)}
        //     className="cursor-pointer hover:bg-primary/5!"
        //     aria-label="Anterior"
        //   >
        //     <ChevronLeft className="size-4" />
        //   </Button>
        //   <Button
        //     type="button"
        //     variant="secondary"
        //     onClick={() => onDate(dateKey(new Date()))}
        //     className="cursor-pointer hover:bg-primary/5! py-2 h-fit! text-sm leading-none!"
        //   >
        //     Hoy
        //   </Button>
        //   <Button
        //     type="button"
        //     variant="ghost"
        //     size="icon"
        //     onClick={() => onMove(view === "week" ? 7 : 1)}
        //     className="cursor-pointer hover:bg-primary/5!"
        //     aria-label="Siguiente"
        //   >
        //     <ChevronRight className="size-4" />
        //   </Button>
        // </div> */}
      </div>

      {/* Fila de Filtros: Buscador y Botón Filtros estándar de Zentro */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="w-full min-w-60 flex-1 md:max-w-md">
          <Search
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder="Buscar cliente, servicio o responsable"
          />
        </div>

        <div className="flex items-center gap-2">
          <FilterSheet
            activeCount={
              [
                status !== "all",
                service !== "all",
                responsible !== "all",
                modality !== "all",
              ].filter(Boolean).length
            }
            onClear={() => {
              onStatus("all");
              onService("all");
              onResponsible("all");
              onModality("all");
            }}
            title="Filtros de Agenda"
            description="Filtra las citas por estado, servicio, especialista y modalidad."
            groups={[
              {
                label: "Estado de cita",
                selected: status,
                onSelect: (value) =>
                  onStatus(value as AppointmentStatus | "all"),
                options: [
                  { label: "Todos", value: "all" },
                  { label: "Por confirmar", value: "pendiente_confirmacion" },
                  { label: "Confirmada", value: "confirmada" },
                  { label: "En curso", value: "en_curso" },
                  { label: "Completada", value: "completada" },
                  { label: "Cancelada", value: "cancelada" },
                  { label: "No asistió", value: "no_asistio" },
                ],
              },
              {
                label: "Servicio",
                selected: service,
                onSelect: onService,
                options: [
                  { label: "Todos", value: "all" },
                  ...agendaServices.map((item) => ({
                    label: item.name,
                    value: item.id,
                  })),
                ],
              },
              {
                label: "Responsable",
                selected: responsible,
                onSelect: onResponsible,
                options: [
                  { label: "Todos", value: "all" },
                  { label: "Sin asignar", value: "unassigned" },
                  ...teamMembers
                    .filter((member) => member.status === "activo")
                    .map((member) => ({
                      label: member.name,
                      value: member.id,
                    })),
                ],
              },
              {
                label: "Modalidad",
                selected: modality,
                onSelect: (value) =>
                  onModality(value as AppointmentModality | "all"),
                options: [
                  { label: "Todas", value: "all" },
                  { label: "Presencial", value: "presencial" },
                  { label: "A domicilio", value: "domicilio" },
                  { label: "Online", value: "online" },
                ],
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
