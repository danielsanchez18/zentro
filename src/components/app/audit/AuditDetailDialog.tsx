"use client";

import { useState } from "react";
import {
  Calendar,
  Clock3,
  Copy,
  Check,
  MapPin,
  User,
  Layers,
  ShieldAlert,
  Tag,
  Fingerprint,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import { toastMsg } from "@/components/ui/toast-message";
import {
  auditTypeIcon,
  findAuditEventType,
  AUDIT_SEVERITY_LABELS,
  type AuditEvent,
} from "@/lib/mock/audit";
import { PERMISSION_MODULES } from "@/lib/mock/team";

interface AuditDetailDialogProps {
  event: AuditEvent | null;
  locationName: (locationId?: string | null) => string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

const formatTime = (isoStr: string) => {
  try {
    const d = new Date(isoStr);
    return d.toLocaleTimeString("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "";
  }
};

/**
 * Diálogo modal para inspeccionar en detalle un evento del registro de auditoría,
 * siguiendo el sistema de diseño y jerarquía visual del diálogo de Agenda.
 */
export const AuditDetailDialog = ({
  event,
  locationName,
  open,
  onOpenChange,
}: AuditDetailDialogProps) => {
  const [copied, setCopied] = useState(false);

  if (!event) return null;

  const TypeIcon = auditTypeIcon(event.type);
  const typeDef = findAuditEventType(event.type);
  const moduleLabel =
    PERMISSION_MODULES.find((m) => m.key === event.module)?.label ??
    event.module;
  const place = locationName(event.locationId);

  const handleCopyId = () => {
    navigator.clipboard.writeText(event.id);
    setCopied(true);
    toastMsg.success(
      "ID copiado",
      "El identificador del evento se copió al portapapeles.",
    );
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95dvh] flex flex-col sm:max-w-lg">
        {/* Cabecera estilizada con Estado, Código e Info de Módulo */}
        <DialogHeader className="pr-6">
          <StatusBadge
            status={event.severity === "sensitive" ? "warning" : "default"}
            label={AUDIT_SEVERITY_LABELS[event.severity]}
          />
          <div className="space-y-1 text-left pt-1">
            <DialogTitle className="text-lg font-medium font-heading text-foreground tracking-tight">
              {event.description}
            </DialogTitle>
            <div className="font-heading flex flex-wrap items-center gap-2 text-sm text-muted-foreground capitalize">
              <span>{formatFullDate(event.at)}</span>
              <span>·</span>
              <span className="normal-case font-medium text-foreground">
                {formatTime(event.at)}
              </span>
            </div>
          </div>
        </DialogHeader>

        {/* Cuerpo del Diálogo */}
        <div className="overflow-y-auto font-heading space-y-4 pt-1">
          {/* Tarjeta del Actor Principal (estilo participante de Agenda) */}
          <div className="flex flex-col gap-y-2 border-b border-border pb-3">
            <span className="text-sm font-medium text-muted-foreground">
              Actor del evento
            </span>
            <div className="flex items-center justify-between gap-3 py-1">
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-10 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-sm shrink-0 border border-primary/20">
                  {event.actor[0]?.toUpperCase() ?? "U"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {event.actor}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {event.actorRole ?? "Usuario registrado"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Grilla de Detalles Operativos */}
          <div className="grid gap-3">
            {/* Tipo de acción */}
            <div className="pt-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <TypeIcon className="size-4" />
                <span>Tipo de evento:</span>
              </div>
              <p className="text-sm font-medium text-foreground">
                {typeDef.label}
              </p>
            </div>

            {/* Entidad afectada */}
            {event.target && (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Tag className="size-4" />
                  <span>Entidad afectada:</span>
                </div>
                <span className="font-mono text-[13px] bg-muted px-2.5 py-2 leading-none rounded-md text-foreground font-medium">
                  {event.target}
                </span>
              </div>
            )}

            {/* Módulo */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Layers className="size-4" />
                <span>Módulo del sistema:</span>
              </div>
              <p className="text-sm font-medium text-foreground">
                {moduleLabel}
              </p>
            </div>

            {/* Ubicación / Sede */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-4" />
                <span>Sede / Ubicación:</span>
              </div>
              <p className="text-sm font-medium text-foreground truncate">
                {place ?? "General / Todas las sedes"}
              </p>
            </div>

            {/* Identificador técnico con botón de copiado */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Fingerprint className="size-4" />
                <span>Identificador único:</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-sm uppercase text-muted-foreground select-all">
                  {event.id}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyId}
                  className="size-7 p-0 cursor-pointer text-muted-foreground hover:text-foreground"
                  title="Copiar ID"
                >
                  {copied ? (
                    <Check className="size-3.5 text-primary" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer con Botones de Acción */}
        <DialogFooter className="flex-col sm:flex-row sm:items-center justify-end gap-2 pt-3 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer rounded-full"
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
