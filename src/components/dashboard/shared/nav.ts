import { CircleQuestionMark, CreditCard, LifeBuoy, Mail } from "lucide-react";
import { CompanyIcon, HomeIcon, UserIcon, type HubIcon } from "@/components/dashboard/shared/icons";

export interface HubNavItem {
  href: string;
  label: string;
  /** Acepta íconos propios (icons.tsx) o de lucide-react. */
  icon: HubIcon;
  /** Muestra el contador de invitaciones pendientes. */
  badge?: "invitations";
}

export interface HubNavGroup {
  label: string;
  items: HubNavItem[];
}

/**
 * Navegación del Hub personal, agrupada por intención:
 * - Espacios: dónde trabaja el usuario.
 * - Cuenta: lo que le pertenece (perfil y cobros de sus organizaciones).
 * - Soporte.
 */
export const HUB_NAV: HubNavGroup[] = [
  {
    label: "Espacios",
    items: [
      { href: "/dashboard", label: "Inicio", icon: HomeIcon },
      { href: "/dashboard/organizaciones", label: "Organizaciones", icon: CompanyIcon },
      { href: "/dashboard/invitaciones", label: "Invitaciones", icon: Mail, badge: "invitations" },
    ],
  },
  {
    label: "Cuenta",
    items: [
      { href: "/dashboard/cuenta", label: "Mi cuenta", icon: UserIcon },
      { href: "/dashboard/suscripciones", label: "Suscripciones", icon: CreditCard },
    ],
  },
  {
    label: "Soporte",
    items: [{ href: "/dashboard/ayuda", label: "Ayuda", icon: CircleQuestionMark }],
  },
];

export const HUB_NAV_ITEMS = HUB_NAV.flatMap((group) => group.items);

/** Inicio solo está activo en la ruta exacta; el resto incluye sus sub-rutas. */
export const isNavItemActive = (href: string, pathname: string) =>
  href === "/dashboard"
    ? pathname === "/dashboard"
    : pathname === href || pathname.startsWith(`${href}/`);

export const getActiveNavItem = (pathname: string) =>
  HUB_NAV_ITEMS.find((item) => isNavItemActive(item.href, pathname));
