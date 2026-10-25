"use client";

import { useRef, useState } from "react";
import { Loader2, Mail, Phone, Trash2, Upload, UserRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toastMsg } from "@/components/ui/toast-message";
import { VerifyEmailDialog } from "@/components/dashboard/cuenta/VerifyEmailDialog";
import { SettingsBlock, SettingsRow, btnPrimary, btnSecondary, errorMessage } from "@/components/dashboard/cuenta/ui";
import { useAccountStore } from "@/stores/account-store";
import { HubStatusChip } from "@/components/dashboard/shared/HubStatusChip";
import { UserAvatar } from "@/components/dashboard/shared/UserAvatar";
import type { AccountProfile } from "@/lib/services/account.service";

type EditableField = "name" | "phone";

const AVATAR_SIZE = 256;

/** Recorta al centro y reduce la imagen a 256×256 JPEG (≈20–40 KB) antes de subirla. */
const toAvatarDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const side = Math.min(image.width, image.height);
      const canvas = document.createElement("canvas");
      canvas.width = AVATAR_SIZE;
      canvas.height = AVATAR_SIZE;
      canvas
        .getContext("2d")!
        .drawImage(
          image,
          (image.width - side) / 2,
          (image.height - side) / 2,
          side,
          side,
          0,
          0,
          AVATAR_SIZE,
          AVATAR_SIZE,
        );
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("No pudimos leer la imagen."));
    };
    image.src = url;
  });

/** "Juan Carlos Pérez Díaz" → nombre "Juan Carlos", apellido "Pérez Díaz". */
const splitName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/);
  const firstCount = parts.length >= 4 ? 2 : 1;
  return { first: parts.slice(0, firstCount).join(" "), last: parts.slice(firstCount).join(" ") };
};

export const PerfilSection = ({ profile }: { profile: AccountProfile }) => {
  const saveProfile = useAccountStore((state) => state.saveProfile);
  const saveAvatar = useAccountStore((state) => state.saveAvatar);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<EditableField | null>(null);
  const [draft, setDraft] = useState("");
  const [lastName, setLastName] = useState("");
  const [saving, setSaving] = useState(false);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const emailVerified = profile.emailVerifiedAt !== null;

  const handleAvatar = async (file: File | undefined) => {
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
      toastMsg.error("Formato no permitido", "Sube una imagen JPG, PNG o WebP.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toastMsg.error("Imagen muy pesada", "Elige una imagen de hasta 10 MB.");
      return;
    }
    setUploading(true);
    try {
      await saveAvatar(await toAvatarDataUrl(file));
      toastMsg.success("Foto actualizada");
    } catch (error) {
      toastMsg.error("No se pudo subir la foto", errorMessage(error));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleRemoveAvatar = async () => {
    setUploading(true);
    try {
      await saveAvatar(null);
      toastMsg.success("Foto eliminada");
    } catch (error) {
      toastMsg.error("No se pudo quitar la foto", errorMessage(error));
    } finally {
      setUploading(false);
    }
  };

  const startEditing = (field: EditableField) => {
    if (field === "name") {
      const { first, last } = splitName(profile.name);
      setDraft(first);
      setLastName(last);
    } else {
      setDraft(profile.phone ?? "");
    }
    setEditing(field);
  };

  const handleSave = async () => {
    if (!editing) return;
    let value = draft.trim();
    if (editing === "name") {
      const last = lastName.trim();
      if (value.length < 2 || last.length < 2) {
        toastMsg.error("Datos incompletos", "Ingresa tu nombre y tu apellido.");
        return;
      }
      value = `${value} ${last}`;
    }
    setSaving(true);
    try {
      await saveProfile({ [editing]: value });
      setEditing(null);
      toastMsg.success("Perfil actualizado");
    } catch (error) {
      toastMsg.error("No se pudo guardar", errorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const keyHandler = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") void handleSave();
    if (event.key === "Escape") setEditing(null);
  };

  const editButton = (field: EditableField) =>
    editing !== field && (
      <button type="button" className={btnSecondary} onClick={() => startEditing(field)} disabled={editing !== null}>
        Editar
      </button>
    );

  const editFooter = (field: EditableField) =>
    editing === field && (
      <>
        <button type="button" className={btnSecondary} onClick={() => setEditing(null)} disabled={saving}>
          Cancelar
        </button>
        <button type="button" className={btnPrimary} onClick={() => void handleSave()} disabled={saving}>
          {saving && <Loader2 className="size-4 animate-spin" />}
          Guardar
        </button>
      </>
    );

  const nameInputs = (
    <div className="mt-2 grid w-full max-w-md gap-2 sm:grid-cols-2">
      <label className="space-y-1">
        <span className="text-xs text-muted-foreground">Nombre</span>
        <Input
          className="h-9 rounded-sm text-sm"
          placeholder="Nombre"
          value={draft}
          maxLength={60}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={keyHandler}
          autoFocus
        />
      </label>
      <label className="space-y-1">
        <span className="text-xs text-muted-foreground">Apellido</span>
        <Input
          className="h-9 rounded-sm text-sm"
          placeholder="Apellido"
          value={lastName}
          maxLength={60}
          onChange={(event) => setLastName(event.target.value)}
          onKeyDown={keyHandler}
        />
      </label>
    </div>
  );

  return (
    <SettingsBlock title="Información personal" description="Datos con los que te identificas en todas tus organizaciones.">
      <div className="space-y-2">
        <SettingsRow
          media={
            profile.avatarUrl ? (
              <UserAvatar name={profile.name} src={profile.avatarUrl} />
            ) : undefined
          }
          icon={UserRound}
          label="Foto de perfil"
          footer={
            <>
              {profile.avatarUrl && (
                <button
                  type="button"
                  className={btnSecondary}
                  disabled={uploading}
                  onClick={() => void handleRemoveAvatar()}
                >
                  <Trash2 className="size-4" />
                  Quitar
                </button>
              )}
              <button type="button" className={btnSecondary} disabled={uploading} onClick={() => fileRef.current?.click()}>
                {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                {profile.avatarUrl ? "Cambiar foto" : "Subir foto"}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(event) => void handleAvatar(event.target.files?.[0])}
              />
            </>
          }
        >
          JPG, PNG o WebP. La recortamos a un cuadrado.
        </SettingsRow>

        <SettingsRow icon={UserRound} label="Nombre completo" action={editButton("name")} footer={editFooter("name")}>
          {editing === "name" ? nameInputs : profile.name}
        </SettingsRow>

        <SettingsRow
          icon={Mail}
          label="Correo electrónico"
          action={
            <>
              <HubStatusChip
                tone={emailVerified ? "success" : "warning"}
                label={emailVerified ? "Verificado" : "Sin verificar"}
              />
              {!emailVerified && (
                <button type="button" className={btnPrimary} onClick={() => setVerifyDialogOpen(true)}>
                  Verificar
                </button>
              )}
            </>
          }
        >
          {profile.email}
        </SettingsRow>

        <SettingsRow icon={Phone} label="Teléfono" action={editButton("phone")} footer={editFooter("phone")}>
          {editing === "phone" ? (
            <Input
              className="mt-2 h-9 w-full max-w-xs rounded-sm text-sm"
              placeholder="+51 999 999 999"
              value={draft}
              maxLength={30}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={keyHandler}
              autoFocus
            />
          ) : (
            profile.phone || "Sin teléfono"
          )}
        </SettingsRow>
      </div>

      <VerifyEmailDialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen} email={profile.email} />
    </SettingsBlock>
  );
};
