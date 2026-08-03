"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PerfilSection } from "@/components/dashboard/cuenta/PerfilSection";
import { SeguridadSection } from "@/components/dashboard/cuenta/SeguridadSection";
import { AccesoSection } from "@/components/dashboard/cuenta/AccesoSection";
import { NotificacionesSection } from "@/components/dashboard/cuenta/NotificacionesSection";
import { PagosSection } from "@/components/dashboard/cuenta/PagosSection";
import { LogoutDialog } from "@/components/dashboard/shared/LogoutDialog";
import { Bell, CreditCard, KeyRound, Lock, LogOut, User } from "lucide-react";

const TABS = [
  { id: "perfil", label: "Información Personal", icon: User },
  { id: "seguridad", label: "Seguridad", icon: Lock },
  { id: "acceso", label: "Acceso", icon: KeyRound },
  { id: "notificaciones", label: "Notificaciones", icon: Bell },
  { id: "pagos", label: "Pagos", icon: CreditCard },
] as const;

type TabId = (typeof TABS)[number]["id"];

// Base compartida. Las variantes conservan el estilo exacto de cada botón:
// - sidebar: full width + padding vertical mayor (w-full, py-2.5)
// - tabs (mobile): no wrap + padding compacto (text-nowrap, py-2)
const buttonBase =
  "flex items-center gap-x-2.5 font-medium text-sm rounded-lg px-3 py-2";

const getButtonClasses = (isActive: boolean, variant: "sidebar" | "tabs") => {
  if (variant === "sidebar") {
    return cn(
      buttonBase,
      "w-full px-4 py-2.5",
      isActive
        ? "bg-accent"
        : "text-muted-foreground hover:bg-accent hover:text-primary",
    );
  }

  return cn(
    buttonBase,
    "text-nowrap text-muted-foreground hover:bg-accent hover:text-primary",
    isActive && "bg-accent text-foreground",
  );
};

export const CuentaPage = () => {
  const [activeTab, setActiveTab] = useState<TabId>("perfil");
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row gap-5">
      {/* Sidebar Desktop */}
      <div className="lg:w-full max-w-xs flex flex-col gap-y-5 lg:pr-5 lg:border-r border-border">
        <h1 className="text-lg font-medium font-sans">Mi cuenta</h1>

        <div className="hidden lg:flex flex-col gap-y-0.5">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              aria-current={activeTab === tab.id ? "page" : undefined}
              onClick={() => setActiveTab(tab.id)}
              className={getButtonClasses(activeTab === tab.id, "sidebar")}
            >
              <tab.icon className="size-4" />
              <span className="text-sm font-medium font-sans">{tab.label}</span>
            </button>
          ))}

          <div className="pt-3 mt-3 border-t border-border">
            <button
              type="button"
              onClick={() => setLogoutOpen(true)}
              className="w-full px-4 py-2.5 text-sm rounded-lg text-muted-foreground hover:bg-accent hover:text-primary flex items-center gap-x-2.5 font-medium"
            >
              <LogOut className="size-4" />
              <span className="text-sm font-medium font-sans">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Mobile */}
      <div className="lg:hidden overflow-x-auto p-1.5 border border-border rounded-xl">
        <div
          role="tablist"
          aria-label="Secciones de tu cuenta"
          className="flex flex-nowrap gap-1 w-fit"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={getButtonClasses(activeTab === tab.id, "tabs")}
            >
              <tab.icon className="size-4" />
              <span className="text-sm font-medium font-sans">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {activeTab === "perfil" && <PerfilSection />}
      {activeTab === "seguridad" && <SeguridadSection />}
      {activeTab === "acceso" && <AccesoSection />}
      {activeTab === "notificaciones" && <NotificacionesSection />}
      {activeTab === "pagos" && <PagosSection />}

      <LogoutDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
    </div>
  );
};
