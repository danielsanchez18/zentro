"use client";

import { Rocket } from "lucide-react";
import { useWorkspaceContextView } from "@/hooks/use-workspace-context";

const SHORTCUTS = [
  { label: "Catálogo", href: "/catalogo" },
  { label: "CRM", href: "/clientes" },
  { label: "Ventas", href: "/pos" },
  { label: "Inventario", href: "/inventario" },
];

/**
 * Accesos directos del Resumen (/app/:slug), filtrados por el contexto del
 * workspace: solo se muestran módulos con permiso efectivo (al menos `view`) y
 * capacidad activa, igual que el sidebar.
 */
export function QuickLinks({ slug }: { slug: string }) {
  const view = useWorkspaceContextView(slug);

  const visible = SHORTCUTS.filter(
    (shortcut) =>
      view.canViewModule(shortcut.href) &&
      view.moduleEnabledByCapability(shortcut.href),
  );

  if (visible.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
        No tienes módulos con acceso directo en este contexto.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {visible.map((shortcut) => (
        <a
          key={shortcut.href}
          href={`/app/${slug}${shortcut.href}`}
          className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-secondary/40"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{shortcut.label}</span>
            <Rocket className="size-4 text-muted-foreground transition-transform group-hover:-rotate-12 group-hover:text-primary" />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Acceso directo (mockup)</p>
        </a>
      ))}
    </div>
  );
}