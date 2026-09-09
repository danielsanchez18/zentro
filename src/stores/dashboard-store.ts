import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  CURRENT_USER_ID,
  dashboardBranches,
  dashboardInvitations,
  dashboardMemberships,
  dashboardOrganizations,
  dashboardPlans,
  dashboardSubscriptions,
  dashboardUsers,
  getCurrentDashboardUser,
  notificationPreferences,
  userIdentities,
  userSessions,
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
  NotificationPreference,
  NotificationPreferenceKey,
  UserIdentity,
  UserSession,
} from "@/types/dashboard";

interface DashboardState {
  currentUser: DashboardUser;
  identities: UserIdentity[];
  sessions: UserSession[];
  notificationPreferences: NotificationPreference[];
  localPassword: string;
  organizations: DashboardOrganization[];
  memberships: Membership[];
  branches: OrganizationBranch[];
  organizationSetups: OrganizationSetup[];
  invitations: OrganizationInvitation[];
  createOrganizationDraft: (input: { name: string; slug: string }) => string;
  isSlugAvailable: (slug: string) => boolean;
  getOrganizationSummaries: () => DashboardOrganizationSummary[];
  saveOrganizationSetup: (organizationId: string, input: {
    industry: BusinessIndustry;
    capabilities: CapabilityKey[];
    branch: { enabled: boolean; name: string; address: string; phone: string; openingHours: string };
    complete: boolean;
  }) => void;
  skipOrganizationSetup: (organizationId: string) => void;
  getInvitationSummaries: () => DashboardInvitationSummary[];
  respondToInvitation: (invitationId: string, response: "ACCEPTED" | "DECLINED") => void;
  updateProfile: (input: Pick<DashboardUser, "phone" | "avatarUrl">) => void;
  verifyEmail: () => void;
  disconnectIdentity: (identityId: string) => { ok: boolean; reason?: string };
  revokeSession: (sessionId: string) => void;
  toggleEmailPreference: (key: NotificationPreferenceKey) => void;
  changePassword: (currentPassword: string, newPassword: string) => { ok: boolean };
}

export const useDashboardStore = create<DashboardState>()(persist((set, get) => ({
  currentUser: getCurrentDashboardUser(),
  identities: userIdentities.filter((identity) => identity.userId === CURRENT_USER_ID),
  sessions: userSessions.filter((session) => session.userId === CURRENT_USER_ID),
  notificationPreferences: notificationPreferences.filter(
    (preference) => preference.userId === CURRENT_USER_ID,
  ),
  localPassword: "123456",
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
          plan: plan?.name ?? "Sin configurar",
          role: membership.roleName,
          status: subscription?.status ?? "TRIAL",
          members: state.memberships.filter((item) => item.organizationId === organization.id && item.status === "ACTIVE").length,
          branches: state.branches.filter((item) => item.organizationId === organization.id && item.status === "ACTIVE").length,
          setupStatus: state.organizationSetups.find((item) => item.organizationId === organization.id)?.status,
        };
      });
  },
  saveOrganizationSetup: (organizationId, input) => {
    const now = new Date().toISOString();
    set((state) => {
      const existingBranch = state.branches.find((branch) => branch.organizationId === organizationId);
      let branches = state.branches;
      if (input.branch.enabled && input.branch.name.trim()) {
        branches = existingBranch
          ? state.branches.map((branch) => branch.id === existingBranch.id ? {
              ...branch,
              name: input.branch.name.trim(),
              address: input.branch.address.trim() || null,
              phone: input.branch.phone.trim() || null,
              openingHours: input.branch.openingHours.trim() || null,
            } : branch)
          : [...state.branches, {
              id: `branch_local_${Date.now()}`,
              organizationId,
              name: input.branch.name.trim(),
              status: "ACTIVE" as const,
              isPrimary: true,
              address: input.branch.address.trim() || null,
              phone: input.branch.phone.trim() || null,
              openingHours: input.branch.openingHours.trim() || null,
            }];
      }
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
        status: invitation.status,
        expiresIn: invitation.status === "PENDING" ? "6 días" : undefined,
        receivedAt: "hace 1 día",
      }));
  },
  respondToInvitation: (invitationId, response) => {
    const now = new Date().toISOString();
    set((state) => {
      const invitation = state.invitations.find((item) => item.id === invitationId);
      if (!invitation || invitation.status !== "PENDING") return state;
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
  updateProfile: (input) =>
    set((state) => ({ currentUser: { ...state.currentUser, ...input, updatedAt: new Date().toISOString() } })),
  verifyEmail: () =>
    set((state) => ({
      currentUser: {
        ...state.currentUser,
        emailVerifiedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    })),
  disconnectIdentity: (identityId) => {
    const active = get().identities.filter((identity) => identity.status === "ACTIVE");
    if (active.length <= 1) {
      return { ok: false, reason: "Debes conservar al menos un método de acceso." };
    }
    set((state) => ({
      identities: state.identities.map((identity) =>
        identity.id === identityId ? { ...identity, status: "DISCONNECTED" } : identity,
      ),
    }));
    return { ok: true };
  },
  revokeSession: (sessionId) =>
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId && !session.isCurrent
          ? { ...session, revokedAt: new Date().toISOString() }
          : session,
      ),
    })),
  toggleEmailPreference: (key) =>
    set((state) => ({
      notificationPreferences: state.notificationPreferences.map((preference) =>
        preference.key === key && !preference.required
          ? { ...preference, emailEnabled: !preference.emailEnabled }
          : preference,
      ),
    })),
  changePassword: (currentPassword, newPassword) => {
    if (get().localPassword !== currentPassword) return { ok: false };
    set({ localPassword: newPassword });
    return { ok: true };
  },
}), { name: "zentro-dashboard-mock" }));
