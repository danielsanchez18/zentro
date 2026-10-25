import { HubPageLoader } from "@/components/dashboard/shared/HubPageLoader";

/** Se muestra mientras Next.js carga una página del Hub. */
export default function DashboardLoading() {
  return <HubPageLoader label="Cargando página" />;
}
