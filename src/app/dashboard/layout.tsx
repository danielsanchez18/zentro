'use client';

import { useEffect } from 'react';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { Header } from '@/components/dashboard/shared/Header';
import { Sidebar } from '@/components/dashboard/shared/Sidebar';
import { MobileTabBar } from '@/components/dashboard/shared/MobileTabBar';
import { Footer } from '@/components/dashboard/shared/Footer';
import { HubOverlays } from '@/components/dashboard/shared/HubOverlays';
import { HubPageLoader } from '@/components/dashboard/shared/HubPageLoader';
import './hub.css';

/**
 * Layout del Hub personal.
 * - Desde `lg`: sidebar flotante a la izquierda + header con título.
 * - Debajo de `lg`: header compacto con logo y barra de navegación inferior.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { checking } = useRequireAuth();

  // Diálogos, drawers y menús se renderizan en un portal dentro de <body>,
  // fuera de este árbol. Marcamos <body> mientras el Hub está montado para
  // que también reciban los tokens de hub.css (colores, radios y acento).
  useEffect(() => {
    document.body.classList.add('hub-scope');
    return () => document.body.classList.remove('hub-scope');
  }, []);

  if (checking) {
    return (
      <div className="hub-scope min-h-screen bg-background">
        <HubPageLoader label="Preparando tu panel" />
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
      <HubOverlays />
    </div>
  );
}
