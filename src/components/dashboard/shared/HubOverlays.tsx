"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { create } from "zustand";
import { useAuthStore } from "@/stores/auth-store";
import { useTenantStore } from "@/stores/tenant-store";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { hubButton } from "@/components/dashboard/shared/styles";
import { CompanyIcon } from "@/components/dashboard/shared/icons";

/**
 * Overlays globales del Hub, montados una sola vez en el layout:
 * - Confirmación de cierre de sesión (cualquier botón "Cerrar sesión").
 * - Animación de entrada a una organización (cualquier "Entrar").
 */

interface EnteringOrganization {
  id: string;
  slug: string;
  name: string;
}

interface HubOverlayState {
  logoutOpen: boolean;
  entering: EnteringOrganization | null;
  setLogoutOpen: (open: boolean) => void;
  setEntering: (organization: EnteringOrganization | null) => void;
}

const useHubOverlays = create<HubOverlayState>((set) => ({
  logoutOpen: false,
  entering: null,
  setLogoutOpen: (logoutOpen) => set({ logoutOpen }),
  setEntering: (entering) => set({ entering }),
}));

/** Abre la confirmación de cierre de sesión. */
export const useLogout = () => {
  const setLogoutOpen = useHubOverlays((state) => state.setLogoutOpen);
  return () => setLogoutOpen(true);
};

/** Entra a una organización mostrando la animación de transición. */
export const useEnterOrganization = () => {
  const setEntering = useHubOverlays((state) => state.setEntering);
  return (organization: EnteringOrganization) => setEntering(organization);
};

const LogoutDialog = () => {
  const open = useHubOverlays((state) => state.logoutOpen);
  const setOpen = useHubOverlays((state) => state.setLogoutOpen);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const confirm = () => {
    setOpen(false);
    logout();
    router.replace("/ingresar");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent showCloseButton={false} className="p-6 sm:max-w-sm">
        <div className="flex flex-col items-center text-center">
          <span className="flex size-12 items-center justify-center rounded-(--hub-radius-control) bg-destructive/10 text-destructive">
            <LogOut className="size-5" />
          </span>
          <DialogTitle className="mt-4 font-sans text-base font-medium">
            ¿Cerrar sesión?
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm">
            Tendrás que volver a iniciar sesión para entrar a tu cuenta y a tus organizaciones.
          </DialogDescription>
          <div data-hub-footer className="mt-5 flex w-full">
            <button type="button" className={hubButton.secondary} onClick={() => setOpen(false)}>
              Cancelar
            </button>
            <button type="button" className={hubButton.danger} onClick={confirm}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ENTER_MS = 1400;

const EnteringOverlay = () => {
  const entering = useHubOverlays((state) => state.entering);
  const setEntering = useHubOverlays((state) => state.setEntering);
  const setActiveTenant = useTenantStore((state) => state.setActiveTenant);
  const router = useRouter();

  useEffect(() => {
    if (!entering) return;
    setActiveTenant({ orgId: entering.id, slug: entering.slug, name: entering.name });
    router.prefetch(`/app/${entering.slug}`);
    const timer = setTimeout(() => {
      router.push(`/app/${entering.slug}`);
      // El overlay se desmonta con el layout del Hub al cambiar de ruta;
      // este reset cubre el caso de que la navegación falle.
      setTimeout(() => setEntering(null), 4000);
    }, ENTER_MS);
    return () => clearTimeout(timer);
  }, [entering, router, setActiveTenant, setEntering]);

  if (!entering) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="hub-enter fixed inset-0 z-[100] flex items-center justify-center bg-background"
    >
      <div className="flex flex-col items-center px-6 text-center">
        <div className="hub-enter-door relative flex size-24 items-center justify-center">
          <span className="hub-enter-ring absolute inset-0 rounded-full border-2 border-hub-accent" />
          <span className="hub-enter-ring absolute inset-0 rounded-full border-2 border-hub-accent" style={{ animationDelay: "0.45s" }} />
          <span className="relative flex size-16 items-center justify-center rounded-(--hub-radius-control) bg-hub-accent text-hub-accent-foreground shadow-lg">
            <CompanyIcon className="size-8" />
          </span>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">Entrando a</p>
        <p className="font-sans text-xl font-semibold">{entering.name}</p>
        <div className="mt-5 h-1 w-40 overflow-hidden rounded-full bg-muted">
          <div className="hub-enter-bar h-full rounded-full bg-hub-accent" style={{ animationDuration: `${ENTER_MS}ms` }} />
        </div>
      </div>
    </div>
  );
};

export const HubOverlays = () => (
  <>
    <LogoutDialog />
    <EnteringOverlay />
  </>
);
