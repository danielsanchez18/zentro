"use client";

import { Laptop, MonitorCheck, Smartphone } from "lucide-react";
import { HubStatusChip } from "@/components/dashboard/shared/HubStatusChip";
import { SettingsBlock, SettingsRow, btnSecondary } from "@/components/dashboard/cuenta/ui";
import { useDashboardStore } from "@/stores/dashboard-store";
import { formatRelative } from "@/lib/format/dates";

/** Sesiones activas en otros dispositivos. */
export const DispositivosSection = () => {
  const { sessions, revokeSession } = useDashboardStore();
  const activeSessions = sessions.filter((session) => session.revokedAt === null);

  return (
    <SettingsBlock
      title="Dispositivos"
      description="Sesiones con acceso a tu cuenta. Cierra las que no reconozcas. La ubicación es aproximada."
    >
      <ul className="space-y-2">
        {activeSessions.map((session) => (
          <li key={session.id}>
            <SettingsRow
              icon={session.deviceType === "MOBILE" ? Smartphone : Laptop}
              label={`${session.browserName} en ${session.deviceName}`}
              action={
                session.isCurrent ? (
                  <HubStatusChip tone="info" icon={MonitorCheck} label="Esta sesión" />
                ) : (
                  <button type="button" className={btnSecondary} onClick={() => revokeSession(session.id)}>
                    Cerrar sesión
                  </button>
                )
              }
            >
              {session.approximateLocation ?? "Ubicación desconocida"} ·{" "}
              {session.isCurrent ? "Activa ahora" : `Activa ${formatRelative(session.lastActiveAt)}`}
            </SettingsRow>
          </li>
        ))}
      </ul>
    </SettingsBlock>
  );
};
