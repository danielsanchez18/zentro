import { Greeting } from "@/components/dashboard/overview/Greeting";
import { OnboardingBanner } from "@/components/dashboard/overview/OnboardingBanner";
import { OrganizationsGrid } from "@/components/dashboard/overview/OrganizationsGrid";
import { InvitationsList } from "@/components/dashboard/overview/InvitationsList";
import { SubscriptionsSummary } from "@/components/dashboard/overview/SubscriptionsSummary";
import { DemoTour } from "@/components/dashboard/overview/DemoTour";

/**
 * Overview del hub (/dashboard)
 *
 * Orden de secciones:
 *   1. Bienvenida
 *   2. Mis organizaciones (entrada al workspace y borradores)
 *   3. Primeros pasos (onboarding)
 *   4. Invitaciones
 *   5. Suscripciones
 *
 * TODO(0.2): conectar con datos reales (/users/me, /orgs, /invitations).
 */
export const Overview = () => {
  return (
    <div className="space-y-2">
      <Greeting />
      <OrganizationsGrid />
      <OnboardingBanner />
      <InvitationsList />
      <SubscriptionsSummary />
      <DemoTour />
    </div>
  );
};
