'use client';

import { usePathname } from 'next/navigation';
import { useGuestGuard } from '@/hooks/use-guest-guard';

/**
 * Layout del grupo (auth).
 * Solo /ingresar y /registrar redirigen al dashboard si ya hay sesión.
 * /forgot-password y /reset-password se mantienen públicas siempre para no
 * interrumpir el flujo de recuperación.
 */
const GUEST_ONLY_PATHS = ['/ingresar', '/registrar'];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isGuestOnly = GUEST_ONLY_PATHS.includes(pathname);

  useGuestGuard({ enabled: isGuestOnly });

  return <>{children}</>;
}
