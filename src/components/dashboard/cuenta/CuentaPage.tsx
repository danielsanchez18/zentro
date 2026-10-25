"use client";

import { useState } from "react";
import { Bell, LogOut, MonitorSmartphone, ShieldCheck, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLogout } from "@/components/dashboard/shared/HubOverlays";
import { useDashboardStore } from "@/stores/dashboard-store";
import { UserAvatar } from "@/components/dashboard/shared/UserAvatar";
import { PerfilSection } from "@/components/dashboard/cuenta/PerfilSection";
import { SeguridadSection } from "@/components/dashboard/cuenta/SeguridadSection";
import { DispositivosSection } from "@/components/dashboard/cuenta/DispositivosSection";
import { NotificacionesSection } from "@/components/dashboard/cuenta/NotificacionesSection";
import { btnSecondary } from "@/components/dashboard/cuenta/ui";
import { hubTabs } from "@/components/dashboard/shared/styles";

/**
 * Mi cuenta — ordenada de lo más consultado a lo menos:
 * 1. Perfil (identidad y contacto)
 * 2. Seguridad (contraseña, 2FA y métodos de inicio de sesión)
 * 3. Dispositivos (sesiones activas)
 * 4. Notificaciones
 * Los pagos no viven aquí: son de cada organización y están en Suscripciones.
 */
const TABS = [
  { id: "perfil", label: "Perfil", icon: UserRound },
  { id: "seguridad", label: "Seguridad", icon: ShieldCheck },
  { id: "dispositivos", label: "Dispositivos", icon: MonitorSmartphone },
  { id: "notificaciones", label: "Notificaciones", icon: Bell },
] as const;

type TabId = (typeof TABS)[number]["id"];

export const CuentaPage = () => {
  const [activeTab, setActiveTab] = useState<TabId>("perfil");
  const user = useDashboardStore((state) => state.currentUser);
  const handleLogout = useLogout();

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3 rounded-sm bg-card px-4 py-3">
        <UserAvatar name={user.name} className="size-12" />
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-sans text-lg font-medium">{user.name}</h1>
          <p className="truncate text-sm text-muted-foreground">{user.email}</p>
        </div>
        <button type="button" onClick={handleLogout} className={cn(btnSecondary, "text-destructive")}>
          <LogOut className="size-4" />
          Cerrar sesión
        </button>
      </div>

      <div className="rounded-sm bg-card px-4 py-3">
        <div
          role="tablist"
          aria-label="Secciones de tu cuenta"
          className={hubTabs.list}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                hubTabs.tab,
                activeTab === tab.id
                  ? hubTabs.active
                  : hubTabs.idle,
              )}
            >
              <tab.icon className="size-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "perfil" && <PerfilSection />}
      {activeTab === "seguridad" && <SeguridadSection />}
      {activeTab === "dispositivos" && <DispositivosSection />}
      {activeTab === "notificaciones" && <NotificacionesSection />}
    </div>
  );
};
