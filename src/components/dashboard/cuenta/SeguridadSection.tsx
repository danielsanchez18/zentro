"use client";

import { useState } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import { ChangePasswordDialog } from "@/components/dashboard/cuenta/ChangePasswordDialog";
import { AccesoSection } from "@/components/dashboard/cuenta/AccesoSection";
import { SettingsBlock, SettingsRow, btnSecondary } from "@/components/dashboard/cuenta/ui";

/** Seguridad: contraseña, métodos de inicio de sesión y 2FA. */
export const SeguridadSection = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-2">
      <SettingsBlock title="Contraseña y verificación" description="Protege el acceso a tu cuenta personal.">
        <div className="space-y-2">
          <SettingsRow
            icon={Lock}
            label="Contraseña"
            action={
              <button type="button" className={btnSecondary} onClick={() => setDialogOpen(true)}>
                Cambiar
              </button>
            }
          >
            Usa al menos 8 caracteres.
          </SettingsRow>
          <SettingsRow
            icon={ShieldCheck}
            label="Verificación en dos pasos (2FA)"
            action={
              <button type="button" className={btnSecondary} disabled>
                Próximamente
              </button>
            }
          >
            Una capa extra de seguridad con una app de autenticación.
          </SettingsRow>
        </div>
      </SettingsBlock>

      <AccesoSection />

      <ChangePasswordDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
};
