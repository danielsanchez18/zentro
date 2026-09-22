import { create } from "zustand";
import { formResponsesMock, formsMock, type FormResponse, type FormResponseStatus, type FormStatus, type ZentroForm } from "@/lib/mock/forms";

interface FormsStore {
  forms: ZentroForm[];
  responses: FormResponse[];
  setStatus: (id: string, status: FormStatus) => void;
  duplicateForm: (id: string) => void;
  removeForm: (id: string) => void;
  createForm: (form: ZentroForm) => void;
  updateForm: (id: string, form: Partial<ZentroForm>) => void;
  addResponse: (response: FormResponse) => void;
  setResponseStatus: (id: string, status: FormResponseStatus) => void;
  convertResponse: (id: string, destination: "crm" | "agenda" | "pedidos") => void;
}

export const useFormsStore = create<FormsStore>((set) => ({
  forms: formsMock,
  responses: formResponsesMock,
  setStatus: (id, status) =>
    set((state) => ({
      forms: state.forms.map((form) =>
        form.id === id
          ? { ...form, status, updatedAt: new Date().toISOString() }
          : form,
      ),
    })),
  duplicateForm: (id) =>
    set((state) => {
      const source = state.forms.find((form) => form.id === id);
      if (!source) return state;
      const now = new Date().toISOString();
      return {
        forms: [
          {
            ...source,
            id: `form_${crypto.randomUUID()}`,
            name: `${source.name} — copia`,
            status: "borrador",
            submissions: 0,
            unreadSubmissions: 0,
            completionRate: 0,
            publicPath: `${source.publicPath}-copia`,
            createdAt: now,
            updatedAt: now,
          },
          ...state.forms,
        ],
      };
    }),
  removeForm: (id) =>
    set((state) => ({
      forms: state.forms.filter((form) => form.id !== id),
    })),
  createForm: (form) => set((state) => ({ forms: [form, ...state.forms] })),
  updateForm: (id, values) =>
    set((state) => ({
      forms: state.forms.map((form) =>
        form.id === id ? { ...form, ...values, updatedAt: new Date().toISOString() } : form,
      ),
    })),
  addResponse: (response) => set((state) => ({
    responses: [{ ...response, history: [{ id: `event_${crypto.randomUUID()}`, label: "Respuesta recibida", createdAt: response.submittedAt }] }, ...state.responses],
    forms: state.forms.map((form) => form.id === response.formId ? { ...form, submissions: form.submissions + 1, unreadSubmissions: form.unreadSubmissions + 1 } : form),
  })),
  setResponseStatus: (id, status) => set((state) => ({ responses: state.responses.map((response) => response.id === id ? { ...response, status, history: [...(response.history ?? []), { id: `event_${crypto.randomUUID()}`, label: `Estado cambiado a ${status}`, createdAt: new Date().toISOString() }] } : response) })),
  convertResponse: (id, destination) => set((state) => ({ responses: state.responses.map((response) => response.id === id ? { ...response, status: "convertida", conversion: { destination, referenceId: `${destination}_${crypto.randomUUID().slice(0, 8)}`, createdAt: new Date().toISOString() }, history: [...(response.history ?? []), { id: `event_${crypto.randomUUID()}`, label: destination === "crm" ? "Convertida en cliente CRM" : destination === "agenda" ? "Convertida en solicitud de cita" : "Convertida en solicitud de pedido", createdAt: new Date().toISOString() }] } : response) })),
}));
