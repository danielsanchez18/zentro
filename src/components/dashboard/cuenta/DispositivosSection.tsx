"use client";

import { useEffect, useState } from "react";
import { Laptop, Loader2, MonitorCheck, Smartphone } from "lucide-react";
import { HubStatusChip } from "@/components/dashboard/shared/HubStatusChip";
import { toastMsg } from "@/components/ui/toast-message";
import { SettingsBlock, SettingsRow, btnSecondary, errorMessage } from "@/components/dashboard/cuenta/ui";
import { useAccountStore } from "@/stores/account-store";
import { formatRelative } from "@/lib/format/dates";

/** Etiqueta legible a partir del user-agent guardado con la sesión. */
const describeDevice = (userAgent: string | null) => {
  const ua = userAgent ?? "";
  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /OPR\//.test(ua)
      ? "Opera"
      : /Chrome\//.test(ua)
        ? "Chrome"
        : /Firefox\//.test(ua)
          ? "Firefox"
          : /Safari\//.test(ua)
            ? "Safari"
            : "Navegador";
  const os = /Windows/.test(ua)
    ? "Windows"
    : /Android/.test(ua)
      ? "Android"
      : /iPhone|iPad/.test(ua)
        ? "iOS"
        : /Mac OS X/.test(ua)
          ? "macOS"
          : /Linux/.test(ua)
            ? "Linux"
            : "dispositivo desconocido";
  return { label: `${browser} en ${os}`, mobile: /Mobile|Android|iPhone/.test(ua) };
};

/** IP legible: "::1" y "127.0.0.1" son este mismo equipo; "::ffff:x" es IPv4 en formato IPv6. */
const describeIp = (ip: string | null) => {
  if (!ip) return "Ubicación desconocida";
  const plain = ip.replace(/^::ffff:/, "");
  if (plain === "::1" || plain === "127.0.0.1") return "Este equipo (localhost)";
  if (/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(plain)) return `Red local · ${plain}`;
  return `IP ${plain}`;
};

/** Sesiones activas (refresh tokens vigentes) de la cuenta. */
export const DispositivosSection = () => {
  const { sessions, loadSessions, revokeSession, revokeOtherSessions } = useAccountStore();
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    loadSessions().catch((error) => toastMsg.error("No se pudieron cargar tus sesiones", errorMessage(error)));
  }, [loadSessions]);

  const run = async (id: string, action: () => Promise<void>, done: string) => {
    setBusy(id);
    try {
      await action();
      toastMsg.success(done);
    } catch (error) {
      toastMsg.error("No se pudo cerrar la sesión", errorMessage(error));
    } finally {
      setBusy(null);
    }
  };

  const others = sessions?.filter((session) => !session.current).length ?? 0;

  return (
    <SettingsBlock
      title="Dispositivos"
      description="Sesiones con acceso a tu cuenta. Cierra las que no reconozcas."
    >
      {sessions === null ? (
        <div className="flex justify-center py-6 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
        </div>
      ) : (
        <>
          <ul className="space-y-2">
            {sessions.map((session) => {
              const device = describeDevice(session.userAgent);
              return (
                <li key={session.id}>
                  <SettingsRow
                    icon={device.mobile ? Smartphone : Laptop}
                    label={device.label}
                    action={
                      session.current ? (
                        <HubStatusChip tone="info" icon={MonitorCheck} label="Esta sesión" />
                      ) : (
                        <button
                          type="button"
                          className={btnSecondary}
                          disabled={busy !== null}
                          onClick={() => void run(session.id, () => revokeSession(session.id), "Sesión cerrada")}
                        >
                          {busy === session.id && <Loader2 className="size-4 animate-spin" />}
                          Cerrar sesión
                        </button>
                      )
                    }
                  >
                    {describeIp(session.ipAddress)} ·{" "}
                    {session.current ? "Activa ahora" : `Activa ${formatRelative(session.lastUsedAt)}`}
                  </SettingsRow>
                </li>
              );
            })}
          </ul>
          {others > 0 && (
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                className={btnSecondary}
                disabled={busy !== null}
                onClick={() => void run("others", revokeOtherSessions, "Cerraste las demás sesiones")}
              >
                {busy === "others" && <Loader2 className="size-4 animate-spin" />}
                Cerrar las demás sesiones
              </button>
            </div>
          )}
        </>
      )}
    </SettingsBlock>
  );
};
