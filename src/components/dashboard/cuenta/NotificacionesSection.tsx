"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Preference {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
}

// TODO(0.2): leer/guardar desde GET/PATCH /users/me/notifications
const DEFAULT_PREFERENCES: Preference[] = [
  {
    key: "invitations",
    label: "Invitaciones",
    description: "Cuando alguien te invite a una organización",
    enabled: true,
  },
  {
    key: "billing",
    label: "Facturación y pagos",
    description: "Próximos cobros, facturas y cambios de plan",
    enabled: true,
  },
  {
    key: "security",
    label: "Recuperación y seguridad",
    description: "Cambios de contraseña y nuevos inicios de sesión",
    enabled: true,
  },
  {
    key: "marketing",
    label: "Novedades y marketing",
    description: "Nuevas funciones y avisos de producto",
    enabled: false,
  },
];

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

const Switch = ({ checked, onChange, label }: SwitchProps) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
        checked ? "bg-primary" : "bg-muted-foreground/30",
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
  const [preferences, setPreferences] =
    useState<Preference[]>(DEFAULT_PREFERENCES);

  const toggle = (key: string) => {
    setPreferences((prev) =>
      prev.map((pref) =>
        pref.key === key ? { ...pref, enabled: !pref.enabled } : pref,
      ),
    );
  };

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
                <p className="text-sm font-medium">{pref.label}</p>
                <p className="text-sm text-muted-foreground">
                  {pref.description}
                </p>
              </div>
              <Switch
                checked={pref.enabled}
                onChange={() => toggle(pref.key)}
                label={pref.label}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
