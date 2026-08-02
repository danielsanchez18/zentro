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

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: string;
  amount: string;
}

export interface InvoiceParty {
  name: string;
  taxId: string;
  address: string;
}

export interface InvoiceDetail {
  seriesNumber: string;
  issuedDate: string;
  dueDateFull: string;
  periodFull: string;
  currency: string;
  issuer: InvoiceParty;
  client: InvoiceParty;
  items: InvoiceLineItem[];
  subtotal: string;
  taxLabel: string;
  taxAmount: string;
  total: string;
  paymentMethod: string;
  notes?: string;
}

export interface Invoice {
  id: string;
  number: string;
  orgName: string;
  period: string;
  amount: string;
  status: InvoiceStatus;
  dueDate: string;
  // TODO(0.2): URL del PDF generado por el backend (POST /orgs/:orgId/invoices/:id/pdf)
  pdfUrl?: string;
  detail?: InvoiceDetail;
}
