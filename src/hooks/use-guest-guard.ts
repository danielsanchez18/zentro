'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

/**
 * Guard inverso para páginas de auth (/ingresar, /registrar).
 * Si ya hay una sesión activa (en memoria o recuperable con la cookie)
 * redirige a /dashboard.
 *
 * Pasa `enabled={false}` en rutas auth que deben seguir siendo públicas
 * aunque exista sesión (p.ej. /forgot-password y /reset-password).
 */
export function useGuestGuard({ enabled = true }: { enabled?: boolean } = {}): void {
  const router = useRouter();
  const status = useAuthStore((s) => s.status);
  const restoreSession = useAuthStore((s) => s.restoreSession);

  useEffect(() => {
    if (!enabled) return;
    if (status === 'unknown') void restoreSession();
    if (status === 'authenticated') router.replace('/dashboard');
  }, [enabled, status, restoreSession, router]);
}
