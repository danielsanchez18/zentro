'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { showError } from '@/components/ui/toast-message';

export type EmailGateStatus = 'no-param' | 'checking' | 'valid' | 'invalid';

interface UseValidateEmailParamOptions {
  /** Valor del parámetro ?email= (vacío si no viene en la URL). */
  email: string;
  /**
   * Precondición de la ruta. Devuelve true si el correo cumple.
   * Ej.: login/forgot → exists; register → !exists; reset → coincide con el
   * contexto de sessionStorage.
   */
  validate: (email: string) => Promise<boolean>;
  /** Ruta a la que redirigir si el correo NO cumple la precondición. */
  redirectTo: string;
  /** Título del toast de error al rechazar la URL. */
  errorTitle: string;
  /** Descripción del toast de error al rechazar la URL. */
  errorDescription?: string;
}

/**
 * Gate para rutas de 2 pasos (login, registro, forgot, reset).
 * Valida el ?email= de la URL al montar; si no cumple la precondición muestra
 * un toast y redirige al paso 1. Evita URLs forjadas (correo inexistente,
 * correo ajeno o flujo cortado a mitad de camino).
 *
 * Si la validación falla por red/error interno se deja pasar (degradación
 * consistente con el paso 1: "si el check falla, dejamos continuar").
 */
export function useValidateEmailParam({
  email,
  validate,
  redirectTo,
  errorTitle,
  errorDescription,
}: UseValidateEmailParamOptions): { status: EmailGateStatus } {
  const router = useRouter();
  const [status, setStatus] = useState<EmailGateStatus>(email ? 'checking' : 'no-param');

  useEffect(() => {
    if (!email) return;

    let cancelled = false;

    (async () => {
      let valid = false;
      try {
        valid = await validate(email);
      } catch {
        valid = true; // degradación: backend caído entre medio
      }

      if (cancelled) return;

      if (valid) {
        setStatus('valid');
      } else {
        setStatus('invalid');
        showError(errorTitle, errorDescription);
        router.replace(redirectTo);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [email, validate, redirectTo, errorTitle, errorDescription]);

  return { status };
}
