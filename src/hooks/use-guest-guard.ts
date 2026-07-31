'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

/**
 * Guard inverso para páginas de auth (/ingresar, /registrar).
 * Si ya hay una sesión activa → redirige a /dashboard.
 *
 * Pasa `enabled={false}` en rutas auth que deben seguir siendo públicas
 * aunque exista sesión (p.ej. /forgot-password y /reset-password).
 */
export function useGuestGuard({ enabled = true }: { enabled?: boolean } = {}): void {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (enabled && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [enabled, isAuthenticated, router]);
}
