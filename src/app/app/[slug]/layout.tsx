"use client";

import { Breadcrumb } from "@/components/app/shared/Breadcrumb";
import { Header } from "@/components/app/shared/Header";
import { Sidebar } from "@/components/app/shared/Sidebar";

/**
 * Layout del Tenant Workspace (/app/:slug).
 *
 * Arquitectura igual que el dashboard/hub:
 * - Ensambla Header (barra superior) y Sidebar (amplíca a la izquierda).
 * - El contenido vivo vive en `children` (las páginas NO montan el sidebar).
 *
 * Contexto actual (mockup de flujo): un único rol Owner, sin switchers ni
 * contexto de sucursal. Por eso NO se exige sesión aún.
 *
 * TODO(0.2#12): al conectar el backend, montar el guard de tenant aquí
 * (tipo `useRequireTenant(slug)`) para resolver la org, validar membresía y
 * redirigir al hub si el usuario no pertenece al tenant. El guard de auth
 * genérico (`useRequireAuth`) se elimina por el redirect de navegación M7.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />

      <div className="flex flex-col w-full flex-1 min-w-0">
        <Header />
        
        <div className="lg:hidden">
          <Breadcrumb />
        </div>

        <main className="flex min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}