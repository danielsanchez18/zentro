"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Bell, Loader2, LogOut, MonitorSmartphone, ShieldCheck, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLogout } from "@/components/dashboard/shared/HubOverlays";
import { useAuthStore } from "@/stores/auth-store";
import { UserAvatar } from "@/components/dashboard/shared/UserAvatar";
import { PerfilSection } from "@/components/dashboard/cuenta/PerfilSection";
import { SeguridadSection } from "@/components/dashboard/cuenta/SeguridadSection";
import { DispositivosSection } from "@/components/dashboard/cuenta/DispositivosSection";
import { NotificacionesSection } from "@/components/dashboard/cuenta/NotificacionesSection";
import { btnSecondary, errorMessage } from "@/components/dashboard/cuenta/ui";
import { toastMsg } from "@/components/ui/toast-message";
import { useAccountStore } from "@/stores/account-store";
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

/** Errores que devuelve el callback de Google al vincular (`?linkError=`). */
const LINK_ERRORS: Record<string, string> = {
  already_linked: "Esa cuenta de Google ya está vinculada a otro usuario de Zentro.",
  email_in_use: "El correo de esa cuenta de Google pertenece a otro usuario de Zentro. Elige la cuenta de Google que usas con este correo.",
  link_expired: "El enlace para vincular expiró. Vuelve a intentarlo.",
  email_missing: "Google no compartió tu correo.",
  email_unverified: "Tu correo de Google no está verificado.",
};

export const CuentaPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const linked = searchParams.get("linked");
  const linkError = searchParams.get("linkError");
  const [activeTab, setActiveTab] = useState<TabId>(
    linked || linkError || searchParams.get("tab") === "seguridad" ? "seguridad" : "perfil",
  );
  const user = useAuthStore((state) => state.user)!;
  const { profile, loadProfile } = useAccountStore();
  const handleLogout = useLogout();

  useEffect(() => {
    loadProfile().catch((error) => toastMsg.error("No se pudo cargar tu cuenta", errorMessage(error)));
  }, [loadProfile]);

  // Resultado de volver de Google tras "Conectar".
  useEffect(() => {
    if (!linked && !linkError) return;
    if (linked) toastMsg.success("Google conectado", "Ya puedes iniciar sesión con tu cuenta de Google.");
    if (linkError) toastMsg.error("No se pudo conectar Google", LINK_ERRORS[linkError] ?? "Inténtalo de nuevo.");
    router.replace("/dashboard/cuenta");
  }, [linked, linkError, router]);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3 rounded-sm bg-card px-4 py-3">
        <UserAvatar name={user.name} src={user.avatarUrl} className="size-12" />
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

      {!profile ? (
        <div className="flex justify-center rounded-sm bg-card py-10 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
        </div>
      ) : (
        <>
          {activeTab === "perfil" && <PerfilSection profile={profile} />}
          {activeTab === "seguridad" && <SeguridadSection profile={profile} />}
        </>
      )}
      {activeTab === "dispositivos" && <DispositivosSection />}
      {activeTab === "notificaciones" && <NotificacionesSection />}
    </div>
  );
};
