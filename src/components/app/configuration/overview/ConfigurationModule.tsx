"use client";

import { useMemo } from "react";
import {
  MapPin,
  Receipt,
  Calculator,
  CalendarClock,
  RadioTower,
  Users,
} from "lucide-react";
import { useWorkspaceContextView } from "@/hooks/use-workspace-context";
import { useLocationsStore } from "@/stores/locations-store";
import { useChannelsStore } from "@/stores/channels-store";
import { ConfigurationHeader } from "../shared/ConfigurationHeader";
import {
  ConfigurationSectionCard,
  type SectionCardData,
} from "./ConfigurationSectionCard";
import {
  ConfigurationModuleLinks,
  type ModuleLinkData,
} from "./ConfigurationModuleLinks";

interface ConfigurationModuleProps {
  slug: string;
}

/**
 * Hub principal del Centro de configuración (/app/:slug/configuracion).
 *
 * Agrupa las secciones de configuración generales del negocio y proporciona
 * accesos rápidos a las configuraciones distribuidas en otros módulos.
 */
export const ConfigurationModule = ({ slug }: ConfigurationModuleProps) => {
  const view = useWorkspaceContextView(slug);
  const locations = useLocationsStore((state) => state.locations);
  const channels = useChannelsStore((state) => state.channels);

  const orgName = view.organization?.name ?? "la organización";

  const orgLocations = useMemo(
    () =>
      view.organization
        ? locations.filter(
            (location) => location.organizationId === view.organization!.id,
          )
        : [],
    [locations, view.organization],
  );

  const activeLocations = useMemo(
    () => orgLocations.filter((location) => location.status === "ACTIVE"),
    [orgLocations],
  );

  const activeChannels = useMemo(
    () =>
      view.organization
        ? channels.filter(
            (channel) =>
              channel.organizationId === view.organization!.id &&
              channel.kind === "native" &&
              channel.status === "activo",
          )
        : [],
    [channels, view.organization],
  );

  const sections: SectionCardData[] = [
    {
      href: `/app/${slug}/canales`,
      label: "Canales de venta",
      subtitle: "Propios e integraciones",
      description:
        "Decide por dónde entran los pedidos: punto de venta, sitio web, marketplace y futuras integraciones.",
      icon: RadioTower,
      badge: String(activeChannels.length),
      statusBadge: {
        status: activeChannels.length > 0 ? "activo" : "inactivo",
        label:
          activeChannels.length === 1
            ? "1 canal activo"
            : `${activeChannels.length} canales activos`,
      },
      stats: [
        {
          label: "Propios",
          value: `${activeChannels.length} ${
            activeChannels.length === 1 ? "activo" : "activos"
          }`,
        },
        {
          label: "Integraciones",
          value: "Próximamente",
        },
      ],
    },
    {
      href: `/app/${slug}/configuracion/ubicaciones`,
      label: "Ubicaciones",
      subtitle: "Sedes y puntos de atención",
      description:
        "Crea y gestiona dónde opera tu negocio: atención, POS, inventario, delivery y más.",
      icon: MapPin,
      badge: String(activeLocations.length),
      statusBadge: {
        status: activeLocations.length > 0 ? "activo" : "inactivo",
        label:
          activeLocations.length === 1
            ? "1 sede activa"
            : `${activeLocations.length} sedes activas`,
      },
      stats: [
        {
          label: "Registradas",
          value: `${orgLocations.length} ${
            orgLocations.length === 1 ? "sede" : "sedes"
          }`,
        },
        {
          label: "Operativas",
          value: `${activeLocations.length} activas`,
        },
      ],
    },
    {
      href: `/app/${slug}/configuracion/facturacion`,
      label: "Facturación",
      subtitle: "Datos fiscales y comprobantes",
      description:
        "Datos fiscales, RUC, razón social, logo y configuración de comprobantes.",
      icon: Receipt,
      statusBadge: {
        status: "activo",
        label: "Habilitada",
      },
      stats: [
        {
          label: "Comprobantes",
          value: "Boletas y Facturas",
        },
        {
          label: "Emisión",
          value: "Electrónica SUNAT",
        },
      ],
    },
  ];

  const moduleLinks: ModuleLinkData[] = [
    {
      href: `/app/${slug}/caja/configuracion`,
      label: "Configuración de caja",
      subtitle: "Finanzas y caja",
      description: "Aperturas, turnos, límites de efectivo y medios de pago.",
      icon: Calculator,
    },
    {
      href: `/app/${slug}/agenda/configuracion`,
      label: "Configuración de agenda",
      subtitle: "Citas y reservas",
      description: "Horarios de atención, intervalos de citas y profesionales.",
      icon: CalendarClock,
    },
    {
      href: `/app/${slug}/equipo`,
      label: "Equipo y permisos",
      subtitle: "Permisos y accesos",
      description: "Miembros, roles, accesos por módulo y auditoría.",
      icon: Users,
    },
  ];

  return (
    <div className="w-full space-y-7 px-5 py-7 md:px-7 xl:px-10">
      <ConfigurationHeader
        title="Centro de configuración"
        description={`Configura la operación de ${orgName}: ubicaciones, datos fiscales y canales de venta.`}
      />

      {/* Grid de Secciones Principales */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => (
          <ConfigurationSectionCard key={section.href} section={section} />
        ))}
      </div>

      {/* Accesos a configuraciones de otros módulos */}
      <ConfigurationModuleLinks links={moduleLinks} />
    </div>
  );
};
