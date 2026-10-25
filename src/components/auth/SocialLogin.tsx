"use client";

import { GoogleIcon } from "@/components/auth/GoogleIcon";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showError } from "@/components/ui/toast-message";
import { API_URL, apiRequest } from "@/lib/api/client";

// APPLE (pausado): Sign in with Apple aún no se implementa; descomentar para activarlo.
type Provider = "google"; // | "apple"

/** Mensajes para los errores que devuelve el callback de OAuth (`?oauthError=`). */
const OAUTH_ERRORS: Record<string, [string, string]> = {
  cancelled: ["Inicio de sesión cancelado", "No se completó el acceso con el proveedor."],
  email_missing: [
    "Falta tu correo",
    "El proveedor no compartió tu correo. Autoriza el permiso de correo o usa otro método.",
  ],
  email_unverified: [
    "Correo sin verificar",
    "Verifica tu correo en el proveedor o inicia sesión con tu contraseña.",
  ],
  failed: ["No pudimos iniciar sesión", "Inténtalo de nuevo en unos segundos."],
};

// APPLE (pausado)
// const AppleIcon = () => (
//   <svg className="size-4.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
//     <path d="M16.37 12.6c-.02-2.27 1.86-3.36 1.94-3.41-1.06-1.55-2.7-1.76-3.28-1.78-1.4-.14-2.73.82-3.44.82-.71 0-1.8-.8-2.96-.78-1.52.02-2.93.89-3.71 2.25-1.58 2.74-.4 6.8 1.14 9.02.75 1.09 1.65 2.31 2.82 2.27 1.13-.05 1.56-.73 2.93-.73 1.37 0 1.75.73 2.95.71 1.22-.02 1.99-1.11 2.73-2.2.86-1.26 1.22-2.49 1.24-2.55-.03-.01-2.37-.91-2.4-3.62zM14.12 5.94c.62-.76 1.04-1.81.93-2.86-.9.04-1.99.6-2.63 1.35-.58.67-1.08 1.74-.95 2.77 1 .08 2.03-.51 2.65-1.26z" />
//   </svg>
// );

const PROVIDERS: { key: Provider; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "google", label: "Google", Icon: GoogleIcon },
  // { key: "apple", label: "Apple", Icon: AppleIcon }, // APPLE (pausado)
];

/**
 * Inicio de sesión con Google (OAuth en la API). Apple está pausado.
 * El botón lleva a la API, que redirige al proveedor y vuelve a /dashboard con
 * la sesión abierta. Si un proveedor no está configurado, su botón se desactiva.
 */
export function SocialLogin() {
  const searchParams = useSearchParams();
  const [enabled, setEnabled] = useState<Record<Provider, boolean> | null>(null);
  const [redirecting, setRedirecting] = useState<Provider | null>(null);

  useEffect(() => {
    apiRequest<Record<Provider, boolean>>("/auth/oauth/providers")
      .then(setEnabled)
      .catch(() => setEnabled({ google: false }));
  }, []);

  // Error devuelto por el callback de OAuth.
  const oauthError = searchParams.get("oauthError");
  useEffect(() => {
    if (!oauthError) return;
    const [title, description] = OAUTH_ERRORS[oauthError] ?? OAUTH_ERRORS.failed;
    showError(title, description);
  }, [oauthError]);

  return (
    <div className="w-full max-w-sm px-5 space-y-4">
      <div className="flex items-center gap-x-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-muted-foreground shrink-0">o continuar con</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="grid grid-cols-1 gap-x-2">
        {PROVIDERS.map(({ key, label, Icon }) => {
          const available = enabled?.[key] ?? false;
          return (
            <Button
              key={key}
              type="button"
              variant="outline"
              className="w-full gap-x-3 h-fit rounded-full py-2"
              disabled={!available || redirecting !== null}
              title={enabled && !available ? `El inicio de sesión con ${label} aún no está configurado` : undefined}
              onClick={() => {
                setRedirecting(key);
                window.location.href = `${API_URL}/api/v1/auth/oauth/${key}`;
              }}
            >
              {redirecting === key ? <Loader2 className="size-4.5 animate-spin" /> : <Icon />}
              {label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
