import { dashboardBranches } from "@/lib/mock/dashboard";
import type { OrganizationBranch } from "@/types/dashboard";

/**
 * Entidad "Ubicación" del workspace (decisión de producto 09/2026).
 *
 * No existen sucursal/almacén como tipos rígidos: una ubicación es una sola
 * entidad flexible y sus funciones se configuran con "¿Qué sucede aquí?".
 * Una ubicación puede combinar varias funciones (p. ej. atiende al público,
 * tiene POS y despacha delivery).
 */

export type LocationFunctionKey =
  | "atencion" // Atención al público
  | "pos" // Venta en punto de venta
  | "inventario" // Almacena inventario
  | "preparacion" // Prepara pedidos
  | "recojo" // Recojo en tienda / pickup
  | "delivery" // Despacho a delivery
  | "citas" // Recibe citas (agenda)
  | "presencia"; // Ficha pública (mi sitio web / marketplace)

export interface LocationFunction {
  key: LocationFunctionKey;
  label: string;
  description: string;
}

export const LOCATION_FUNCTIONS: LocationFunction[] = [
  {
    key: "atencion",
    label: "Atención al público",
    description: "Atiende clientes de forma presencial.",
  },
  {
    key: "pos",
    label: "Punto de venta",
    description: "Registra ventas desde el POS.",
  },
  {
    key: "inventario",
    label: "Inventario",
    description: "Almacena y controla stock.",
  },
  {
    key: "preparacion",
    label: "Preparación",
    description: "Prepara pedidos y órdenes.",
  },
  {
    key: "recojo",
    label: "Recojo en tienda",
    description: "El cliente retira su pedido aquí.",
  },
  {
    key: "delivery",
    label: "Delivery",
    description: "Despacha pedidos a domicilio.",
  },
  {
    key: "citas",
    label: "Citas",
    description: "Recibe reservas y citas de la agenda.",
  },
  {
    key: "presencia",
    label: "Presencia pública",
    description: "Aparece en la ficha pública del negocio.",
  },
];

export const findLocationFunction = (key: LocationFunctionKey) =>
  LOCATION_FUNCTIONS.find((fn) => fn.key === key)!;

/** Ficha pública opcional de la ubicación. */
export interface LocationPublicProfile {
  published: boolean;
  headline?: string | null;
  description?: string | null;
  coverImage?: string | null;
}

export interface WorkspaceLocation extends OrganizationBranch {
  functions: LocationFunctionKey[];
  publicProfile: LocationPublicProfile;
}

const PUBLIC_UNPUBLISHED: LocationPublicProfile = {
  published: false,
  headline: null,
  description: null,
  coverImage: null,
};

/**
 * Funciones iniciales por organización (mock razonable a partir de las
 * branches del dashboard). Las ubicaciones nuevas comienzan con atención al
 * público + POS activados por defecto.
 */
const DEFAULT_FUNCTIONS: LocationFunctionKey[] = [
  "atencion",
  "pos",
  "presencia",
];

const seededFunctions = (organizationId: string): LocationFunctionKey[] => {
  switch (organizationId) {
    case "org_001": // Las Rocas (barbería con agenda + ecommerce)
      return [
        "atencion",
        "pos",
        "inventario",
        "recojo",
        "delivery",
        "citas",
        "presencia",
      ];
    case "org_002": // Café del Valle (cafetería 2 locales)
      return ["atencion", "pos", "inventario", "preparacion", "recojo", "presencia"];
    case "org_003": // Fonda La Abuela (restaurante)
      return ["atencion", "pos", "inventario", "preparacion", "delivery", "presencia"];
    default:
      return [...DEFAULT_FUNCTIONS];
  }
};

/** Ubicaciones semilla: idénticas a `dashboardBranches` para no romper el contexto. */
export const seedLocations = (): WorkspaceLocation[] =>
  dashboardBranches.map((branch) => ({
    ...branch,
    functions: seededFunctions(branch.organizationId),
    publicProfile: {
      ...PUBLIC_UNPUBLISHED,
      published: branch.status === "ACTIVE",
    },
  }));

/** Tipo compat: cualquier `WorkspaceLocation` es una `OrganizationBranch`. */
export const toBranch = (location: WorkspaceLocation): OrganizationBranch => {
  const { functions: _functions, publicProfile: _publicProfile, ...branch } =
    location;
  return branch;
};