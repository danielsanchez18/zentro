"use client";

import { Globe, KeyRound, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProviderStatus = "ACTIVE" | "CONNECTED" | "DISCONNECTED";

interface Provider {
  id: string;
  name: string;
  description: string;
  icon: typeof KeyRound;
  status: ProviderStatus;
}

// TODO(0.2): OAuth post-MVP (roadmap). Diseño de la sección.
const PROVIDERS: Provider[] = [
  {
    id: "local",
    name: "Correo y contraseña",
    description: "Tu método principal",
    icon: KeyRound,
    status: "ACTIVE",
  },
  {
    id: "google",
    name: "Google",
    description: "Inicia sesión con tu cuenta de Google",
    icon: Globe,
    status: "CONNECTED",
  },
  {
    id: "facebook",
    name: "Facebook",
    description: "Inicia sesión con tu cuenta de Facebook",
    icon: Users,
    status: "DISCONNECTED",
  },
];

const STATUS_LABELS: Record<ProviderStatus, string> = {
  ACTIVE: "Activo",
  CONNECTED: "Conectado",
  DISCONNECTED: "No conectado",
};

export const AccesoSection = () => {
  return (
    <div className="space-y-6 w-full">
      <div className="lg:pl-5">
        <h2 className="text-base font-medium font-sans">Cómo inicias sesión</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Conecta tu cuenta con proveedores externos.
        </p>

        <ul className="mt-5 space-y-3">
          {PROVIDERS.map((provider) => (
            <li
              key={provider.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  <provider.icon className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{provider.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {provider.description}
                  </p>
                </div>
              </div>

              {provider.status === "CONNECTED" ? (
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                    {STATUS_LABELS.CONNECTED}
                  </span>
                  <Button type="button" variant="outline" size="sm" className="rounded-full h-fit py-1">
                    Desconectar
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1.5 text-xs font-medium uppercase tracking-wide",
                      provider.status === "ACTIVE"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {STATUS_LABELS[provider.status]}
                  </span>
                  {provider.status === "DISCONNECTED" && (
                    <Button type="button" size="sm" disabled className="rounded-full h-fit py-1">
                      Conectar
                    </Button>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>

        <p className="mt-4 text-sm text-muted-foreground">
          La conexión con Google y Facebook estará disponible próximamente.
        </p>
      </div>
    </div>
  );
};
