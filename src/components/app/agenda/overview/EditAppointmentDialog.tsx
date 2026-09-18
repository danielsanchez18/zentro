"use client";

import React, { useState, useEffect } from "react";
import {
  AlignLeft,
  ArrowRight,
  Bell,
  CalendarClock,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Globe,
  Home,
  Layers,
  Lock,
  Mail,
  MapPin,
  Type,
  UserCheck,
  Users,
  Video,
} from "lucide-react";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toastMsg } from "@/components/ui/toast-message";
import { cn } from "@/lib/utils";
import {
  agendaServices,
  agendaResources,
  type Appointment,
  type AppointmentModality,
} from "@/lib/mock/agenda";
import { teamMembers } from "@/lib/mock/team";
import { useCrmStore } from "@/stores/crm-store";
import { TimeInputSelect } from "@/components/app/agenda/settings/shared/TimeInputSelect";

interface EditAppointmentDialogProps {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (
    changes: Partial<Appointment>,
    rescheduled: boolean,
    detail: string,
  ) => boolean | void;
}

const formatDisplayDate = (dateStr: string) => {
  if (!dateStr) return "";
  const d = new Date(`${dateStr}T12:00:00`);
  return d.toLocaleDateString("es-PE", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const dateKey = (d: Date) =>
  [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");

const splitDateTime = (value: string) => {
  const date = new Date(value);
  return {
    date: value.slice(0, 10),
    time: date.toLocaleTimeString("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
  };
};

/**
 * Checkbox interactivo con esquinas redondeadas
 */
function CustomCheckboxItem({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2.5 cursor-pointer text-muted-foreground hover:text-foreground group text-left select-none py-0.5"
    >
      <div
        className={cn(
          "size-4 rounded-sm border flex items-center justify-center transition-all shrink-0",
          checked
            ? "bg-primary border-primary text-primary-foreground shadow-xs"
            : "border-border/90 bg-input/30 group-hover:border-primary/50",
        )}
      >
        {checked && <Check className="size-3 stroke-3" />}
      </div>
      <span className="text-sm leading-none">{label}</span>
    </button>
  );
}

const MODALITY_OPTIONS: {
  id: AppointmentModality;
  label: string;
  icon: typeof Video;
}[] = [
  { id: "online", label: "Videollamada (Online)", icon: Video },
  { id: "presencial", label: "Presencial (Sede)", icon: MapPin },
  { id: "domicilio", label: "A domicilio", icon: Home },
];

export function EditAppointmentDialog({
  appointment,
  open,
  onOpenChange,
  onSave,
}: EditAppointmentDialogProps) {
  const customers = useCrmStore((state) => state.customers);
  const professionals = teamMembers.filter((member) => member.status === "activo");

  // Form states
  const [title, setTitle] = useState("");
  const [serviceId, setServiceId] = useState("service_1");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [repeat, setRepeat] = useState("none");

  // Popover calendar states
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  // Participants & Resources
  const [responsibleId, setResponsibleId] = useState("unassigned");
  const [resourceId, setResourceId] = useState("unassigned");
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [inviteOthers, setInviteOthers] = useState(true);
  const [seeParticipantList, setSeeParticipantList] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);

  // Modality & Meeting
  const [modality, setModality] = useState<AppointmentModality>("presencial");
  const [meetUrl, setMeetUrl] = useState("meet.google.com/dks-qzdb-xgd");
  const [locationName, setLocationName] = useState("");

  // Description & Reminder
  const [notes, setNotes] = useState("");
  const [reminder, setReminder] = useState("30");
  const [copiedLink, setCopiedLink] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!appointment || !open) return;
    const start = splitDateTime(appointment.startsAt);
    const end = splitDateTime(appointment.endsAt);

    // Reinicia el formulario al abrir la cita
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTitle(appointment.serviceName);
    setServiceId(appointment.serviceId ?? "service_1");
    setStartDate(start.date);
    setStartTime(start.time);
    setEndDate(end.date);
    setEndTime(end.time);
    setAllDay(Boolean(appointment.allDay));
    setRepeat(appointment.repeat ?? "none");
    setResponsibleId(appointment.responsibleId ?? "unassigned");
    setResourceId(appointment.resourceId ?? "unassigned");
    setModality(appointment.modality);
    setLocationName(appointment.locationName ?? appointment.address ?? "");
    setNotes(appointment.notes ?? "");
    setReminder(
      appointment.reminderMinutes ? String(appointment.reminderMinutes) : "30",
    );
    setNotifyEmail(appointment.notifyByEmail ?? true);
    setInviteOthers(appointment.allowGuests ?? true);
    setSeeParticipantList(appointment.showParticipantList ?? true);
    setMeetUrl(
      appointment.meetingUrl
        ? appointment.meetingUrl.replace(/^https?:\/\//, "")
        : "meet.google.com/dks-qzdb-xgd",
    );
    setReason("");
    setPermissionsOpen(false);
  }, [appointment, open]);

  if (!appointment) return null;

  const selectedCustomer = appointment.customerId
    ? customers.find((c) => c.id === appointment.customerId)
    : customers.find(
        (c) =>
          c.name.toLowerCase() === appointment.customerName.toLowerCase() ||
          (c.phone && appointment.customerPhone && c.phone === appointment.customerPhone),
      );

  const selectedResponsible = professionals.find((m) => m.id === responsibleId);
  const selectedService = agendaServices.find((s) => s.id === serviceId);

  // Verificamos si hubo reprogramación respecto al horario original
  const sTime = allDay ? "08:00" : startTime;
  const eTime = allDay ? "18:00" : endTime;
  const currentStartsAt = `${startDate}T${sTime}:00-05:00`;
  const currentEndsAt = `${endDate}T${eTime}:00-05:00`;
  const isRescheduled =
    currentStartsAt !== appointment.startsAt ||
    currentEndsAt !== appointment.endsAt;

  const copyMeet = () => {
    navigator.clipboard.writeText(`https://${meetUrl}`);
    setCopiedLink(true);
    toastMsg.info("Enlace copiado", "Se copió el enlace de la reunión.");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSave = () => {
    if (!title.trim() || !startDate || !startTime || !endDate || !endTime) {
      toastMsg.error("Faltan datos", "Completa el título y el horario.");
      return;
    }

    if (new Date(currentEndsAt) <= new Date(currentStartsAt)) {
      toastMsg.error(
        "Horario inválido",
        "La hora de finalización debe ser posterior al inicio.",
      );
      return;
    }

    if (isRescheduled && !reason.trim()) {
      toastMsg.error(
        "Indica el motivo",
        "La reprogramación de horario debe quedar explicada en el historial de auditoría.",
      );
      return;
    }

    const responsible = professionals.find((member) => member.id === responsibleId);
    const resource = agendaResources.find((item) => item.id === resourceId);

    const durationMinutes = Math.round(
      (new Date(currentEndsAt).getTime() - new Date(currentStartsAt).getTime()) / 60000,
    );

    const changes: Partial<Appointment> = {
      serviceName: title.trim(),
      startsAt: currentStartsAt,
      endsAt: currentEndsAt,
      durationMinutes,
      allDay,
      repeat: repeat as Appointment["repeat"],
      responsibleId: responsible?.id,
      responsibleName: responsible?.name,
      resourceId: resource?.id,
      resourceName: resource?.name,
      modality,
      locationName:
        modality === "presencial"
          ? locationName.trim()
          : modality === "domicilio"
            ? "Domicilio del cliente"
            : undefined,
      address: modality === "domicilio" ? locationName.trim() : undefined,
      meetingUrl: modality === "online" ? `https://${meetUrl}` : undefined,
      notes: notes.trim(),
      reminderMinutes: reminder === "none" ? undefined : Number(reminder),
      notifyByEmail: notifyEmail,
      allowGuests: inviteOthers,
      showParticipantList: seeParticipantList,
    };

    const saved = onSave(
      changes,
      isRescheduled,
      reason.trim() || (isRescheduled ? "Cita reprogramada" : "Se actualizaron los datos de la cita."),
    );

    if (saved === false) return;
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95dvh] flex flex-col sm:max-w-xl rounded-2xl">
        {/* Header con título y badge de cita */}
        <DialogHeader>
          <div className="flex items-center justify-between gap-2">
            <DialogTitle>Editar cita</DialogTitle>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">
              {appointment.number}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Modifica los detalles de la cita. Las propiedades clave permanecen bloqueadas por control.
          </p>
        </DialogHeader>

        {/* Formulario estructurado con iconos a la izquierda */}
        <div className="space-y-5 py-2 overflow-y-auto font-heading pr-1">
          {/* Fila 1: Título y Servicio (Icono T) */}
          <div className="flex items-start gap-4">
            <div className="pt-2 shrink-0 text-muted-foreground/80 flex justify-center">
              <Type className="size-4" />
            </div>
            <div className="flex-1 space-y-2 min-w-0">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título de la cita o servicio..."
                className="h-fit py-2 px-3 text-sm font-medium"
              />

              {/* Selector de servicio bloqueado por control */}
              <div className="space-y-1">
                <Select value={serviceId} disabled>
                  <SelectTrigger
                    disabled
                    className="bg-muted/40! text-sm h-fit py-2 w-full px-3 rounded-lg min-w-0 opacity-80 cursor-not-allowed border border-border"
                  >
                    {selectedService ? (
                      <div className="flex items-center gap-2 min-w-0 truncate text-sm">
                        <span className="font-medium text-foreground truncate">
                          {selectedService.name}
                        </span>
                        <span className="text-muted-foreground text-sm shrink-0">
                          · S/ {selectedService.price} - {selectedService.durationMinutes} min
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 min-w-0 truncate text-sm">
                        <span className="font-medium text-foreground truncate">
                          {appointment.serviceName}
                        </span>
                        {appointment.price !== undefined && (
                          <span className="text-muted-foreground text-sm shrink-0">
                            · S/ {appointment.price} - {appointment.durationMinutes} min
                          </span>
                        )}
                      </div>
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={serviceId}>
                      {selectedService?.name ?? appointment.serviceName}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-2xs text-muted-foreground pl-1 flex items-center gap-1">
                  <Lock className="size-2.5" />
                  Servicio y tarifa bloqueados para preservar la consistencia contable.
                </p>
              </div>
            </div>
          </div>

          {/* Fila 2: Fecha y Horario (Icono Reloj) */}
          <div className="flex items-start gap-4">
            <div className="pt-2 shrink-0 text-muted-foreground/80 flex justify-center">
              <Clock className="size-4" />
            </div>
            <div className="flex-1 space-y-3 min-w-0">
              {/* Sub-fila A: Horas editables con Popover de opciones (Inicio -> Fin) */}
              {!allDay && (
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex-1 min-w-0">
                    <TimeInputSelect
                      value={startTime}
                      onChange={(t) => setStartTime(t)}
                    />
                  </div>

                  <ArrowRight className="size-4 text-muted-foreground shrink-0" />

                  <div className="flex-1 min-w-0">
                    <TimeInputSelect
                      value={endTime}
                      onChange={(t) => setEndTime(t)}
                    />
                  </div>
                </div>
              )}

              {/* Sub-fila B: Fechas con Popover Calendar (Inicio -> Fin) con Truncate */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Popover Fecha Inicio */}
                <div className="flex-1 min-w-0">
                  <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                    <PopoverTrigger
                      render={
                        <button
                          type="button"
                          className="w-full min-w-0 cursor-pointer flex items-center justify-between gap-2 h-fit py-2 px-3 rounded-lg border border-border bg-input/30 text-sm font-medium text-foreground hover:bg-muted/40 transition-colors text-left"
                        />
                      }
                    >
                      <span className="truncate min-w-0 text-left capitalize">
                        {formatDisplayDate(startDate)}
                      </span>
                      <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className="w-fit p-0 rounded-xl overflow-hidden shadow-xl border border-border bg-popover z-50"
                    >
                      <Calendar
                        mode="single"
                        selected={new Date(`${startDate}T12:00:00`)}
                        onSelect={(d) => {
                          if (d) {
                            const key = dateKey(d);
                            setStartDate(key);
                            if (key > endDate) setEndDate(key);
                            setStartDateOpen(false);
                          }
                        }}
                        locale={es}
                        defaultMonth={new Date(`${startDate}T12:00:00`)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <ArrowRight className="size-4 text-muted-foreground shrink-0" />

                {/* Popover Fecha Fin */}
                <div className="flex-1 min-w-0">
                  <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                    <PopoverTrigger
                      render={
                        <button
                          type="button"
                          className="w-full min-w-0 cursor-pointer flex items-center justify-between gap-2 h-fit py-2 px-3 rounded-lg border border-border bg-input/30 text-sm font-medium text-foreground hover:bg-muted/40 transition-colors text-left"
                        />
                      }
                    >
                      <span className="truncate min-w-0 text-left capitalize">
                        {formatDisplayDate(endDate)}
                      </span>
                      <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className="w-fit p-0 rounded-xl overflow-hidden shadow-xl border border-border bg-popover z-50"
                    >
                      <Calendar
                        mode="single"
                        selected={new Date(`${endDate}T12:00:00`)}
                        onSelect={(d) => {
                          if (d) {
                            setEndDate(dateKey(d));
                            setEndDateOpen(false);
                          }
                        }}
                        locale={es}
                        defaultMonth={new Date(`${endDate}T12:00:00`)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Sub-fila C: Switch Todo el día & Repetición */}
              <div className="flex items-center justify-between gap-3 pt-1 flex-wrap sm:flex-nowrap">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    Todo el día:
                  </span>
                  <Switch checked={allDay} onCheckedChange={setAllDay} />
                </div>

                <Select
                  value={repeat}
                  onValueChange={(val) => setRepeat(String(val))}
                >
                  <SelectTrigger className="h-fit py-2 px-3 bg-input/30 min-w-37.5 w-auto rounded-lg text-sm border border-border">
                    <div className="flex items-center gap-1.5 truncate text-sm">
                      <span className="text-sm text-muted-foreground font-normal">
                        Repetir:
                      </span>
                      <span className="font-medium text-foreground truncate">
                        {repeat === "none"
                          ? "No se repite"
                          : repeat === "daily"
                            ? "Cada día"
                            : repeat === "weekly"
                              ? "Cada semana"
                              : repeat === "monthly"
                                ? "Cada mes"
                                : "Cada año"}
                      </span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No se repite</SelectItem>
                    <SelectItem value="daily">Todos los días (Diario)</SelectItem>
                    <SelectItem value="weekly">Todas las semanas (Semanal)</SelectItem>
                    <SelectItem value="monthly">Todos los meses (Mensual)</SelectItem>
                    <SelectItem value="yearly">Todos los años (Anual)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Alerta / Input de Motivo de reprogramación */}
          {isRescheduled ? (
            <div className="flex items-start gap-4 p-3 rounded-xl border border-amber-500/40 bg-amber-500/10 transition-all">
              <div className="pt-1 shrink-0 text-amber-600 dark:text-amber-400 flex justify-center">
                <CalendarClock className="size-4" />
              </div>
              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    Motivo de reprogramación
                  </span>
                  <span className="text-2xs font-semibold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300">
                    Requerido por auditoría
                  </span>
                </div>
                <Input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ej. Solicitud del paciente, ajuste de agenda médica..."
                  className="h-fit py-2 px-3 text-sm bg-background border-amber-500/30 font-medium"
                  autoFocus
                />
                <p className="text-2xs text-muted-foreground">
                  El horario cambió respecto al original ({splitDateTime(appointment.startsAt).date}{" "}
                  {splitDateTime(appointment.startsAt).time} - {splitDateTime(appointment.endsAt).time}).
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-4">
              <div className="pt-2 shrink-0 text-muted-foreground/80 flex justify-center">
                <CalendarClock className="size-4" />
              </div>
              <div className="flex-1 space-y-1 min-w-0">
                <Input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Motivo del ajuste (opcional si el horario no cambia)..."
                  className="h-fit py-2 px-3 text-sm bg-input/30 rounded-lg"
                />
              </div>
            </div>
          )}

          {/* Fila 3: Recurso Reservable (Icono Layers) */}
          <div className="flex items-center gap-4">
            <div className="shrink-0 text-muted-foreground/80 flex justify-center">
              <Layers className="size-4" />
            </div>
            <div className="flex-1 min-w-0">
              <Select
                value={resourceId}
                onValueChange={(value) => setResourceId(value as string)}
              >
                <SelectTrigger className="bg-input/30! text-sm h-fit py-2 w-full px-3 rounded-lg min-w-0 border border-border">
                  <div className="flex items-center justify-between w-full gap-2 min-w-0 text-sm">
                    <div className="flex items-center gap-2 min-w-0 truncate">
                      <span className="text-muted-foreground font-normal">
                        Recurso:
                      </span>
                      <span className="font-medium text-foreground truncate">
                        {agendaResources.find((item) => item.id === resourceId)
                          ?.name ?? "Sin recurso"}
                      </span>
                    </div>
                    {resourceId !== "unassigned" && (
                      <span className="text-xs capitalize text-muted-foreground shrink-0">
                        {
                          agendaResources.find((item) => item.id === resourceId)
                            ?.kind
                        }
                      </span>
                    )}
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Sin recurso</SelectItem>
                  <SelectSeparator />
                  {agendaResources
                    .filter((item) => item.status === "activo")
                    .map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        <div className="flex items-center justify-between w-full gap-3">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-xs text-muted-foreground capitalize">
                            {item.kind}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Fila 4: Zona Horaria (Icono Globo) */}
          <div className="flex items-center gap-4">
            <div className="shrink-0 text-muted-foreground/80 flex justify-center">
              <Globe className="size-4" />
            </div>
            <div className="flex-1 text-sm text-muted-foreground font-medium truncate">
              Lima (GMT-5) · Horario estándar de Perú
            </div>
          </div>

          {/* Fila 5: Participantes (Icono Usuarios) */}
          <div className="flex items-start gap-4">
            <div className="pt-2 shrink-0 text-muted-foreground/80 flex justify-center">
              <Users className="size-4" />
            </div>
            <div className="flex-1 space-y-3 min-w-0">
              {/* Cliente Bloqueado por Control / Auditoría */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center gap-3 p-2.5 rounded-lg border border-border bg-muted/30">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {selectedCustomer?.avatar ? (
                      <img
                        src={selectedCustomer.avatar}
                        alt={appointment.customerName}
                        className="size-8 rounded-full object-cover shrink-0 border border-border/60"
                      />
                    ) : (
                      <div className="size-8 rounded-full bg-primary/10 text-primary font-medium flex items-center justify-center text-sm shrink-0">
                        {(appointment.customerName || "C")[0]?.toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-foreground truncate">
                          {appointment.customerName}
                        </span>
                        <Lock className="size-3 text-muted-foreground shrink-0" />
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {appointment.customerPhone || appointment.customerEmail || "Cliente registrado"}
                      </p>
                    </div>
                  </div>
                  <span className="text-2xs rounded-md font-medium px-2 py-1 h-fit leading-none bg-muted text-muted-foreground border border-border shrink-0">
                    Cliente (Fijo)
                  </span>
                </div>
                <p className="text-2xs text-muted-foreground pl-1 flex items-center gap-1">
                  <Lock className="size-2.5" />
                  El participante titular no puede ser alterado en una cita registrada.
                </p>
              </div>

              {/* Participantes asignados */}
              <div className="space-y-2 pt-1 min-w-0">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {1 + (selectedResponsible && selectedResponsible.id !== "unassigned" ? 1 : 0)}{" "}
                    participante{selectedResponsible && selectedResponsible.id !== "unassigned" ? "s" : ""}
                  </span>
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 text-muted-foreground" />
                    <UserCheck className="size-4 text-muted-foreground" />
                  </div>
                </div>

                {/* Participante Responsable / Especialista (Editable) */}
                <div className="flex justify-between items-center gap-3 p-2 rounded-lg border border-border">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="size-8 rounded-full bg-muted text-foreground font-medium flex items-center justify-center text-sm shrink-0">
                      {selectedResponsible && selectedResponsible.id !== "unassigned"
                        ? selectedResponsible.name[0]
                        : "?"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <Select
                        value={responsibleId}
                        onValueChange={(val) => setResponsibleId(String(val))}
                      >
                        <SelectTrigger className="h-fit text-sm border-0 bg-transparent p-0 shadow-none font-medium text-foreground focus:ring-0">
                          <span className="truncate">
                            {selectedResponsible && selectedResponsible.id !== "unassigned"
                              ? `${selectedResponsible.name} (${selectedResponsible.role})`
                              : "Sin asignar"}
                          </span>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">Sin asignar</SelectItem>
                          {professionals.map((m) => (
                            <SelectItem key={m.id} value={m.id}>
                              {m.name} ({m.role})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Responsable / Especialista
                      </p>
                    </div>
                  </div>
                  <span className="text-xs rounded-md font-medium px-2 py-1.5 h-fit leading-none bg-primary/10 text-primary shrink-0">
                    Organizador
                  </span>
                </div>
              </div>

              {/* Acordeón de Permisos y Notificaciones */}
              <div className="border-t border-border/50 pt-2">
                <button
                  type="button"
                  onClick={() => setPermissionsOpen(!permissionsOpen)}
                  className="cursor-pointer flex items-center justify-between w-full text-left py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="font-medium">Permisos y notificaciones</span>
                  {permissionsOpen ? (
                    <ChevronUp className="size-4" />
                  ) : (
                    <ChevronDown className="size-4" />
                  )}
                </button>

                {permissionsOpen && (
                  <div className="mt-3 text-sm space-y-2.5">
                    <CustomCheckboxItem
                      checked={notifyEmail}
                      onChange={setNotifyEmail}
                      label="Enviar confirmación y recordatorio por WhatsApp y correo"
                    />
                    <CustomCheckboxItem
                      checked={inviteOthers}
                      onChange={setInviteOthers}
                      label="Permitir invitar a acompañantes"
                    />
                    <CustomCheckboxItem
                      checked={seeParticipantList}
                      onChange={setSeeParticipantList}
                      label="Mostrar lista de participantes en la confirmación"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Fila 6: Modalidad en Chips y Ubicación */}
          <div className="flex items-start gap-4">
            <div className="pt-2 shrink-0 text-muted-foreground/80 flex justify-center">
              {modality === "online" ? (
                <Video className="size-4 text-primary" />
              ) : modality === "presencial" ? (
                <MapPin className="size-4 text-primary" />
              ) : (
                <Home className="size-4 text-primary" />
              )}
            </div>
            <div className="flex-1 space-y-2.5 min-w-0">
              {/* Botones Chips de Modalidad */}
              <div className="flex items-center gap-2 flex-wrap">
                {MODALITY_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = modality === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setModality(opt.id)}
                      className={cn(
                        "cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border",
                        isSelected
                          ? "bg-primary/10 border-primary text-primary shadow-xs font-semibold"
                          : "bg-input/20 border-border/70 text-muted-foreground hover:text-foreground hover:bg-muted/30",
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-3.5",
                          isSelected ? "text-primary" : "text-muted-foreground",
                        )}
                      />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Contenido según Modalidad */}
              {modality === "online" ? (
                <div className="flex justify-between items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted/20">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-emerald-500 inline-block" />
                      Google Meet
                    </p>
                    <p className="text-2xs text-muted-foreground font-mono truncate">
                      {meetUrl}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={copyMeet}
                      className="size-8 rounded-lg cursor-pointer"
                      title="Copiar enlace"
                    >
                      {copiedLink ? (
                        <Check className="size-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
              ) : modality === "presencial" ? (
                <Input
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="Nombre de la sede o consultorio..."
                  className="h-fit px-3 py-2 rounded-lg text-sm border-border bg-input/30"
                />
              ) : (
                <Input
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="Dirección del domicilio del cliente..."
                  className="h-fit px-3 py-2 rounded-lg text-sm border-border bg-input/30"
                />
              )}
            </div>
          </div>

          {/* Fila 7: Notas / Descripción (Icono AlignLeft) */}
          <div className="flex items-start gap-4">
            <div className="pt-2 shrink-0 text-muted-foreground/80 flex justify-center">
              <AlignLeft className="size-4" />
            </div>
            <div className="flex-1 min-w-0">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Agregar descripción, notas o instrucciones para la cita..."
                rows={2}
                className="resize-none text-sm px-3 py-2 rounded-lg bg-input/30"
              />
            </div>
          </div>

          {/* Fila 8: Recordatorio (Icono Campana) */}
          <div className="flex items-center gap-4">
            <div className="shrink-0 text-muted-foreground/80 flex justify-center">
              <Bell className="size-4" />
            </div>
            <div className="flex-1 flex items-center gap-3 min-w-0">
              <Select
                value={reminder}
                onValueChange={(val) => setReminder(String(val))}
              >
                <SelectTrigger className="h-fit px-3 py-2 text-sm font-medium w-full border-border bg-input/30 rounded-lg min-w-0">
                  <div className="flex items-center gap-2 truncate text-sm">
                    <span className="text-muted-foreground text-sm font-normal shrink-0">
                      Recordatorio:
                    </span>
                    <span className="font-medium text-foreground truncate">
                      {reminder === "none"
                        ? "Sin recordatorio previo"
                        : reminder === "10"
                          ? "10 minutos antes"
                          : reminder === "15"
                            ? "15 minutos antes"
                            : reminder === "30"
                              ? "30 minutos antes"
                              : reminder === "60"
                                ? "1 hora antes"
                                : "1 día antes"}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 minutos antes</SelectItem>
                  <SelectItem value="15">15 minutos antes</SelectItem>
                  <SelectItem value="30">30 minutos antes</SelectItem>
                  <SelectItem value="60">1 hora antes</SelectItem>
                  <SelectItem value="1440">1 día antes</SelectItem>
                  <SelectItem value="none">Sin recordatorio previo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Footer con botones redondeados Cancelar y Guardar cambios */}
        <DialogFooter className="py-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-full cursor-pointer"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="rounded-full cursor-pointer"
          >
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
