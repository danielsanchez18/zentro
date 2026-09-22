import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ToastProps {
  children?: ReactNode;
  formId?: string;
  onCancel?: () => void;
  onPreview?: () => void;
  previewLabel?: string;
  submitLabel?: string;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

export const Toast = ({
  children,
  formId,
  onCancel,
  onPreview,
  previewLabel = "Preview",
  submitLabel = "Guardar cambios",
  disabled = false,
  ariaLabel = "Acciones",
  className,
}: ToastProps) => {
  return (
    <div
      className={cn(
        "flex max-w-[calc(100vw-2rem)] items-center gap-x-1 overflow-x-auto rounded-full bg-black p-1.5 w-fit scrollbar-hide",
        className,
      )}
      role="group"
      aria-label={ariaLabel}
    >
      {children ?? (
        <>
          {onPreview && (
            <Button
              type="button"
              onClick={onPreview}
              disabled={disabled}
              variant="link"
              className="cursor-pointer gap-1.5 pl-3 pr-0 text-white hover:text-white/80 text-sm font-medium shrink-0 whitespace-nowrap"
            >
              {previewLabel}
            </Button>
          )}

          <Button
            type="button"
            onClick={onCancel}
            disabled={disabled}
            variant="link"
            className="cursor-pointer px-3 text-white hover:text-white/80 text-sm font-medium shrink-0 whitespace-nowrap"
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            form={formId}
            variant="secondary"
            disabled={disabled}
            className="cursor-pointer px-3.5 rounded-full text-sm font-medium shrink-0 whitespace-nowrap"
          >
            {submitLabel}
          </Button>
        </>
      )}
    </div>
  );
};
