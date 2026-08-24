import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

interface ToastProps {
  children?: ReactNode;
  formId?: string;
  onCancel?: () => void;
  submitLabel?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

export const Toast = ({
  children,
  formId,
  onCancel,
  submitLabel = "Guardar cambios",
  disabled = false,
  ariaLabel = "Acciones",
}: ToastProps) => {
  return (
    <div
      className="flex items-center gap-x-1 rounded-full bg-black p-1.5 w-fit"
      role="group"
      aria-label={ariaLabel}
    >
      {children ?? (
        <>
          <Button
            type="button"
            onClick={onCancel}
            disabled={disabled}
            variant="link"
            className="px-3 text-white"
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            form={formId}
            variant="secondary"
            disabled={disabled}
            className="px-3 rounded-full"
          >
            {submitLabel}
          </Button>
        </>
      )}
    </div>
  );
};
