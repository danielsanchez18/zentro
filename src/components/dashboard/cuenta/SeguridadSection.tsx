"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { HubStatusChip } from "@/components/dashboard/shared/HubStatusChip";
import { toastMsg } from "@/components/ui/toast-message";
import {
  DisableTwoFactorDialog,
  EnableTwoFactorDialog,
  RecoveryCodesDialog,
} from "@/components/dashboard/cuenta/TwoFactorDialogs";
import { NoPasswordBanner } from "@/components/dashboard/shared/NoPasswordBanner";
import { ChangePasswordDialog } from "@/components/dashboard/cuenta/ChangePasswordDialog";
import { AccesoSection } from "@/components/dashboard/cuenta/AccesoSection";
import { SettingsBlock, SettingsRow, btnPrimary, btnSecondary, errorMessage } from "@/components/dashboard/cuenta/ui";
import { formatRelative } from "@/lib/format/dates";
import { getTwoFactorStatus } from "@/lib/services/account.service";
import type { AccountProfile, TwoFactorStatus } from "@/lib/services/account.service";

/** Seguridad: contraseña, métodos de inicio de sesión y 2FA. */
export const SeguridadSection = ({ profile }: { profile: AccountProfile }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [twoFactor, setTwoFactor] = useState<TwoFactorStatus | null>(null);
  const [twoFactorDialog, setTwoFactorDialog] = useState<"enable" | "disable" | "codes" | null>(null);

  const loadTwoFactor = useCallback(() => {
    getTwoFactorStatus()
      .then(setTwoFactor)
      .catch((error) => toastMsg.error("No se pudo cargar la verificación en dos pasos", errorMessage(error)));
  }, []);

  useEffect(loadTwoFactor, [loadTwoFactor]);

  const closeTwoFactorDialog = (open: boolean) => {
    if (!open) setTwoFactorDialog(null);
  };

  return (
    <div className="space-y-2">
      <NoPasswordBanner dismissible={false} />
      <SettingsBlock title="Contraseña y verificación" description="Protege el acceso a tu cuenta personal.">
        <div className="space-y-2">
          <SettingsRow
            icon={Lock}
            label="Contraseña"
            action={
              <button
                type="button"
                className={profile.hasPassword ? btnSecondary : btnPrimary}
                onClick={() => setDialogOpen(true)}
              >
                {profile.hasPassword ? "Cambiar" : "Crear contraseña"}
              </button>
            }
          >
            {profile.hasPassword
              ? `Actualizada ${profile.passwordSetAt ? formatRelative(profile.passwordSetAt) : "—"}. Al cambiarla se cierran tus otras sesiones.`
              : "Aún no tienes contraseña: hoy solo entras con Google."}
          </SettingsRow>
          <SettingsRow
            icon={ShieldCheck}
            label="Verificación en dos pasos (2FA)"
            action={
              twoFactor === null ? (
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              ) : twoFactor.enabled ? (
                <>
                  <HubStatusChip tone="success" label="Activada" />
                  <button type="button" className={btnSecondary} onClick={() => setTwoFactorDialog("disable")}>
                    Desactivar
                  </button>
                </>
              ) : (
                <button type="button" className={btnPrimary} onClick={() => setTwoFactorDialog("enable")}>
                  Activar
                </button>
              )
            }
            footer={
              twoFactor?.enabled && (
                <button type="button" className={btnSecondary} onClick={() => setTwoFactorDialog("codes")}>
                  Generar códigos de respaldo nuevos
                </button>
              )
            }
          >
            {twoFactor?.enabled
              ? `Te pedimos un código de tu app al iniciar sesión. Te quedan ${twoFactor.recoveryCodesLeft} códigos de respaldo.`
              : "Una capa extra de seguridad: al iniciar sesión te pediremos un código de tu app autenticadora."}
          </SettingsRow>
        </div>
      </SettingsBlock>

      <AccesoSection hasPassword={profile.hasPassword} />

      <ChangePasswordDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        hasPassword={profile.hasPassword}
      />

      <EnableTwoFactorDialog
        open={twoFactorDialog === "enable"}
        onOpenChange={closeTwoFactorDialog}
        onDone={() => {
          loadTwoFactor();
          toastMsg.success("Verificación en dos pasos activada");
        }}
      />
      <DisableTwoFactorDialog
        open={twoFactorDialog === "disable"}
        onOpenChange={closeTwoFactorDialog}
        hasPassword={profile.hasPassword}
        onDone={() => {
          loadTwoFactor();
          toastMsg.success("Verificación en dos pasos desactivada");
        }}
      />
      <RecoveryCodesDialog open={twoFactorDialog === "codes"} onOpenChange={closeTwoFactorDialog} onDone={loadTwoFactor} />
    </div>
  );
};
