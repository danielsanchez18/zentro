"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toastMsg } from "@/components/ui/toast-message";
import { useDashboardStore } from "@/stores/dashboard-store";
import { EMPTY_MODULES, RUBROS_BY_CODE, STEPS, type IndustryCode, type LocalData, type ModuleKey, type StepId } from "./constants";
import { StepProgress } from "./StepProgress";
import { ActivityStep } from "./ActivityStep";
import { LocalStep } from "./LocalStep";
import { ModulesStep } from "./ModulesStep";
import { ReviewStep } from "./ReviewStep";

const EMPTY_LOCATION: LocalData = { nombre: "", direccion: "", telefono: "", horario: "" };

export const OnboardingWizard = ({ organizationId }: { organizationId: string }) => {
  const router = useRouter();
  const organization = useDashboardStore((state) => state.organizations.find((item) => item.id === organizationId));
  const setup = useDashboardStore((state) => state.organizationSetups.find((item) => item.organizationId === organizationId));
  const saveOrganizationSetup = useDashboardStore((state) => state.saveOrganizationSetup);
  const skipOrganizationSetup = useDashboardStore((state) => state.skipOrganizationSetup);
  const [step, setStep] = useState<StepId>("actividad");
  const [industry, setIndustry] = useState<IndustryCode | null>(setup?.industry ?? null);
  const [selected, setSelected] = useState<Record<ModuleKey, boolean>>(() => ({
    ...EMPTY_MODULES,
    ...Object.fromEntries((setup?.capabilities ?? []).map((key) => [key, true])),
  }));
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [location, setLocation] = useState<LocalData>(EMPTY_LOCATION);

  const showLocationStep = Boolean(industry && (RUBROS_BY_CODE[industry].physicalSetupHelpful || selected.ventas || selected.inventario));
  const visibleSteps = useMemo(() => STEPS.filter((item) => item.id !== "local" || showLocationStep), [showLocationStep]);
  const activeStepIndex = visibleSteps.findIndex((item) => item.id === step);

  if (!organization || !setup) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center">
        <h1 className="text-lg font-medium">No encontramos esta organización</h1>
        <p className="mt-2 text-sm text-muted-foreground">Vuelve al listado y crea o selecciona una organización.</p>
        <Button className="mt-5 rounded-full" onClick={() => router.push("/dashboard/organizaciones")}>Ver organizaciones</Button>
      </div>
    );
  }

  const handleSelectIndustry = (code: IndustryCode) => {
    setIndustry(code);
    const suggestions = { ...EMPTY_MODULES };
    RUBROS_BY_CODE[code].suggested.forEach((key) => { suggestions[key] = true; });
    setSelected(suggestions);
  };

  const goNext = () => {
    if (step === "actividad") return setStep("modulos");
    if (step === "modulos") return setStep(showLocationStep ? "local" : "resumen");
    if (step === "local") return setStep("resumen");

    saveOrganizationSetup(organizationId, {
      industry: industry!,
      capabilities: (Object.keys(selected) as ModuleKey[]).filter((key) => selected[key]),
      branch: { enabled: locationEnabled, name: location.nombre, address: location.direccion, phone: location.telefono, openingHours: location.horario },
      complete: true,
    });
    toastMsg.success("Organización configurada", "La configuración del prototipo quedó guardada.");
    router.push("/dashboard/organizaciones");
  };

  const goBack = () => {
    if (activeStepIndex > 0) setStep(visibleSteps[activeStepIndex - 1].id);
  };

  const skip = () => {
    skipOrganizationSetup(organizationId);
    toastMsg.info("Configuración guardada como pendiente", "Puedes retomarla desde Organizaciones.");
    router.push("/dashboard/organizaciones");
  };

  return (
    <div className="space-y-8 pb-24">
      <header className="space-y-6">
        <div><p className="text-sm text-muted-foreground">{organization.name}</p><h1 className="font-sans text-xl font-medium">Configura cómo usarás Zentro</h1></div>
        <StepProgress step={step} steps={visibleSteps} />
      </header>

      {step === "actividad" && <ActivityStep rubro={industry} onSelect={handleSelectIndustry} />}
      {step === "modulos" && <ModulesStep rubro={industry} selected={selected} onToggle={(key) => setSelected((current) => ({ ...current, [key]: !current[key] }))} />}
      {step === "local" && <LocalStep local={location} onChange={(field, value) => setLocation((current) => ({ ...current, [field]: value }))} enabled={locationEnabled} onEnabledChange={setLocationEnabled} />}
      {step === "resumen" && industry && <ReviewStep organizationName={organization.name} industry={industry} selected={selected} locationEnabled={locationEnabled} location={location} />}

      <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-350 items-center justify-between gap-3 px-5 py-4 sm:px-7 xl:px-10">
          {activeStepIndex > 0 ? <Button type="button" variant="outline" className="h-fit rounded-full px-3 py-2 text-sm" onClick={goBack}><ArrowLeft className="size-4" />Atrás</Button> : <Button type="button" variant="outline" className="h-fit rounded-full px-3 py-2 text-sm" onClick={skip}>Configurar después</Button>}
          <Button type="button" className="h-fit rounded-full px-3 py-2 text-sm" onClick={goNext} disabled={(step === "actividad" && !industry) || (step === "local" && locationEnabled && !location.nombre.trim())}>
            {step === "resumen" ? <><Check className="size-4" />Finalizar</> : <>Continuar<ArrowRight className="size-4" /></>}
          </Button>
        </div>
      </div>
    </div>
  );
};
