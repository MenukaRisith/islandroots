import type { Product } from "~/types/domain";
import { ProductCard } from "./ProductCard";

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="mt-8 space-y-3">
      <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50 sm:text-base">
        You might also like
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
