'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

/**
 * Guard de las rutas protegidas (Hub).
 * Si no hay sesión en memoria intenta recuperarla con la cookie httpOnly
 * (`/auth/refresh`); si no se puede, redirige a /ingresar.
 * TODO: protección también del lado del servidor (middleware) cuando el
 * frontend y la API compartan dominio.
 */
export function useRequireAuth(): { checking: boolean } {
  const router = useRouter();
  const status = useAuthStore((state) => state.status);
  const restoreSession = useAuthStore((state) => state.restoreSession);

  useEffect(() => {
    if (status === 'unknown') {
      void restoreSession();
    } else if (status === 'anonymous') {
      router.replace('/ingresar');
    }
  }, [status, restoreSession, router]);

  // Mientras no haya sesión confirmada se mantiene el loader (también
  // durante el redirect, para que el contenido no parpadee).
  return { checking: status !== 'authenticated' };
}
