"use client";

import { useState } from "react";
import { inventoryItems as initialItems, type InventoryItem } from "@/lib/mock/inventory";
import { InventoryHeader } from "./InventoryHeader";
import { InventoryKpis } from "./InventoryKpis";
import { InventoryList } from "./InventoryList";
import { RegisterEntryDialog } from "./RegisterEntryDialog";

export function InventoryModule() {
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [selectedItemForEntry, setSelectedItemForEntry] = useState<InventoryItem | null>(null);

  const handleOpenRegister = (item?: InventoryItem) => {
    setSelectedItemForEntry(item || null);
    setRegisterOpen(true);
  };

  const handleStockEntrySuccess = (itemId: string, addedStock: number) => {
    setItems((prevItems) =>
      prevItems.map((i) =>
        i.id === itemId
          ? { ...i, currentStock: i.currentStock + addedStock }
          : i
      )
    );
  };

  return (
    <div className="w-full space-y-7 px-5 py-7 md:px-7 xl:px-10">
      <InventoryHeader onRegisterEntry={() => handleOpenRegister()} />
      <InventoryKpis items={items} />
      <InventoryList items={items} onRegisterEntry={handleOpenRegister} />

      <RegisterEntryDialog
        open={registerOpen}
        onOpenChange={setRegisterOpen}
        items={items}
        preselectedItem={selectedItemForEntry}
        onSuccess={handleStockEntrySuccess}
      />
    </div>
  );
}
