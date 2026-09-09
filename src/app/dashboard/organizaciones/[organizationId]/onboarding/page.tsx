import { OnboardingWizard } from "@/components/dashboard/onboarding/OnboardingWizard";

export default async function OrganizationOnboardingPage({ params }: { params: Promise<{ organizationId: string }> }) {
  const { organizationId } = await params;

  return (
    <div className="mx-auto w-full max-w-350 px-5 py-10 sm:px-7 xl:px-10">
      <OnboardingWizard organizationId={organizationId} />
    </div>
  );
}
