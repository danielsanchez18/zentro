import { orgsApi, type ApiOrganization } from "@/lib/api/orgs";
import { useAuthStore } from "@/stores/auth-store";
import type { SubscriptionStatus } from "@/components/dashboard/overview/StatusChip";

/**
 * Capa de servicios del módulo Organizaciones.
 * Lee el token del auth-store y mapea la respuesta de la API al dominio del hub.
 */

export interface HubOrganization {
  id: string;
  name: string;
  slug: string;
  industry: string | null;
  status: string;
  createdAt: string;
  role: string;
  members: number;
  branches: number;
  /** Nombre legible del plan (subscription.plan.name) o "Sin plan". */
  plan: string;
  planSlug: string;
  /** Estado de suscripción del plan para el StatusChip. */
  subscriptionStatus: SubscriptionStatus;
  trialEndsAt: string | null;
}

function getToken(): string {
  const token = useAuthStore.getState().token;
  if (!token) throw new Error("Sesión no iniciada");
  return token;
}

function mapSubscriptionStatus(raw: string | undefined): SubscriptionStatus {
  switch (raw) {
    case "ACTIVE":
      return "ACTIVE";
    case "PAST_DUE":
      return "PAST_DUE";
    case "CANCELED":
      return "CANCELED";
    case "TRIALING":
    default:
      return "TRIAL";
  }
}

function mapOrg(org: ApiOrganization): HubOrganization {
  const plan = org.subscription?.plan;
  return {
    id: org.id,
    name: org.name,
    slug: org.slug,
    industry: org.industry,
    status: org.status,
    createdAt: org.createdAt,
    role: org.role,
    members: org.members,
    branches: org.branches,
    plan: plan?.name ?? "Sin plan",
    planSlug: plan?.slug ?? "",
    subscriptionStatus: mapSubscriptionStatus(org.subscription?.status),
    trialEndsAt: org.subscription?.trialEndsAt ?? null,
  };
}

export async function getOrgsService(): Promise<HubOrganization[]> {
  const { organizations } = await orgsApi.list(getToken());
  return organizations.map(mapOrg);
}

export async function createOrgService(input: {
  name: string;
  slug: string;
}): Promise<HubOrganization> {
  const { organization } = await orgsApi.create(input, getToken());
  return mapOrg(organization);
}

export async function checkAvailabilityService(
  name: string,
  slug: string,
): Promise<{
  nameTaken: boolean;
  slugAvailable: boolean;
  suggestions: string[];
}> {
  const res = await orgsApi.checkAvailability(name, slug, getToken());
  return {
    nameTaken: res.nameTaken,
    slugAvailable: res.slugAvailable,
    suggestions: res.suggestions,
  };
}

export async function updateOrgIndustryService(id: string, industry: string): Promise<void> {
  await orgsApi.update(id, { industry }, getToken());
}

export async function updateOrgFeaturesService(
  id: string,
  modules: string[],
  features: string[],
): Promise<void> {
  await orgsApi.updateFeatures(id, { modules, features }, getToken());
}
