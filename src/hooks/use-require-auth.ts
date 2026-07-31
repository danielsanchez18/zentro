'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { validateSessionService } from '@/lib/services/auth.service';

/**
 * Guard para rutas protegidas (dashboard).
 *
 * Flujo:
 * - Sin sesión (isAuthenticated/token ausente) → redirige a /ingresar.
 * - Con sesión en modo MOCK → confía en el store (el token mock no es un JWT real).
 * - Con sesión en modo API → valida el token contra GET /auth/me.
 *   - 200 → refresca el usuario del store y permite el acceso.
 *   - 401/error → cierra sesión y redirige a /ingresar.
 *
 * Devuelve `{ checking }`. Mientras sea true, la UI debe mostrar un spinner.
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

        // Refresca la información del usuario con la data fresca del backend.
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
