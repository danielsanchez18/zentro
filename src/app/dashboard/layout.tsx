'use client';

import { Loader2 } from 'lucide-react';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { useAuthStore } from '@/stores/auth-store';
import { MockBadge } from '@/components/ui/mock-badge';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { checking } = useRequireAuth();
  const { user, logout } = useAuthStore();

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
