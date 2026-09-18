"use client";

import React, { useEffect, useState } from "react";
import { Check, ChevronDown, Clock } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const TIME_OPTIONS = [
  "00:00",
  "00:30",
  "01:00",
  "01:30",
  "02:00",
  "02:30",
  "03:00",
  "03:30",
  "04:00",
  "04:30",
  "05:00",
  "05:30",
  "06:00",
  "06:30",
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
  "23:00",
  "23:30",
];

interface TimeInputSelectProps {
  value: string;
  onChange: (time: string) => void;
  className?: string;
  disabled?: boolean;
}

export function TimeInputSelect({
  value,
  onChange,
  className,
  disabled = false,
}: TimeInputSelectProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const sanitizeAndClamp = (val: string): string => {
    const clean = val.replace(/[^\d:]/g, "").slice(0, 5);
    const parts = clean.split(":");
    const hStr = parts[0] ?? "";
    const mStr = parts[1] ?? "";

    let h = parseInt(hStr, 10);
    if (isNaN(h)) h = 0;
    if (h > 23) h = 23;

    let m = parseInt(mStr, 10);
    if (isNaN(m)) m = 0;
    if (m > 59) m = 59;

    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/[^\d:]/g, "");
    if (raw.length > 5) raw = raw.slice(0, 5);

    // Si el usuario ingresa 2 dígitos seguidos sin ":"
    if (
      raw.length === 2 &&
      !raw.includes(":") &&
      (e.nativeEvent as InputEvent).inputType !== "deleteContentBackward"
    ) {
      raw = raw + ":";
    }

    // Clamping dinámico
    const parts = raw.split(":");
    let hStr = parts[0] ?? "";
    let mStr = parts[1] ?? "";

    if (hStr.length >= 2) {
      const h = parseInt(hStr, 10);
      if (h > 23) {
        hStr = "23";
        raw = "23" + (raw.includes(":") ? ":" + mStr : "");
      }
    }
    if (mStr.length >= 2) {
      const m = parseInt(mStr, 10);
      if (m > 59) {
        mStr = "59";
        raw = hStr + ":59";
      }
    }

    setInputValue(raw);

    if (/^([01]\d|2[0-3]):[0-5]\d$/.test(raw)) {
      onChange(raw);
    }
  };

  const handleBlur = () => {
    if (!inputValue) {
      setInputValue(value);
      return;
    }
    const clamped = sanitizeAndClamp(inputValue);
    setInputValue(clamped);
    onChange(clamped);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleBlur();
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div
        className={cn(
          "flex items-center w-full h-fit rounded-lg border border-border bg-card focus-within:ring-1 focus-within:ring-primary/40 focus-within:border-primary/50 transition-colors",
          disabled && "opacity-50 pointer-events-none",
          className,
        )}
      >
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="00:00"
          maxLength={5}
          disabled={disabled}
          className="w-full bg-transparent px-3 py-2 text-sm font-medium text-foreground outline-none tracking-wide text-left placeholder:text-muted-foreground min-w-0"
        />

        <PopoverTrigger
          render={
            <button
              type="button"
              disabled={disabled}
              className="cursor-pointer px-2 py-1.5 text-muted-foreground hover:text-foreground transition-colors shrink-0 outline-none flex items-center gap-1"
              aria-label="Abrir selector de hora"
            />
          }
        >
          {/* <Clock className="size-3 text-muted-foreground/70" /> */}
          <ChevronDown className="size-4 opacity-60 hover:opacity-100" />
        </PopoverTrigger>
      </div>

      <PopoverContent
        align="start"
        className="w-36 p-1 rounded-xl max-h-56 overflow-y-auto shadow-xl border border-border bg-popover z-50"
      >
        <div className="space-y-0.5">
          {TIME_OPTIONS.map((timeOpt) => {
            const isSelected = value === timeOpt;
            return (
              <button
                key={timeOpt}
                type="button"
                onClick={() => {
                  setInputValue(timeOpt);
                  onChange(timeOpt);
                  setOpen(false);
                }}
                className={cn(
                  "cursor-pointer flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-sm transition-colors text-left font-medium",
                  isSelected
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "hover:bg-muted text-foreground",
                )}
              >
                <span>{timeOpt}</span>
                {isSelected && <Check className="size-3.5 stroke-3" />}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
