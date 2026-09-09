"use client";

import { cn } from "@/lib/utils";
import { useDashboardStore } from "@/stores/dashboard-store";
import type { NotificationPreferenceKey } from "@/types/dashboard";

const PREFERENCE_COPY: Record<NotificationPreferenceKey, { label: string; description: string }> = {
  INVITATIONS: { label: "Invitaciones", description: "Cuando alguien te invite a una organización" },
  BILLING: { label: "Facturación y pagos", description: "Próximos cobros, facturas y cambios de plan" },
  RECOVERY: { label: "Recuperación", description: "Restablecimiento de contraseña y códigos de recuperación" },
  SECURITY: { label: "Seguridad", description: "Nuevos inicios de sesión y cambios de dispositivo" },
  PRODUCT_UPDATES: { label: "Novedades y marketing", description: "Nuevas funciones y avisos de producto" },
};

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}

const Switch = ({ checked, onChange, label, disabled = false }: SwitchProps) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
        checked ? "bg-primary" : "bg-muted-foreground/30",
        disabled && "cursor-not-allowed opacity-60",
      )}
    >
      <span
        className={cn(
          "inline-block size-3.5 rounded-full bg-background shadow transition-transform",
          checked ? "translate-x-4.5" : "translate-x-0.75",
        )}
      />
    </button>
  );
};

export const NotificacionesSection = () => {
  const { notificationPreferences: preferences, toggleEmailPreference } = useDashboardStore();

  return (
    <div className="w-full space-y-6">
      <div className="max-lg:pt-3 lg:pl-5">
        <h2 className="text-base font-medium font-sans">Notificaciones</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Elige qué avisos quieres recibir por correo.
        </p>

        <ul className="mt-5 divide-y divide-border">
          {preferences.map((pref) => (
            <li
              key={pref.key}
              className="flex items-center justify-between gap-3 py-5"
            >
              <div>
                <p className="text-sm font-medium">{PREFERENCE_COPY[pref.key].label}</p>
                <p className="text-sm text-muted-foreground">
                  {PREFERENCE_COPY[pref.key].description}
                </p>
              </div>
              <Switch
                checked={pref.emailEnabled}
                onChange={() => toggleEmailPreference(pref.key)}
                label={PREFERENCE_COPY[pref.key].label}
                disabled={pref.required}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
