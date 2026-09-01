"use client";

import {
  MoreHorizontal,
  Eye,
  Pencil,
  PackageX,
  PackageCheck,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { CatalogProduct } from "@/lib/mock/catalog";

interface ProductActionsMenuProps {
  product: CatalogProduct;
  onPreview: (product: CatalogProduct) => void;
  onEdit: (product: CatalogProduct) => void;
  onRequestToggleStatus: (product: CatalogProduct) => void;
  onRequestRemove: (product: CatalogProduct) => void;
}

/**
 * Menú de acciones (⋮) de un producto.
 * Detiene la propagación del clic para no abrir el preview desde la card/fila.
 */
export const ProductActionsMenu = ({
  product,
  onPreview,
  onEdit,
  onRequestToggleStatus,
  onRequestRemove,
}: ProductActionsMenuProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger
      onClick={(e) => e.stopPropagation()}
      className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
      aria-label={`Acciones de ${product.name}`}
    >
      <MoreHorizontal className="size-4" />
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="end"
      className="w-48"
      onClick={(e) => e.stopPropagation()}
    >
      <DropdownMenuItem onClick={() => onPreview(product)} className="py-1.5 px-2">
        <Eye />
        Ver detalle
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onEdit(product)} className="py-1.5 px-2">
        <Pencil />
        Editar
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      {product.status === "inactivo" ? (
        <DropdownMenuItem
          onClick={() => onRequestToggleStatus(product)}
          className="py-1.5 px-2"
        >
          <PackageCheck />
          Activar
        </DropdownMenuItem>
      ) : (
        <DropdownMenuItem
          onClick={() => onRequestToggleStatus(product)}
          className="py-1.5 px-2"
        >
          <PackageX />
          Desactivar
        </DropdownMenuItem>
      )}

      <DropdownMenuItem
        variant="destructive"
        onClick={() => onRequestRemove(product)}
        className="py-1.5 px-2"
      >
        <Trash2 />
        Eliminar
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
