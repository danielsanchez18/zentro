"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toastMsg } from "@/components/ui/toast-message";
import {
  EMPTY_MODULES,
  RUBROS_BY_CODE,
  STEPS,
  type IndustryCode,
  type LocalData,
  type ModuleKey,
  type StepId,
} from "./constants";
import { StepProgress } from "./StepProgress";
import { ActivityStep } from "./ActivityStep";
import { LocalStep } from "./LocalStep";
import { ModulesStep } from "./ModulesStep";
import { IndispensableDialog } from "./IndispensableDialog";

const DEFAULT_LOCAL: LocalData = {
  nombre: "Sucursal principal",
  direccion: "",
  telefono: "",
  horario: "",
};

/**
 * Wizard de onboarding (paso 2 de creación de org).
 * Captura rubro → sucursal → módulos con sugerencias por rubro.
 * TODO(0.2): persistir rubro/modules/features en la org (PATCH /orgs/:id + PUT /orgs/:id/features).
 */
export const OnboardingWizard = () => {
  const router = useRouter();

  const [step, setStep] = useState<StepId>("actividad");
  const [rubro, setRubro] = useState<IndustryCode | null>(null);
  const [local, setLocal] = useState<LocalData>(DEFAULT_LOCAL);
  const [selected, setSelected] = useState<Record<ModuleKey, boolean>>(EMPTY_MODULES);
  const [pendingModule, setPendingModule] = useState<ModuleKey | null>(null);

  const activeStepIndex = STEPS.findIndex((s) => s.id === step);
  const currentRubro = rubro ? RUBROS_BY_CODE[rubro] : undefined;

  const navigate = (route: string) => router.push(route);

  const handleSelectRubro = (code: IndustryCode) => {
    setRubro(code);
    const next = { ...EMPTY_MODULES };
    RUBROS_BY_CODE[code].suggested.forEach((key) => {
      next[key] = true;
    });
    setSelected(next);
  };

  const handleLocalChange = (field: keyof LocalData, value: string) => {
    setLocal((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleModule = (key: ModuleKey) => {
    setSelected((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const finish = () => {
    toastMsg.success(
      "Organización configurada",
      "Tu negocio está listo. Puedes editarlo desde el hub."
    );
    navigateAway();
  };

  const navigateAway = () => navigate("/dashboard");

  const handleNext = () => {
    if (step === "actividad") {
      setStep("local");
      return;
    }
    if (step === "local") {
      setStep("modulos");
      return;
    }
    // step === modulos: verificar indispensables desmarcados
    if (currentRubro) {
      const toRemove = currentRubro.indispensable.find((k) => !selected[k]);
      if (toRemove) {
        setPendingModule(toRemove);
        return;
      }
    }
    finish();
  };

  const handleConfigurarDespues = () => {
    toastMsg.info("Listo", "Puedes configurarlo desde el hub.");
    navigateAway();
  };

  const handleConfirmarSinModulo = () => {
    setPendingModule(null);
    finish();
  };

  return (
    <div className="space-y-8">
      <header className="space-y-6">
        <h1 className="text-xl font-medium font-sans">Configura tu negocio</h1>
        <StepProgress step={step} />
      </header>

      {step === "actividad" && (
        <ActivityStep rubro={rubro} onSelect={handleSelectRubro} />
      )}
      {step === "local" && <LocalStep local={local} onChange={handleLocalChange} />}
      {step === "modulos" && (
        <ModulesStep rubro={rubro} selected={selected} onToggle={handleToggleModule} />
      )}

      {/* Barra de acciones fija al fondo */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background backdrop-blur z-10">
        <div
          className={cn(
            "mx-auto flex w-full max-w-350 items-center justify-between gap-3 px-5 py-4 sm:px-7 xl:px-10"
          )}
        >
          {step !== "actividad" ? (
            <Button
              type="button"
              variant="outline"
              className="text-sm px-3 py-2 h-fit rounded-full"
              onClick={() => setStep(STEPS[activeStepIndex - 1].id)}
            >
              <ArrowLeft className="size-4" />
              Atrás
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="text-sm px-3 py-2 h-fit rounded-full"
              onClick={handleConfigurarDespues}
            >
              Configurar después
            </Button>
          )}

          <Button
            type="button"
            className="text-sm px-3 py-2 h-fit rounded-full"
            onClick={handleNext}
            disabled={step === "actividad" && !rubro}
          >
            Continuar
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>

      <IndispensableDialog
        moduleKey={pendingModule}
        onCancel={() => setPendingModule(null)}
        onConfirm={handleConfirmarSinModulo}
      />
    </div>
  );
};