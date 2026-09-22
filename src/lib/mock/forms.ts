export type FormStatus = "borrador" | "activo" | "pausada" | "finalizada";
export type FormType =
  | "contacto"
  | "cotizacion"
  | "reserva"
  | "encuesta"
  | "personalizado";
export type FormChannel = "web" | "marketplace" | "enlace" | "interno";
export type FormDestination = "crm" | "agenda" | "pedidos" | "ninguno";
export type FormFieldType = "text" | "email" | "phone" | "number" | "textarea" | "select" | "date" | "checkbox";

export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  options?: string[];
}

export interface ZentroForm {
  id: string;
  name: string;
  description: string;
  type: FormType;
  status: FormStatus;
  channel: FormChannel;
  destination: FormDestination;
  fieldCount: number;
  submissions: number;
  unreadSubmissions: number;
  completionRate: number;
  publicPath: string;
  createdAt: string;
  updatedAt: string;
  fields?: FormField[];
  successMessage?: string;
}

export type FormResponseStatus = "nueva" | "revisada" | "convertida" | "descartada";
export interface FormResponseEvent {
  id: string;
  label: string;
  createdAt: string;
}
export interface FormConversion {
  destination: Exclude<FormDestination, "ninguno">;
  referenceId: string;
  createdAt: string;
}
export interface FormResponse {
  id: string;
  formId: string;
  status: FormResponseStatus;
  channel: FormChannel;
  submittedAt: string;
  respondent: string;
  email?: string;
  values: Record<string, string | boolean>;
  history?: FormResponseEvent[];
  conversion?: FormConversion;
}

export const formResponsesMock: FormResponse[] = [
  { id: "response_1", formId: "form_1", status: "nueva", channel: "web", submittedAt: "2026-09-17T15:32:00-05:00", respondent: "Lucía Ramírez", email: "lucia.ramirez@example.com", values: { name: "Lucía Ramírez", phone: "+51 987 120 452", service: "Consulta", date: "2026-09-22" }, history: [{ id: "event_1", label: "Respuesta recibida desde Sitio web", createdAt: "2026-09-17T15:32:00-05:00" }] },
  { id: "response_2", formId: "form_1", status: "revisada", channel: "web", submittedAt: "2026-09-16T10:15:00-05:00", respondent: "Marco Villanueva", email: "marco.v@example.com", values: { name: "Marco Villanueva", phone: "+51 945 330 811", service: "Evaluación", date: "2026-09-20" } },
  { id: "response_3", formId: "form_2", status: "nueva", channel: "enlace", submittedAt: "2026-09-17T12:05:00-05:00", respondent: "Taller Norte", email: "compras@tallernorte.pe", values: { name: "Taller Norte", email: "compras@tallernorte.pe", need: "Cotización para 40 unidades", budget: "Más de S/ 2,000" } },
  { id: "response_4", formId: "form_3", status: "convertida", channel: "marketplace", submittedAt: "2026-09-15T18:42:00-05:00", respondent: "Andrea Salazar", email: "andrea.salazar@example.com", values: { name: "Andrea Salazar", email: "andrea.salazar@example.com", message: "Quiero conocer sus horarios." }, conversion: { destination: "crm", referenceId: "customer_form_4", createdAt: "2026-09-15T18:50:00-05:00" }, history: [{ id: "event_4a", label: "Respuesta recibida desde Marketplace", createdAt: "2026-09-15T18:42:00-05:00" }, { id: "event_4b", label: "Convertida en cliente CRM", createdAt: "2026-09-15T18:50:00-05:00" }] },
];

export const formTemplateFields: Record<FormType, FormField[]> = {
  contacto: [
    { id: "name", type: "text", label: "Nombre completo", placeholder: "Escribe tu nombre", required: true },
    { id: "email", type: "email", label: "Correo electrónico", placeholder: "correo@ejemplo.com", required: true },
    { id: "phone", type: "phone", label: "Teléfono", placeholder: "+51 999 999 999", required: false },
    { id: "message", type: "textarea", label: "Mensaje", placeholder: "¿Cómo podemos ayudarte?", required: true },
  ],
  cotizacion: [
    { id: "name", type: "text", label: "Nombre o empresa", required: true },
    { id: "email", type: "email", label: "Correo electrónico", required: true },
    { id: "need", type: "textarea", label: "¿Qué necesitas?", required: true },
    { id: "budget", type: "select", label: "Presupuesto aproximado", required: false, options: ["Menos de S/ 500", "S/ 500 a S/ 2,000", "Más de S/ 2,000"] },
  ],
  reserva: [
    { id: "name", type: "text", label: "Nombre completo", required: true },
    { id: "phone", type: "phone", label: "Teléfono", required: true },
    { id: "service", type: "select", label: "Servicio", required: true, options: ["Consulta", "Evaluación", "Otro"] },
    { id: "date", type: "date", label: "Fecha preferida", required: true },
  ],
  encuesta: [
    { id: "score", type: "select", label: "¿Cómo calificarías la atención?", required: true, options: ["Excelente", "Buena", "Regular", "Mala"] },
    { id: "comment", type: "textarea", label: "Cuéntanos más", required: false },
  ],
  personalizado: [],
};

export const formsMock: ZentroForm[] = [
  { id: "form_1", name: "Reserva una consulta", description: "Captura solicitudes desde el sitio y prepara una cita en Agenda.", type: "reserva", status: "activo", channel: "web", destination: "agenda", fieldCount: 7, submissions: 128, unreadSubmissions: 9, completionRate: 74, publicPath: "/f/reserva-consulta", createdAt: "2026-08-12T10:00:00-05:00", updatedAt: "2026-09-16T17:20:00-05:00" },
  { id: "form_2", name: "Solicita una cotización", description: "Recoge necesidades, presupuesto y datos de contacto comercial.", type: "cotizacion", status: "activo", channel: "enlace", destination: "crm", fieldCount: 9, submissions: 84, unreadSubmissions: 5, completionRate: 68, publicPath: "/f/solicita-cotizacion", createdAt: "2026-08-18T09:30:00-05:00", updatedAt: "2026-09-15T13:10:00-05:00" },
  { id: "form_3", name: "Contacto general", description: "Formulario breve para consultas desde la ficha pública del negocio.", type: "contacto", status: "activo", channel: "marketplace", destination: "crm", fieldCount: 4, submissions: 246, unreadSubmissions: 12, completionRate: 81, publicPath: "/f/contacto-general", createdAt: "2026-07-28T15:00:00-05:00", updatedAt: "2026-09-17T08:45:00-05:00" },
  { id: "form_4", name: "Encuesta posterior al servicio", description: "Mide satisfacción y comentarios después de una atención.", type: "encuesta", status: "pausada", channel: "enlace", destination: "ninguno", fieldCount: 6, submissions: 57, unreadSubmissions: 0, completionRate: 63, publicPath: "/f/encuesta-servicio", createdAt: "2026-08-03T11:15:00-05:00", updatedAt: "2026-09-10T16:00:00-05:00" },
  { id: "form_5", name: "Registro para campaña local", description: "Landing temporal para registrar interesados en una campaña.", type: "personalizado", status: "borrador", channel: "web", destination: "crm", fieldCount: 5, submissions: 0, unreadSubmissions: 0, completionRate: 0, publicPath: "/f/campana-local", createdAt: "2026-09-14T12:00:00-05:00", updatedAt: "2026-09-14T12:00:00-05:00" },
  { id: "form_6", name: "Pedido corporativo", description: "Solicitud inicial para ventas por volumen y atención B2B.", type: "cotizacion", status: "finalizada", channel: "interno", destination: "pedidos", fieldCount: 11, submissions: 31, unreadSubmissions: 0, completionRate: 59, publicPath: "/f/pedido-corporativo", createdAt: "2026-06-20T10:30:00-05:00", updatedAt: "2026-08-31T18:00:00-05:00" },
];

export const formTypeLabel = (type: FormType) => ({
  contacto: "Contacto",
  cotizacion: "Cotización",
  reserva: "Reserva",
  encuesta: "Encuesta",
  personalizado: "Personalizado",
})[type];

export const formChannelLabel = (channel: FormChannel) => ({
  web: "Sitio web",
  marketplace: "Marketplace",
  enlace: "Enlace público",
  interno: "Uso interno",
})[channel];

export const formDestinationLabel = (destination: FormDestination) => ({
  crm: "CRM",
  agenda: "Agenda",
  pedidos: "Pedidos",
  ninguno: "Sin automatización",
})[destination];
