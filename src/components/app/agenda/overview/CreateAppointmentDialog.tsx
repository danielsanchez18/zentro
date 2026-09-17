"use client";

import React, { useState, useEffect } from "react";
import {
  AlignLeft,
  ArrowRight,
  Bell,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Globe,
  Home,
  Mail,
  MapPin,
  Plus,
  RefreshCcw,
  Type,
  UserCheck,
  UserPlus,
  Users,
  Video,
  X,
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
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toastMsg } from "@/components/ui/toast-message";
import { cn } from "@/lib/utils";
import {
  agendaServices,
  type Appointment,
  type AppointmentModality,
} from "@/lib/mock/agenda";
import { teamMembers } from "@/lib/mock/team";
import { useCrmStore } from "@/stores/crm-store";

interface CreateAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (appointment: Appointment) => void;
  initialDate?: string;
}

const TIME_OPTIONS = [
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
];

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

/**
 * Input de hora editable con formato HH:mm, validación de horas (máx 23)
 * y minutos (máx 59), más botón ChevronDown para desplegar opciones predefinidas.
 */
function TimeInputSelect({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (time: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const sanitizeAndClamp = (val: string): string => {
    const clean = val.replace(/[^\d:]/g, "").slice(0, 5);
    const parts = clean.split(":");
    let hStr = parts[0] ?? "";
    let mStr = parts[1] ?? "";

    let h = parseInt(hStr, 10);
    if (isNaN(h)) h = 0;
    if (h > 23) h = 23;

    let m = parseInt(mStr, 10);
    if (isNaN(m)) m = 0;
    if (m > 59) m = 59;

    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/[^\d:]/g, "");
    if (raw.length > 5) raw = raw.slice(0, 5);

    // Si el usuario ingresa 2 dígitos seguidos sin dos puntos
    if (
      raw.length === 2 &&
      !raw.includes(":") &&
      (e.nativeEvent as InputEvent).inputType !== "deleteContentBackward"
    ) {
      raw = raw + ":";
    }

    // Clamping dinámico mientras escribe
    const parts = raw.split(":");
    let hStr = parts[0] ?? "";
    let mStr = parts[1] ?? "";

    if (hStr.length >= 2) {
      let h = parseInt(hStr, 10);
      if (h > 23) {
        hStr = "23";
        raw = "23" + (raw.includes(":") ? ":" + mStr : "");
      }
    }
    if (mStr.length >= 2) {
      let m = parseInt(mStr, 10);
      if (m > 59) {
        mStr = "59";
        raw = hStr + ":59";
      }
    }

    setInputValue(raw);

    if (/^([01]\d|2[0-3]):[0-5]\d$/.test(raw)) {
      onChange(raw);
    }
  };

  const handleBlur = () => {
    const clamped = sanitizeAndClamp(inputValue);
    setInputValue(clamped);
    onChange(clamped);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleBlur();
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div
        className={cn(
          "flex items-center w-full h-fit rounded-lg border border-border bg-input/30 focus-within:ring-1 focus-within:ring-primary/40 focus-within:border-primary/50 transition-colors",
          className,
        )}
      >
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="00:00"
          maxLength={5}
          className="w-full bg-transparent px-3 py-2 text-sm font-medium text-foreground outline-none tracking-wide text-left placeholder:text-muted-foreground"
        />
        <PopoverTrigger
          render={
            <button
              type="button"
              className="cursor-pointer px-2.5 py-2 text-muted-foreground hover:text-foreground transition-colors shrink-0 outline-none"
              aria-label="Seleccionar hora"
            />
          }
        >
          <ChevronDown className="size-3.5 opacity-60 hover:opacity-100" />
        </PopoverTrigger>
      </div>

      <PopoverContent
        align="start"
        className="w-36 p-1 rounded-xl max-h-60 overflow-y-auto shadow-xl border border-border bg-popover z-50"
      >
        <div className="space-y-0.5">
          {TIME_OPTIONS.map((timeOpt) => {
            const isSelected = value === timeOpt;
            return (
              <button
                key={timeOpt}
                type="button"
                onClick={() => {
                  setInputValue(timeOpt);
                  onChange(timeOpt);
                  setOpen(false);
                }}
                className={cn(
                  "cursor-pointer flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-sm transition-colors text-left",
                  isSelected
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "hover:bg-muted text-foreground",
                )}
              >
                <span>{timeOpt}</span>
                {isSelected && <Check className="size-3.5 stroke-[2.5]" />}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/**
 * Checkbox interactivo con esquinas rounded-lg reales y accesibilidad
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

export function CreateAppointmentDialog({
  open,
  onOpenChange,
  onCreate,
  initialDate = "2026-09-12",
}: CreateAppointmentDialogProps) {
  const customers = useCrmStore((state) => state.customers).filter(
    (c) => c.status === "activo",
  );
  const professionals = teamMembers.filter((m) => m.status === "activo");

  // Form states
  const [title, setTitle] = useState("");
  const [serviceId, setServiceId] = useState("service_1");
  const [startDate, setStartDate] = useState(initialDate);
  const [endDate, setEndDate] = useState(initialDate);
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("10:45");
  const [allDay, setAllDay] = useState(false);
  const [repeat, setRepeat] = useState("none");

  // Popover calendar states
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  // Participants
  const [customerId, setCustomerId] = useState("");
  const [isGuest, setIsGuest] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [responsibleId, setResponsibleId] = useState("unassigned");
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [inviteOthers, setInviteOthers] = useState(true);
  const [seeParticipantList, setSeeParticipantList] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);

  // Modality & Meeting
  const [modality, setModality] = useState<AppointmentModality>("online");
  const [meetUrl, setMeetUrl] = useState("meet.google.com/dks-qzdb-xgd");
  const [locationName, setLocationName] = useState("Sede Central - Monsefú");

  // Description & Reminder
  const [notes, setNotes] = useState("");
  const [reminder, setReminder] = useState("30");
  const [copiedLink, setCopiedLink] = useState(false);

  // Auto-calculate end time when service changes
  const handleServiceChange = (id: string) => {
    setServiceId(id);
    if (id === "custom") {
      if (!title) setTitle("Servicio personalizado");
      return;
    }
    const s = agendaServices.find((item) => item.id === id);
    if (s) {
      if (!title || agendaServices.some((item) => item.name === title)) {
        setTitle(s.name);
      }
      const [h, m] = startTime.split(":").map(Number);
      const totalMinutes =
        (isNaN(h) ? 10 : h) * 60 + (isNaN(m) ? 0 : m) + s.durationMinutes;
      const endH = Math.min(23, Math.floor(totalMinutes / 60));
      const endM = totalMinutes % 60;
      const pad = (n: number) => String(n).padStart(2, "0");
      setEndTime(`${pad(endH)}:${pad(endM)}`);
    }
  };

  const copyMeet = () => {
    navigator.clipboard.writeText(`https://${meetUrl}`);
    setCopiedLink(true);
    toastMsg.info("Enlace copiado", "Se copió el enlace de la reunión.");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const close = () => {
    setTitle("");
    setServiceId("service_1");
    setCustomerId("");
    setIsGuest(false);
    setGuestName("");
    setGuestPhone("");
    setGuestEmail("");
    setResponsibleId("unassigned");
    setNotes("");
    setModality("online");
    onOpenChange(false);
  };

  const handleSave = () => {
    const customer = customers.find((c) => c.id === customerId);
    const service =
      agendaServices.find((s) => s.id === serviceId) ?? agendaServices[0];
    const responsible = professionals.find((m) => m.id === responsibleId);

    const clientName = customer?.name ?? guestName.trim();
    if (!clientName) {
      toastMsg.error(
        "Falta el participante",
        "Por favor selecciona un cliente registrado o ingresa los datos del invitado.",
      );
      return;
    }

    const appointmentTitle = title.trim() || service?.name || "Cita agendada";
    const now = new Date().toISOString();

    const sTime = allDay ? "08:00" : startTime;
    const eTime = allDay ? "18:00" : endTime;

    onCreate({
      id: `apt_${Date.now()}`,
      number: `CIT-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: customer?.id,
      customerName: clientName,
      customerPhone: customer?.phone ?? guestPhone.trim(),
      customerEmail: customer?.email ?? guestEmail.trim(),
      serviceId: service?.id ?? "service_1",
      serviceName: appointmentTitle,
      durationMinutes: service?.durationMinutes ?? 45,
      price: service?.price ?? 0,
      responsibleId: responsible?.id,
      responsibleName: responsible?.name,
      modality,
      status: "confirmada",
      paymentStatus: "sin_pago",
      paidAmount: 0,
      origin: "manual",
      startsAt: `${startDate}T${sTime}:00-05:00`,
      endsAt: `${endDate}T${eTime}:00-05:00`,
      notes: notes.trim(),
      meetingUrl: modality === "online" ? `https://${meetUrl}` : undefined,
      locationName:
        modality === "presencial"
          ? locationName
          : modality === "domicilio"
            ? "Domicilio del cliente"
            : undefined,
      createdAt: now,
      updatedAt: now,
    });

    toastMsg.success(
      "Cita programada",
      `Se agendó «${appointmentTitle}» para ${clientName}.`,
    );
    close();
  };

  const selectedCustomer = customers.find((c) => c.id === customerId);
  const selectedResponsible = professionals.find((m) => m.id === responsibleId);
  const selectedService = agendaServices.find((s) => s.id === serviceId);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => (next ? onOpenChange(true) : close())}
    >
      <DialogContent className="max-h-[95dvh] flex flex-col sm:max-w-xl rounded-2xl">
        {/* Header con título */}
        <DialogHeader>
          <DialogTitle>Nueva cita</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Agrega una nueva cita a tu calendario.
          </p>
        </DialogHeader>

        {/* Formulario estructurado con iconos a la izquierda */}
        <div className="space-y-5 py-2 overflow-y-auto font-heading">
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

              {/* Selector de servicio rápido con label mejorado */}
              <div className="flex items-center gap-2 min-w-0">
                <Select
                  value={serviceId}
                  onValueChange={(val) => handleServiceChange(String(val))}
                >
                  <SelectTrigger className="bg-input/30! text-sm h-fit py-2 w-full px-3 rounded-lg min-w-0">
                    {selectedService ? (
                      <div className="flex items-center gap-2 min-w-0 truncate text-sm">
                        <span className="font-medium text-foreground truncate">
                          {selectedService.name}
                        </span>
                        <span className="text-muted-foreground text-sm shrink-0">
                          · S/ {selectedService.price} -{" "}
                          {selectedService.durationMinutes} min
                        </span>
                      </div>
                    ) : serviceId === "custom" ? (
                      <span className="text-sm font-medium text-primary truncate">
                        Servicio personalizado / Libre
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground truncate">
                        Seleccionar servicio...
                      </span>
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">
                      <div className="font-medium flex items-center gap-2 text-primary">
                        <Plus className="size-3" />
                        Servicio personalizado / Libre
                      </div>
                    </SelectItem>
                    <SelectSeparator />
                    {agendaServices
                      .filter((s) => s.status === "activo")
                      .map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          <div className="flex items-center justify-between w-full gap-2">
                            <span className="font-medium">{s.name}</span>·
                            <span className="text-sm text-muted-foreground">
                              S/ {s.price} - {s.durationMinutes} min
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
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

              {/* Sub-fila C: Switch Todo el día & Repetición con label mejorado */}
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
                    <SelectItem value="daily">
                      Todos los días (Diario)
                    </SelectItem>
                    <SelectItem value="weekly">
                      Todas las semanas (Semanal)
                    </SelectItem>
                    <SelectItem value="monthly">
                      Todos los meses (Mensual)
                    </SelectItem>
                    <SelectItem value="yearly">
                      Todos los años (Anual)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Fila 3: Zona Horaria (Icono Globo) */}
          <div className="flex items-center gap-4">
            <div className="shrink-0 text-muted-foreground/80 flex justify-center">
              <Globe className="size-4" />
            </div>
            <div className="flex-1 text-sm text-muted-foreground font-medium truncate">
              Lima (GMT-5) · Horario estándar de Perú
            </div>
          </div>

          {/* Fila 4: Participantes (Icono Usuarios) */}
          <div className="flex items-start gap-4">
            <div className="pt-2 shrink-0 text-muted-foreground/80 flex justify-center">
              <Users className="size-4" />
            </div>
            <div className="flex-1 space-y-3 min-w-0">
              {/* Selector de Cliente / Invitado con Fotos y Truncate */}
              {!isGuest ? (
                <div className="flex items-center gap-2 min-w-0">
                  <Select
                    value={customerId}
                    onValueChange={(val) => {
                      const v = String(val);
                      if (v === "guest_mode") {
                        setIsGuest(true);
                        setCustomerId("");
                      } else {
                        setCustomerId(v);
                      }
                    }}
                  >
                    <SelectTrigger className="h-fit px-3 py-2 bg-input/30 rounded-lg w-full min-w-0 overflow-hidden text-left">
                      {selectedCustomer ? (
                        <div className="flex items-center gap-2 min-w-0 truncate text-sm">
                          {selectedCustomer.avatar ? (
                            <img
                              src={selectedCustomer.avatar}
                              alt={selectedCustomer.name}
                              className="size-5 rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <div className="size-5 rounded-full bg-primary/15 text-primary text-xs font-semibold flex items-center justify-center shrink-0">
                              {selectedCustomer.name[0]?.toUpperCase()}
                            </div>
                          )}
                          <span className="font-medium text-foreground truncate">
                            {selectedCustomer.name}
                          </span>
                          <span className="text-xs text-muted-foreground shrink-0">
                            ({selectedCustomer.phone || selectedCustomer.email})
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground truncate min-w-0 block">
                          Buscar o agregar participante...
                        </span>
                      )}
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                      <SelectItem value="guest_mode">
                        <div className="font-medium text-primary flex items-center gap-2">
                          <UserPlus className="size-4" />
                          <span>Registrar persona invitada</span>
                        </div>
                      </SelectItem>
                      <SelectSeparator />
                      {customers.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          <div className="flex items-center gap-2.5 min-w-0 py-0.5">
                            {c.avatar ? (
                              <img
                                src={c.avatar}
                                alt={c.name}
                                className="size-6 rounded-full object-cover shrink-0 border border-border/50"
                              />
                            ) : (
                              <div className="size-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center shrink-0">
                                {c.name[0]?.toUpperCase()}
                              </div>
                            )}
                            <div className="flex items-center gap-1 min-w-0 text-left">
                              <span className="text-sm font-medium text-foreground truncate">
                                {c.name}
                              </span>
                              <span className="text-sm text-muted-foreground truncate">
                                {c.phone || c.email}
                              </span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="space-y-2 mt-1.5 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      Datos del invitado
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsGuest(false)}
                      className="text-sm text-primary hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <RefreshCcw className="size-3.5" />
                      Elegir cliente
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Input
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Nombre del invitado"
                      className="h-fit px-3 py-2 text-sm bg-input/30 rounded-lg"
                    />
                    <Input
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="Teléfono"
                      className="h-fit px-3 py-2 text-sm bg-input/30 rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Lista de participantes agregados con Foto */}
              {(selectedCustomer ||
                (isGuest && guestName.trim()) ||
                selectedResponsible) && (
                <div className="space-y-2 pt-1 min-w-0">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      {1 +
                        (selectedResponsible &&
                        selectedResponsible.id !== "unassigned"
                          ? 1
                          : 0)}{" "}
                      participante
                      {selectedResponsible &&
                      selectedResponsible.id !== "unassigned"
                        ? "s"
                        : ""}
                    </span>
                    <div className="flex items-center gap-2">
                      <Mail className="size-4 text-muted-foreground" />
                      <UserCheck className="size-4 text-muted-foreground" />
                    </div>
                  </div>

                  {/* Participante 1: Cliente / Invitado */}
                  {(selectedCustomer || (isGuest && guestName.trim())) && (
                    <div className="flex justify-between items-center gap-3 p-2 rounded-lg border border-border">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {selectedCustomer?.avatar ? (
                          <img
                            src={selectedCustomer.avatar}
                            alt={selectedCustomer.name}
                            className="size-8 rounded-full object-cover shrink-0 border border-border/60"
                          />
                        ) : (
                          <div className="size-8 rounded-full bg-primary/10 text-primary font-medium flex items-center justify-center text-sm shrink-0">
                            {(selectedCustomer?.name ??
                              guestName)[0]?.toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {selectedCustomer?.name ?? guestName}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {selectedCustomer?.email ??
                              selectedCustomer?.phone ??
                              guestPhone ??
                              "Cliente"}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs rounded-md font-medium px-2 py-1.5 h-fit leading-none bg-primary/10 text-primary shrink-0">
                        Cliente
                      </span>
                    </div>
                  )}

                  {/* Participante 2: Responsable */}
                  <div className="flex justify-between items-center gap-3 p-2 rounded-lg border border-border">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="size-8 rounded-full bg-muted text-foreground font-medium flex items-center justify-center text-sm shrink-0">
                        {selectedResponsible &&
                        selectedResponsible.id !== "unassigned"
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
                              {selectedResponsible &&
                              selectedResponsible.id !== "unassigned"
                                ? `${selectedResponsible.name} (${selectedResponsible.role})`
                                : "Sin asignar"}
                            </span>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unassigned">
                              Sin asignar
                            </SelectItem>
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
              )}

              {/* Acordeón de Permisos con Checkbox rounded-lg reales */}
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

          {/* Fila 5: Modalidad en Botones Chips y Ubicación */}
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
              {/* Botones de Selección Estilo Chips */}
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
                  placeholder="Dirección del domicilio del cliente..."
                  className="h-fit px-3 py-2 rounded-lg text-sm border-border bg-input/30"
                />
              )}
            </div>
          </div>

          {/* Fila 6: Notas / Descripción (Icono AlignLeft) */}
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

          {/* Fila 7: Recordatorio con Label Mejorado (Icono Campana) */}
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

        {/* Footer con botones redondeados Cancelar y Guardar */}
        <DialogFooter className="py-3">
          <Button
            type="button"
            variant="outline"
            onClick={close}
            className="rounded-full cursor-pointer"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="rounded-full cursor-pointer"
          >
            Guardar cita
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
