import { cn } from "@/lib/utils";

/**
 * Loader de carga de página del Hub: modal centrado sobre un fondo difuminado,
 * con el isotipo de Zentro animado (bloques que se iluminan en secuencia) y
 * una barra indeterminada. Las animaciones viven en hub.css (.hub-loader-*).
 */
export const HubPageLoader = ({
  label = "Cargando",
  className,
}: {
  label?: string;
  className?: string;
}) => (
  <div
    role="status"
    aria-live="polite"
    className={cn(
      "fixed inset-0 z-[90] flex items-center justify-center bg-background/60 p-4 backdrop-blur-sm",
      className,
    )}
  >
    <div className="hub-loader flex w-56 flex-col items-center rounded-sm bg-card px-6 py-6 shadow-lg">
      <div className="grid grid-cols-3 gap-1.5" aria-hidden="true">
        {Array.from({ length: 9 }, (_, index) => (
          <span
            key={index}
            className="hub-loader-cell size-3.5 rounded-[4px] bg-muted"
            style={{ animationDelay: `${(index % 3 + Math.floor(index / 3)) * 120}ms` }}
          />
        ))}
      </div>
      <p className="mt-5 text-sm font-medium">
        {label}
        <span className="hub-loader-dots" aria-hidden="true" />
      </p>
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted">
        <div className="hub-loader-bar h-full w-1/3 rounded-full bg-hub-accent" />
      </div>
    </div>
  </div>
);
