"use client";

import { cn } from "@/lib/utils";
import {
  reportPeriods,
  reportPeriodLabel,
  type ReportPeriod,
} from "@/lib/mock/reportes";

export function PeriodSelector({
  value,
  onChange,
}: {
  value: ReportPeriod;
  onChange: (period: ReportPeriod) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1.5 overflow-x-auto">
      {reportPeriods.map((period) => (
        <button
          key={period}
          type="button"
          onClick={() => onChange(period)}
          className={cn(
            "text-nowrap rounded-md px-3 py-1.5 leading-none text-sm font-medium transition-colors cursor-pointer",
            value === period
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground bg-primary/5",
          )}
        >
          {reportPeriodLabel[period]}
        </button>
      ))}
    </div>
  );
}
