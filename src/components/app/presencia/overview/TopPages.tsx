"use client";

import { FileText } from "lucide-react";
import type { PageMetric } from "@/lib/mock/presence-analytics";

interface TopPagesProps {
  pages: PageMetric[];
}

const formatSeconds = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return minutes > 0 ? `${minutes}m ${rest}s` : `${rest}s`;
};

/** Páginas del sitio ordenadas por vistas, con permanencia y rebote. */
export const TopPages = ({ pages }: TopPagesProps) => {
  if (pages.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Sin páginas con visitas en este periodo.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs text-muted-foreground">
            <th className="px-3 py-2 font-medium">Página</th>
            <th className="px-3 py-2 text-right font-medium">Vistas</th>
            <th className="px-3 py-2 text-right font-medium">Permanencia</th>
            <th className="px-3 py-2 text-right font-medium">Rebote</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page) => (
            <tr key={page.slug} className="border-b border-border last:border-0">
              <td className="px-3 py-2.5">
                <span className="flex items-center gap-2">
                  <FileText className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="font-medium text-foreground">
                    {page.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {page.slug}
                  </span>
                </span>
              </td>
              <td className="px-3 py-2.5 text-right tabular-nums text-foreground">
                {page.views}
              </td>
              <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground">
                {formatSeconds(page.avgSeconds)}
              </td>
              <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground">
                {page.bounceRate}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};