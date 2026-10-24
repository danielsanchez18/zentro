'use client';

import { Loader2 } from 'lucide-react';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { Header } from '@/components/dashboard/shared/Header';
import { Sidebar } from '@/components/dashboard/shared/Sidebar';
import { MobileTabBar } from '@/components/dashboard/shared/MobileTabBar';
import { Footer } from '@/components/dashboard/shared/Footer';
import './hub.css';

/**
 * Layout del Hub personal.
 * - Desde `lg`: sidebar flotante a la izquierda + header con título.
 * - Debajo de `lg`: header compacto con logo y barra de navegación inferior.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { checking } = useRequireAuth();

  if (checking) {
    return (
      <div className="hub-scope min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="hub-scope flex min-h-dvh bg-background text-foreground">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="flex-1 pb-24 lg:pb-0">
          {children}
        </main>

        <Footer />
      </div>

      <MobileTabBar />
    </div>
  );
}
