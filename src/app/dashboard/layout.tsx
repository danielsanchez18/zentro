'use client';

import { Loader2 } from 'lucide-react';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { Header } from '@/components/dashboard/shared/Header';
import { Navlink } from '@/components/dashboard/shared/Navlink';
import { Footer } from '@/components/dashboard/shared/Footer';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { checking } = useRequireAuth();

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navlink />

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}
