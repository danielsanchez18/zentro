"use client";

import { useCallback, useRef, useState } from "react";
import { CalendarDays, Check } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DatePreset = "today" | "week" | "month" | "custom" | null;

export function DateRangeFilter({
  from,
  to,
  onFromChange,
  onToChange,
  onClear,
}: {
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"presets" | "custom">("presets");
  const [preset, setPreset] = useState<DatePreset>(null);
  const [draft, setDraft] = useState<DateRange | undefined>();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);
  const active = Boolean(from || to);

  /** Prevent popover from closing when interacting with the calendar. */
  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen && view === "custom") {
        // Don't close if we're in custom/calendar view
        // User must click Cancelar or Aplicar
        return;
      }
      setOpen(nextOpen);
      if (!nextOpen) setView("presets");
    },
    [view],
  );

  const clear = () => {
    onClear();
    setPreset(null);
    setDraft(undefined);
    setFromDate("");
    setToDate("");
  };
  const togglePreset = (nextPreset: Exclude<DatePreset, "custom" | null>) => {
    if (preset === nextPreset) {
      clear();
      setOpen(false);
      return;
    }
    const end = startOfDay(new Date());
    const start = new Date(end);
    if (nextPreset === "week") start.setDate(start.getDate() - 6);
    if (nextPreset === "month") start.setMonth(start.getMonth() - 1);
    onFromChange(toInputDate(start));
    onToChange(toInputDate(end));
    setPreset(nextPreset);
    setOpen(false);
  };
  const handleCustom = () => {
    if (preset === "custom") {
      clear();
      setOpen(false);
      return;
    }
    const fromVal = from || "";
    const toVal = to || "";
    setDraft({
      from: fromVal ? new Date(`${fromVal}T00:00:00`) : undefined,
      to: toVal ? new Date(`${toVal}T00:00:00`) : undefined,
    });
    setFromDate(fromVal);
    setToDate(toVal);
    setView("custom");
  };
  const handleCalendarSelect = (range: DateRange | undefined) => {
    setDraft(range);
    setFromDate(range?.from ? toInputDate(range.from) : "");
    setToDate(range?.to ? toInputDate(range.to) : "");
  };
  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFromDate(val);
    if (val) {
      const parsed = new Date(`${val}T00:00:00`);
      if (!isNaN(parsed.getTime())) {
        setDraft((prev) => ({
          from: parsed,
          to: prev?.to && prev.to >= parsed ? prev.to : undefined,
        }));
      }
    } else {
      setDraft((prev) => ({ from: undefined, to: prev?.to }));
    }
  };
  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setToDate(val);
    if (val) {
      const parsed = new Date(`${val}T00:00:00`);
      if (!isNaN(parsed.getTime())) {
        setDraft((prev) => ({
          from: prev?.from && prev.from <= parsed ? prev.from : parsed,
          to: parsed,
        }));
      }
    } else {
      setDraft((prev) => ({ from: prev?.from, to: undefined }));
    }
  };
  const applyCustom = () => {
    const finalFrom = draft?.from ? toInputDate(draft.from) : fromDate;
    const finalTo = draft?.to ? toInputDate(draft.to) : toDate || finalFrom;
    if (!finalFrom) return;
    onFromChange(finalFrom);
    onToChange(finalTo);
    setPreset("custom");
    setOpen(false);
  };
  const closeCustom = () => {
    setView("presets");
    setOpen(false);
  };

  const label =
    preset === "today"
      ? "Hoy"
      : preset === "week"
        ? "Última semana"
        : preset === "month"
          ? "Último mes"
          : preset === "custom" && active
            ? `${formatShortLabel(from)} — ${formatShortLabel(to)}`
            : "Fecha";

  const options: { id: Exclude<DatePreset, null>; label: string }[] = [
    { id: "today", label: "Hoy" },
    { id: "week", label: "Última semana" },
    { id: "month", label: "Último mes" },
    { id: "custom", label: "Establecer fecha" },
  ];

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="h-fit rounded-lg px-3 py-2"
          />
        }
      >
        <CalendarDays className="size-3.5" />
        <span className="hidden sm:inline">{label}</span>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-fit p-0">
        {view === "presets" ? (
          <div className="py-1 px-1">
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() =>
                  option.id === "custom"
                    ? handleCustom()
                    : togglePreset(option.id)
                }
                className="flex w-full cursor-pointer items-center rounded-lg px-2.5 py-2 text-sm hover:bg-accent"
              >
                <span className="flex-1 text-left">{option.label}</span>
                {preset === option.id && (
                  <Check className="size-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        ) : (
          <div ref={contentRef}>
            {/* Inputs Desde / Hasta */}
            <div className="flex items-center gap-3 border-b border-border px-4 pt-4 pb-3">
              <div className="flex flex-1 flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Desde
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={handleFromChange}
                  className={cn(
                    "w-28 rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm font-heading text-foreground",
                    "outline-none focus:border-primary focus:ring-1 focus:ring-primary/30",
                    "[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none",
                    "[&::-webkit-inner-spin-button]:hidden [&::-webkit-inner-spin-button]:appearance-none",
                  )}
                />
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Hasta
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={handleToChange}
                  className={cn(
                    "w-28 rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm font-heading text-foreground",
                    "outline-none focus:border-primary focus:ring-1 focus:ring-primary/30",
                    "[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none",
                    "[&::-webkit-inner-spin-button]:hidden [&::-webkit-inner-spin-button]:appearance-none",
                  )}
                />
              </div>
            </div>

            <Calendar
              mode="range"
              selected={draft}
              onSelect={handleCalendarSelect}
              numberOfMonths={1}
              classNames={{
                day: "relative size-9 p-0 text-center text-sm [&.rdp-selected]:bg-accent [&:has(.rdp-range_start)]:rounded-l-lg [&:has(.rdp-range_end)]:rounded-r-lg [&:has(.rdp-range_middle)]:bg-primary/15",
                day_button:
                  "flex size-9 cursor-pointer items-center justify-center rounded-lg font-normal hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&.rdp-selected]:bg-primary [&.rdp-selected]:text-primary-foreground [&.rdp-range_start]:rounded-lg [&.rdp-range_start]:bg-primary [&.rdp-range_start]:text-primary-foreground [&.rdp-range_end]:rounded-lg [&.rdp-range_end]:bg-primary [&.rdp-range_end]:text-primary-foreground [&.rdp-range_middle]:rounded-none [&.rdp-range_middle]:bg-primary/20 [&.rdp-range_middle]:text-foreground",
              }}
            />
            <div className="flex justify-end gap-1 border-t border-border p-3">
              <Button
                type="button"
                variant="outline"
                onClick={closeCustom}
                className="rounded-full"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={applyCustom}
                disabled={!draft?.from && !fromDate}
                className="rounded-full"
              >
                Aplicar
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

function startOfDay(date: Date) {
  date.setHours(0, 0, 0, 0);
  return date;
}
function toInputDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function formatShortLabel(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
  });
}
