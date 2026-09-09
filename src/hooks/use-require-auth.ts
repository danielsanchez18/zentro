'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { validateSessionService } from '@/lib/services/auth.service';

/**
 * Guard local para las rutas protegidas de dashboard y app.
 * Durante el prototipado valida la sesión persistida y restaura el usuario de prueba.
 */
export function useRequireAuth(): { checking: boolean } {
  const router = useRouter();
  const { isAuthenticated, token, user, setUser, logout } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!isAuthenticated || !token) {
        if (!cancelled) {
          router.replace('/ingresar');
          // No bajamos checking: mantenemos el spinner hasta completar el
          // redirect para que el contenido del dashboard no parpadee.
        }
        return;
      }

      try {
        const { user: freshUser } = await validateSessionService(token);
        if (cancelled) return;

        // Mantiene sincronizado el usuario persistido con el escenario local.
        if (freshUser && (!user || user.email !== freshUser.email)) {
          setUser(freshUser);
        }
        setChecking(false);
      } catch {
        if (!cancelled) {
          logout();
          router.replace('/ingresar');
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, token, router, user, setUser, logout]);

  return { checking };
}
