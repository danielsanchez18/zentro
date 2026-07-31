'use client';

import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { MockBadge } from '@/components/ui/mock-badge';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/ingresar');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-14 border-b border-border px-4 flex items-center justify-between bg-background">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">Zentro</span>
          {user?.organization && (
            <span className="text-sm text-muted-foreground hidden sm:inline">
              — {user.organization}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <MockBadge />
          <span className="text-sm text-muted-foreground">{user?.name || user?.email}</span>
          <button
            onClick={logout}
            className="text-xs text-destructive hover:underline"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
