import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  catalogCategories,
  catalogProducts,
  type ProductVariant,
} from "@/lib/mock/catalog";
import { ProductCard } from "./ProductCard";

export function ProductBrowser({
  query,
  category,
  onQuery,
  onCategory,
  onAdd,
}: {
  query: string;
  category: string;
  onQuery: (value: string) => void;
  onCategory: (value: string) => void;
  onAdd: (productId: string, variant?: ProductVariant) => void;
}) {
  const products = catalogProducts.filter(
    (item) =>
      item.status === "activo" &&
      (category === "all" || item.categoryId === category) &&
      item.name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <section className="min-w-0 flex-1">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
        <Input
          className="h-9 pl-9"
          placeholder="Buscar productos"
          value={query}
          onChange={(event) => onQuery(event.target.value)}
        />
      </div>
      <div className="my-4 flex gap-2 overflow-x-auto pb-1">
        <Button
          variant={category === "all" ? "default" : "outline"}
          onClick={() => onCategory("all")}
        >
          Todos
        </Button>
        {catalogCategories
          .filter((item) => item.status === "activo")
          .map((item) => (
            <Button
              key={item.id}
              variant={category === item.id ? "default" : "outline"}
              onClick={() => onCategory(item.id)}
            >
              {item.name}
            </Button>
          ))}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            stock={index === 4 ? 0 : 8 + index * 3}
            onAdd={(variant) => onAdd(product.id, variant)}
          />
        ))}
      </div>
    </section>
  );
}
