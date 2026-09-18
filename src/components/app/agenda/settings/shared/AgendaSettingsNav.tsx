"use client";

import { cn } from "@/lib/utils";

export type AgendaSettingsTab = "schedule" | "resources" | "blocks" | "general";

interface AgendaSettingsNavProps {
  activeTab: AgendaSettingsTab;
  onTabChange: (tab: AgendaSettingsTab) => void;
}

const ITEMS: { id: AgendaSettingsTab; label: string }[] = [
  { id: "schedule", label: "Horario semanal" },
  { id: "resources", label: "Recursos reservables" },
  { id: "blocks", label: "Bloqueos y excepciones" },
  { id: "general", label: "Parámetros de reserva" },
];

export function AgendaSettingsNav({
  activeTab,
  onTabChange,
}: AgendaSettingsNavProps) {
  return (
    <nav
      aria-label="Secciones de configuración de agenda"
      className="flex gap-2 overflow-x-auto"
    >
      {ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onTabChange(item.id)}
          className={cn(
            "cursor-pointer whitespace-nowrap rounded-lg px-2.5 py-1.5 leading-none text-sm font-medium transition-colors",
            activeTab === item.id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground bg-muted/50",
          )}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
