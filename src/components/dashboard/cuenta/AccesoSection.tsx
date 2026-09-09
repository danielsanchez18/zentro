"use client";

import { Apple, Globe, KeyRound, Users } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toastMsg } from "@/components/ui/toast-message";
import { DisconnectProviderDialog } from "@/components/dashboard/cuenta/DisconnectProviderDialog";
import { useDashboardStore } from "@/stores/dashboard-store";
import type { IdentityProvider, UserIdentity } from "@/types/dashboard";

const PROVIDER_COPY: Record<IdentityProvider, { name: string; description: string; icon: typeof KeyRound }> = {
  PASSWORD: { name: "Correo y contraseña", description: "Accede con tus credenciales de Zentro", icon: KeyRound },
  GOOGLE: { name: "Google", description: "Inicia sesión con tu cuenta de Google", icon: Globe },
  FACEBOOK: { name: "Facebook", description: "Inicia sesión con tu cuenta de Facebook", icon: Users },
  APPLE: { name: "Apple", description: "Inicia sesión con tu Apple ID", icon: Apple },
};

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
    <div className="space-y-6 w-full">
      <div className="max-lg:pt-3 lg:pl-5">
        <h2 className="text-base font-medium font-sans">Cómo inicias sesión</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Administra los métodos vinculados a tu cuenta personal.
        </p>

        <ul className="mt-5 space-y-3">
          {identities.map((identity) => {
            const provider = PROVIDER_COPY[identity.provider];
            const ProviderIcon = provider.icon;
            const connected = identity.status === "ACTIVE";
            return (
              <li key={identity.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    <ProviderIcon className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{provider.name}</p>
                    <p className="text-sm text-muted-foreground">{provider.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={cn(
                    "rounded-full px-2.5 py-1.5 text-xs font-medium uppercase tracking-wide",
                    connected ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-muted text-muted-foreground",
                  )}>
                    {connected ? "Conectado" : "No conectado"}
                  </span>
                  {connected && identity.provider !== "PASSWORD" ? (
                    <Button type="button" variant="outline" size="sm" className="rounded-full h-fit py-1" onClick={() => setPendingIdentity(identity)}>
                      Desconectar
                    </Button>
                  ) : identity.provider !== "PASSWORD" ? (
                    <Button type="button" size="sm" disabled className="rounded-full h-fit py-1">
                      Conectar
                    </Button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>

        <p className="mt-4 text-sm text-muted-foreground">
          La conexión de nuevos proveedores permanece deshabilitada hasta implementar OAuth.
        </p>
      </div>

      <DisconnectProviderDialog
        open={pendingIdentity !== null}
        onOpenChange={(open) => { if (!open) setPendingIdentity(null); }}
        providerName={pendingIdentity ? PROVIDER_COPY[pendingIdentity.provider].name : ""}
        onConfirm={() => { if (pendingIdentity) handleDisconnect(pendingIdentity); }}
      />
    </div>
  );
};
