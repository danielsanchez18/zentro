interface TitleProps {
  title: string;
  description?: string;
}

/** Encabezado de sección de la página de Usuarios. */
export function Title({ title, description }: TitleProps) {
  return (
    <div className="space-y-1">
      <h1 className="text-lg font-mediun">{title}</h1>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}