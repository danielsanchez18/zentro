import { Greeting } from "@/components/dashboard/overview/Greeting";
import { OnboardingBanner } from "@/components/dashboard/overview/OnboardingBanner";
import { OrganizationsGrid } from "@/components/dashboard/overview/OrganizationsGrid";
import { InvitationsList } from "@/components/dashboard/overview/InvitationsList";
import { SubscriptionsSummary } from "@/components/dashboard/overview/SubscriptionsSummary";

/**
 * Overview del hub (/dashboard)
 *
 * Orden de secciones:
 *   1. Bienvenida
 *   2. Primeros pasos (onboarding)
 *   3. Mis organizaciones
 *   4. Invitaciones
 *   5. Suscripciones
 *
 * TODO(0.2): conectar con datos reales (/users/me, /orgs, /invitations).
 */
export const Overview = () => {
  return (
    <div className="space-y-10">
      <Greeting />
      <OnboardingBanner />
      <OrganizationsGrid />
      <InvitationsList />
      <SubscriptionsSummary />
    </div>
  );
};
