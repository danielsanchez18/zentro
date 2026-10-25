import type {
  OrganizationInvoice,
  DashboardInvitationSummary,
  DashboardOrganization,
  DashboardOrganizationSummary,
  DashboardSubscriptionSummary,
  DashboardUser,
  Membership,
  OnboardingProgress,
  OrganizationInvitation,
  OrganizationBranch,
  OrganizationSubscription,
  PlanDefinition,
  UserNotification,
} from "@/types/dashboard";

export const CURRENT_USER_ID = "usr_001";

export const dashboardUsers: DashboardUser[] = [
  {
    id: CURRENT_USER_ID,
    email: "admin@lasrocas.com",
    emailVerifiedAt: null,
    name: "Daniel Sánchez",
    phone: "+51 936 245 721",
    avatarUrl: null,
    locale: "es-PE",
    timezone: "America/Lima",
    status: "ACTIVE",
    createdAt: "2026-07-30T14:00:00.000Z",
    updatedAt: "2026-09-08T20:00:00.000Z",
  },
  {
    id: "usr_002",
    email: "lucia@lafonda.example",
    emailVerifiedAt: "2026-07-01T15:00:00.000Z",
    name: "Lucía Torres",
    phone: null,
    avatarUrl: null,
    locale: "es-PE",
    timezone: "America/Lima",
    status: "ACTIVE",
    createdAt: "2026-07-01T14:00:00.000Z",
    updatedAt: "2026-07-01T15:00:00.000Z",
  },
];

export const dashboardOrganizations: DashboardOrganization[] = [
  {
    id: "org_001",
    name: "Las Rocas Restaurante",
    slug: "las-rocas",
    legalName: "Las Rocas Restaurante S.A.C.",
    taxId: "20518463527",
    status: "ACTIVE",
    countryCode: "PE",
    currencyCode: "PEN",
    timezone: "America/Lima",
    createdAt: "2026-07-30T15:00:00.000Z",
    updatedAt: "2026-09-08T20:00:00.000Z",
  },
  {
    id: "org_002",
    name: "Café del Valle",
    slug: "cafe-del-valle",
    legalName: "Café del Valle S.A.C.",
    taxId: "20451826374",
    status: "ACTIVE",
    countryCode: "PE",
    currencyCode: "PEN",
    timezone: "America/Lima",
    createdAt: "2026-06-10T15:00:00.000Z",
    updatedAt: "2026-08-15T20:00:00.000Z",
  },
  {
    id: "org_003",
    name: "Fonda La Abuela",
    slug: "fonda-la-abuela",
    legalName: "Fonda La Abuela S.A.C.",
    taxId: "20603719248",
    status: "ACTIVE",
    countryCode: "PE",
    currencyCode: "PEN",
    timezone: "America/Lima",
    createdAt: "2026-05-10T15:00:00.000Z",
    updatedAt: "2026-08-10T20:00:00.000Z",
  },
  {
    id: "org_004",
    name: "La Fonda del Chef",
    slug: "la-fonda-del-chef",
    legalName: null,
    taxId: null,
    status: "ACTIVE",
    countryCode: "PE",
    currencyCode: "PEN",
    timezone: "America/Lima",
    createdAt: "2026-08-01T15:00:00.000Z",
    updatedAt: "2026-08-01T15:00:00.000Z",
  },
];

export const dashboardBranches: OrganizationBranch[] = [
  { id: "branch_001", organizationId: "org_001", name: "Monsefú", status: "ACTIVE", isPrimary: true, address: "Calle Real 245, Monsefú, Chiclayo", phone: "+51 974 112 300", openingHours: "Lun-Dom 12:00-22:00" },
  { id: "branch_002", organizationId: "org_002", name: "Miraflores", status: "ACTIVE", isPrimary: true, address: "Av. Larco 1234, Miraflores, Lima", phone: "+51 987 220 145", openingHours: "Lun-Sáb 07:00-21:00" },
  { id: "branch_003", organizationId: "org_002", name: "Barranco", status: "ACTIVE", isPrimary: false, address: "Av. Grau 310, Barranco, Lima", phone: null, openingHours: "Lun-Dom 08:00-20:00" },
  { id: "branch_004", organizationId: "org_003", name: "Barranco", status: "ACTIVE", isPrimary: true, address: "Jr. San Martín 45, Barranco, Lima", phone: "+51 955 410 220", openingHours: "Mar-Dom 12:00-23:00" },
];

export const dashboardMemberships: Membership[] = [
  { id: "mem_001", userId: CURRENT_USER_ID, organizationId: "org_001", roleKey: "OWNER", roleName: "Owner", status: "ACTIVE", joinedAt: "2026-07-30T15:00:00.000Z" },
  { id: "mem_002", userId: CURRENT_USER_ID, organizationId: "org_002", roleKey: "ADMIN", roleName: "Admin", status: "ACTIVE", joinedAt: "2026-07-01T15:00:00.000Z" },
  { id: "mem_003", userId: CURRENT_USER_ID, organizationId: "org_003", roleKey: "MEMBER", roleName: "Miembro", status: "ACTIVE", joinedAt: "2026-06-01T15:00:00.000Z" },
];

export const dashboardPlans: PlanDefinition[] = [
  { id: "plan_001", key: "ESSENTIAL", name: "Esencial", currencyCode: "PEN", priceInMinorUnits: 4900, interval: "MONTH", limits: { members: 3, branches: 1 } },
  { id: "plan_002", key: "GROWTH", name: "Crecimiento", currencyCode: "PEN", priceInMinorUnits: 9900, interval: "MONTH", limits: { members: 10, branches: 3 } },
];

export const dashboardSubscriptions: OrganizationSubscription[] = [
  // Fechas coherentes con el "hoy" del prototipo (oct 2026). Trial de 30 días (SUPPORT.trialDays).
  { id: "sub_001", organizationId: "org_001", planId: "plan_001", status: "TRIAL", currentPeriodStart: "2026-10-08T05:00:00.000Z", currentPeriodEnd: "2026-11-07T04:59:59.000Z", trialEndsAt: "2026-11-07T04:59:59.000Z", cancelAtPeriodEnd: false, createdAt: "2026-10-08T05:00:00.000Z" },
  { id: "sub_002", organizationId: "org_002", planId: "plan_002", status: "ACTIVE", currentPeriodStart: "2026-10-15T05:00:00.000Z", currentPeriodEnd: "2026-11-15T04:59:59.000Z", trialEndsAt: null, cancelAtPeriodEnd: false, createdAt: "2026-06-15T05:00:00.000Z" },
  { id: "sub_003", organizationId: "org_003", planId: "plan_001", status: "ACTIVE", currentPeriodStart: "2026-10-01T05:00:00.000Z", currentPeriodEnd: "2026-11-01T04:59:59.000Z", trialEndsAt: null, cancelAtPeriodEnd: false, createdAt: "2026-05-01T05:00:00.000Z" },
];

/** Emisor de las facturas de suscripción. TODO(0.2): vendrá de la configuración fiscal del backend. */
export const ZENTRO_ISSUER = {
  name: "Zentro S.A.C.",
  taxId: "RUC 20601849235",
  address: "Av. Javier Prado Este 550, San Isidro, Lima",
};

// Montos con IGV 18% incluido: 99.00 = 83.90 + 15.10; 49.00 = 41.53 + 7.47.
export const dashboardInvoices: OrganizationInvoice[] = [
  { id: "inv_004", organizationId: "org_003", subscriptionId: "sub_003", number: "INV-0004", seriesNumber: "F001-0004", status: "OPEN", currencyCode: "PEN", subtotalInMinorUnits: 4153, taxInMinorUnits: 747, totalInMinorUnits: 4900, taxLabel: "IGV (18%)", periodStart: "2026-10-01T05:00:00.000Z", periodEnd: "2026-11-01T04:59:59.000Z", issuedAt: "2026-10-01T15:00:00.000Z", dueAt: "2026-10-31T15:00:00.000Z", paidAt: null, paymentMethod: null, notes: "Recuerda pagar antes del vencimiento para evitar la suspensión del servicio.", pdfUrl: null },
  { id: "inv_003", organizationId: "org_002", subscriptionId: "sub_002", number: "INV-0003", seriesNumber: "F001-0003", status: "PAID", currencyCode: "PEN", subtotalInMinorUnits: 8390, taxInMinorUnits: 1510, totalInMinorUnits: 9900, taxLabel: "IGV (18%)", periodStart: "2026-10-15T05:00:00.000Z", periodEnd: "2026-11-15T04:59:59.000Z", issuedAt: "2026-10-15T15:00:00.000Z", dueAt: "2026-10-22T15:00:00.000Z", paidAt: "2026-10-15T15:05:00.000Z", paymentMethod: "Tarjeta de crédito ···· 4242 (VISA)", notes: "Gracias por tu suscripción. Este comprobante se emitió electrónicamente.", pdfUrl: null },
  { id: "inv_002", organizationId: "org_002", subscriptionId: "sub_002", number: "INV-0002", seriesNumber: "F001-0002", status: "PAID", currencyCode: "PEN", subtotalInMinorUnits: 8390, taxInMinorUnits: 1510, totalInMinorUnits: 9900, taxLabel: "IGV (18%)", periodStart: "2026-09-15T05:00:00.000Z", periodEnd: "2026-10-15T04:59:59.000Z", issuedAt: "2026-09-15T15:00:00.000Z", dueAt: "2026-09-22T15:00:00.000Z", paidAt: "2026-09-15T15:04:00.000Z", paymentMethod: "Tarjeta de crédito ···· 4242 (VISA)", notes: null, pdfUrl: null },
  { id: "inv_001", organizationId: "org_003", subscriptionId: "sub_003", number: "INV-0001", seriesNumber: "F001-0001", status: "PAID", currencyCode: "PEN", subtotalInMinorUnits: 4153, taxInMinorUnits: 747, totalInMinorUnits: 4900, taxLabel: "IGV (18%)", periodStart: "2026-09-01T05:00:00.000Z", periodEnd: "2026-10-01T04:59:59.000Z", issuedAt: "2026-09-01T15:00:00.000Z", dueAt: "2026-09-30T15:00:00.000Z", paidAt: "2026-09-10T18:20:00.000Z", paymentMethod: "Yape", notes: null, pdfUrl: null },
];

export const dashboardInvitations: OrganizationInvitation[] = [
  { id: "invite_001", organizationId: "org_004", email: "admin@lasrocas.com", invitedByUserId: "usr_002", roleKey: "MEMBER", roleName: "Miembro", status: "PENDING", createdAt: "2026-10-24T14:30:00.000Z", expiresAt: "2026-10-31T14:30:00.000Z", respondedAt: null },
];

export const dashboardNotifications: UserNotification[] = [
  { id: "ntf_001", userId: CURRENT_USER_ID, type: "INVITATION", title: "Nueva invitación", body: "Lucía Torres te invitó a La Fonda del Chef como Miembro.", href: "/dashboard/invitaciones", createdAt: "2026-10-24T14:30:00.000Z", readAt: null },
  { id: "ntf_002", userId: CURRENT_USER_ID, type: "BILLING", title: "Factura pendiente", body: "Fonda La Abuela tiene la factura INV-0004 por S/ 49.00 que vence el 31 de octubre.", href: "/dashboard/suscripciones", createdAt: "2026-10-23T16:00:00.000Z", readAt: null },
  { id: "ntf_003", userId: CURRENT_USER_ID, type: "SECURITY", title: "Nuevo inicio de sesión", body: "Se inició sesión desde Chrome en Windows, Lima (aproximada).", href: "/dashboard/cuenta", createdAt: "2026-10-22T09:12:00.000Z", readAt: null },
  { id: "ntf_004", userId: CURRENT_USER_ID, type: "ORGANIZATION", title: "Prueba por terminar", body: "La prueba gratuita de Las Rocas Restaurante termina el 6 de noviembre.", href: "/dashboard/suscripciones", createdAt: "2026-10-20T12:00:00.000Z", readAt: "2026-10-20T18:00:00.000Z" },
  { id: "ntf_005", userId: CURRENT_USER_ID, type: "PRODUCT", title: "Novedad en Zentro", body: "Ya puedes publicar tu sitio web desde Presencia digital.", href: null, createdAt: "2026-10-15T10:00:00.000Z", readAt: "2026-10-16T08:00:00.000Z" },
];

export const dashboardOnboarding: OnboardingProgress = {
  userId: CURRENT_USER_ID,
  skippedAt: null,
  steps: [
    { key: "CREATE_ORGANIZATION", completedAt: "2026-07-30T15:00:00.000Z" },
    { key: "COMPLETE_BUSINESS_PROFILE", completedAt: null },
    { key: "REVIEW_CAPABILITIES", completedAt: null },
  ],
};

export const getCurrentDashboardUser = () =>
  dashboardUsers.find((user) => user.id === CURRENT_USER_ID)!;
