"use client";

import { useState } from "react";
import { Laptop, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChangePasswordDialog } from "@/components/dashboard/cuenta/ChangePasswordDialog";
import { useDashboardStore } from "@/stores/dashboard-store";

export const SeguridadSection = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { sessions, revokeSession } = useDashboardStore();
  const activeSessions = sessions.filter((session) => session.revokedAt === null);

  return (
      <div className="flex flex-col w-full lg:pl-5">

        {/* Contraseña */}
        <div className="max-lg:pt-3 pb-4 border-b border-border space-y-2 flex flex-wrap items-center justify-between gap-x-5">

          <div className="space-y-1">
            <p className="text-sm font-medium">Contraseña</p>
            <p className="text-muted-foreground text-sm">Usa al menos 8 caracteres.</p>
          </div>

          <Button size="sm" variant="outline" className="text-sm rounded-full h-fit px-3 py-1.5" onClick={() => setDialogOpen(true)}>Cambiar</Button>
        </div>

        {/* Sesiones */}
        <div className="py-5 border-b border-border">
          <h2 className="text-sm font-medium font-sans">Sesiones activas</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Dispositivos con acceso a tu cuenta.
          </p>

          <ul className="mt-5 space-y-3">
            {activeSessions.map((session) => {
              const DeviceIcon = session.deviceType === "MOBILE" ? Smartphone : Laptop;
              return (
              <li
                key={session.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    <DeviceIcon className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {session.browserName} en {session.deviceName}
                      {session.isCurrent && (
                        <span className="ml-2 rounded-full bg-primary/10 px-2 py-1 text-xs uppercase tracking-wide text-primary">
                          Esta sesión
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {session.approximateLocation ?? "Ubicación desconocida"} · {session.isCurrent ? "Activa ahora" : "Hace 2 días"}
                    </p>
                  </div>
                </div>
                {!session.isCurrent && (
                  <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => revokeSession(session.id)}>
                    Cerrar
                  </Button>
                )}
              </li>
              );
            })}
          </ul>
        </div>

        {/* 2FA */}
        <div className="pt-4 space-y-2 flex flex-wrap items-center justify-between gap-x-5">

          <div className="space-y-2">
            <p className="text-sm font-medium">Verificación en dos pasos (2FA)</p>
            <p className="text-muted-foreground text-sm">Una capa extra de seguridad con una app de autenticación. Disponible próximamente.</p>
          </div>

          <Button size="sm" variant="outline" disabled className="text-sm rounded-full h-fit px-3 py-1.5">Próximamente</Button>
        </div>

        <ChangePasswordDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />

      </div>
  );
};
