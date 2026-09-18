"use client";

import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toastMsg } from "@/components/ui/toast-message";
import { cn } from "@/lib/utils";
import { useAgendaSettingsStore } from "@/stores/agenda-settings-store";
import { AgendaSettingsSection } from "../shared/AgendaSettingsSection";
import { TimeInputSelect } from "../shared/TimeInputSelect";

export function ScheduleSection() {
  const days = useAgendaSettingsStore((state) => state.days);
  const updateDay = useAgendaSettingsStore((state) => state.updateDay);
  const copyScheduleToWorkdays = useAgendaSettingsStore(
    (state) => state.copyScheduleToWorkdays,
  );

  const handleCopySchedule = () => {
    copyScheduleToWorkdays("monday");
    toastMsg.success(
      "Horario replicado",
      "Se copió el horario del lunes a los días laborales (mar - vie).",
    );
  };

  const calculateHours = (from: string, to: string) => {
    const [h1, m1] = from.split(":").map(Number);
    const [h2, m2] = to.split(":").map(Number);
    const diffMin = h2 * 60 + m2 - (h1 * 60 + m1);
    if (diffMin <= 0) return "0 hrs";
    const hours = Math.floor(diffMin / 60);
    const mins = diffMin % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours} hrs`;
  };

  return (
    <div className="space-y-6">
      <AgendaSettingsSection
        title="Disponibilidad semanal"
        actions={
          <Button type="button" variant="outline" onClick={handleCopySchedule}>
            <span>Copiar lunes a días laborales</span>
          </Button>
        }
      >
        {/* Grilla de tarjetas para los 7 días */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {days.map((day) => {
            const duration = day.enabled
              ? calculateHours(day.from, day.to)
              : null;

            return (
              <div
                key={day.id}
                className={cn(
                  "flex flex-col justify-between rounded-lg border p-4 transition-all",
                  day.enabled
                    ? "border-border bg-card"
                    : "bg-muted/15 opacity-65",
                )}
              >
                {/* Cabecera de la Tarjeta de Día */}
                <div className="flex justify-between gap-2">
                  <div>
                    <p
                      className={cn(
                        "text-sm font-medium font-heading",
                        day.enabled
                          ? "text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {day.label}
                    </p>
                    {day.enabled ? (
                      <p className="text-muted-foreground text-sm font-heading">
                        {duration} de jornada
                      </p>
                    ) : (
                      <p className="text-muted-foreground/75 text-sm font-heading">
                        No laborable / Cerrado
                      </p>
                    )}
                  </div>

                  <Switch
                    checked={day.enabled}
                    onCheckedChange={(checked) =>
                      updateDay(day.id, { enabled: checked })
                    }
                  />
                </div>

                {/* Inputs de Horario con TimeInputSelect o Estado Cerrado */}
                <div className="mt-5">
                  {day.enabled ? (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-y-1">
                        <span className="text-sm text-muted-foreground font-medium block">
                          Apertura
                        </span>
                        <TimeInputSelect
                          value={day.from}
                          onChange={(val) => updateDay(day.id, { from: val })}
                        />
                      </div>

                      <div className="flex flex-col gap-y-1">
                        <span className="text-sm text-muted-foreground font-medium block">
                          Cierre
                        </span>
                        <TimeInputSelect
                          value={day.to}
                          onChange={(val) => updateDay(day.id, { to: val })}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-2 rounded-lg bg-muted/20 border border-dashed border-border/50">
                      <span className="text-sm text-muted-foreground font-medium">
                        Día inactivo
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </AgendaSettingsSection>
    </div>
  );
}
