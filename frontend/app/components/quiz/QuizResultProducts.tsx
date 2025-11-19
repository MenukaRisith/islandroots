import { useEffect, useState } from "react";
import type { TagKey } from "~/config/constants";
import { ProductGrid } from "~/components/products/ProductGrid";
import type { Product } from "~/types/domain";
import type { ApiListResponse, ApiProduct } from "~/types/api";
import { TAG_KEYS } from "~/config/constants";
import type { TagKey as TagKeyType } from "~/config/constants";
import { apiClientRequest } from "~/utils/api.client";

interface QuizResultProductsProps {
  primaryTag: TagKey;
}

interface State {
  loading: boolean;
  error?: string;
  products: Product[];
}

export function QuizResultProducts({ primaryTag }: QuizResultProductsProps) {
  const [state, setState] = useState<State>({
    loading: true,
    products: [],
  });

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setState({ loading: true, products: [], error: undefined });

      try {
        const res = await apiClientRequest<ApiListResponse<ApiProduct>>({
          path: "/products",
          method: "GET",
          query: {
            causeTag: primaryTag,
            page: 1,
            pageSize: 12,
          },
        });

        if (cancelled) return;

        const products = res.items.map(mapApiProductToDomain);
        setState({ loading: false, products });
      } catch {
        if (cancelled) return;
        setState({
          loading: false,
          products: [],
          error: "Could not load recommendations. Please try again.",
        });
      }
    }

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, [primaryTag]);

  if (state.loading) {
    return (
      <div className="space-y-3 rounded-3xl bg-white p-4 shadow-sm dark:bg-gray-900">
        <p className="text-xs font-semibold text-gray-900 dark:text-gray-50">
          Finding products that match your vibe…
        </p>
        <p className="text-[0.7rem] text-gray-500 dark:text-gray-400">
          We’re looking for items tagged under this impact cause.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="h-32 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800"
            />
          ))}
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="rounded-3xl bg-white p-4 text-xs text-rose-500 shadow-sm dark:bg-gray-900">
        {state.error}
      </div>
    );
  }

  if (state.products.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-4 text-xs text-gray-500 shadow-sm dark:bg-gray-900 dark:text-gray-400">
        No products matched this cause yet. Try exploring other sections of
        IslandRoots while we onboard more makers. 💚
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-3xl bg-white p-4 shadow-sm dark:bg-gray-900">
      <p className="text-xs font-semibold text-gray-900 dark:text-gray-50 sm:text-sm">
        Recommended for you
      </p>
      <p className="text-[0.7rem] text-gray-500 dark:text-gray-400">
        Based on your answers, these products are tagged under your primary
        impact cause.
      </p>
      <ProductGrid products={state.products} />
    </div>
  );
}

function mapApiProductToDomain(api: ApiProduct): Product {
  const tagKeys: TagKeyType[] = api.tags
    .filter((tag) => TAG_KEYS.includes(tag as TagKeyType))
    .map((tag) => tag as TagKeyType);

  return {
    id: api.id,
    slug: api.slug,
    name: api.name,
    description: api.description,
    price: api.price,
    currency: api.currency,
    stock: api.stock,
    category: api.category,
    images: api.images,
    vendorId: api.vendorId,
    vendor: undefined,
    tags: tagKeys,
    isFeatured: api.isFeatured,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}
