import type { PromotionScope, PromotionType } from "@/lib/mock/promotions";

export interface PromotionFormValues {
  name: string;
  description: string;
  type: PromotionType;
  value: string;
  scope: PromotionScope;
  targetIds: string[];
  targetUnits?: Record<string, number>;
  startsAt: string;
  endsAt: string;
  priority: string;
  unlimitedUsage: boolean;
  usageLimit: string;
}

