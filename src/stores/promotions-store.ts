import { create } from "zustand";
import { promotions as initialPromotions, type Promotion, type PromotionStatus } from "@/lib/mock/promotions";

interface PromotionsStore {
  promotions: Promotion[];
  addPromotion: (promotion: Promotion) => void;
  updatePromotion: (id: string, changes: Partial<Promotion>) => void;
  setStatus: (id: string, status: PromotionStatus) => void;
  removePromotion: (id: string) => void;
}

export const usePromotionsStore = create<PromotionsStore>((set) => ({
  promotions: initialPromotions,
  addPromotion: (promotion) => set((state) => ({ promotions: [promotion, ...state.promotions] })),
  updatePromotion: (id, changes) => set((state) => ({ promotions: state.promotions.map((promotion) => promotion.id === id ? { ...promotion, ...changes } : promotion) })),
  setStatus: (id, status) => set((state) => ({ promotions: state.promotions.map((promotion) => promotion.id === id ? { ...promotion, status } : promotion) })),
  removePromotion: (id) => set((state) => ({ promotions: state.promotions.filter((promotion) => promotion.id !== id) })),
}));
