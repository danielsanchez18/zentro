import { create } from "zustand";
import {
  seedSalesChannels,
  type SalesChannel,
  type ExternalPlatformKey,
} from "@/lib/mock/channels";

export interface UpsertChannelInput {
  /** Obligatorio: los canales propios forman un catálogo cerrado por organización. */
  id: string;
  name?: string;
  description?: string;
  status: "activo" | "inactivo";
  acceptsOrders?: boolean;
}

interface ChannelsStore {
  channels: SalesChannel[];
  upsertChannel: (input: UpsertChannelInput) => void;
  removeChannel: (id: string) => void;
  setChannelStatus: (id: string, status: SalesChannel["status"]) => void;
  toggleAcceptsOrders: (id: string) => void;
  channelsByOrganization: (organizationId: string) => SalesChannel[];
  nativeChannelsByOrganization: (organizationId: string) => SalesChannel[];
  externalChannelsByOrganization: (organizationId: string) => SalesChannel[];
  /**
   * Resuelve una clave legacy (`OrderChannel`, `CustomerChannel`,
   * `FormChannel`) a un canal propio de la organización.
   */
  resolveLegacyChannel: (
    organizationId: string,
    legacyKey: string,
  ) => SalesChannel | undefined;
}

export const useChannelsStore = create<ChannelsStore>((set, get) => ({
  channels: [...seedSalesChannels],

  upsertChannel: (input) =>
    set((state) => ({
      channels: state.channels.map((channel) =>
        channel.id === input.id
          ? {
              ...channel,
              name: input.name ?? channel.name,
              description: input.description ?? channel.description,
              status: input.status,
              acceptsOrders:
                input.acceptsOrders ??
                (input.status === "activo" ? channel.acceptsOrders : false),
            }
          : channel,
      ),
    })),

  removeChannel: (id) =>
    set((state) => ({
      channels: state.channels.filter((channel) => channel.id !== id),
    })),

  setChannelStatus: (id, status) =>
    set((state) => ({
      channels: state.channels.map((channel) =>
        channel.id === id
          ? {
              ...channel,
              status,
              acceptsOrders:
                status === "activo" ? channel.acceptsOrders : false,
            }
          : channel,
      ),
    })),

  toggleAcceptsOrders: (id) =>
    set((state) => ({
      channels: state.channels.map((channel) =>
        channel.id === id
          ? { ...channel, acceptsOrders: !channel.acceptsOrders }
          : channel,
      ),
    })),

  channelsByOrganization: (organizationId) =>
    get().channels.filter(
      (channel) => channel.organizationId === organizationId,
    ),

  nativeChannelsByOrganization: (organizationId) =>
    get()
      .channels.filter(
        (channel) =>
          channel.organizationId === organizationId &&
          channel.kind === "native",
      )
      .sort((a, b) => a.name.localeCompare(b.name, "es")),

  externalChannelsByOrganization: (organizationId) =>
    get().channels.filter(
      (channel) =>
        channel.organizationId === organizationId &&
        channel.kind === "external",
    ),

  resolveLegacyChannel: (organizationId, legacyKey) =>
    get().channels.find(
      (channel) =>
        channel.organizationId === organizationId &&
        channel.legacyKeys.includes(legacyKey as never),
    ),
}));

/** Reexporta la plataforma externa para los componentes del módulo. */
export type { ExternalPlatformKey };