import type { Product } from "~/types/domain";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        No products found. Try changing filters or search terms.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
