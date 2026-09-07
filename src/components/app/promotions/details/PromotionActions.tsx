import { Button } from "@/components/ui/button";
import { Toast } from "@/components/app/shared/Toast";
import type { PromotionStatus } from "@/lib/mock/promotions";

interface PromotionActionsProps {
  status: PromotionStatus;
  onEdit: () => void;
  onPublish: () => void;
  onTogglePause: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

export function PromotionActions({
  status,
  onEdit,
  onPublish,
  onTogglePause,
  onCancel,
  onDelete,
}: PromotionActionsProps) {
  const isTerminated = status === "finalizada" || status === "cancelada";
  if (isTerminated) return null;

  return (
    <Toast ariaLabel="Acciones de la promoción">
      {/* 1. Editar (Verde) */}
      <Button
        type="button"
        variant="link"
        onClick={onEdit}
        className="cursor-pointer px-3 text-green-500"
      >
        Editar
      </Button>

      {/* 2. Acción de estado principal (Blanco) */}
      {status === "borrador" && (
        <Button
          type="button"
          variant="link"
          onClick={onPublish}
          className="cursor-pointer px-3 text-white"
        >
          Publicar
        </Button>
      )}

      {(status === "activa" || status === "programada") && (
        <Button
          type="button"
          variant="link"
          onClick={onTogglePause}
          className="cursor-pointer px-3 text-white"
        >
          Pausar
        </Button>
      )}

      {status === "pausada" && (
        <Button
          type="button"
          variant="link"
          onClick={onTogglePause}
          className="cursor-pointer px-3 text-white"
        >
          Reanudar
        </Button>
      )}

      {/* 3. Acción destructiva (Rojo) */}
      {status === "borrador" ? (
        <Button
          type="button"
          variant="link"
          onClick={onDelete}
          className="cursor-pointer px-3 text-rose-400"
        >
          Eliminar
        </Button>
      ) : (
        <Button
          type="button"
          variant="link"
          onClick={onCancel}
          className="cursor-pointer px-3 text-rose-400"
        >
          Cancelar
        </Button>
      )}
    </Toast>
  );
}
