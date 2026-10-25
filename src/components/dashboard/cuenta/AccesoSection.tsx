"use client";

import { Apple, Globe, KeyRound, Users } from "lucide-react";
import { useState } from "react";
import { HubStatusChip } from "@/components/dashboard/shared/HubStatusChip";
import { toastMsg } from "@/components/ui/toast-message";
import { DisconnectProviderDialog } from "@/components/dashboard/cuenta/DisconnectProviderDialog";
import { SettingsBlock, SettingsRow, btnPrimary, btnSecondary } from "@/components/dashboard/cuenta/ui";
import { useDashboardStore } from "@/stores/dashboard-store";
import type { IdentityProvider, UserIdentity } from "@/types/dashboard";

const PROVIDER_COPY: Record<IdentityProvider, { name: string; description: string; icon: typeof KeyRound }> = {
  PASSWORD: { name: "Correo y contraseña", description: "Accede con tus credenciales de Zentro", icon: KeyRound },
  GOOGLE: { name: "Google", description: "Inicia sesión con tu cuenta de Google", icon: Globe },
  FACEBOOK: { name: "Facebook", description: "Inicia sesión con tu cuenta de Facebook", icon: Users },
  APPLE: { name: "Apple", description: "Inicia sesión con tu Apple ID", icon: Apple },
};

/** Métodos de inicio de sesión vinculados (se muestra dentro de Seguridad). */
export const AccesoSection = () => {
  const { identities, disconnectIdentity } = useDashboardStore();
  const [pendingIdentity, setPendingIdentity] = useState<UserIdentity | null>(null);

  const handleDisconnect = (identity: UserIdentity) => {
    const result = disconnectIdentity(identity.id);
    const provider = PROVIDER_COPY[identity.provider];
    if (!result.ok) {
      toastMsg.error("No se puede desconectar", result.reason);
      return;
    }
    toastMsg.success("Método desconectado", `${provider.name} ya no está conectado.`);
  };

  return (
    <SettingsBlock
      title="Métodos de inicio de sesión"
      description="Debes conservar al menos un método activo. Conectar nuevos proveedores estará disponible pronto."
    >
      <ul className="space-y-2">
        {identities.map((identity) => {
          const provider = PROVIDER_COPY[identity.provider];
          const connected = identity.status === "ACTIVE";
          return (
            <li key={identity.id}>
              <SettingsRow
                icon={provider.icon}
                label={provider.name}
                action={
                  <>
                    <HubStatusChip
                      tone={connected ? "success" : "neutral"}
                      label={connected ? "Conectado" : "No conectado"}
                    />
                    {identity.provider !== "PASSWORD" &&
                      (connected ? (
                        <button type="button" className={btnSecondary} onClick={() => setPendingIdentity(identity)}>
                          Desconectar
                        </button>
                      ) : (
                        <button type="button" className={btnPrimary} disabled>
                          Conectar
                        </button>
                      ))}
                  </>
                }
              >
                {provider.description}
              </SettingsRow>
            </li>
          );
        })}
      </ul>

      <DisconnectProviderDialog
        open={pendingIdentity !== null}
        onOpenChange={(open) => {
          if (!open) setPendingIdentity(null);
        }}
        providerName={pendingIdentity ? PROVIDER_COPY[pendingIdentity.provider].name : ""}
        onConfirm={() => {
          if (pendingIdentity) handleDisconnect(pendingIdentity);
        }}
      />
    </SettingsBlock>
  );
};
