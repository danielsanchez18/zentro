"use client";

import * as React from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "relative flex flex-col",
        month: "relative space-y-4",
        month_caption: "flex h-9 items-center justify-center px-10",
        caption_label: "text-sm font-medium font-heading",
        nav: "absolute inset-x-0 top-0 h-9 z-20 flex items-center justify-between px-1 pointer-events-none",
        button_previous:
          "pointer-events-auto inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground",
        button_next:
          "pointer-events-auto inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "w-9 text-center text-xs font-normal text-muted-foreground",
        week: "mt-1 flex w-full",
        day: "relative size-9 p-0 text-center text-sm [&:has([data-selected-single=true])]:bg-accent [&:has([data-range-end=true])]:rounded-r-lg [&:has([data-range-start=true])]:rounded-l-lg [&:has([data-range-middle=true])]:bg-accent/60",
        day_button:
          "flex size-9 cursor-pointer items-center justify-center rounded-lg font-normal hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-start=true]:rounded-lg data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:rounded-lg data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-accent",
        today: "font-semibold text-primary",
        outside: "text-muted-foreground/40",
        disabled: "pointer-events-none opacity-40",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: iconClassName, ...iconProps }) => {
          const Icon =
            orientation === "left"
              ? ChevronLeft
              : orientation === "right"
                ? ChevronRight
                : ChevronDown;
          return (
            <Icon className={cn("size-4", iconClassName)} {...iconProps} />
          );
        },
        ...props.components,
      }}
      {...props}
    />
  );
}
