"use client";

import * as React from "react";
import {
  CalendarDays,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  ArrowRight,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  value?: string; // Format: YYYY-MM-DDTHH:mm or YYYY-MM-DD HH:mm
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const WEEKDAYS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

/* -------------------------------------------------------------------------- */
/*                      Samsung Alarm Style Wheel Column                      */
/* -------------------------------------------------------------------------- */
function WheelColumn({
  label,
  value,
  max,
  onChange,
}: {
  label: string;
  value: number; // 0 to max - 1
  max: number; // 24 for hours, 60 for minutes
  onChange: (val: number) => void;
}) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(String(value).padStart(2, "0"));

  React.useEffect(() => {
    setInputValue(String(value).padStart(2, "0"));
  }, [value]);

  const prevValue = (value - 1 + max) % max;
  const nextValue = (value + 1) % max;

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 0) {
      onChange((value + 1) % max);
    } else if (e.deltaY < 0) {
      onChange((value - 1 + max) % max);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      onChange((value - 1 + max) % max);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      onChange((value + 1) % max);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    let num = parseInt(inputValue, 10);
    if (isNaN(num)) num = 0;
    if (num < 0) num = 0;
    if (num >= max) num = max - 1;
    onChange(num);
  };

  return (
    <div className="flex flex-col items-center select-none">
      <span className="text-xs font-medium mb-2 font-heading">
        {label}
      </span>
      <div
        tabIndex={0}
        onWheel={handleWheel}
        onKeyDown={handleKeyDown}
        className="relative flex flex-col items-center justify-center w-24 py-1 rounded-xl focus:outline-none focus:ring-0 cursor-grab active:cursor-grabbing"
      >
        {/* Center Active Row Selection Highlight */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-13 bg-accent/70 border-y border-border/80 rounded-xl pointer-events-none" />

        {/* Previous item (Faded top) */}
        <button
          type="button"
          onClick={() => onChange(prevValue)}
          className="z-10 h-10 flex items-center justify-center text-base font-heading font-medium text-muted-foreground/35 hover:text-muted-foreground/60 transition-all hover:scale-105"
        >
          {String(prevValue).padStart(2, "0")}
        </button>

        {/* Current item (Active center) */}
        <div className="z-10 h-13 flex items-center justify-center">
          {isEditing ? (
            <input
              type="text"
              autoFocus
              inputMode="numeric"
              maxLength={2}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value.replace(/\D/g, ""))}
              onBlur={handleBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleBlur();
              }}
              className="w-16 h-10 text-center text-xl font-medium font-heading bg-background border border-primary rounded-lg text-foreground outline-none"
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-xl font-medium font-heading text-foreground hover:text-primary transition-colors cursor-pointer px-2 py-0.5 rounded-lg hover:bg-accent/40"
              title="Haz clic para cambiar manualmente"
            >
              {String(value).padStart(2, "0")}
            </button>
          )}
        </div>

        {/* Next item (Faded bottom) */}
        <button
          type="button"
          onClick={() => onChange(nextValue)}
          className="z-10 h-10 flex items-center justify-center text-base font-heading font-medium text-muted-foreground/35 hover:text-muted-foreground/60 transition-all hover:scale-105"
        >
          {String(nextValue).padStart(2, "0")}
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                           Main DateTimePicker                              */
/* -------------------------------------------------------------------------- */
export function DateTimePicker({
  value,
  onChange,
  placeholder = "Seleccionar fecha y hora",
  className,
  disabled = false,
}: DateTimePickerProps) {
  const parsedDate = React.useMemo(() => {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }, [value]);

  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState<"date" | "time">("date");

  const [viewDate, setViewDate] = React.useState<Date>(() => parsedDate || new Date());
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(parsedDate);
  const [hours, setHours] = React.useState<string>(() => {
    if (parsedDate) return String(parsedDate.getHours()).padStart(2, "0");
    return "12";
  });
  const [minutes, setMinutes] = React.useState<string>(() => {
    if (parsedDate) return String(parsedDate.getMinutes()).padStart(2, "0");
    return "00";
  });

  // Reset to date step on popover open
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setStep("date");
    }
  };

  // Sync internal state when external value changes
  React.useEffect(() => {
    if (parsedDate) {
      setSelectedDate(parsedDate);
      setViewDate(parsedDate);
      setHours(String(parsedDate.getHours()).padStart(2, "0"));
      setMinutes(String(parsedDate.getMinutes()).padStart(2, "0"));
    } else {
      setSelectedDate(null);
    }
  }, [parsedDate]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // Navigation handlers
  const prevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  // Calendar days grid computation
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday-based index
  const prevMonthDays = new Date(year, month, 0).getDate();

  const handleSelectDay = (dayNum: number, isCurrentMonth: boolean, monthOffset: number = 0) => {
    const targetDate = new Date(year, month + monthOffset, dayNum);
    setSelectedDate(targetDate);
    if (!isCurrentMonth) {
      setViewDate(new Date(year, month + monthOffset, 1));
    }
  };

  const emitValue = (dateObj: Date, h: string, m: string) => {
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
    const dd = String(dateObj.getDate()).padStart(2, "0");
    const formatted = `${yyyy}-${mm}-${dd}T${h}:${m}`;
    onChange?.(formatted);
  };

  const handleClear = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedDate(null);
    onChange?.("");
  };

  const handleQuickPreset = (preset: "today" | "tomorrow" | "nextWeek") => {
    const base = new Date();
    if (preset === "tomorrow") base.setDate(base.getDate() + 1);
    if (preset === "nextWeek") base.setDate(base.getDate() + 7);

    setSelectedDate(base);
    setViewDate(base);
  };

  const handleGoToTimeStep = () => {
    if (!selectedDate) {
      const today = new Date();
      setSelectedDate(today);
      setViewDate(today);
    }
    setStep("time");
  };

  const handleConfirmFinal = () => {
    const targetDate = selectedDate || new Date();
    emitValue(targetDate, hours, minutes);
    setOpen(false);
  };

  // Format label to display on trigger button
  const displayLabel = React.useMemo(() => {
    if (!selectedDate) return null;
    const day = selectedDate.getDate();
    const mName = MONTH_NAMES[selectedDate.getMonth()].slice(0, 3);
    const yr = selectedDate.getFullYear();
    return `${day} ${mName}. ${yr}, ${hours}:${minutes} hs`;
  }, [selectedDate, hours, minutes]);

  const todayStr = new Date().toDateString();

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        disabled={disabled}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground transition-all duration-150 outline-none hover:bg-accent/40 focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
          !selectedDate && "text-muted-foreground",
          className
        )}
      >
        <div className="flex items-center gap-2.5 truncate">
          <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
          <span className="truncate">{displayLabel || placeholder}</span>
        </div>

        {selectedDate ? (
          <span
            role="button"
            tabIndex={0}
            onClick={handleClear}
            onKeyDown={(e) => e.key === "Enter" && handleClear(e as unknown as React.MouseEvent)}
            className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Limpiar fecha"
          >
            <X className="size-3.5" />
          </span>
        ) : (
          <Clock className="size-4 shrink-0 text-muted-foreground/60" />
        )}
      </PopoverTrigger>

      <PopoverContent align="start" className="w-80 p-4 shadow-xl">
        {step === "date" ? (
          /* STEP 1: CALENDAR VIEW */
          <div className="flex flex-col gap-3">
            {/* Header Navigation */}
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-sm font-semibold font-heading text-foreground">
                {MONTH_NAMES[month]} {year}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-7 rounded-md"
                  onClick={prevMonth}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-7 rounded-md"
                  onClick={nextMonth}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center justify-between gap-1 py-1.5 text-xs border-b border-border/60 font-heading">
              <button
                type="button"
                onClick={() => handleQuickPreset("today")}
                className="rounded-full px-2.5 py-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground uppercase font-semibold"
              >
                Hoy
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset("tomorrow")}
                className="rounded-full px-2.5 py-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground uppercase font-semibold"
              >
                Mañana
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset("nextWeek")}
                className="rounded-full px-2.5 py-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground uppercase font-semibold"
              >
                En 1 semana
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="pt-1">
              <div className="grid grid-cols-7 text-center text-xs font-semibold uppercase text-muted-foreground mb-1">
                {WEEKDAYS.map((day) => (
                  <div key={day} className="py-1">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium">
                {/* Prev Month Days */}
                {Array.from({ length: firstDayIndex }).map((_, i) => {
                  const dayNum = prevMonthDays - firstDayIndex + i + 1;
                  return (
                    <button
                      key={`prev-${i}`}
                      type="button"
                      onClick={() => handleSelectDay(dayNum, false, -1)}
                      className="size-8 rounded-md p-0 text-muted-foreground/35 hover:bg-accent/50 hover:text-muted-foreground"
                    >
                      {dayNum}
                    </button>
                  );
                })}

                {/* Current Month Days */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const thisDate = new Date(year, month, dayNum);
                  const isSelected =
                    selectedDate &&
                    selectedDate.getFullYear() === year &&
                    selectedDate.getMonth() === month &&
                    selectedDate.getDate() === dayNum;

                  const isToday = thisDate.toDateString() === todayStr;

                  return (
                    <button
                      key={`current-${i}`}
                      type="button"
                      onClick={() => handleSelectDay(dayNum, true)}
                      className={cn(
                        "relative size-8 rounded-md font-medium transition-all duration-150 p-0 flex items-center justify-center mx-auto cursor-pointer",
                        isSelected
                          ? "bg-primary text-primary-foreground font-semibold shadow-sm scale-105"
                          : "text-foreground hover:bg-accent hover:text-accent-foreground",
                        isToday && !isSelected && "border border-primary/50 text-primary font-semibold"
                      )}
                    >
                      {dayNum}
                    </button>
                  );
                })}

                {/* Next Month Padding */}
                {Array.from({
                  length: (7 - ((firstDayIndex + daysInMonth) % 7)) % 7,
                }).map((_, i) => {
                  const dayNum = i + 1;
                  return (
                    <button
                      key={`next-${i}`}
                      type="button"
                      onClick={() => handleSelectDay(dayNum, false, 1)}
                      className="size-8 rounded-md p-0 text-muted-foreground/35 hover:bg-accent/50 hover:text-muted-foreground"
                    >
                      {dayNum}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 1 Actions Footer */}
            <div className="mt-2 pt-3 border-t border-border flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                className="px-3 rounded-full"
                onClick={() => handleClear()}
              >
                Limpiar
              </Button>
              <Button
                type="button"
                className="px-3 rounded-full gap-1.5"
                onClick={handleGoToTimeStep}
              >
                Siguiente
              </Button>
            </div>
          </div>
        ) : (
          /* STEP 2: SAMSUNG ALARM STYLE TIME PICKER */
          <div className="flex flex-col gap-3">
            {/* Header displaying selected date + back button */}
            <div className="flex items-center justify-center">
              <p className="text-sm font-medium capitalize text-foreground font-heading">
                {selectedDate
                  ? selectedDate.toLocaleDateString("es-ES", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "Fecha no seleccionada"}
              </p>
            </div>

            {/* Samsung Alarm Clock Scroll Wheel Picker */}
            <div className="flex items-center justify-center gap-2 py-4 bg-muted/20 border border-border/60 rounded-2xl">
              <WheelColumn
                label="Horas"
                value={parseInt(hours, 10) || 0}
                max={24}
                onChange={(val) => setHours(String(val).padStart(2, "0"))}
              />

              <span className="text-2xl font-medium text-muted-foreground/70 mt-5 select-none animate-pulse">
                :
              </span>

              <WheelColumn
                label="Minutos"
                value={parseInt(minutes, 10) || 0}
                max={60}
                onChange={(val) => setMinutes(String(val).padStart(2, "0"))}
              />
            </div>

            {/* Hour suggestions */}
            <div className="flex items-center gap-1 py-1 font-heading">
              {["09", "12", "15", "18", "21"].map((h) => {
                const isActive = hours === h;
                return (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setHours(h)}
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium transition-all cursor-pointer border",
                      isActive
                        ? "border-primary bg-primary/10 text-primary font-semibold"
                        : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground"
                    )}
                  >
                    {h}:00
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-muted-foreground font-medium font-heading">
              Gira con la rueda del ratón o haz clic para cambiar la hora.
            </p>

            {/* Step 2 Actions Footer */}
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                className="px-3 rounded-full"
                onClick={() => setStep("date")}
              >
                Atrás
              </Button>
              <Button
                type="button"
                className="px-3 rounded-full gap-1.5"
                onClick={handleConfirmFinal}
              >
                Confirmar
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
