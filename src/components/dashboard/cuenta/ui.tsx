import { cn } from "@/lib/utils";
import { hubButton } from "@/components/dashboard/shared/styles";

/** Piezas visuales compartidas por las secciones de Mi cuenta. */

export const btnPrimary = hubButton.primary;

export const btnSecondary = hubButton.secondary;


/** Bloque de una sección: título + descripción + contenido. */
export const SettingsBlock = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <section className="space-y-4 rounded-sm bg-card px-4 py-3">
    <div>
      <h2 className="font-sans text-base font-medium">{title}</h2>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
    {children}
  </section>
);

/**
 * Fila de ajuste con borde: icono (o `media`, p. ej. la foto), texto y acción a
 * la derecha. Con `footer` (modo edición) el contenido se alinea arriba y los
 * botones del footer van debajo de los campos.
 */
export const SettingsRow = ({
  icon: Icon,
  media,
  label,
  children,
  action,
  footer,
  className,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  media?: React.ReactNode;
  label: React.ReactNode;
  children?: React.ReactNode;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) => {
  const editing = Boolean(footer);
  const leading =
    media ??
    (Icon && (
      <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-muted text-foreground">
        <Icon className="size-5" />
      </span>
    ));
  return (
    <div
      className={cn(
        "flex flex-wrap justify-between gap-3 rounded-sm border border-border p-2",
        editing ? "items-start" : "items-center",
        className,
      )}
    >
      <div className={cn("flex min-w-0 flex-1 gap-3", editing ? "items-start" : "items-center")}>
        {leading && <div className={cn("shrink-0", editing && "mt-1")}>{leading}</div>}
        <div className={cn("min-w-0 flex-1", !leading && "px-1")}>
          <div className="text-sm font-medium">{label}</div>
          {children && <div className="text-sm text-muted-foreground">{children}</div>}
          {footer && <div className="mt-3 flex flex-wrap items-center gap-1.5">{footer}</div>}
        </div>
      </div>
      {/* En móvil la acción baja debajo del texto, alineada con él. */}
      {action && (
        <div className={cn("flex flex-wrap items-center gap-1.5 max-sm:w-full", leading && "max-sm:pl-13")}>
          {action}
        </div>
      )}
    </div>
  );
};

/** Mensaje legible de un error de la API (o genérico). */
export const errorMessage = (error: unknown, fallback = "Ocurrió un error. Inténtalo de nuevo.") =>
  error instanceof Error && error.message ? error.message : fallback;
