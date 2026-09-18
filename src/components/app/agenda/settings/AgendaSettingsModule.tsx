"use client";

import React, { useState } from "react";
import { Toast } from "@/components/app/shared/Toast";
import { Button } from "@/components/ui/button";
import { toastMsg } from "@/components/ui/toast-message";
import { useAgendaSettingsStore } from "@/stores/agenda-settings-store";
import { AgendaSettingsHeader } from "./shared/AgendaSettingsHeader";
import {
  AgendaSettingsNav,
  type AgendaSettingsTab,
} from "./shared/AgendaSettingsNav";
import { BlocksSection } from "./sections/BlocksSection";
import { GeneralParametersSection } from "./sections/GeneralParametersSection";
import { ResourcesSection } from "./sections/ResourcesSection";
import { ScheduleSection } from "./sections/ScheduleSection";

interface AgendaSettingsModuleProps {
  slug: string;
}

export function AgendaSettingsModule({ slug }: AgendaSettingsModuleProps) {
  const [activeTab, setActiveTab] = useState<AgendaSettingsTab>("schedule");
  const resetToDefaults = useAgendaSettingsStore(
    (state) => state.resetToDefaults,
  );

  const handleReset = () => {
    resetToDefaults();
    toastMsg.info(
      "Valores restablecidos",
      "Se restablecieron los parámetros iniciales de agenda.",
    );
  };

  const handleSave = () => {
    toastMsg.success(
      "Configuración guardada",
      "Se actualizaron la disponibilidad, recursos y parámetros de la agenda.",
    );
  };

  return (
    <div className="w-full space-y-7 px-5 py-7 md:px-7 xl:px-10">
      {/* Encabezado estándar de módulo */}
      <AgendaSettingsHeader slug={slug} />

      {/* Subnavegación idéntica a InventoryNav */}
      <AgendaSettingsNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Secciones de configuración */}
      <div>
        {activeTab === "schedule" && <ScheduleSection />}
        {activeTab === "resources" && <ResourcesSection />}
        {activeTab === "blocks" && <BlocksSection />}
        {activeTab === "general" && <GeneralParametersSection />}
      </div>

      {/* Barra de acción flotante Toast idéntica al patrón de formularios de inventario */}
      <div className="sticky bottom-5 z-40 mx-auto mt-7 w-fit">
        <Toast>
          <Button
            type="button"
            variant="link"
            onClick={handleReset}
            className="px-3 text-white cursor-pointer"
          >
            Restablecer
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleSave}
            className="px-3 rounded-full cursor-pointer"
          >
            Guardar cambios
          </Button>
        </Toast>
      </div>
    </div>
  );
}
