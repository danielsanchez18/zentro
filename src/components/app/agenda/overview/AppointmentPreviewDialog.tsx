"use client";

import React, { useState } from "react";
import {
  AlignLeft,
  BadgeCheck,
  Calendar,
  Check,
  Clock3,
  Copy,
  ExternalLink,
  Globe,
  Home,
  Mail,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Phone,
  Play,
  Share2,
  Tag,
  Trash2,
  UserCheck,
  UserRound,
  UserX,
  Video,
  Wallet,
  XCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/app/team/ConfirmDialog";
import { AppointmentReasonDialog } from "./AppointmentReasonDialog";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toastMsg } from "@/components/ui/toast-message";
import { cn } from "@/lib/utils";
import {
  agendaMoney,
  appointmentModalityLabel,
  appointmentPaymentLabel,
  type Appointment,
  type AppointmentStatus,
} from "@/lib/mock/agenda";
import { teamMembers } from "@/lib/mock/team";
import { useCrmStore } from "@/stores/crm-store";

interface AppointmentPreviewDialogProps {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (appointment: Appointment) => void;
  onTransition?: (
    appointment: Appointment,
    status: AppointmentStatus,
    reason?: string,
  ) => void;
  onDelete?: (appointment: Appointment) => void;
  onPayment?: (appointment: Appointment) => void;
}

const formatFullDate = (isoStr: string) => {
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString("es-PE", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return isoStr;
  }
};

const formatTimeRange = (startsAt: string, endsAt: string) => {
  try {
    const s = new Date(startsAt);
    const e = new Date(endsAt);
    const fmt = (d: Date) =>
      d.toLocaleTimeString("es-PE", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    return `${fmt(s)} – ${fmt(e)}`;
  } catch {
    return "";
  }
};

export function AppointmentPreviewDialog({
  appointment,
  open,
  onOpenChange,
  onEdit,
  onTransition,
  onDelete,
  onPayment,
}: AppointmentPreviewDialogProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [reasonAction, setReasonAction] = useState<AppointmentStatus | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const customers = useCrmStore((state) => state.customers);

  if (!appointment) return null;

  // Buscar cliente y foto
  const customer = customers.find(
    (c) =>
      c.id === appointment.customerId ||
      c.name.toLowerCase() === appointment.customerName.toLowerCase(),
  );
  const customerAvatar = customer?.avatar;

  // Buscar responsable
  const responsible = teamMembers.find(
    (m) =>
      m.id === appointment.responsibleId ||
      m.name.toLowerCase() === appointment.responsibleName?.toLowerCase(),
  );

  const copyMeetingUrl = () => {
    if (!appointment.meetingUrl) return;
    navigator.clipboard.writeText(appointment.meetingUrl);
    setCopiedLink(true);
    toastMsg.info("Enlace copiado", "Se copió el enlace de la reunión.");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copySummary = () => {
    const text = `Cita ${appointment.number}: ${appointment.serviceName}\nCliente: ${appointment.customerName}\nFecha: ${formatFullDate(appointment.startsAt)}\nHorario: ${formatTimeRange(appointment.startsAt, appointment.endsAt)}\nModalidad: ${appointmentModalityLabel(appointment.modality)}${appointment.meetingUrl ? `\nEnlace: ${appointment.meetingUrl}` : ""}`;
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    toastMsg.success("Detalles copiados", "Se copió el resumen de la cita.");
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const whatsappPhone = (appointment.customerPhone ?? "").replace(/\D/g, "");
  const whatsappUrl = whatsappPhone
    ? `https://wa.me/${whatsappPhone}`
    : undefined;

  const paymentPercent =
    appointment.price > 0
      ? Math.min(
          100,
          Math.round((appointment.paidAmount / appointment.price) * 100),
        )
      : 0;

  const isPaid = appointment.paymentStatus === "pagado";
  const isPartial = appointment.paymentStatus === "adelanto";

  const nextAction:
    | { status: AppointmentStatus; label: string; icon: typeof Play }
    | undefined =
    appointment.status === "pendiente_confirmacion"
      ? { status: "confirmada", label: "Confirmar cita", icon: BadgeCheck }
      : appointment.status === "confirmada"
        ? { status: "en_curso", label: "Iniciar atención", icon: Play }
        : appointment.status === "en_curso"
          ? { status: "completada", label: "Completar cita", icon: BadgeCheck }
          : undefined;

  const canDelete =
    appointment.paymentStatus === "sin_pago" &&
    !["completada", "en_curso"].includes(appointment.status);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[95dvh] flex flex-col sm:max-w-xl rounded-2xl">
        {/* Cabecera estilizada con Estado, Código y Modalidad */}
        <DialogHeader className="pr-6">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={appointment.status} />
              <span className="font-mono text-[13px] leading-none font-semibold px-2.5 py-2 rounded-lg bg-muted">
                {appointment.number}
              </span>
              <span className="inline-flex items-center gap-1 text-[13px] leading-none font-medium px-2.5 py-1.5 rounded-lg bg-muted capitalize">
                {appointment.modality === "online" ? (
                  <Video className="size-4" />
                ) : appointment.modality === "presencial" ? (
                  <MapPin className="size-4" />
                ) : (
                  <Home className="size-4" />
                )}
                {appointmentModalityLabel(appointment.modality)}
              </span>
            </div>
          </div>

          <div className="space-y-1 text-left">
            <DialogTitle className="text-lg font-medium font-heading text-foreground tracking-tight">
              {appointment.serviceName}
            </DialogTitle>
            <div className="font-heading flex flex-wrap items-center gap-2 text-sm text-muted-foreground capitalize">
              <div className="flex items-center gap-2">
                <Calendar className="size-3.5 shrink-0 text-primary" />
                <span>{formatFullDate(appointment.startsAt)}</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-2">
                <Clock3 className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="normal-case font-medium text-foreground">
                  {formatTimeRange(appointment.startsAt, appointment.endsAt)}
                </span>
              </div>
              <span className="text-[13px] bg-muted px-2 py-2 rounded-md leading-none font-mono normal-case">
                {appointment.durationMinutes} min
              </span>
            </div>
          </div>
        </DialogHeader>

        {/* Cuerpo del Diálogo */}
        <div className="overflow-y-auto font-heading">
          {/* Card de Videollamada (Google Meet / Online) */}
          {appointment.modality === "online" && appointment.meetingUrl && (
            <div className="mb-4 flex items-center justify-between flex-wrap gap-3 p-3.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
              <div className="flex gap-3 min-w-0">
                <Video className="size-5" />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-sm font-medium ">
                    Reunión Virtual · Google Meet
                  </div>
                  <p className="text-sm text-muted-foreground font-mono truncate select-all">
                    {appointment.meetingUrl}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={copyMeetingUrl}
                  className="h-8 px-2 text-sm gap-1 cursor-pointer rounded-lg border-emerald-500/30 hover:bg-emerald-500/10"
                >
                  {copiedLink ? (
                    <Check className="size-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                  <span>Copiar</span>
                </Button>
                <a
                  href={appointment.meetingUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center justify-center h-8 px-2 text-sm gap-1.5 cursor-pointer rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors"
                >
                  <span>Unirse</span>
                  <ExternalLink className="size-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* Tarjeta del Participante / Cliente */}
          <div className="flex flex-col gap-y-2 border-b border-border pb-2">
            <span className="text-sm font-meidum text-muted-foreground">
              Participante principal
            </span>
            <div className="flex items-center justify-between gap-3 py-2">
              <div className="flex items-center gap-3 min-w-0">
                {customerAvatar ? (
                  <img
                    src={customerAvatar}
                    alt={appointment.customerName}
                    className="size-10 rounded-full object-cover shrink-0 border border-border/80 shadow-xs"
                  />
                ) : (
                  <div className="size-10 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-sm shrink-0 border border-primary/20">
                    {appointment.customerName[0]?.toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {appointment.customerName}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground text-nowrap line-clamp-1">
                    {appointment.customerPhone && (
                      <span>{appointment.customerPhone}</span>
                    )}
                    {appointment.customerEmail && (
                      <>
                        <span>·</span>
                        <span className="truncate">
                          {appointment.customerEmail}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Botones de acción rápida con el cliente */}
              <div className="flex items-center shrink-0">
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center justify-center size-8 rounded-lg text-emerald-600 hover:bg-emerald-500/10 cursor-pointer transition-colors"
                    title="Enviar mensaje de WhatsApp"
                  >
                    <svg
                      className="size-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <g fill="none">
                        <g clip-path="url(#SVGXv8lpc2Y)">
                          <path
                            fill="currentColor"
                            fill-rule="evenodd"
                            d="M17.415 14.382c-.298-.149-1.759-.867-2.031-.967s-.47-.148-.669.15c-.198.297-.767.966-.94 1.164c-.174.199-.347.223-.644.075c-.297-.15-1.255-.463-2.39-1.475c-.883-.788-1.48-1.761-1.653-2.059c-.173-.297-.019-.458.13-.606c.134-.133.297-.347.446-.52s.198-.298.297-.497c.1-.198.05-.371-.025-.52c-.074-.149-.668-1.612-.916-2.207c-.241-.579-.486-.5-.668-.51c-.174-.008-.372-.01-.57-.01s-.52.074-.792.372c-.273.297-1.04 1.016-1.04 2.479c0 1.462 1.064 2.875 1.213 3.074s2.095 3.2 5.076 4.487c.71.306 1.263.489 1.694.625c.712.227 1.36.195 1.872.118c.57-.085 1.758-.719 2.006-1.413s.247-1.289.173-1.413s-.272-.198-.57-.347m-5.422 7.403h-.004a9.87 9.87 0 0 1-5.032-1.378l-.36-.214l-3.742.982l.999-3.648l-.235-.374a9.86 9.86 0 0 1-1.511-5.26c.002-5.45 4.436-9.884 9.889-9.884a9.8 9.8 0 0 1 6.988 2.899a9.82 9.82 0 0 1 2.892 6.992c-.002 5.45-4.436 9.885-9.884 9.885m8.412-18.297A11.82 11.82 0 0 0 11.992 0C5.438 0 .102 5.335.1 11.892a11.86 11.86 0 0 0 1.587 5.945L0 24l6.304-1.654a11.9 11.9 0 0 0 5.684 1.448h.005c6.554 0 11.89-5.335 11.892-11.893a11.82 11.82 0 0 0-3.48-8.413"
                            clip-rule="evenodd"
                          />
                        </g>
                        <defs>
                          <clipPath id="SVGXv8lpc2Y">
                            <path fill="#fff" d="M0 0h24v24H0z" />
                          </clipPath>
                        </defs>
                      </g>
                    </svg>
                  </a>
                )}
                {appointment.customerEmail && (
                  <a
                    href={`mailto:${appointment.customerEmail}`}
                    className="inline-flex items-center justify-center size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
                    title="Enviar correo"
                  >
                    <Mail className="size-4" />
                  </a>
                )}
                {appointment.customerPhone && (
                  <a
                    href={`tel:${appointment.customerPhone}`}
                    className="inline-flex items-center justify-center size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
                    title="Llamar"
                  >
                    <Phone className="size-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Grilla de Detalles Operativos */}
          <div className="grid gap-3">
            {/* Responsable asignado */}
            <div className="pt-4 space-y-2">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <UserCheck className="size-4 text-primary" />
                <span className="font-medium">Responsable / Especialista</span>
              </div>
              <div className="flex items-center gap-2 pt-0.5 min-w-0">
                <div className="size-6 rounded-full bg-muted text-foreground font-medium flex items-center justify-center text-xs shrink-0">
                  {appointment.responsibleName
                    ? appointment.responsibleName[0]
                    : "?"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {appointment.responsibleName ?? "Por asignar"}
                  </p>
                  {/* <p className="text-2xs text-muted-foreground truncate">
                    {responsible?.role ?? "Especialista"}
                  </p> */}
                </div>
              </div>
            </div>

            {/* Ubicación / Sede */}
            <div className="pt-4 border-t border-border flex items-center gap-x-2">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                {appointment.modality === "online" ? (
                  <Globe className="size-4 text-primary" />
                ) : appointment.modality === "domicilio" ? (
                  <Home className="size-4 text-primary" />
                ) : (
                  <MapPin className="size-4 text-primary" />
                )}
                <span className="font-medium">Lugar de atención:</span>
              </div>
              <p className="text-sm font-medium text-foreground truncate">
                {appointment.locationName ??
                  appointment.address ??
                  (appointment.modality === "online"
                    ? "Videollamada en línea"
                    : "Sede central")}
              </p>
              {appointment.address && appointment.locationName && (
                <p className="text-sm text-muted-foreground truncate">
                  {appointment.address}
                </p>
              )}
            </div>

            {/* Cobro y Estado Financiero */}
            <div className="py-3 border-t border-border space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Wallet className="size-4 text-primary" />
                  <span className="font-medium">Estado del pago</span>
                </div>
                <span
                  className={cn(
                    "text-[13px] font-medium px-2.5 py-2 leading-none rounded-lg",
                    isPaid
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : isPartial
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        : "bg-muted text-muted-foreground",
                  )}
                >
                  {appointmentPaymentLabel(appointment.paymentStatus)}
                </span>
              </div>

              <div className="flex items-baseline justify-between gap-2">
                <div className="text-sm font-medium text-foreground">
                  <span>{agendaMoney(appointment.paidAmount)}</span>
                  <span className="text-muted-foreground text-sm">
                    {" "}
                    de {agendaMoney(appointment.price)}
                  </span>
                </div>
                <span className="text-sm font-mono text-muted-foreground">
                  {paymentPercent}% abonado
                </span>
              </div>

              {/* Barra de progreso de pago */}
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    isPaid
                      ? "bg-emerald-500"
                      : isPartial
                        ? "bg-amber-500"
                        : "bg-muted-foreground/30",
                  )}
                  style={{ width: `${paymentPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Notas o Instrucciones de la cita */}
          {appointment.notes && (
            <div className="pt-4 border-t border-border space-y-2">
              <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                <AlignLeft className="size-3.5 text-primary" />
                <span>Notas e instrucciones</span>
              </div>
              <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                {appointment.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer con Botones de Acción */}
        <DialogFooter className="flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-border">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer gap-1.5 rounded-full"
                />
              }
            >
              <MoreHorizontal />
              Más acciones
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 font-heading">
              {onEdit && (
                <DropdownMenuItem
                  onClick={() => {
                    onOpenChange(false);
                    onEdit(appointment);
                  }}
                  className="cursor-pointer"
                >
                  <Pencil /> Editar o reprogramar
                </DropdownMenuItem>
              )}
              {onPayment && (
                <DropdownMenuItem
                  onClick={() => {
                    onOpenChange(false);
                    onPayment(appointment);
                  }}
                  className="cursor-pointer"
                >
                  <Wallet /> Gestionar pago
                </DropdownMenuItem>
              )}
              {onTransition && appointment.status !== "cancelada" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => setReasonAction("cancelada")}
                    className="cursor-pointer"
                  >
                    <XCircle /> Cancelar cita
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => setReasonAction("no_asistio")}
                    className="cursor-pointer"
                  >
                    <UserX /> Marcar no asistencia
                  </DropdownMenuItem>
                </>
              )}
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    disabled={!canDelete}
                    onClick={() => setDeleteOpen(true)}
                    className="cursor-pointer"
                  >
                    <Trash2 /> Eliminar registro
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              onClick={copySummary}
              variant="outline"
              title="Copiar resumen de la cita"
              className="rounded-full cursor-pointer"
            >
              {copiedSummary ? (
                <BadgeCheck className="text-emerald-500" />
              ) : (
                <Share2 />
              )}
              Compartir
            </Button>
            {nextAction && onTransition && (
              <Button
                type="button"
                onClick={() => onTransition(appointment, nextAction.status)}
                className="rounded-full cursor-pointer"
              >
                <nextAction.icon />
                {nextAction.label}
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-full cursor-pointer"
            >
              Cerrar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <AppointmentReasonDialog
      open={Boolean(reasonAction)}
      onOpenChange={(nextOpen) => !nextOpen && setReasonAction(null)}
      title={
        reasonAction === "cancelada"
          ? "Cancelar cita"
          : "Registrar no asistencia"
      }
      description="La cita se conservará y el motivo quedará visible en su historial."
      confirmLabel={
        reasonAction === "cancelada" ? "Cancelar cita" : "Registrar"
      }
      onConfirm={(reason) => {
        if (!reasonAction) return;
        onTransition?.(appointment, reasonAction, reason);
        setReasonAction(null);
        onOpenChange(false);
      }}
    />

    <ConfirmDialog
      open={deleteOpen}
      onOpenChange={setDeleteOpen}
      title="Eliminar registro"
      description={
        canDelete
          ? `${appointment.number} se eliminará del prototipo. Usa cancelar si necesitas conservar trazabilidad.`
          : "No se puede eliminar una cita iniciada, completada o con pagos. Cancélala para conservar la trazabilidad."
      }
      confirmLabel="Eliminar"
      onConfirm={() => {
        if (!canDelete) return;
        onDelete?.(appointment);
        setDeleteOpen(false);
        onOpenChange(false);
      }}
    />
  </>
  );
}
