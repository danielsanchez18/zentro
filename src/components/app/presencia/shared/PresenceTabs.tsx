"use client";

import { LayoutTemplate, ListTree, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PresenceTabId } from "../WebPresenceModule";

interface PresenceTabsProps {
  activeTab: PresenceTabId;
  onTabChange: (tab: PresenceTabId) => void;
}

const ITEMS: {
  id: PresenceTabId;
  label: string;
  icon: typeof LayoutTemplate;
}[] = [
  { id: "sitio", label: "Sitio", icon: LayoutTemplate },
  { id: "paginas", label: "Páginas", icon: ListTree },
  { id: "diseno", label: "Diseño", icon: SlidersHorizontal },
];

/** Mismo patrón de tabs que la configuración de agenda. */
export function PresenceTabs({ activeTab, onTabChange }: PresenceTabsProps) {
  return (
    <nav aria-label="Secciones del sitio web" className="flex gap-2 overflow-x-auto">
      {ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onTabChange(item.id)}
          className={cn(
            "flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 leading-none text-sm font-medium transition-colors",
            activeTab === item.id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground bg-muted/50",
          )}
        >
          <item.icon className="size-3.5" />
          {item.label}
        </button>
      ))}
    </nav>
  );
}