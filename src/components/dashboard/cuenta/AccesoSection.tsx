"use client";

// APPLE / FACEBOOK (pausado): import { Apple, Users } from "lucide-react";
import { KeyRound, Loader2 } from "lucide-react";
import { GoogleIcon } from "@/components/auth/GoogleIcon";
import { useEffect, useState } from "react";
import { HubStatusChip } from "@/components/dashboard/shared/HubStatusChip";
import { toastMsg } from "@/components/ui/toast-message";
import { DisconnectProviderDialog } from "@/components/dashboard/cuenta/DisconnectProviderDialog";
import { SettingsBlock, SettingsRow, btnPrimary, btnSecondary, errorMessage } from "@/components/dashboard/cuenta/ui";
import { startGoogleLink } from "@/lib/services/account.service";
import type { AccessMethod, AccessProvider } from "@/lib/services/account.service";
import { useAccountStore } from "@/stores/account-store";

const PROVIDER_COPY: Record<AccessProvider, { name: string; description: string; icon: React.ComponentType<{ className?: string }> }> = {
  PASSWORD: { name: "Correo y contraseña", description: "Accede con tu correo y contraseña de Zentro", icon: KeyRound },
  GOOGLE: { name: "Google", description: "Inicia sesión con tu cuenta de Google", icon: GoogleIcon },
  // FACEBOOK (pausado): { name: "Facebook", description: "Inicia sesión con tu cuenta de Facebook", icon: Users },
  // APPLE (pausado): { name: "Apple", description: "Inicia sesión con tu Apple ID", icon: Apple },
};

/**
 * Métodos de inicio de sesión (dentro de Seguridad). Reglas del servidor:
 * - nunca se puede quitar el último método de acceso;
 * - la contraseña no se desvincula (se cambia o se crea);
 * - si la cuenta solo entra con Google, debe crear una contraseña antes de desvincularlo.
 */
export const AccesoSection = ({ hasPassword }: { hasPassword: boolean }) => {
  const { methods, loadMethods, unlinkMethod } = useAccountStore();
  const [pending, setPending] = useState<AccessMethod | null>(null);
  const [linking, setLinking] = useState(false);

  useEffect(() => {
    loadMethods().catch((error) => toastMsg.error("No se pudieron cargar tus métodos", errorMessage(error)));
  }, [loadMethods]);

  const connectedCount = methods?.filter((method) => method.connected).length ?? 0;

  const handleConnect = async (provider: AccessProvider) => {
    if (provider !== "GOOGLE") return;
    setLinking(true);
    try {
      const { url } = await startGoogleLink();
      window.location.assign(url);
    } catch (error) {
      setLinking(false);
      toastMsg.error("No se pudo conectar Google", errorMessage(error));
    }
  };

  const handleDisconnect = async (method: AccessMethod) => {
    const provider = PROVIDER_COPY[method.provider];
    try {
      await unlinkMethod(method.provider);
      toastMsg.success("Método desconectado", `${provider.name} ya no está conectado.`);
    } catch (error) {
      toastMsg.error("No se puede desconectar", errorMessage(error));
    }
  };

  return (
    <SettingsBlock
      title="Métodos de inicio de sesión"
      description="Debes conservar al menos un método activo para no perder el acceso a tu cuenta."
    >
      {methods === null ? (
        <div className="flex justify-center py-6 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
        </div>
      ) : (
        <ul className="space-y-2">
          {methods.map((method) => {
            const provider = PROVIDER_COPY[method.provider];
            const isLast = method.connected && connectedCount <= 1;
            return (
              <li key={method.provider}>
                <SettingsRow
                  icon={provider.icon}
                  label={provider.name}
                  action={
                    <>
                      <HubStatusChip
                        tone={method.connected ? "success" : "neutral"}
                        label={method.connected ? "Conectado" : "No conectado"}
                      />
                      {method.provider !== "PASSWORD" &&
                        (method.connected ? (
                          <button
                            type="button"
                            className={btnSecondary}
                            disabled={isLast}
                            title={isLast ? "Crea una contraseña antes de desconectarlo" : undefined}
                            onClick={() => setPending(method)}
                          >
                            Desconectar
                          </button>
                        ) : (
                          <button
                            type="button"
                            className={btnPrimary}
                            disabled={linking}
                            onClick={() => void handleConnect(method.provider)}
                          >
                            {linking && <Loader2 className="size-4 animate-spin" />}
                            Conectar
                          </button>
                        ))}
                    </>
                  }
                >
                  {method.connected && method.email && method.provider !== "PASSWORD"
                    ? method.email
                    : method.provider === "PASSWORD" && !method.connected
                      ? "Sin contraseña: créala en «Contraseña y verificación»."
                      : isLast
                        ? `${provider.description}. Es tu único método de acceso.`
                        : provider.description}
                </SettingsRow>
              </li>
            );
          })}
        </ul>
      )}

      <DisconnectProviderDialog
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open) setPending(null);
        }}
        providerName={pending ? PROVIDER_COPY[pending.provider].name : ""}
        hasPasswordAccess={hasPassword}
        onConfirm={() => {
          if (pending) void handleDisconnect(pending);
        }}
      />
    </SettingsBlock>
  );
};
