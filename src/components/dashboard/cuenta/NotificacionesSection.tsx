"use client";

import { cn } from "@/lib/utils";
import { useDashboardStore } from "@/stores/dashboard-store";
import { SettingsBlock, SettingsRow } from "@/components/dashboard/cuenta/ui";
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
        checked ? "bg-foreground" : "bg-muted-foreground/30",
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
    <SettingsBlock
      title="Notificaciones por correo"
      description="Elige qué avisos quieres recibir. Los de recuperación y seguridad son obligatorios."
    >
      <ul className="space-y-2">
        {preferences.map((pref) => (
          <li key={pref.key}>
            <SettingsRow
              label={PREFERENCE_COPY[pref.key].label}
              action={
                <Switch
                  checked={pref.emailEnabled}
                  onChange={() => toggleEmailPreference(pref.key)}
                  label={PREFERENCE_COPY[pref.key].label}
                  disabled={pref.required}
                />
              }
            >
              {PREFERENCE_COPY[pref.key].description}
            </SettingsRow>
          </li>
        ))}
      </ul>
    </SettingsBlock>
  );
};
