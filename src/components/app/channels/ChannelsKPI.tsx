"use client";

import { Radio, Store, ShoppingBag, PlugZap } from "lucide-react";
import type { SalesChannel } from "@/lib/mock/channels";
import { INTEGRATION_CATALOG } from "@/lib/mock/channels";

interface ChannelsKPIProps {
  channels: SalesChannel[];
}

/**
 * KPIs del módulo Canales de venta.
 *
 * Reflejan la distinción propio/externo: los canales propios se activan, las
 * integraciones externas se conectan (hoy ninguna está disponible).
 */
export const ChannelsKPI = ({ channels }: ChannelsKPIProps) => {
  const active = channels.filter((c) => c.status === "activo").length;
  const nativeCount = channels.filter((c) => c.kind === "native").length;
  const accepting = channels.filter(
    (c) => c.kind === "native" && c.status === "activo" && c.acceptsOrders,
  ).length;
  const connected = channels.filter(
    (c) => c.integration?.status === "conectado",
  ).length;

  const stats = [
    {
      title: "Canales activos",
      value: active,
      unit: active === 1 ? "canal" : "canales",
      hint: "Habilitados para operar",
      icon: Radio,
    },
    {
      title: "Canales propios",
      value: nativeCount,
      unit: nativeCount === 1 ? "canal" : "canales",
      hint: "Pedidos nacen en Zentro",
      icon: Store,
    },
    {
      title: "Reciben pedidos",
      value: accepting,
      unit: accepting === 1 ? "canal" : "canales",
      hint: "Activos y con pedidos entrantes",
      icon: ShoppingBag,
    },
    {
      title: "Integraciones",
      value: `${connected}/${INTEGRATION_CATALOG.length}`,
      unit: "",
      hint: "Conectadas de plataformas externas",
      icon: PlugZap,
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((item) => (
        <div
          key={item.title}
          className="border border-border bg-card rounded-xl px-5 py-4 font-heading"
        >
          <div className="space-y-2">
            <div className="flex justify-between text-primary/70 items-center">
              <p className="text-sm">{item.title}</p>
              <item.icon className="size-4.5" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-xl">
                {item.value} {item.unit && <span className="text-sm">{item.unit}</span>}
              </p>
              <p className="text-xs text-primary/70">{item.hint}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};