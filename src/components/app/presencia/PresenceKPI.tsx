"use client";

import { FileText, PenLine, Globe, Link2 } from "lucide-react";
import type { SitePage } from "@/lib/mock/web-presence";

interface PresenceKPIProps {
  pages: SitePage[];
  pendingCount: number;
}

/**
 * KPIs del Constructor Web. El más importante es "Pendiente de publicar":
 * hace visible la diferencia entre guardar un cambio y publicarlo.
 */
export const PresenceKPI = ({ pages, pendingCount }: PresenceKPIProps) => {
  const published = pages.filter((page) => page.status === "publicado").length;
  const drafts = pages.length - published;
  const blocks = pages.reduce((total, page) => total + page.blocks.length, 0);

  const stats = [
    {
      title: "Páginas",
      value: pages.length,
      unit: pages.length === 1 ? "página" : "páginas",
      hint: `${published} publicadas`,
      icon: FileText,
    },
    {
      title: "Bloques",
      value: blocks,
      unit: "",
      hint: "En todas las páginas",
      icon: PenLine,
    },
    {
      title: "Borradores",
      value: drafts,
      unit: drafts === 1 ? "página" : "páginas",
      hint: "Solo visibles al publicar",
      icon: Globe,
    },
    {
      title: "Pendiente de publicar",
      value: pendingCount,
      unit: pendingCount === 1 ? "cambio" : "cambios",
      hint: pendingCount > 0 ? "El visitante aún no lo ve" : "Todo al día",
      icon: Link2,
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
                {item.value}{" "}
                {item.unit && <span className="text-sm">{item.unit}</span>}
              </p>
              <p className="text-xs text-primary/70">{item.hint}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};