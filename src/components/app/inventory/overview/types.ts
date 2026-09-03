import type { InventoryItem } from "@/lib/mock/inventory";

export interface InventoryMovement {
  id: string;
  itemId: string;
  type: "entrada" | "salida" | "merma" | "ajuste";
  quantity: number;
  resultingStock: number;
  createdAt: string;
  reason?: string;
  notes?: string;
  documentRef?: string;
  previousStock?: number;
}

export interface MovementMetadata {
  reason: string;
  notes?: string;
  documentRef?: string;
  unitCost?: number;
}

export interface CommonDialogProps {
  item: InventoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
