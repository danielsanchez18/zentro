"use client";

import React from "react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useAgendaSettingsStore } from "@/stores/agenda-settings-store";
import { AgendaSettingsSection } from "../shared/AgendaSettingsSection";

const DURATION_OPTIONS = [
  { value: 15, label: "15 min" },
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min (Estándar)" },
  { value: 60, label: "1 hora" },
  { value: 90, label: "1h 30m" },
];

const BUFFER_OPTIONS = [
  { value: 0, label: "Sin descanso" },
  { value: 5, label: "5 min" },
  { value: 10, label: "10 min" },
  { value: 15, label: "15 min" },
  { value: 30, label: "30 min" },
];

const ADVANCE_OPTIONS = [
  { value: 0, label: "Inmediato" },
  { value: 1, label: "1 hora" },
  { value: 2, label: "2 horas" },
  { value: 6, label: "6 horas" },
  { value: 24, label: "24 horas" },
];

export function GeneralParametersSection() {
  const general = useAgendaSettingsStore((state) => state.general);
  const updateGeneral = useAgendaSettingsStore((state) => state.updateGeneral);

  return (
    <div className="space-y-6">
      {/* Tiempos y Reglas de Reserva */}
      <AgendaSettingsSection title="Reglas de reserva y tiempos">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Card: Duración predeterminada */}
          <div className="flex flex-col justify-between rounded-lg border border-border bg-card p-4 transition-all">
            <div>
              <p className="text-sm font-medium font-heading text-foreground">
                Duración de citas
              </p>
              <p className="text-muted-foreground text-sm font-heading mt-0.5">
                Tiempo que se asignará automáticamente a las reservas.
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {DURATION_OPTIONS.map((opt) => {
                const isSelected = general.defaultDurationMin === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      updateGeneral({ defaultDurationMin: opt.value })
                    }
                    className={cn(
                      "cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground font-semibold"
                        : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card: Tiempo de descanso (Buffer) */}
          <div className="flex flex-col justify-between rounded-lg border border-border bg-card p-4 transition-all">
            <div>
              <p className="text-sm font-medium font-heading text-foreground">
                Tiempo de descanso (Buffer)
              </p>
              <p className="text-muted-foreground text-sm font-heading mt-0.5">
                Margen de preparación o limpieza entre turnos consecutivos.
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {BUFFER_OPTIONS.map((opt) => {
                const isSelected = general.bufferBetweenMin === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      updateGeneral({ bufferBetweenMin: opt.value })
                    }
                    className={cn(
                      "cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground font-semibold"
                        : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card: Antelación mínima de reserva */}
          <div className="flex flex-col justify-between rounded-lg border border-border bg-card p-4 transition-all">
            <div>
              <p className="text-sm font-medium font-heading text-foreground">
                Antelación mínima para agendar
              </p>
              <p className="text-muted-foreground text-sm font-heading mt-0.5">
                Mínimo de anticipación requerida para programar una cita.
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {ADVANCE_OPTIONS.map((opt) => {
                const isSelected = general.minAdvanceBookingHours === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      updateGeneral({ minAdvanceBookingHours: opt.value })
                    }
                    className={cn(
                      "cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground font-semibold"
                        : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card: Zona horaria */}
          <div className="flex flex-col justify-between rounded-lg border border-border bg-card p-4 transition-all">
            <div>
              <p className="text-sm font-medium font-heading text-foreground">
                Zona horaria activa
              </p>
              <p className="text-muted-foreground text-sm font-heading mt-0.5">
                Horario oficial que rige la disponibilidad y calendario de la
                sucursal.
              </p>
            </div>

            <div className="mt-5">
              <span className="inline-flex items-center rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-sm font-medium text-foreground">
                {general.timezone}
              </span>
            </div>
          </div>
        </div>
      </AgendaSettingsSection>

      {/* Notificaciones */}
      <AgendaSettingsSection title="Notificaciones automáticas">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Card: WhatsApp */}
          <div
            className={cn(
              "flex flex-col justify-between rounded-lg border p-4 transition-all",
              general.autoNotifyWhatsapp
                ? "border-border bg-card"
                : "bg-muted/15 opacity-65",
            )}
          >
            <div className="flex justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-medium font-heading text-foreground">
                  Confirmaciones por WhatsApp
                </p>
                <p className="text-muted-foreground text-sm font-heading mt-0.5">
                  Enviar mensajes de confirmación y recordatorios automáticos al
                  agendar.
                </p>
              </div>

              <Switch
                checked={general.autoNotifyWhatsapp}
                onCheckedChange={(checked) =>
                  updateGeneral({ autoNotifyWhatsapp: checked })
                }
              />
            </div>

            <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between">
              <span className="text-sm text-muted-foreground font-heading">
                {general.autoNotifyWhatsapp
                  ? "Activado por defecto"
                  : "Desactivado"}
              </span>
            </div>
          </div>

          {/* Card: Correo Electrónico */}
          <div
            className={cn(
              "flex flex-col justify-between rounded-lg border p-4 transition-all",
              general.autoNotifyEmail
                ? "border-border bg-card"
                : "bg-muted/15 opacity-65",
            )}
          >
            <div className="flex justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-medium font-heading text-foreground">
                  Confirmaciones por correo electrónico
                </p>
                <p className="text-muted-foreground text-sm font-heading mt-0.5">
                  Enviar comprobante y detalles de cita a la casilla del
                  cliente.
                </p>
              </div>

              <Switch
                checked={general.autoNotifyEmail}
                onCheckedChange={(checked) =>
                  updateGeneral({ autoNotifyEmail: checked })
                }
              />
            </div>

            <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between">
              <span className="text-sm text-muted-foreground font-heading">
                {general.autoNotifyEmail
                  ? "Activado por defecto"
                  : "Desactivado"}
              </span>
            </div>
          </div>
        </div>
      </AgendaSettingsSection>
    </div>
  );
}
