import { create } from "zustand";
import { crmCustomers, type CrmCustomer } from "@/lib/mock/crm";

interface CrmStore {
  customers: CrmCustomer[];
  addCustomer: (customer: CrmCustomer) => void;
  updateCustomer: (id: string, changes: Partial<CrmCustomer>) => void;
  removeCustomer: (id: string) => void;
}

export const useCrmStore = create<CrmStore>((set) => ({
  customers: crmCustomers,
  addCustomer: (customer) => set((state) => ({ customers: [customer, ...state.customers] })),
  updateCustomer: (id, changes) => set((state) => ({ customers: state.customers.map((customer) => customer.id === id ? { ...customer, ...changes, updatedAt: new Date().toISOString() } : customer) })),
  removeCustomer: (id) => set((state) => ({ customers: state.customers.filter((customer) => customer.id !== id) })),
}));
