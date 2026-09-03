"use client";

import { useState } from "react";
import type { InventoryItem } from "@/lib/mock/inventory";
import { useInventoryStore } from "@/stores/inventory-store";
import { InventoryHeader } from "./InventoryHeader";
import { InventoryKpis } from "./InventoryKpis";
import { InventoryList } from "./InventoryList";
import { RegisterEntryDialog } from "./RegisterEntryDialog";
import type { MovementMetadata } from "./types";
import { InventoryNav } from "../shared/InventoryNav";

export function InventoryModule({ slug }: { slug: string }) {
  const items = useInventoryStore((state) => state.items);
  const updateItem = useInventoryStore((state) => state.updateItem);
  const addMovement = useInventoryStore((state) => state.addMovement);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [selectedItemForEntry, setSelectedItemForEntry] = useState<InventoryItem | null>(null);

  const handleOpenRegister = (item?: InventoryItem) => {
    setSelectedItemForEntry(item || null);
    setRegisterOpen(true);
  };

  const handleStockEntrySuccess = (itemId: string, addedStock: number, metadata: MovementMetadata) => {
    const item = items.find((candidate) => candidate.id === itemId);
    const resultingStock = (item?.currentStock ?? 0) + addedStock;
    updateItem(itemId, { currentStock: resultingStock, unitCost: metadata.unitCost ?? item?.unitCost, updatedAt: new Date().toISOString() });
    addMovement({ id: `mov_${Date.now()}_${itemId}`, itemId, type: "entrada", quantity: addedStock, previousStock: item?.currentStock, resultingStock, createdAt: new Date().toISOString(), ...metadata });
  };

  const handleUpdateItem = (itemId: string, changes: Partial<InventoryItem>) => {
    updateItem(itemId, changes);
  };

  return (
    <div className="w-full space-y-7 px-5 py-7 md:px-7 xl:px-10">
      <InventoryNav slug={slug} />
      <InventoryHeader onRegisterEntry={() => handleOpenRegister()} />
      <InventoryKpis items={items} />
      <InventoryList slug={slug} items={items} onRegisterEntry={handleOpenRegister} onUpdateItem={handleUpdateItem} onAddMovement={addMovement} />

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
