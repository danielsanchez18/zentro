import type {
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
  UserIdentity,
  UserSession,
  NotificationPreference,
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

export const userIdentities: UserIdentity[] = [
  {
    id: "identity_001",
    userId: CURRENT_USER_ID,
    provider: "PASSWORD",
    providerAccountId: null,
    status: "ACTIVE",
    connectedAt: "2026-07-30T14:00:00.000Z",
    lastUsedAt: "2026-09-08T20:00:00.000Z",
  },
  {
    id: "identity_002",
    userId: CURRENT_USER_ID,
    provider: "GOOGLE",
    providerAccountId: "google_001",
    status: "ACTIVE",
    connectedAt: "2026-08-02T14:00:00.000Z",
    lastUsedAt: "2026-08-20T16:00:00.000Z",
  },
  {
    id: "identity_003",
    userId: CURRENT_USER_ID,
    provider: "FACEBOOK",
    providerAccountId: null,
    status: "DISCONNECTED",
    connectedAt: "2026-08-02T14:00:00.000Z",
    lastUsedAt: null,
  },
  {
    id: "identity_004",
    userId: CURRENT_USER_ID,
    provider: "APPLE",
    providerAccountId: null,
    status: "DISCONNECTED",
    connectedAt: "2026-08-02T14:00:00.000Z",
    lastUsedAt: null,
  },
];

export const userSessions: UserSession[] = [
  {
    id: "session_001",
    userId: CURRENT_USER_ID,
    deviceType: "DESKTOP",
    deviceName: "Windows",
    browserName: "Chrome",
    approximateLocation: "Lima, Perú",
    ipAddress: "192.0.2.10",
    isCurrent: true,
    createdAt: "2026-09-08T18:00:00.000Z",
    lastActiveAt: "2026-09-08T20:00:00.000Z",
    revokedAt: null,
  },
  {
    id: "session_002",
    userId: CURRENT_USER_ID,
    deviceType: "MOBILE",
    deviceName: "iPhone",
    browserName: "Safari",
    approximateLocation: "Lima, Perú",
    ipAddress: "192.0.2.20",
    isCurrent: false,
    createdAt: "2026-09-01T14:00:00.000Z",
    lastActiveAt: "2026-09-06T18:00:00.000Z",
    revokedAt: null,
  },
];

export const notificationPreferences: NotificationPreference[] = [
  { userId: CURRENT_USER_ID, key: "INVITATIONS", emailEnabled: true, inAppEnabled: true, required: false },
  { userId: CURRENT_USER_ID, key: "BILLING", emailEnabled: true, inAppEnabled: true, required: false },
  { userId: CURRENT_USER_ID, key: "RECOVERY", emailEnabled: true, inAppEnabled: true, required: true },
  { userId: CURRENT_USER_ID, key: "SECURITY", emailEnabled: true, inAppEnabled: true, required: true },
  { userId: CURRENT_USER_ID, key: "PRODUCT_UPDATES", emailEnabled: false, inAppEnabled: false, required: false },
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
  { id: "branch_001", organizationId: "org_001", name: "Monsefú", status: "ACTIVE", isPrimary: true },
  { id: "branch_002", organizationId: "org_002", name: "Miraflores", status: "ACTIVE", isPrimary: true },
  { id: "branch_003", organizationId: "org_002", name: "Barranco", status: "ACTIVE", isPrimary: false },
  { id: "branch_004", organizationId: "org_003", name: "Barranco", status: "ACTIVE", isPrimary: true },
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
  { id: "sub_001", organizationId: "org_001", planId: "plan_001", status: "TRIAL", currentPeriodStart: "2026-08-18T05:00:00.000Z", currentPeriodEnd: "2026-09-01T04:59:59.000Z", trialEndsAt: "2026-09-01T04:59:59.000Z", cancelAtPeriodEnd: false, createdAt: "2026-08-18T05:00:00.000Z" },
  { id: "sub_002", organizationId: "org_002", planId: "plan_002", status: "ACTIVE", currentPeriodStart: "2026-08-15T05:00:00.000Z", currentPeriodEnd: "2026-09-15T04:59:59.000Z", trialEndsAt: null, cancelAtPeriodEnd: false, createdAt: "2026-06-15T05:00:00.000Z" },
  { id: "sub_003", organizationId: "org_003", planId: "plan_001", status: "ACTIVE", currentPeriodStart: "2026-08-01T05:00:00.000Z", currentPeriodEnd: "2026-09-01T04:59:59.000Z", trialEndsAt: null, cancelAtPeriodEnd: false, createdAt: "2026-05-01T05:00:00.000Z" },
];

export const dashboardInvitations: OrganizationInvitation[] = [
  { id: "invite_001", organizationId: "org_004", email: "admin@lasrocas.com", invitedByUserId: "usr_002", roleKey: "MEMBER", roleName: "Miembro", status: "PENDING", createdAt: "2026-09-07T15:00:00.000Z", expiresAt: "2026-09-14T15:00:00.000Z", respondedAt: null },
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

export const getUserOrganizationSummaries = (userId = CURRENT_USER_ID): DashboardOrganizationSummary[] =>
  dashboardMemberships
    .filter((membership) => membership.userId === userId && membership.status === "ACTIVE")
    .map((membership) => {
      const organization = dashboardOrganizations.find((item) => item.id === membership.organizationId)!;
      const subscription = dashboardSubscriptions.find((item) => item.organizationId === organization.id)!;
      const plan = dashboardPlans.find((item) => item.id === subscription.planId)!;
      return {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        plan: plan.name,
        role: membership.roleName,
        status: subscription.status,
        members: dashboardMemberships.filter((item) => item.organizationId === organization.id && item.status === "ACTIVE").length,
        branches: dashboardBranches.filter((item) => item.organizationId === organization.id && item.status === "ACTIVE").length,
      };
    });

export const getInvitationSummaries = (userId = CURRENT_USER_ID): DashboardInvitationSummary[] => {
  const user = dashboardUsers.find((item) => item.id === userId)!;
  return dashboardInvitations
    .filter((invitation) => invitation.email.toLowerCase() === user.email.toLowerCase())
    .map((invitation) => ({
      id: invitation.id,
      orgName: dashboardOrganizations.find((item) => item.id === invitation.organizationId)!.name,
      invitedBy: dashboardUsers.find((item) => item.id === invitation.invitedByUserId)!.name,
      role: invitation.roleName,
      status: invitation.status,
      expiresIn: invitation.status === "PENDING" ? "6 días" : undefined,
      receivedAt: "hace 1 día",
    }));
};

export const getPendingInvitationSummaries = (userId = CURRENT_USER_ID) =>
  getInvitationSummaries(userId).filter((invitation) => invitation.status === "PENDING");

export const getSubscriptionSummaries = (userId = CURRENT_USER_ID): DashboardSubscriptionSummary[] => {
  const organizationIds = new Set(
    dashboardMemberships
      .filter((membership) => membership.userId === userId && membership.status === "ACTIVE")
      .map((membership) => membership.organizationId),
  );

  return dashboardSubscriptions
    .filter((subscription) => organizationIds.has(subscription.organizationId))
    .map((subscription) => {
      const organization = dashboardOrganizations.find((item) => item.id === subscription.organizationId)!;
      const plan = dashboardPlans.find((item) => item.id === subscription.planId)!;
      return {
        id: subscription.id,
        organizationId: organization.id,
        orgName: organization.name,
        slug: organization.slug,
        plan: plan.name,
        status: subscription.status,
        nextCharge: new Intl.DateTimeFormat("es-PE", { day: "numeric", month: "long", timeZone: organization.timezone }).format(new Date(subscription.currentPeriodEnd)),
      };
    });
};
