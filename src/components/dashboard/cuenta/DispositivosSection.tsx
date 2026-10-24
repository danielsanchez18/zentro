"use client";

import { Laptop, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { SettingsBlock, SettingsRow, btnSecondary, chip } from "@/components/dashboard/cuenta/ui";
import { useDashboardStore } from "@/stores/dashboard-store";

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
                  <span className={cn(chip, "border-border bg-muted text-foreground")}>Esta sesión</span>
                ) : (
                  <button type="button" className={btnSecondary} onClick={() => revokeSession(session.id)}>
                    Cerrar sesión
                  </button>
                )
              }
            >
              {session.approximateLocation ?? "Ubicación desconocida"} ·{" "}
              {session.isCurrent ? "Activa ahora" : "Hace 2 días"}
            </SettingsRow>
          </li>
        ))}
      </ul>
    </SettingsBlock>
  );
};
