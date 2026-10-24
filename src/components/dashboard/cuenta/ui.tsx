import { cn } from "@/lib/utils";

/** Piezas visuales compartidas por las secciones de Mi cuenta. */

export const btnPrimary =
  "inline-flex items-center gap-1.5 rounded-sm bg-foreground px-2.5 py-1.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:pointer-events-none disabled:opacity-50";

export const btnSecondary =
  "inline-flex items-center gap-1.5 rounded-sm bg-muted px-2.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/70 disabled:pointer-events-none disabled:opacity-50";

export const chip =
  "inline-flex h-8 items-center gap-1.5 rounded-sm border px-2.5 text-[13px] font-medium uppercase tracking-wide";

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

/** Fila de ajuste con borde: icono opcional, texto y acción a la derecha. */
export const SettingsRow = ({
  icon: Icon,
  label,
  children,
  action,
  className,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: React.ReactNode;
  children?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex flex-wrap items-center justify-between gap-3 rounded-sm border border-border p-2", className)}>
    <div className="flex min-w-0 flex-1 items-center gap-3">
      {Icon && (
        <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-muted text-foreground">
          <Icon className="size-5" />
        </span>
      )}
      <div className={cn("min-w-0", !Icon && "px-1")}>
        <div className="text-sm font-medium">{label}</div>
        {children && <div className="text-sm text-muted-foreground">{children}</div>}
      </div>
    </div>
    {action && <div className="flex items-center gap-1.5">{action}</div>}
  </div>
);
