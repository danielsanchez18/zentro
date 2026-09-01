"use client";

import * as React from "react";
import Image from "next/image";
import { Search, Check, ChevronsUpDown, X, FolderTree, ChevronRight } from "lucide-react";
import { catalogCategories, catalogSubcategories } from "@/lib/mock/catalog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Field, FormSection, productInputClass } from "./FormSection";
import { cn } from "@/lib/utils";

interface ProductOrganizationProps {
  categoryId: string;
  subcategoryId: string;
  vendor: string;
  tags: string;
  onChange: (field: "categoryId" | "subcategoryId" | "vendor" | "tags", value: string) => void;
}

interface CategoryOption {
  id: string;
  name: string;
  fullName: string;
  categoryId: string;
  subcategoryId: string | null;
  parentName?: string;
  image?: string;
}

export function ProductOrganization({
  categoryId,
  subcategoryId,
  vendor,
  tags,
  onChange,
}: ProductOrganizationProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Build full hierarchy of options: Categories + Subcategories
  const options = React.useMemo(() => {
    const list: CategoryOption[] = [];

    catalogCategories.forEach((cat) => {
      // Base Category option
      list.push({
        id: `cat_${cat.id}`,
        name: cat.name,
        fullName: cat.name,
        categoryId: cat.id,
        subcategoryId: null,
        image: cat.image,
      });

      // Child Subcategories options
      const children = catalogSubcategories.filter((sub) => sub.parentId === cat.id);
      children.forEach((sub) => {
        list.push({
          id: `sub_${sub.id}`,
          name: sub.name,
          fullName: `${cat.name} → ${sub.name}`,
          categoryId: cat.id,
          subcategoryId: sub.id,
          parentName: cat.name,
          image: sub.image || cat.image,
        });
      });
    });

    return list;
  }, []);

  // Find current selected option
  const selectedOption = React.useMemo(() => {
    if (!categoryId) return null;
    if (subcategoryId) {
      return options.find((opt) => opt.categoryId === categoryId && opt.subcategoryId === subcategoryId) || null;
    }
    return options.find((opt) => opt.categoryId === categoryId && !opt.subcategoryId) || null;
  }, [categoryId, subcategoryId, options]);

  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery.trim()) return options;
    const query = searchQuery.toLowerCase().trim();
    return options.filter((opt) => opt.fullName.toLowerCase().includes(query));
  }, [options, searchQuery]);

  const handleSelectOption = (opt: CategoryOption) => {
    onChange("categoryId", opt.categoryId);
    onChange("subcategoryId", opt.subcategoryId || "");
    setOpen(false);
    setSearchQuery("");
  };

  const handleClearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("categoryId", "");
    onChange("subcategoryId", "");
  };

  return (
    <FormSection
      title="Organización"
      description="Clasifica el producto para que sea fácil encontrarlo y administrarlo."
    >
      <div className="grid gap-5">
        {/* Single Combined Field: Agregar a una categoría */}
        <Field label="Agregar a una categoría" hint="Selecciona la categoría o subcategoría principal.">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              className={cn(
                "flex w-full items-center justify-between gap-2 rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground transition-all duration-150 outline-none hover:bg-accent/40 focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer min-w-0 overflow-hidden text-left",
                !selectedOption && "text-muted-foreground"
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
                {selectedOption ? (
                  <>
                    {/* Category Thumbnail Avatar */}
                    {selectedOption.image ? (
                      <Image
                        src={selectedOption.image}
                        alt={selectedOption.name}
                        width={24}
                        height={24}
                        className="size-6 rounded-md object-cover shrink-0 border border-border"
                      />
                    ) : (
                      <div className="size-6 rounded-md bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 font-heading">
                        {selectedOption.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    {/* Display selected hierarchy */}
                    <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden truncate text-foreground font-medium font-heading">
                      {selectedOption.parentName ? (
                        <>
                          <span className="text-muted-foreground font-normal shrink-0">{selectedOption.parentName}</span>
                          <ChevronRight className="size-3.5 text-muted-foreground/60 shrink-0" />
                          <span className="font-semibold text-primary truncate min-w-0">{selectedOption.name}</span>
                        </>
                      ) : (
                        <span className="font-semibold text-foreground truncate min-w-0">{selectedOption.name}</span>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                    <FolderTree className="size-4 shrink-0 text-muted-foreground" />
                    <p className="line-clamp-1 text-nowrap min-w-0 block">Seleccionar categoría...</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-auto">
                {selectedOption && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={handleClearSelection}
                    onKeyDown={(e) => e.key === "Enter" && handleClearSelection(e as unknown as React.MouseEvent)}
                    className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    title="Quitar categoría"
                  >
                    <X className="size-3.5" />
                  </span>
                )}
                <ChevronsUpDown className="size-4 text-muted-foreground/70 shrink-0" />
              </div>
            </PopoverTrigger>

            <PopoverContent align="start" className="w-(--anchor-width) min-w-0 overflow-hidden rounded-xl p-0">
              
              {/* Search Header */}
              <div className="px-2 pt-2 pb-1">
                <div className="flex items-center gap-2 border border-border px-3 py-2 bg-muted/20 rounded-lg">
                  <Search className="size-4 text-muted-foreground shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar categoría..."
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground font-heading"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="text-muted-foreground hover:text-foreground text-xs"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Options List */}
              <div className="max-h-65 overflow-y-auto p-1 flex flex-col gap-1">
                {filteredOptions.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground font-heading">
                    No se encontraron categorías para &quot;{searchQuery}&quot;.
                  </div>
                ) : (
                  filteredOptions.map((opt) => {
                    const isSelected =
                      selectedOption?.categoryId === opt.categoryId &&
                      selectedOption?.subcategoryId === opt.subcategoryId;

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectOption(opt)}
                        className={cn(
                          "w-full flex items-center justify-between gap-3 px-2 py-1.5 rounded-lg text-left text-sm transition-colors cursor-pointer font-heading",
                          isSelected
                            ? "bg-primary/5 text-primary font-semibold"
                            : "hover:bg-accent text-foreground"
                        )}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          {/* Image Avatar */}
                          {opt.image ? (
                            <Image
                              src={opt.image}
                              alt={opt.name}
                              width={28}
                              height={28}
                              className="size-7 rounded-md object-cover shrink-0 border border-border"
                            />
                          ) : (
                            <div
                              className={cn(
                                "size-7 rounded-md flex items-center justify-center font-semibold text-xs shrink-0 font-heading",
                                opt.subcategoryId
                                  ? "bg-muted text-muted-foreground"
                                  : "bg-primary/10 text-primary"
                              )}
                            >
                              {opt.name.charAt(0).toUpperCase()}
                            </div>
                          )}

                          {/* Category Name & Hierarchy */}
                          <div className="flex flex-col truncate">
                            {opt.parentName ? (
                              <div className="flex items-center gap-0.5 text-sm truncate">
                                <span className="text-muted-foreground font-normal">{opt.parentName}</span>
                                <ChevronRight className="size-3.5 text-muted-foreground/60 shrink-0" />
                                <span className="font-medium text-foreground truncate">{opt.name}</span>
                              </div>
                            ) : (
                              <span className="font-medium text-sm text-foreground truncate">{opt.name}</span>
                            )}
                          </div>
                        </div>

                        {isSelected && <Check className="size-4 text-primary shrink-0" />}
                      </button>
                    );
                  })
                )}
              </div>
            </PopoverContent>
          </Popover>
        </Field>

        <Field label="Marca o proveedor">
          <input
            value={vendor}
            onChange={(e) => onChange("vendor", e.target.value)}
            placeholder="Ej. La casa"
            className={productInputClass}
          />
        </Field>

        <Field label="Etiquetas" hint="Sepáralas con comas.">
          <input
            value={tags}
            onChange={(e) => onChange("tags", e.target.value)}
            placeholder="popular, almuerzo, nuevo"
            className={productInputClass}
          />
        </Field>
      </div>
    </FormSection>
  );
}
