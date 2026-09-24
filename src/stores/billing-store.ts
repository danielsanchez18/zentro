import { create } from "zustand";
import {
  billingInvoicesMock,
  billingNotesMock,
  billingConfigMock,
  type Invoice,
  type InvoiceNote,
  type BillingConfig,
  type InvoiceStatus,
} from "@/lib/mock/billing";

interface BillingState {
  invoices: Invoice[];
  notes: InvoiceNote[];
  config: BillingConfig;
  addInvoice: (invoice: Invoice) => void;
  updateInvoiceStatus: (id: string, status: InvoiceStatus, notes?: string) => void;
  addNote: (note: InvoiceNote) => void;
  updateConfig: (values: Partial<BillingConfig>) => void;
}

export const useBillingStore = create<BillingState>((set) => ({
  invoices: billingInvoicesMock,
  notes: billingNotesMock,
  config: billingConfigMock,
  addInvoice: (invoice) =>
    set((state) => ({ invoices: [invoice, ...state.invoices] })),
  updateInvoiceStatus: (id, status, annulledReason) =>
    set((state) => ({
      invoices: state.invoices.map((inv) =>
        inv.id === id
          ? {
              ...inv,
              status,
              ...(status === "enviado" ? { sentAt: new Date().toISOString() } : {}),
              ...(status === "pagado" ? { paidAt: new Date().toISOString() } : {}),
              ...(status === "anulado"
                ? {
                    annulledAt: new Date().toISOString(),
                    annulledReason,
                  }
                : {}),
            }
          : inv,
      ),
    })),
  addNote: (note) =>
    set((state) => ({ notes: [note, ...state.notes] })),
  updateConfig: (values) =>
    set((state) => ({
      config: { ...state.config, ...values },
    })),
}));
