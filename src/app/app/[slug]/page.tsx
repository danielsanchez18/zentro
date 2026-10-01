import { LayoutDashboard } from "lucide-react";
import { QuickLinks } from "@/components/app/overview/QuickLinks";

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Landing «Resumen» del Tenant Workspace (mockup de flujo).
 *
 * Página placeholder para visualizar el layout (Header + Sidebar). Muestra el
 * slug de la organización y accesos directos a los módulos principales filtrados
 * por el contexto del workspace (`QuickLinks`, client-side).
 */
export default async function AppHomePage({ params }: Props) {
  const { slug } = await params;

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

      <QuickLinks slug={slug} />

      <div className="mt-8 rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Este es el área donde crecerán los módulos del workspace (Catálogo, Ventas,
          CRM, Reportes, etc.).
        </p>
      </div>
    </div>
  );
}