"use client";

import {
  MoreHorizontal,
  PackagePlus,
  PackageMinus,
  SlidersHorizontal,
  History,
  ExternalLink,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { InventoryItem } from "@/lib/mock/inventory";
import { toastMsg } from "@/components/ui/toast-message";

interface InventoryItemActionsProps {
  item: InventoryItem;
  onPreview?: (item: InventoryItem) => void;
  onRegisterEntry: (item: InventoryItem) => void;
  onRegisterOutput?: (item: InventoryItem) => void;
  onRegisterWaste?: (item: InventoryItem) => void;
  onEditMinStock?: (item: InventoryItem) => void;
  onAdjustStock?: (item: InventoryItem) => void;
  onViewHistory?: (item: InventoryItem) => void;
}

export function InventoryItemActions({
  item,
  onPreview,
  onRegisterEntry,
  onRegisterOutput,
  onRegisterWaste,
  onEditMinStock,
  onAdjustStock,
  onViewHistory,
}: InventoryItemActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label={`Acciones de ${item.productName}`}
            onClick={(e) => e.stopPropagation()}
            className="size-8 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
          />
        }
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 font-heading">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2.5 py-1.5 truncate text-sm font-medium text-foreground">
            {item.productName}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onRegisterOutput?.(item);
          }}
          className="cursor-pointer gap-2 px-2.5 py-1.5"
        >
          <PackageMinus className="size-4" />
          <span>Registrar salida</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onAdjustStock?.(item);
          }}
          className="cursor-pointer gap-2 px-2.5 py-1.5"
        >
          <SlidersHorizontal className="size-4" />
          <span>Ajustar stock físico</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onPreview?.(item);
          }}
          className="cursor-pointer gap-2 px-2.5 py-1.5"
        >
          <ExternalLink className="size-4" />
          <span>Ver resumen</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onRegisterEntry(item);
          }}
          className="cursor-pointer gap-2 px-2.5 py-1.5"
        >
          <PackagePlus className="size-4" />
          <span>Registrar entrada</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onRegisterWaste?.(item);
          }}
          className="cursor-pointer gap-2 px-2.5 py-1.5 text-destructive focus:text-destructive"
        >
          <PackageMinus className="size-4" />
          <span>Registrar merma</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            if (onEditMinStock) {
              onEditMinStock(item);
            } else {
              toastMsg.info(
                "Límite de stock",
                `Stock mínimo de ${item.productName}: ${item.minimumStock} unidades`,
              );
            }
          }}
          className="cursor-pointer gap-2 px-2.5 py-1.5"
        >
          <PackageMinus className="size-4" />
          <span>Editar stock mínimo</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            if (onViewHistory) {
              onViewHistory(item);
            } else {
              toastMsg.info(
                "Historial",
                `Ver bitácora de movimientos de ${item.productName}`,
              );
            }
          }}
          className="cursor-pointer gap-2 px-2.5 py-1.5"
        >
          <History className="size-4" />
          <span>Ver historial</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
