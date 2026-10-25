"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { KeyRound, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { hubButton } from "@/components/dashboard/shared/styles";
import { useAccountStore } from "@/stores/account-store";
import { useAuthStore } from "@/stores/auth-store";

const DISMISS_KEY = "zentro:no-password-banner";

const readDismissed = () => {
  try {
    return localStorage.getItem(DISMISS_KEY);
  } catch {
    return null; // Almacenamiento bloqueado: se muestra el aviso.
  }
};

/**
 * Aviso para cuentas creadas con Google que aún no tienen contraseña: si
 * pierden su cuenta de Google se quedan sin acceso. En el Hub se puede cerrar
 * (se recuerda en este navegador); en Seguridad (`dismissible={false}`) siempre se ve.
 */
export const NoPasswordBanner = ({ dismissible = true }: { dismissible?: boolean }) => {
  const { profile: loaded, loadProfile } = useAccountStore();
  const userId = useAuthStore((state) => state.user?.id);
  const [closedNow, setClosedNow] = useState(false);
  // Ignora un perfil de otra sesión (el store de cuenta no se limpia al cambiar de usuario).
  const profile = loaded && loaded.id === userId ? loaded : null;

  useEffect(() => {
    if (userId && !profile) loadProfile().catch(() => undefined);
  }, [userId, profile, loadProfile]);

  // El perfil solo existe en el cliente, así que leer localStorage aquí no rompe la hidratación.
  const dismissed = closedNow || (dismissible && profile !== null && readDismissed() === profile.id);

  if (!profile || profile.hasPassword || dismissed) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, profile.id);
    } catch {
      // Sin almacenamiento solo se oculta en esta visita.
    }
    setClosedNow(true);
  };

  return (
    <div className="flex flex-wrap items-start gap-3 rounded-sm border border-amber-500/30 bg-amber-500/10 px-4 py-3">
      <KeyRound className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="text-sm font-medium">Hoy solo entras con Google</p>
        <p className="text-sm text-muted-foreground">
          Crea una contraseña para no perder el acceso si pierdes tu cuenta de Google. Tu correo principal es{" "}
          <strong className="text-foreground">{profile.email}</strong>.
        </p>
        {dismissible && (
          <Link href="/dashboard/cuenta?tab=seguridad" className={cn(hubButton.primary, "mt-2 inline-flex")}>
            Crear contraseña
          </Link>
        )}
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={dismiss}
          aria-label="Cerrar aviso"
          className="rounded-sm p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
};
