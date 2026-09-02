"use client";

import { useState } from "react";
import { inventoryItems as initialItems, type InventoryItem } from "@/lib/mock/inventory";
import { InventoryHeader } from "./InventoryHeader";
import { InventoryKpis } from "./InventoryKpis";
import { InventoryList } from "./InventoryList";
import { RegisterEntryDialog } from "./RegisterEntryDialog";
import type { InventoryMovement, MovementMetadata } from "./types";

export function InventoryModule() {
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [selectedItemForEntry, setSelectedItemForEntry] = useState<InventoryItem | null>(null);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);

  const handleOpenRegister = (item?: InventoryItem) => {
    setSelectedItemForEntry(item || null);
    setRegisterOpen(true);
  };

  const handleStockEntrySuccess = (itemId: string, addedStock: number, metadata: MovementMetadata) => {
    const item = items.find((candidate) => candidate.id === itemId);
    const resultingStock = (item?.currentStock ?? 0) + addedStock;
    setItems((prevItems) =>
      prevItems.map((i) =>
        i.id === itemId
          ? { ...i, currentStock: i.currentStock + addedStock, unitCost: metadata.unitCost ?? i.unitCost, updatedAt: new Date().toISOString() }
          : i
      )
    );
    setMovements((current) => [{ id: `mov_${Date.now()}_${itemId}`, itemId, type: "entrada", quantity: addedStock, previousStock: item?.currentStock, resultingStock, createdAt: new Date().toISOString(), ...metadata }, ...current]);
  };

  const handleUpdateItem = (itemId: string, changes: Partial<InventoryItem>) => {
    setItems((current) => current.map((item) => item.id === itemId ? { ...item, ...changes } : item));
  };

  return (
    <div className="w-full space-y-7 px-5 py-7 md:px-7 xl:px-10">
      <InventoryHeader onRegisterEntry={() => handleOpenRegister()} />
      <InventoryKpis items={items} />
      <InventoryList items={items} onRegisterEntry={handleOpenRegister} onUpdateItem={handleUpdateItem} movements={movements} onAddMovement={(movement) => setMovements((current) => [movement, ...current])} />

      {registerOpen && <RegisterEntryDialog
        open={registerOpen}
        onOpenChange={setRegisterOpen}
        items={items}
        preselectedItem={selectedItemForEntry}
        onSuccess={handleStockEntrySuccess}
      />}
    </div>
  );
}
