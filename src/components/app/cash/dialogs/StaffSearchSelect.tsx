"use client";

import { useMemo, useState } from "react";
import { Check, ChevronsUpDown, Search, UserX } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { posStaff } from "@/lib/mock/pos";
import { cn } from "@/lib/utils";

export function StaffSearchSelect({
  value,
  onValueChange,
  placeholder = "Seleccionar colaborador...",
}: {
  value: string;
  onValueChange: (id: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selectedStaff = useMemo(
    () => posStaff.find((s) => s.id === value),
    [value],
  );

  const filteredStaff = useMemo(() => {
    if (!query.trim()) return posStaff;
    const q = query.toLowerCase();
    return posStaff.filter(
      (s) =>
        s.name.toLowerCase().includes(q) || s.role.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="font-heading flex w-full items-center justify-between gap-2.5 rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors hover:bg-muted/40 focus:border-primary focus:ring-1 focus:ring-primary/20 cursor-pointer h-10">
        {selectedStaff ? (
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              role="img"
              aria-label={`Foto de ${selectedStaff.name}`}
              className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted bg-cover bg-center text-[10px] font-semibold border border-border"
              style={
                selectedStaff.avatar
                  ? { backgroundImage: `url(${selectedStaff.avatar})` }
                  : undefined
              }
            >
              {!selectedStaff.avatar && selectedStaff.name[0]?.toUpperCase()}
            </span>
            <div className="flex items-baseline gap-1.5 min-w-0 truncate text-left">
              <span className="text-sm font-medium text-foreground truncate">
                {selectedStaff.name}
              </span>
              {/* <span className="text-sm text-muted-foreground shrink-0 font-normal">
                · {selectedStaff.role}
              </span> */}
            </div>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">{placeholder}</span>
        )}
        <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
      </PopoverTrigger>

      <PopoverContent align="start" className="w-75 p-2">
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre o rol..."
            className="pl-9 h-fit py-2"
            autoFocus
          />
        </div>

        <div className="max-h-52 overflow-y-auto space-y-1">
          {filteredStaff.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-3 py-5 text-center text-sm font-heading">
              <span className="p-2.5 rounded-lg bg-accent">
                <UserX className="size-4.5" />
              </span>
              <p className="mt-3 text-sm text-muted-foreground">
                No se encontraron colaboradores
              </p>
            </div>
          ) : (
            filteredStaff.map((staff) => {
              const isSelected = staff.id === value;
              return (
                <button
                  key={staff.id}
                  type="button"
                  onClick={() => {
                    onValueChange(staff.id);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition-colors cursor-pointer",
                    isSelected
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted text-foreground",
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      role="img"
                      aria-label={`Foto de ${staff.name}`}
                      className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted bg-cover bg-center text-[11px] font-semibold border border-border"
                      style={
                        staff.avatar
                          ? { backgroundImage: `url(${staff.avatar})` }
                          : undefined
                      }
                    >
                      {!staff.avatar && staff.name[0]?.toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {staff.name}
                      </p>
                      {/* <p className="text-muted-foreground">{staff.role}</p> */}
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="size-4 text-primary shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
