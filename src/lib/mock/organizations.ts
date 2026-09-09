import { getUserOrganizationSummaries } from "@/lib/mock/dashboard";

/**
 * Fuente local de organizaciones para el prototipo.
 * TODO(0.2): reemplazar por GET /orgs cuando esté el backend.
 */
export const MOCK_ORGANIZATIONS = getUserOrganizationSummaries();
