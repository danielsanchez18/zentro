import { LayoutDashboard, Rocket } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Landing «Resumen» del Tenant Workspace (mockup de flujo).
 *
 * Página placeholder para visualizar el layout (Header + Sidebar). No contiene
 * lógica de negocio real: muestra el slug de la organización y tarjetas que
 * enlazan a los principales módulos del workspace.
 */
export default async function AppHomePage({ params }: Props) {
  const { slug } = await params;

  const shortcuts = [
    { label: "Catálogo", href: `/app/${slug}/catalogo` },
    { label: "CRM", href: `/app/${slug}/clientes` },
    { label: "Ventas", href: `/app/${slug}/pos` },
    { label: "Inventario", href: `/app/${slug}/inventario` },
  ];

  return (
    <div className="w-full px-5 py-10 md:px-7 xl:px-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <LayoutDashboard className="size-4" />
          Workspace · <span className="font-medium capitalize">{slug.replace(/-/g, " ")}</span>
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Resumen</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Mockup del área de negocio. Aún no hay datos reales.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {shortcuts.map((shortcut) => (
          <a
            key={shortcut.href}
            href={shortcut.href}
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

      <div className="mt-8 rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Este es el área donde crecerán los módulos del workspace (Catálogo, Ventas,
          CRM, Reportes, etc.).
        </p>
      </div>
    </div>
  );
}