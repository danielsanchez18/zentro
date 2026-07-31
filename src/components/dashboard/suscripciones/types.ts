import type { SubscriptionStatus } from "@/components/dashboard/overview/StatusChip";

export interface Subscription {
  id: string;
  orgName: string;
  slug: string;
  plan: string;
  status: SubscriptionStatus;
  period: string;
  price: string;
  nextCharge: string;
  usage: {
    users: { used: number; limit: number };
    branches: { used: number; limit: number };
  };
}

export type InvoiceStatus = "PAID" | "OPEN" | "VOID";

export interface Invoice {
  id: string;
  number: string;
  orgName: string;
  period: string;
  amount: string;
  status: InvoiceStatus;
  dueDate: string;
}
