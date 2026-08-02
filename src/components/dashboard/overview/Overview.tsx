import { Greeting } from "@/components/dashboard/overview/Greeting";
import { TenantEntry } from "@/components/dashboard/overview/TenantEntry";
import { OnboardingBanner } from "@/components/dashboard/overview/OnboardingBanner";
import { OrganizationsGrid } from "@/components/dashboard/overview/OrganizationsGrid";
import { InvitationsList } from "@/components/dashboard/overview/InvitationsList";
import { SubscriptionsSummary } from "@/components/dashboard/overview/SubscriptionsSummary";

/**
 * Overview del hub (/dashboard)
 *
 * Orden de secciones:
 *   1. Bienvenida
 *   2. Tu organización (entrada al tenant: directo con 1, selector con 2+)
 *   3. Primeros pasos (onboarding)
 *   4. Mis organizaciones
 *   5. Invitaciones
 *   6. Suscripciones
 *
 * TODO(0.2): conectar con datos reales (/users/me, /orgs, /invitations).
 */
export const Overview = () => {
  return (
    <div className="space-y-10">
      <Greeting />
      <TenantEntry />
      <OnboardingBanner />
      <OrganizationsGrid />
      <InvitationsList />
      <SubscriptionsSummary />
    </div>
  );
};
