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

// Re-export del modelo del hub (servicios/orgs.service.ts) para consumo del dashboard.
export type { HubOrganization } from "@/lib/services/orgs.service";
