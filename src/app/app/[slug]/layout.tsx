"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Building2, Loader2 } from "lucide-react";
import { Header } from "@/components/app/shared/Header";
import { Breadcrumb } from "@/components/app/shared/Breadcrumb";
import { Sidebar } from "@/components/app/shared/Sidebar";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { useTenantStore } from "@/stores/tenant-store";
import { getOrgsService } from "@/lib/services/orgs.service";

type TenantState =
  | { status: "loading" }
  | { status: "ready" }
  | { status: "not-member" };

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [state, setState] = useState<TenantState>({ status: "loading" });
  const { activeTenant, setActiveTenant } = useTenantStore();

  // Al pasar a desktop (lg), el sidebar ya está visible como columna fija, así
  // que el Sheet abierto debe cerrarse.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMobileOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Resuelve el tenant activo por slug: si el usuario es miembro ACTIVE de la
  // org con ese slug, lo setea en el store; si no, muestra acceso denegado.
  useEffect(() => {
    if (!slug) return;

    void (async () => {
      try {
        if (activeTenant?.slug === slug) {
          setState({ status: "ready" });
          return;
        }
        const orgs = await getOrgsService();
        const org = orgs.find((o) => o.slug === slug);
        if (!org) {
          setState({ status: "not-member" });
          return;
        }
        setActiveTenant({
          orgId: org.id,
          slug: org.slug,
          name: org.name,
          plan: org.plan,
          planSlug: org.planSlug,
          subscriptionStatus: org.subscriptionStatus,
          trialEndsAt: org.trialEndsAt,
        });
        setState({ status: "ready" });
      } catch {
        setState({ status: "not-member" });
      }
    })();
  }, [slug, activeTenant?.slug, setActiveTenant]);

  if (state.status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (state.status === "not-member") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
        <Building2 className="size-10 stroke-1.5 text-muted-foreground" />
        <div>
          <h1 className="text-lg font-sans font-medium">No tienes acceso a este tenant</h1>
          <p className="text-sm text-muted-foreground">
            No eres miembro de /app/{slug} o no existe.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          Ir al hub
        </Link>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar desktop */}
      <Sidebar />

      {/* Sidebar móvil dentro de un Sheet (shadcn). El botón "menú" vive en el
          Breadcrumb de la barra inferior (solo mobile). */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-xs p-0">
          <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
          <Sidebar mobile onClose={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex w-full min-w-0 flex-col">
        <Header breadcrumb={<Breadcrumb />} />

        {/* Barra separada de breadcrumb: solo mobile (en desktop vive en el
            header). Su botón "menú" abre el Sheet del sidebar. */}
        <div className="lg:hidden border-b border-border px-5 md:px-7 xl:px-10 py-2">
          <Breadcrumb onOpenMenu={() => setMobileOpen(true)} />
        </div>

        <main className="flex-1 px-5 md:px-7 xl:px-10 py-7">{children}</main>
      </div>
    </div>
  );
}