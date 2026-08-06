/**
 * Mock data para el tenant dashboard (/app/:slug).
 * Se usa mientras el backend de 0.2 no está conectado.
 * Incluye 2 sucursales para poder testear el BranchSwitcher.
 */

export interface MockBranch {
  id: string;
  name: string;
  type: "MAIN" | "ADDITIONAL";
  isDefault: boolean;
  address?: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface MockOrg {
  id: string;
  slug: string;
  name: string;
  logoUrl?: string;
  industry: string;
  modules: string[];
  subscription: {
    status: "TRIALING" | "ACTIVE" | "PAST_DUE" | "CANCELED";
    planName: string;
    trialEndsAt?: string; // ISO date
    daysLeft?: number;
  };
  branches: MockBranch[];
}

// Org de prueba con 2 sucursales (para testear el switcher)
export const MOCK_ORG: MockOrg = {
  id: "org_001",
  slug: "las-rocas",
  name: "Las Rocas",
  industry: "RESTAURANT",
  modules: ["ventas", "catalogo", "clientes", "inventario", "presencia"],
  subscription: {
    status: "TRIALING",
    planName: "Trial",
    trialEndsAt: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    daysLeft: 28,
  },
  branches: [
    {
      id: "branch_001",
      name: "Sucursal Principal",
      type: "MAIN",
      isDefault: true,
      address: "Av. La Marina 1234, San Miguel",
      status: "ACTIVE",
    },
    {
      id: "branch_002",
      name: "Sucursal Norte",
      type: "ADDITIONAL",
      isDefault: false,
      address: "Jr. Los Pinos 567, Los Olivos",
      status: "ACTIVE",
    },
  ],
};

// Módulos activos de esta org — determina qué items del sidebar están habilitados
export const ACTIVE_MODULES = new Set(MOCK_ORG.modules);
