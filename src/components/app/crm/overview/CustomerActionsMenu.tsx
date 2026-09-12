"use client";

import { Ban, Eye, MoreHorizontal, Pencil, RotateCcw, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CrmCustomer } from "@/lib/mock/crm";

interface CustomerActionsMenuProps {
  customer: CrmCustomer;
  onOpen: (customer: CrmCustomer) => void;
  onEdit: (customer: CrmCustomer) => void;
  onToggleStatus: (customer: CrmCustomer) => void;
  onRemove: (customer: CrmCustomer) => void;
}

export function CustomerActionsMenu({
  customer,
  onOpen,
  onEdit,
  onToggleStatus,
  onRemove,
}: CustomerActionsMenuProps) {
  const isActive = customer.status === "activo";
  const StatusIcon = isActive ? Ban : RotateCcw;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        onClick={(event) => event.stopPropagation()}
        className="cursor-pointer rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
        aria-label={`Acciones de ${customer.name}`}
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 font-heading"
        onClick={(event) => event.stopPropagation()}
      >
        <DropdownMenuItem onClick={() => onOpen(customer)} className="cursor-pointer gap-2">
          <Eye className="size-4" />
          Ver detalle
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(customer)} className="cursor-pointer gap-2">
          <Pencil className="size-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onToggleStatus(customer)} className="cursor-pointer gap-2">
          <StatusIcon className="size-4" />
          {isActive ? "Deshabilitar" : "Habilitar"}
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={() => onRemove(customer)} className="cursor-pointer gap-2">
          <Trash2 className="size-4" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
