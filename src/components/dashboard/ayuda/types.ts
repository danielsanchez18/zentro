export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED";

export interface SupportTicket {
  id: string;
  reference: string;
  category: string;
  tenantName: string;
  subject: string;
  message: string;
  status: TicketStatus;
  createdAt: string;
}

export const TICKETS_STORAGE_KEY = "zentro-tickets";
