export type AppointmentStatus =
  | "pendiente_confirmacion"
  | "confirmada"
  | "en_curso"
  | "completada"
  | "cancelada"
  | "no_asistio";
export type AppointmentModality = "presencial" | "domicilio" | "online";
export type AppointmentOrigin = "manual" | "pos" | "web" | "marketplace" | "whatsapp";
export type AppointmentPaymentStatus = "sin_pago" | "adelanto" | "pagado";

export interface AgendaService {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
  color: "sage" | "blue" | "amber" | "rose";
  status: "activo" | "inactivo";
}

export interface AgendaResource {
  id: string;
  name: string;
  kind: "cabina" | "sala" | "silla" | "equipo";
  status: "activo" | "inactivo";
}

export interface Appointment {
  id: string;
  number: string;
  customerId?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  durationMinutes: number;
  price: number;
  responsibleId?: string;
  responsibleName?: string;
  resourceId?: string;
  resourceName?: string;
  locationId?: string;
  locationName?: string;
  modality: AppointmentModality;
  address?: string;
  meetingUrl?: string;
  status: AppointmentStatus;
  paymentStatus: AppointmentPaymentStatus;
  paidAmount: number;
  origin: AppointmentOrigin;
  startsAt: string;
  endsAt: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const agendaServices: AgendaService[] = [
  { id: "service_1", name: "Consulta inicial", durationMinutes: 45, price: 80, color: "sage", status: "activo" },
  { id: "service_2", name: "Sesión de seguimiento", durationMinutes: 30, price: 55, color: "blue", status: "activo" },
  { id: "service_3", name: "Servicio premium", durationMinutes: 90, price: 160, color: "amber", status: "activo" },
  { id: "service_4", name: "Evaluación virtual", durationMinutes: 40, price: 70, color: "rose", status: "activo" },
];

export const agendaResources: AgendaResource[] = [
  { id: "resource_1", name: "Consultorio 1", kind: "cabina", status: "activo" },
  { id: "resource_2", name: "Sala privada", kind: "sala", status: "activo" },
  { id: "resource_3", name: "Equipo móvil", kind: "equipo", status: "activo" },
];

export const agendaAppointments: Appointment[] = [
  { id: "appointment_1", number: "CIT-1024", customerId: "customer_1", customerName: "Amanda Harvey", customerEmail: "amanda.harvey@correo.pe", customerPhone: "+51 987 245 610", serviceId: "service_1", serviceName: "Consulta inicial", durationMinutes: 45, price: 80, responsibleId: "u2", responsibleName: "Valentina Torres", resourceId: "resource_1", resourceName: "Consultorio 1", locationId: "location_1", locationName: "Monsefú", modality: "presencial", status: "confirmada", paymentStatus: "adelanto", paidAmount: 30, origin: "web", startsAt: "2026-09-12T09:00:00-05:00", endsAt: "2026-09-12T09:45:00-05:00", createdAt: "2026-09-10T14:20:00-05:00", updatedAt: "2026-09-11T10:00:00-05:00" },
  { id: "appointment_2", number: "CIT-1025", customerId: "customer_2", customerName: "Lucía Fernández", customerEmail: "lucia.fernandez@correo.pe", customerPhone: "+51 945 381 227", serviceId: "service_3", serviceName: "Servicio premium", durationMinutes: 90, price: 160, responsibleId: "u8", responsibleName: "Fernanda Soto", resourceId: "resource_2", resourceName: "Sala privada", locationId: "location_1", locationName: "Monsefú", modality: "presencial", status: "pendiente_confirmacion", paymentStatus: "sin_pago", paidAmount: 0, origin: "whatsapp", startsAt: "2026-09-12T11:00:00-05:00", endsAt: "2026-09-12T12:30:00-05:00", notes: "Confirmar asistencia por teléfono.", createdAt: "2026-09-11T17:10:00-05:00", updatedAt: "2026-09-11T17:10:00-05:00" },
  { id: "appointment_3", number: "CIT-1026", customerId: "customer_3", customerName: "Renato Chávez", customerEmail: "renato.chavez@correo.pe", customerPhone: "+51 976 402 115", serviceId: "service_4", serviceName: "Evaluación virtual", durationMinutes: 40, price: 70, responsibleId: "u2", responsibleName: "Valentina Torres", modality: "online", meetingUrl: "https://meet.zentro.app/cit-1026", status: "confirmada", paymentStatus: "pagado", paidAmount: 70, origin: "marketplace", startsAt: "2026-09-12T15:00:00-05:00", endsAt: "2026-09-12T15:40:00-05:00", createdAt: "2026-09-09T13:30:00-05:00", updatedAt: "2026-09-10T09:15:00-05:00" },
  { id: "appointment_4", number: "CIT-1027", customerName: "Paola Ríos", customerPhone: "+51 922 410 786", serviceId: "service_2", serviceName: "Sesión de seguimiento", durationMinutes: 30, price: 55, responsibleId: "u8", responsibleName: "Fernanda Soto", modality: "domicilio", address: "Av. Sáenz Peña 640, Chiclayo", status: "confirmada", paymentStatus: "sin_pago", paidAmount: 0, origin: "manual", startsAt: "2026-09-13T10:30:00-05:00", endsAt: "2026-09-13T11:00:00-05:00", createdAt: "2026-09-11T12:00:00-05:00", updatedAt: "2026-09-11T12:00:00-05:00" },
  { id: "appointment_5", number: "CIT-1028", customerId: "customer_5", customerName: "Distribuciones Norte SAC", customerEmail: "compras@disnorte.pe", customerPhone: "+51 974 110 823", serviceId: "service_1", serviceName: "Consulta inicial", durationMinutes: 45, price: 80, responsibleId: "u2", responsibleName: "Valentina Torres", modality: "online", status: "pendiente_confirmacion", paymentStatus: "sin_pago", paidAmount: 0, origin: "web", startsAt: "2026-09-15T16:00:00-05:00", endsAt: "2026-09-15T16:45:00-05:00", createdAt: "2026-09-12T08:00:00-05:00", updatedAt: "2026-09-12T08:00:00-05:00" },
  { id: "appointment_6", number: "CIT-1023", customerId: "customer_4", customerName: "Milagros Salazar", customerEmail: "milagros.salazar@correo.pe", customerPhone: "+51 933 718 604", serviceId: "service_2", serviceName: "Sesión de seguimiento", durationMinutes: 30, price: 55, responsibleId: "u8", responsibleName: "Fernanda Soto", locationId: "location_1", locationName: "Monsefú", modality: "presencial", status: "no_asistio", paymentStatus: "adelanto", paidAmount: 20, origin: "manual", startsAt: "2026-09-11T17:00:00-05:00", endsAt: "2026-09-11T17:30:00-05:00", createdAt: "2026-09-08T10:00:00-05:00", updatedAt: "2026-09-11T17:30:00-05:00" },
];

export const agendaMoney = (value: number) => new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(value);
export const appointmentModalityLabel = (modality: AppointmentModality) => ({ presencial: "Presencial", domicilio: "A domicilio", online: "Online" })[modality];
export const appointmentPaymentLabel = (status: AppointmentPaymentStatus) => ({ sin_pago: "Sin pago", adelanto: "Con adelanto", pagado: "Pagado" })[status];
