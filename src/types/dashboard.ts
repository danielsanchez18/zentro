export type EntityId = string;

export type UserStatus = "ACTIVE" | "DISABLED" | "PENDING_VERIFICATION";
export type IdentityProvider = "PASSWORD" | "GOOGLE" | "FACEBOOK" | "APPLE";
export type IdentityStatus = "ACTIVE" | "DISCONNECTED";
export type MembershipStatus = "ACTIVE" | "SUSPENDED" | "LEFT";
export type OrganizationStatus = "ACTIVE" | "ARCHIVED";
export type SubscriptionStatus = "TRIAL" | "ACTIVE" | "PAST_DUE" | "CANCELED";
export type InvitationStatus = "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED" | "REVOKED";

export interface DashboardUser {
  id: EntityId;
  email: string;
  emailVerifiedAt: string | null;
  name: string;
  phone: string | null;
  avatarUrl: string | null;
  locale: string;
  timezone: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UserIdentity {
  id: EntityId;
  userId: EntityId;
  provider: IdentityProvider;
  providerAccountId: string | null;
  status: IdentityStatus;
  connectedAt: string;
  lastUsedAt: string | null;
}

export interface UserSession {
  id: EntityId;
  userId: EntityId;
  deviceType: "DESKTOP" | "MOBILE" | "TABLET" | "OTHER";
  deviceName: string;
  browserName: string;
  approximateLocation: string | null;
  ipAddress: string;
  isCurrent: boolean;
  createdAt: string;
  lastActiveAt: string;
  revokedAt: string | null;
}

export type NotificationPreferenceKey =
  | "INVITATIONS"
  | "BILLING"
  | "RECOVERY"
  | "SECURITY"
  | "PRODUCT_UPDATES";

export interface NotificationPreference {
  userId: EntityId;
  key: NotificationPreferenceKey;
  emailEnabled: boolean;
  inAppEnabled: boolean;
  required: boolean;
}

export interface DashboardOrganization {
  id: EntityId;
  name: string;
  slug: string;
  legalName: string | null;
  taxId: string | null;
  status: OrganizationStatus;
  countryCode: string;
  currencyCode: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: EntityId;
  userId: EntityId;
  organizationId: EntityId;
  roleKey: string;
  roleName: string;
  status: MembershipStatus;
  joinedAt: string;
}

export interface OrganizationBranch {
  id: EntityId;
  organizationId: EntityId;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  isPrimary: boolean;
}

export interface OrganizationInvitation {
  id: EntityId;
  organizationId: EntityId;
  email: string;
  invitedByUserId: EntityId;
  roleKey: string;
  roleName: string;
  status: InvitationStatus;
  createdAt: string;
  expiresAt: string;
  respondedAt: string | null;
}

export interface PlanDefinition {
  id: EntityId;
  key: string;
  name: string;
  currencyCode: string;
  priceInMinorUnits: number;
  interval: "MONTH" | "YEAR";
  limits: {
    members: number | null;
    branches: number | null;
  };
}

export interface OrganizationSubscription {
  id: EntityId;
  organizationId: EntityId;
  planId: EntityId;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEndsAt: string | null;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
}

export interface OnboardingProgress {
  userId: EntityId;
  skippedAt: string | null;
  steps: Array<{
    key: "CREATE_ORGANIZATION" | "COMPLETE_BUSINESS_PROFILE" | "REVIEW_CAPABILITIES";
    completedAt: string | null;
  }>;
}

export interface DashboardOrganizationSummary {
  id: EntityId;
  name: string;
  slug: string;
  plan: string;
  role: string;
  status: SubscriptionStatus;
  members: number;
  branches: number;
}

export interface DashboardInvitationSummary {
  id: EntityId;
  orgName: string;
  invitedBy: string;
  role: string;
  status: InvitationStatus;
  expiresIn?: string;
  receivedAt: string;
}

export interface DashboardSubscriptionSummary {
  id: EntityId;
  organizationId: EntityId;
  orgName: string;
  slug: string;
  plan: string;
  status: SubscriptionStatus;
  nextCharge: string;
}
