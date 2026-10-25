import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  CURRENT_USER_ID,
  dashboardBranches,
  dashboardInvitations,
  dashboardInvoices,
  dashboardNotifications,
  dashboardMemberships,
  dashboardOrganizations,
  dashboardPlans,
  dashboardSubscriptions,
  dashboardUsers,
  getCurrentDashboardUser,
} from "@/lib/mock/dashboard";
import type {
  DashboardUser,
  DashboardOrganization,
  DashboardOrganizationSummary,
  Membership,
  OrganizationBranch,
  OrganizationSetup,
  OrganizationInvitation,
  DashboardInvitationSummary,
  BusinessIndustry,
  CapabilityKey,
  UserNotification,
  OrganizationInvoice,
  DashboardSubscriptionSummary,
} from "@/types/dashboard";
import { daysUntil, formatLongDate, formatRelative } from "@/lib/format/dates";

interface DashboardState {
  currentUser: DashboardUser;
  organizations: DashboardOrganization[];
  memberships: Membership[];
  branches: OrganizationBranch[];
  organizationSetups: OrganizationSetup[];
  invitations: OrganizationInvitation[];
  notifications: UserNotification[];
  /** Guía de primeros pasos del Hub omitida por el usuario (persistida, no por pestaña). */
  onboardingSkippedAt: string | null;
  skipHubOnboarding: () => void;
  resumeHubOnboarding: () => void;
  getHubOnboardingSteps: () => Array<{ key: "CREATE_ORGANIZATION" | "COMPLETE_BUSINESS_PROFILE" | "REVIEW_CAPABILITIES"; done: boolean }>;
  /** Suscripciones de las organizaciones donde el usuario es miembro activo. */
  getSubscriptionSummaries: () => DashboardSubscriptionSummary[];
  /** Facturas de esas organizaciones (TODO(0.2): filtrar por permiso de facturación en el servidor). */
  getInvoices: () => OrganizationInvoice[];
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  createOrganizationDraft: (input: { name: string; slug: string }) => string;
  isSlugAvailable: (slug: string) => boolean;
  getOrganizationSummaries: () => DashboardOrganizationSummary[];
  saveOrganizationSetup: (organizationId: string, input: {
    industry: BusinessIndustry;
    capabilities: CapabilityKey[];
    /** Ubicaciones definidas en el onboarding; vacío = organización sin sucursales. */
    branches: Array<{ name: string; address: string; phone: string; openingHours: string }>;
    complete: boolean;
  }) => void;
  skipOrganizationSetup: (organizationId: string) => void;
  getInvitationSummaries: () => DashboardInvitationSummary[];
  respondToInvitation: (invitationId: string, response: "ACCEPTED" | "DECLINED") => void;
}

export const useDashboardStore = create<DashboardState>()(persist((set, get) => ({
  currentUser: getCurrentDashboardUser(),
  organizations: dashboardOrganizations,
  memberships: dashboardMemberships,
  branches: dashboardBranches,
  organizationSetups: dashboardOrganizations.map((organization) => ({
    organizationId: organization.id,
    status: "READY" as const,
    industry: null,
    capabilities: [],
    skippedAt: null,
    completedAt: organization.createdAt,
    updatedAt: organization.updatedAt,
  })),
  invitations: dashboardInvitations,
  notifications: dashboardNotifications,
  onboardingSkippedAt: null,
  skipHubOnboarding: () => set({ onboardingSkippedAt: new Date().toISOString() }),
  resumeHubOnboarding: () => set({ onboardingSkippedAt: null }),
  getHubOnboardingSteps: () => {
    const state = get();
    const ownedIds = state.memberships
      .filter((membership) => membership.userId === CURRENT_USER_ID && membership.roleKey === "OWNER" && membership.status === "ACTIVE")
      .map((membership) => membership.organizationId);
    const setups = state.organizationSetups.filter((setup) => ownedIds.includes(setup.organizationId));
    return [
      { key: "CREATE_ORGANIZATION", done: ownedIds.length > 0 },
      { key: "COMPLETE_BUSINESS_PROFILE", done: setups.some((setup) => setup.industry !== null) },
      { key: "REVIEW_CAPABILITIES", done: setups.some((setup) => setup.status === "READY" && setup.capabilities.length > 0) },
    ];
  },
  getSubscriptionSummaries: () => {
    const state = get();
    const memberOf = new Set(
      state.memberships
        .filter((membership) => membership.userId === CURRENT_USER_ID && membership.status === "ACTIVE")
        .map((membership) => membership.organizationId),
    );
    return dashboardSubscriptions
      .filter((subscription) => memberOf.has(subscription.organizationId))
      .map((subscription) => {
        const organization = state.organizations.find((item) => item.id === subscription.organizationId)!;
        const plan = dashboardPlans.find((item) => item.id === subscription.planId)!;
        return {
          id: subscription.id,
          organizationId: organization.id,
          orgName: organization.name,
          slug: organization.slug,
          plan: plan.name,
          status: subscription.status,
          nextCharge: formatLongDate(subscription.currentPeriodEnd, organization.timezone),
        };
      });
  },
  getInvoices: () => {
    const state = get();
    const memberOf = new Set(
      state.memberships
        .filter((membership) => membership.userId === CURRENT_USER_ID && membership.status === "ACTIVE")
        .map((membership) => membership.organizationId),
    );
    return dashboardInvoices.filter((invoice) => memberOf.has(invoice.organizationId));
  },
  markNotificationRead: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === notificationId && !notification.readAt
          ? { ...notification, readAt: new Date().toISOString() }
          : notification,
      ),
    })),
  markAllNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.readAt ? notification : { ...notification, readAt: new Date().toISOString() },
      ),
    })),
  isSlugAvailable: (slug) =>
    !get().organizations.some((organization) => organization.slug === slug),
  createOrganizationDraft: ({ name, slug }) => {
    const id = `org_local_${Date.now()}`;
    const now = new Date().toISOString();
    const organization: DashboardOrganization = {
      id,
      name,
      slug,
      legalName: null,
      taxId: null,
      status: "ACTIVE",
      countryCode: "PE",
      currencyCode: "PEN",
      timezone: "America/Lima",
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({
      organizations: [...state.organizations, organization],
      memberships: [...state.memberships, {
        id: `mem_local_${Date.now()}`,
        userId: CURRENT_USER_ID,
        organizationId: id,
        roleKey: "OWNER",
        roleName: "Owner",
        status: "ACTIVE",
        joinedAt: now,
      }],
      organizationSetups: [...state.organizationSetups, {
        organizationId: id,
        status: "DRAFT",
        industry: null,
        capabilities: [],
        skippedAt: null,
        completedAt: null,
        updatedAt: now,
      }],
    }));
    return id;
  },
  getOrganizationSummaries: () => {
    const state = get();
    return state.memberships
      .filter((membership) => membership.userId === CURRENT_USER_ID && membership.status === "ACTIVE")
      .map((membership) => {
        const organization = state.organizations.find((item) => item.id === membership.organizationId)!;
        const subscription = dashboardSubscriptions.find((item) => item.organizationId === organization.id);
        const plan = subscription ? dashboardPlans.find((item) => item.id === subscription.planId) : undefined;
        return {
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
          plan: plan?.name ?? "Sin plan",
          role: membership.roleName,
          status: subscription?.status ?? "TRIAL",
          members: state.memberships.filter((item) => item.organizationId === organization.id && item.status === "ACTIVE").length,
          branches: state.branches.filter((item) => item.organizationId === organization.id && item.status === "ACTIVE").length,
          setupStatus: state.organizationSetups.find((item) => item.organizationId === organization.id)?.status,
          logoUrl: organization.logoUrl ?? null,
          coverUrl: organization.coverUrl ?? null,
        };
      });
  },
  saveOrganizationSetup: (organizationId, input) => {
    const now = new Date().toISOString();
    set((state) => {
      // Las ubicaciones del onboarding reemplazan a las de la organización; la primera es la principal.
      const stamp = Date.now();
      const branches = [
        ...state.branches.filter((branch) => branch.organizationId !== organizationId),
        ...input.branches
          .filter((branch) => branch.name.trim())
          .map((branch, index) => ({
            id: `branch_local_${stamp}_${index}`,
            organizationId,
            name: branch.name.trim(),
            status: "ACTIVE" as const,
            isPrimary: index === 0,
            address: branch.address.trim() || null,
            phone: branch.phone.trim() || null,
            openingHours: branch.openingHours.trim() || null,
          })),
      ];
      return {
        branches,
        organizations: state.organizations.map((organization) =>
          organization.id === organizationId ? { ...organization, updatedAt: now } : organization,
        ),
        organizationSetups: state.organizationSetups.map((setup) =>
          setup.organizationId === organizationId
            ? {
                ...setup,
                industry: input.industry,
                capabilities: input.capabilities,
                status: input.complete ? "READY" : "DRAFT",
                completedAt: input.complete ? now : setup.completedAt,
                skippedAt: null,
                updatedAt: now,
              }
            : setup,
        ),
      };
    });
  },
  skipOrganizationSetup: (organizationId) =>
    set((state) => ({
      organizationSetups: state.organizationSetups.map((setup) =>
        setup.organizationId === organizationId
          ? { ...setup, skippedAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
          : setup,
      ),
    })),
  getInvitationSummaries: () => {
    const state = get();
    const user = state.currentUser;
    return state.invitations
      .filter((invitation) => invitation.email.toLowerCase() === user.email.toLowerCase())
      .map((invitation) => ({
        id: invitation.id,
        orgName: state.organizations.find((organization) => organization.id === invitation.organizationId)?.name ?? "Organización",
        invitedBy: dashboardUsers.find((item) => item.id === invitation.invitedByUserId)?.name ?? "Un miembro",
        role: invitation.roleName,
        // Una invitación pendiente cuya fecha ya pasó se muestra como vencida.
        status:
          invitation.status === "PENDING" && new Date(invitation.expiresAt).getTime() < Date.now()
            ? "EXPIRED"
            : invitation.status,
        expiresIn:
          invitation.status === "PENDING"
            ? `${daysUntil(invitation.expiresAt)} día${daysUntil(invitation.expiresAt) === 1 ? "" : "s"}`
            : undefined,
        receivedAt: formatRelative(invitation.createdAt),
      }));
  },
  respondToInvitation: (invitationId, response) => {
    const now = new Date().toISOString();
    set((state) => {
      const invitation = state.invitations.find((item) => item.id === invitationId);
      if (!invitation || invitation.status !== "PENDING" || new Date(invitation.expiresAt).getTime() < Date.now()) return state;
      const alreadyMember = state.memberships.some((membership) => membership.organizationId === invitation.organizationId && membership.userId === CURRENT_USER_ID && membership.status === "ACTIVE");
      return {
        invitations: state.invitations.map((item) => item.id === invitationId ? { ...item, status: response, respondedAt: now } : item),
        memberships: response === "ACCEPTED" && !alreadyMember
          ? [...state.memberships, {
              id: `mem_invite_${Date.now()}`,
              userId: CURRENT_USER_ID,
              organizationId: invitation.organizationId,
              roleKey: invitation.roleKey,
              roleName: invitation.roleName,
              status: "ACTIVE" as const,
              joinedAt: now,
            }]
          : state.memberships,
      };
    });
  },
}), {
  name: "zentro-dashboard-mock",
  // v3: sin datos de cuenta (vienen de la API). v2: datos de prueba con fechas coherentes (oct 2026), facturas y guía persistida.
  // Al cambiar la versión se descarta el estado guardado y se usa la semilla nueva.
  version: 3,
  migrate: () => ({}) as DashboardState,
}));
