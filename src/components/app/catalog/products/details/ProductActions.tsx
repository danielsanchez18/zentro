import { Button } from "@/components/ui/button";
import { Toast } from "@/components/app/shared/Toast";

interface ProductActionsProps {
  isEnabled: boolean;
  onEdit: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
}

export function ProductActions({
  isEnabled,
  onEdit,
  onToggleStatus,
  onDelete,
}: ProductActionsProps) {
  return (
    <Toast ariaLabel="Acciones del producto">
      <Button
        type="button"
        variant="link"
        onClick={onDelete}
        className="px-3 text-rose-400 cursor-pointer"
      >
        Eliminar
      </Button>
      <Button
        type="button"
        variant="link"
        onClick={onEdit}
        className="px-3 text-green-500 cursor-pointer"
      >
        Editar
      </Button>
      <Button
        type="button"
        variant="link"
        onClick={onToggleStatus}
        className={isEnabled
          ? "px-3 text-white cursor-pointer"
          : "px-3 text-white cursor-pointer"}
      >
        {isEnabled ? "Deshabilitar" : "Habilitar"}
      </Button>
    </Toast>
  );
}
