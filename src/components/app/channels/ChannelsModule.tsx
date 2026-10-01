"use client";

import { useMemo, useState } from "react";
import { RadioTower, ShieldAlert } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { toastMsg } from "@/components/ui/toast-message";
import { useWorkspaceContextView } from "@/hooks/use-workspace-context";
import {
  useChannelsStore,
  type UpsertChannelInput,
} from "@/stores/channels-store";
import type { SalesChannel } from "@/lib/mock/channels";
import { ChannelsKPI } from "./ChannelsKPI";
import { ChannelCard } from "./ChannelCard";
import { ExternalIntegrations } from "./ExternalIntegrations";
import { ChannelFormDialog } from "./ChannelFormDialog";

interface ChannelsModuleProps {
  slug: string;
}

/**
 * Módulo Canales de venta (/app/:slug/canales).
 *
 * Separa lo que ya existía disperso en tres unions (`OrderChannel`,
 * `CustomerChannel`, `FormChannel`) en una sola entidad, y distingue:
 *
 * - **Canales propios**: el pedido nace en Zentro → se activan/desactivan.
 * - **Integraciones externas** (WhatsApp, TikTok, Instagram, Shopify, Mercado
 *   Libre): el pedido nace afuera → se conectan. Catalogadas pero aún sin
 *   conector; el modelo ya tiene la forma que usarán.
 */
export const ChannelsModule = ({ slug }: ChannelsModuleProps) => {
  const view = useWorkspaceContextView(slug);
  const channels = useChannelsStore((state) => state.channels);
  const setChannelStatus = useChannelsStore((state) => state.setChannelStatus);
  const toggleAcceptsOrders = useChannelsStore(
    (state) => state.toggleAcceptsOrders,
  );
  const upsertChannel = useChannelsStore((state) => state.upsertChannel);

  const [editing, setEditing] = useState<SalesChannel | null>(null);

  const organizationId = view.organization?.id;
  const canView = view.canViewModule("/canales");

  const orgChannels = useMemo(
    () =>
      organizationId
        ? channels.filter(
            (channel) => channel.organizationId === organizationId,
          )
        : [],
    [channels, organizationId],
  );

  const nativeChannels = useMemo(
    () =>
      orgChannels
        .filter((channel) => channel.kind === "native")
        .sort((a, b) => a.name.localeCompare(b.name, "es")),
    [orgChannels],
  );

  const externalChannels = useMemo(
    () => orgChannels.filter((channel) => channel.kind === "external"),
    [orgChannels],
  );

  if (!organizationId) {
    return (
      <div className="w-full px-5 py-7 md:px-7 xl:px-10 font-heading">
        <h1 className="text-lg font-medium">Canales de venta</h1>
        <p className="text-sm text-muted-foreground">
          No se encontró la organización activa.
        </p>
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="w-full px-5 py-7 md:px-7 xl:px-10 font-heading">
        <div className="rounded-xl border border-dashed border-border bg-card/40">
          <EmptyState
            icon={ShieldAlert}
            title="Sin acceso a los canales"
            description={`Tu rol (${view.role.name}) no tiene permiso para ver los canales de venta de esta organización.`}
          />
        </div>
      </div>
    );
  }

  const handleToggleStatus = (channel: SalesChannel) => {
    const activating = channel.status !== "activo";
    setChannelStatus(channel.id, activating ? "activo" : "inactivo");
    toastMsg.success(
      activating ? "Canal activado" : "Canal desactivado",
      activating
        ? `${channel.name} vuelve a admitir pedidos.`
        : `${channel.name} deja de admitir pedidos. Su historial se conserva.`,
    );
  };

  const handleToggleOrders = (channel: SalesChannel) => {
    toggleAcceptsOrders(channel.id);
    toastMsg.info(
      channel.acceptsOrders
        ? "Pedidos entrantes desactivados"
        : "Pedidos entrantes activados",
      channel.name,
    );
  };

  const handleConfirmEdit = (input: UpsertChannelInput) => {
    upsertChannel(input);
    toastMsg.success("Canal actualizado", "Los cambios quedaron guardados.");
  };

  return (
    <div className="w-full space-y-7 px-5 py-7 md:px-7 xl:px-10">
      <div>
        <h1 className="text-lg font-medium text-foreground">
          Canales de venta
        </h1>
        <p className="text-sm text-muted-foreground">
          Gestiona los puntos de venta y orígenes de pedidos de tu negocio.
        </p>
      </div>

      <ChannelsKPI channels={orgChannels} />

      {/* Sección: Canales propios */}
      <section className="rounded-xl bg-card border border-border font-heading">
        <div className="border-b border-border px-5 py-3">
          <h2 className="text-sm font-medium text-foreground">
            Canales propios
          </h2>
        </div>

        <div className="p-5">
          {nativeChannels.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card/40 p-6">
              <EmptyState
                icon={RadioTower}
                title="Sin canales configurados"
                description="Activa un canal propio para empezar a registrar pedidos."
              />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {nativeChannels.map((channel) => (
                <ChannelCard
                  key={channel.id}
                  channel={channel}
                  onEdit={setEditing}
                  onToggleStatus={handleToggleStatus}
                  onToggleOrders={handleToggleOrders}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sección: Integraciones externas */}
      <section className="rounded-xl bg-card border border-border font-heading">
        <div className="border-b border-border px-5 py-3">
          <h2 className="text-sm font-medium text-foreground">
            Integraciones externas
          </h2>
        </div>

        <div className="p-5">
          <ExternalIntegrations
            connected={externalChannels.map((channel) => ({
              platform: channel.integration?.platform ?? ("whatsapp" as const),
              account: channel.integration?.externalAccount ?? null,
            }))}
          />
        </div>
      </section>

      <ChannelFormDialog
        channel={editing}
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        onConfirm={handleConfirmEdit}
      />
    </div>
  );
};
