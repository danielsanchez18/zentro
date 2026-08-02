import type { Organization } from "@/components/dashboard/organizaciones/types";

/**
 * Fuente única de organizaciones de prueba (modo mock).
 * TODO(0.2): reemplazar por GET /orgs cuando esté el backend.
 */
export const MOCK_ORGANIZATIONS: Organization[] = [
  {
    id: "org_001",
    name: "Las Rocas Restaurante",
    slug: "las-rocas",
    plan: "Esencial",
    role: "Owner",
    status: "TRIAL",
    members: 3,
    branches: 1,
  },
  {
    id: "org_002",
    name: "Café del Valle",
    slug: "cafe-del-valle",
    plan: "Crecimiento",
    role: "Admin",
    status: "ACTIVE",
    members: 5,
    branches: 2,
  },
  {
    id: "org_003",
    name: "Fonda La Abuela",
    slug: "fonda-la-abuela",
    plan: "Esencial",
    role: "Miembro",
    status: "ACTIVE",
    members: 2,
    branches: 1,
  },
];
