import { create } from "zustand";
import type { PosCartLine, SuspendedSale } from "@/components/app/pos/shared/types";

interface PosStore {
  lines: PosCartLine[];
  suspended: SuspendedSale[];
  addLine: (line: Omit<PosCartLine, "id" | "quantity" | "note">) => void;
  setQuantity: (id: string, quantity: number) => void;
  setNote: (id: string, note: string) => void;
  removeLine: (id: string) => void;
  clear: () => void;
  suspend: (name: string) => boolean;
  resume: (id: string) => void;
  discard: (id: string) => void;
}

export const usePosStore = create<PosStore>((set, get) => ({
  lines: [],
  suspended: [],
  addLine: (input) => set((state) => {
    const existing = state.lines.find((line) => line.productId === input.productId && line.variantId === input.variantId);
    if (existing) return { lines: state.lines.map((line) => line.id === existing.id ? { ...line, quantity: Math.min(line.stock, line.quantity + 1) } : line) };
    return { lines: [...state.lines, { ...input, id: `pos_line_${Date.now()}`, quantity: 1, note: "" }] };
  }),
  setQuantity: (id, quantity) => set((state) => ({ lines: state.lines.map((line) => line.id === id ? { ...line, quantity: Math.min(line.stock, Math.max(1, quantity)) } : line) })),
  setNote: (id, note) => set((state) => ({ lines: state.lines.map((line) => line.id === id ? { ...line, note } : line) })),
  removeLine: (id) => set((state) => ({ lines: state.lines.filter((line) => line.id !== id) })),
  clear: () => set({ lines: [] }),
  suspend: (name) => {
    if (!name.trim() || get().lines.length === 0) return false;
    set((state) => ({ suspended: [...state.suspended, { id: `suspended_${Date.now()}`, name: name.trim(), lines: state.lines, createdAt: new Date().toISOString() }], lines: [] }));
    return true;
  },
  resume: (id) => set((state) => {
    const sale = state.suspended.find((item) => item.id === id);
    return sale ? { lines: sale.lines, suspended: state.suspended.filter((item) => item.id !== id) } : state;
  }),
  discard: (id) => set((state) => ({ suspended: state.suspended.filter((item) => item.id !== id) })),
}));

