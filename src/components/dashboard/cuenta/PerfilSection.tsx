"use client";

import { useState } from "react";
import { Mail, Phone, Upload, UserRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { VerifyEmailDialog } from "@/components/dashboard/cuenta/VerifyEmailDialog";
import { SettingsBlock, SettingsRow, btnPrimary, btnSecondary, chip } from "@/components/dashboard/cuenta/ui";
import { useDashboardStore } from "@/stores/dashboard-store";
import { cn } from "@/lib/utils";

export const PerfilSection = () => {
  const { currentUser, updateProfile, verifyEmail } = useDashboardStore();
  const [phone, setPhone] = useState(currentUser.phone ?? "");
  const [isEditing, setIsEditing] = useState(false);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const emailVerified = currentUser.emailVerifiedAt !== null;

  const handleCancelPhone = () => {
    setPhone(currentUser.phone ?? "");
    setIsEditing(false);
  };

  const handleSavePhone = () => {
    updateProfile({ phone: phone.trim() || null, avatarUrl: currentUser.avatarUrl });
    setIsEditing(false);
  };

  return (
    <SettingsBlock title="Información personal" description="Datos con los que te identificas en todas tus organizaciones.">
      <div className="space-y-2">
        <SettingsRow
          icon={UserRound}
          label="Foto de perfil"
          action={
            <button type="button" className={btnSecondary} title="Disponible al conectar el almacenamiento de archivos">
              <Upload className="size-4" />
              Subir foto
            </button>
          }
        >
          JPG o PNG, mínimo 200 × 200 px.
        </SettingsRow>

        <SettingsRow icon={UserRound} label="Nombre completo">
          {currentUser.name}
        </SettingsRow>

        <SettingsRow
          icon={Mail}
          label={
            <span className="flex flex-wrap items-center gap-2">
              Correo electrónico
              <span
                className={cn(
                  chip,
                  "h-6 px-2 text-[11px]",
                  emailVerified
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                    : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
                )}
              >
                {emailVerified ? "Verificado" : "Sin verificar"}
              </span>
            </span>
          }
          action={
            !emailVerified && (
              <button type="button" className={btnPrimary} onClick={() => setVerifyDialogOpen(true)}>
                Verificar
              </button>
            )
          }
        >
          {currentUser.email}
        </SettingsRow>

        <SettingsRow
          icon={Phone}
          label="Teléfono"
          action={
            isEditing ? (
              <>
                <button type="button" className={btnSecondary} onClick={handleCancelPhone}>
                  Cancelar
                </button>
                <button type="button" className={btnPrimary} onClick={handleSavePhone}>
                  Guardar
                </button>
              </>
            ) : (
              <button type="button" className={btnSecondary} onClick={() => setIsEditing(true)}>
                Editar
              </button>
            )
          }
        >
          {isEditing ? (
            <Input
              className="mt-1.5 h-9 w-full max-w-xs rounded-sm text-sm"
              placeholder="+51 999 999 999"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              autoFocus
            />
          ) : (
            phone || "Sin teléfono"
          )}
        </SettingsRow>
      </div>

      <VerifyEmailDialog
        open={verifyDialogOpen}
        onOpenChange={setVerifyDialogOpen}
        email={currentUser.email}
        onVerified={verifyEmail}
      />
    </SettingsBlock>
  );
};
