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
        day: "group/day relative size-9 p-0 text-center text-sm [&:has([aria-selected=true])]:bg-accent/40 [&:has([data-selected=true])]:bg-accent/40 [&:has(.rdp-range_end)]:rounded-r-lg [&:has(.rdp-range_start)]:rounded-l-lg [&:has(.rdp-range_middle)]:bg-accent/60",
        day_button:
          "flex size-9 cursor-pointer items-center justify-center rounded-lg font-normal transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [td[data-selected]_&]:bg-primary [td[data-selected]_&]:text-primary-foreground [td[data-selected]_&]:hover:bg-primary [td[data-selected]_&]:hover:text-primary-foreground [td[data-selected]_&]:font-semibold [td[data-selected]_&]:shadow-xs [td[aria-selected=true]_&]:bg-primary [td[aria-selected=true]_&]:text-primary-foreground [td[aria-selected=true]_&]:hover:bg-primary [td[aria-selected=true]_&]:hover:text-primary-foreground [td[aria-selected=true]_&]:font-semibold [td[aria-selected=true]_&]:shadow-xs [td.rdp-selected_&]:bg-primary [td.rdp-selected_&]:text-primary-foreground [td.rdp-selected_&]:hover:bg-primary [td.rdp-selected_&]:hover:text-primary-foreground [td.rdp-selected_&]:font-semibold [td.rdp-range_start_&]:bg-primary [td.rdp-range_start_&]:text-primary-foreground [td.rdp-range_start_&]:rounded-lg [td.rdp-range_end_&]:bg-primary [td.rdp-range_end_&]:text-primary-foreground [td.rdp-range_end_&]:rounded-lg [td.rdp-range_middle_&]:bg-accent [td.rdp-range_middle_&]:text-foreground [td.rdp-range_middle_&]:rounded-none",
        selected: "rdp-selected",
        range_start: "rdp-range_start",
        range_end: "rdp-range_end",
        range_middle: "rdp-range_middle",
        today:
          "font-semibold text-primary [td[data-selected]_&]:text-primary-foreground [td[aria-selected=true]_&]:text-primary-foreground [td.rdp-selected_&]:text-primary-foreground",
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
