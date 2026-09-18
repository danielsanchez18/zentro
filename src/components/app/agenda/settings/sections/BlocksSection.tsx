"use client";

import React, { useState } from "react";
import { CalendarOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useAgendaSettingsStore } from "@/stores/agenda-settings-store";
import { AgendaSettingsSection } from "../shared/AgendaSettingsSection";
import { CreateBlockDialog } from "./CreateBlockDialog";

export function BlocksSection() {
  const blocks = useAgendaSettingsStore((state) => state.blocks);
  const removeBlock = useAgendaSettingsStore((state) => state.removeBlock);

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="space-y-6">
      <AgendaSettingsSection
        title="Bloqueos y excepciones de calendario"
        actions={
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsCreateOpen(true)}
          >
            <span>Nuevo bloqueo</span>
          </Button>
        }
      >
        <div className="space-y-5">
          {/* Grilla de Tarjetas de Bloqueos o EmptyState */}
          {blocks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border">
              <EmptyState
                icon={CalendarOff}
                title="Sin bloqueos registrados"
                description="Agrega feriados o fechas de mantenimiento para prevenir agendamientos en esos días."
                actionLabel="Agregar primer bloqueo"
                onAction={() => setIsCreateOpen(true)}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {blocks.map((b) => (
                <div
                  key={b.id}
                  className="flex flex-col justify-between rounded-lg border border-border bg-card p-4 transition-all"
                >
                  {/* Cabecera de la Tarjeta */}
                  <div className="min-w-0">
                    <p className="text-sm font-medium font-heading capitalize text-foreground truncate">
                      {new Date(`${b.date}T12:00:00`).toLocaleDateString(
                        "es-PE",
                        {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </p>
                    <p
                      className="text-muted-foreground text-sm font-heading truncate mt-0.5"
                      title={b.reason}
                    >
                      {b.reason}
                    </p>
                  </div>

                  {/* Footer de la Tarjeta con Alcance y Acción de Eliminar */}
                  <div className="mt-5 flex items-center justify-between pt-3 border-t border-border/60">
                    <span className="text-sm text-muted-foreground font-heading">
                      Jornada completa
                    </span>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBlock(b.id)}
                      className="size-7 rounded-md text-muted-foreground hover:text-destructive cursor-pointer"
                      title="Eliminar bloqueo"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </AgendaSettingsSection>

      {/* Dialog para Nuevo Bloqueo */}
      <CreateBlockDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </div>
  );
}
