"use client";

import React, { useState } from "react";
import { Layers, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useAgendaSettingsStore } from "@/stores/agenda-settings-store";
import { AgendaSettingsSection } from "../shared/AgendaSettingsSection";
import { CreateResourceDialog } from "./CreateResourceDialog";

const KIND_LABELS: Record<string, string> = {
  cabina: "Cabina",
  sala: "Sala de atención",
  silla: "Silla / Sillón",
  equipo: "Equipo / Aparatología",
};

export function ResourcesSection() {
  const resources = useAgendaSettingsStore((state) => state.resources);
  const toggleResource = useAgendaSettingsStore(
    (state) => state.toggleResource,
  );
  const removeResource = useAgendaSettingsStore(
    (state) => state.removeResource,
  );

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="space-y-6">
      <AgendaSettingsSection
        title="Recursos reservables"
        actions={
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsCreateOpen(true)}
          >
            <span>Nuevo recurso</span>
          </Button>
        }
      >
        <div className="space-y-5">
          {/* Grilla de Tarjetas de Recursos o EmptyState */}
          {resources.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border">
              <EmptyState
                icon={Layers}
                title="Sin recursos configurados"
                description="Agrega salas, cabinas o equipamiento que utilicen tus servicios."
                actionLabel="Agregar primer recurso"
                onAction={() => setIsCreateOpen(true)}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {resources.map((res) => {
                const isActive = res.status === "activo";
                return (
                  <div
                    key={res.id}
                    className={cn(
                      "flex flex-col justify-between rounded-lg border p-4 transition-all",
                      isActive
                        ? "border-border bg-card"
                        : "bg-muted/15 opacity-65",
                    )}
                  >
                    {/* Cabecera de la Tarjeta */}
                    <div className="flex justify-between gap-2">
                      <div className="min-w-0">
                        <p
                          className={cn(
                            "text-sm font-medium font-heading truncate",
                            isActive
                              ? "text-foreground"
                              : "text-muted-foreground",
                          )}
                          title={res.name}
                        >
                          {res.name}
                        </p>
                        <p className="text-muted-foreground text-sm font-heading">
                          {KIND_LABELS[res.kind] ?? res.kind}
                        </p>
                      </div>

                      <Switch
                        checked={isActive}
                        onCheckedChange={(checked) =>
                          toggleResource(res.id, checked)
                        }
                      />
                    </div>

                    {/* Footer de la Tarjeta con Estado y Acción de Eliminar */}
                    <div className="mt-5 flex items-center justify-between pt-3 border-t border-border/60">
                      <span className="text-sm text-muted-foreground font-heading">
                        {isActive ? "Disponible" : "Inactivo"}
                      </span>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeResource(res.id)}
                        className="size-7 rounded-md text-muted-foreground hover:text-destructive cursor-pointer"
                        title="Eliminar recurso"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </AgendaSettingsSection>

      {/* Dialog para Nuevo Recurso */}
      <CreateResourceDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </div>
  );
}
