"use client";

import { useEffect, useState } from "react";
import { Loader2, Lock, TriangleAlert } from "lucide-react";
import { HubStatusChip } from "@/components/dashboard/shared/HubStatusChip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toastMsg } from "@/components/ui/toast-message";
import { useAccountStore } from "@/stores/account-store";
import { SettingsBlock, SettingsRow, errorMessage } from "@/components/dashboard/cuenta/ui";
import type { NotificationKey, NotificationPreference } from "@/lib/services/account.service";

const PREFERENCE_COPY: Record<NotificationKey, { label: string; description: string; offWarning?: string }> = {
  SECURITY: { label: "Seguridad", description: "Nuevos inicios de sesión, cambios de contraseña y verificación en dos pasos" },
  RECOVERY: { label: "Recuperación", description: "Códigos para restablecer tu contraseña" },
  INVITATIONS: { label: "Invitaciones", description: "Cuando te invitan a una organización (también aparecen en el Hub)" },
  BILLING: { label: "Facturación crítica", description: "Cobros rechazados y facturas emitidas de tus organizaciones" },
  BILLING_REMINDERS: {
    label: "Recordatorios de facturación",
    description: "Próximos cobros y fin del periodo de prueba",
    offWarning: "Podrías no enterarte de un cobro próximo o del fin de tu periodo de prueba.",
  },
  ACTIVITY_DIGEST: { label: "Resumen de actividad", description: "Un resumen semanal de tus organizaciones" },
  PRODUCT_UPDATES: { label: "Novedades y promociones", description: "Nuevas funciones, consejos y ofertas de Zentro" },
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
        checked ? "bg-hub-accent" : "bg-muted-foreground/30",
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
  const { preferences, loadPreferences, togglePreference } = useAccountStore();
  // `pendingOff` guarda el texto mientras el modal anima su cierre.
  const [pendingOff, setPendingOff] = useState<NotificationKey | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    loadPreferences().catch((error) => toastMsg.error("No se pudieron cargar tus preferencias", errorMessage(error)));
  }, [loadPreferences]);

  const save = (key: NotificationKey, enabled: boolean) => {
    togglePreference(key, enabled)
      .then(() =>
        toastMsg.success(enabled ? "Aviso activado" : "Aviso desactivado", PREFERENCE_COPY[key].label),
      )
      .catch((error) => toastMsg.error("No se pudo guardar", errorMessage(error)));
  };

  // Apagar un aviso sensible pide confirmación; todo lo demás se aplica al instante.
  const handleToggle = (pref: NotificationPreference, enabled: boolean) => {
    if (!enabled && pref.sensitive) {
      setPendingOff(pref.key);
      setConfirmOpen(true);
      return;
    }
    save(pref.key, enabled);
  };

  const required = preferences?.filter((pref) => pref.required) ?? [];
  const optional = preferences?.filter((pref) => !pref.required) ?? [];

  const renderRow = (pref: NotificationPreference) => (
    <li key={pref.key}>
      <SettingsRow
        label={PREFERENCE_COPY[pref.key].label}
        action={
          pref.required ? (
            <HubStatusChip tone="neutral" icon={Lock} label="Siempre activo" />
          ) : (
            <Switch
              checked={pref.emailEnabled}
              onChange={(checked) => handleToggle(pref, checked)}
              label={PREFERENCE_COPY[pref.key].label}
            />
          )
        }
      >
        {PREFERENCE_COPY[pref.key].description}
      </SettingsRow>
    </li>
  );

  return (
    <div className="space-y-2">
      {preferences === null ? (
        <SettingsBlock title="Notificaciones por correo">
          <div className="flex justify-center py-6 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
          </div>
        </SettingsBlock>
      ) : (
        <>
          <SettingsBlock
            title="Avisos opcionales"
            description="Elige qué más quieres recibir en tu correo."
          >
            <ul className="space-y-2">{optional.map(renderRow)}</ul>
          </SettingsBlock>
          <SettingsBlock
            title="Avisos obligatorios"
            description="Protegen tu cuenta y tus organizaciones, por eso siempre te los enviamos."
          >
            <ul className="space-y-2">{required.map(renderRow)}</ul>
          </SettingsBlock>
        </>
      )}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader className="sm:px-1">
            <DialogTitle className="font-sans">
              ¿Desactivar {pendingOff ? PREFERENCE_COPY[pendingOff].label.toLowerCase() : ""}?
            </DialogTitle>
            <DialogDescription>{pendingOff ? PREFERENCE_COPY[pendingOff].offWarning : ""}</DialogDescription>
          </DialogHeader>
          <div className="flex items-start gap-2 rounded-sm bg-amber-500/10 px-3 py-2 my-1 text-sm text-amber-700 dark:text-amber-400">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" />
            <span>Los cobros rechazados y las facturas te seguirán llegando.</span>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)} className="text-sm px-3 py-1.5 h-fit rounded-full">
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (pendingOff) save(pendingOff, false);
                setConfirmOpen(false);
              }}
              className="text-sm px-3 py-1.5 h-fit rounded-full"
            >
              Desactivar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
