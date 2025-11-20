import { useEffect, useState } from "react";
import type { MetaFunction } from "@remix-run/node";
import { Link, useSearchParams } from "@remix-run/react";
import { AppLayout } from "~/components/layout/AppLayout";
import { ProductGrid } from "~/components/products/ProductGrid";
import { ProductFilters } from "~/components/products/ProductFilters";
import { ROUTES, TAG_KEYS } from "~/config/constants";
import type { TagKey } from "~/config/constants";
import type { ApiProduct } from "~/types/api";
import type { Product } from "~/types/domain";
import { usePagination } from "~/hooks/usePagination";

export const meta: MetaFunction = () => [
  { title: "Products – IslandRoots Market" },
  {
    name: "description",
    content:
      "Browse story-driven, eco-friendly products from Sri Lankan small businesses and student creators.",
  },
];

// Same style as in ProductForm
function buildProductApiUrl(path: string): string {
  const env = (typeof window !== "undefined"
    ? (window as unknown as { ENV?: { PUBLIC_API_BASE_URL?: string } }).ENV
    : undefined);

  const base =
    env?.PUBLIC_API_BASE_URL && env.PUBLIC_API_BASE_URL.trim().length > 0
      ? env.PUBLIC_API_BASE_URL.trim()
      : typeof window !== "undefined"
      ? window.location.origin
      : "";

  const trimmedBase = base.replace(/\/+$/, "");
  const trimmedPath = path.startsWith("/") ? path : `/${path}`;
  return `${trimmedBase}/api${trimmedPath}`;
}

export default function ProductsIndex() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const search = searchParams.get("search") ?? "";
  const causeTagParam = searchParams.get("causeTag");
  const causeTag: TagKey | "" =
    causeTagParam && TAG_KEYS.includes(causeTagParam as TagKey)
      ? (causeTagParam as TagKey)
      : "";

  const pageParam = searchParams.get("page");
  const page = pageParam ? Math.max(parseInt(pageParam, 10) || 1, 1) : 1;
  const pageSize = 12;

  // Client-side fetch from /products, like ProductForm
  useEffect(() => {
    if (typeof window === "undefined") return; // safety for SSR

    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const qs = new URLSearchParams();
        if (search.trim()) qs.set("search", search.trim());
        if (causeTag) qs.set("tag", causeTag); // matches Express router: req.query.tag

        const url = buildProductApiUrl(
          `/products${qs.toString() ? `?${qs.toString()}` : ""}`
        );

        const res = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Failed to load products (status ${res.status})`);
        }

        const data = (await res.json()) as ApiProduct[];
        const mapped = data.map(mapApiProductToDomain);
        setProducts(mapped);
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error("[ProductsIndex] load error:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading products."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => controller.abort();
  }, [search, causeTag]);

  const total = products.length;
  const pagination = usePagination({ page, pageSize, totalItems: total });

  // Slice client-side for pagination
  const start = (pagination.page - 1) * pageSize;
  const end = start + pageSize;
  const pagedProducts = products.slice(start, end);

  const handlePageChange = (nextPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(nextPage));
    setSearchParams(next);
  };

  return (
    <AppLayout>
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
              All Products
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Discover handmade, eco-friendly products from creators across Sri
              Lanka.
            </p>
          </div>
          <Link
            to={ROUTES.CAUSES}
            className="text-xs font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
          >
            Browse by cause →
          </Link>
        </div>

        <ProductFilters />

        {/* Loading / error states */}
        {loading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading products…
          </p>
        ) : error ? (
          <p className="text-sm text-rose-500">{error}</p>
        ) : pagedProducts.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No products found. Try adjusting your filters.
          </p>
        ) : (
          <ProductGrid products={pagedProducts} />
        )}

        {/* Pagination */}
        {!loading && total > 0 && pagination.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>
              Page {pagination.page} of {pagination.totalPages} · {total} items
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={!pagination.hasPreviousPage}
                onClick={() =>
                  pagination.previousPage &&
                  handlePageChange(pagination.previousPage)
                }
                className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={!pagination.hasNextPage}
                onClick={() =>
                  pagination.nextPage &&
                  handlePageChange(pagination.nextPage)
                }
                className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
    </AppLayout>
  );
}

function mapApiProductToDomain(api: ApiProduct): Product {
  const tagKeys: TagKey[] = api.tags
    .filter((tag) => TAG_KEYS.includes(tag as TagKey))
    .map((tag) => tag as TagKey);

  return {
    id: api.id,
    slug: api.slug,
    name: api.name,
    description: api.description,
    price: api.price,
    currency: api.currency,
    stock: api.stock,
    category: api.category ?? "Uncategorized",
    images: api.images,
    vendorId: api.vendorId,
    vendor: undefined,
    tags: tagKeys,
    isFeatured: api.isFeatured,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}
