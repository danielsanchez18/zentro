// API calls para el módulo Organizaciones (Account Hub)
import { api } from "./client";

export interface ApiOrgSubscription {
  id: string;
  status: string; // TRIALING | ACTIVE | PAST_DUE | CANCELED
  provider: string;
  trialEndsAt: string | null;
  plan: { id: string; slug: string; name: string; price: number };
}

export interface ApiOrganization {
  id: string;
  slug: string;
  name: string;
  industry: string | null;
  status: string; // REGISTERED | ACTIVE | SUSPENDED | CANCELED
  createdAt: string;
  role: string;
  members: number;
  branches: number;
  subscription: ApiOrgSubscription | null;
}

export interface CreateOrgInput {
  name: string;
  slug: string;
}

export interface UpdateOrgFeaturesInput {
  modules: string[];
  features: string[];
}

export interface AvailabilityCheckResult {
  nameTaken: boolean;
  slugAvailable: boolean;
  suggestions: string[];
}

export const orgsApi = {
  list: (token: string) =>
    api.get<{ organizations: ApiOrganization[] }>("/orgs", token),

  checkAvailability: (name: string, slug: string, token: string) =>
    api.get<AvailabilityCheckResult>(
      `/orgs/check?name=${encodeURIComponent(name)}&slug=${encodeURIComponent(slug)}`,
      token,
    ),

  create: (input: CreateOrgInput, token: string) =>
    api.post<{
      organization: ApiOrganization & {
        branches: unknown[];
        subscription: ApiOrgSubscription;
      };
    }>("/orgs", input, token),

  get: (id: string, token: string) =>
    api.get<{ organization: ApiOrganization }>(`/orgs/${id}`, token),

  update: (
    id: string,
    input: Partial<{ name: string; industry: string; country: string; currency: string }>,
    token: string,
  ) => api.patch<{ organization: ApiOrganization }>(`/orgs/${id}`, input, token),

  updateFeatures: (id: string, input: UpdateOrgFeaturesInput, token: string) =>
    api.put<{ organization: { id: string; modules: string[]; features: string[] } }>(
      `/orgs/${id}/features`,
      input,
      token,
    ),
};