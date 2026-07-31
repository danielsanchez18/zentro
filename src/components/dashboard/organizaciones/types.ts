import type { SubscriptionStatus } from "@/components/dashboard/overview/StatusChip";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: string;
  role: string;
  status: SubscriptionStatus;
  members: number;
  branches: number;
}
