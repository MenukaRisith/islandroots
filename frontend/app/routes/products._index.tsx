// app/routes/products._index.tsx

import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { AppLayout } from "~/components/layout/AppLayout";
import { ProductGrid } from "~/components/products/ProductGrid";
import { ProductFilters } from "~/components/products/ProductFilters";
import { ROUTES, TAG_KEYS } from "~/config/constants";
import type { TagKey } from "~/config/constants";
import { apiRequest } from "~/utils/api.server";
import type { ApiListResponse, ApiProduct } from "~/types/api";
import type { Product } from "~/types/domain";
import { usePagination } from "~/hooks/usePagination";

interface ProductsLoaderData {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  search: string;
  causeTag: TagKey | "" | null;
}

export const meta: MetaFunction = () => [
  { title: "Products – IslandRoots Market" },
  {
    name: "description",
    content:
      "Browse story-driven, eco-friendly products from Sri Lankan small businesses and student creators.",
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const pageParam = url.searchParams.get("page");
  const search = url.searchParams.get("search") ?? "";
  const causeTagParam = url.searchParams.get("causeTag");

  const page = pageParam ? Math.max(parseInt(pageParam, 10) || 1, 1) : 1;
  const pageSize = 12;

  const causeTag =
    causeTagParam && TAG_KEYS.includes(causeTagParam as TagKey)
      ? (causeTagParam as TagKey)
      : "";

  let products: Product[] = [];
  let total = 0;

  try {
    const res = await apiRequest<ApiListResponse<ApiProduct>>({
      path: "/products",
      method: "GET",
      query: {
        page,
        pageSize,
        search: search || "",
        causeTag: causeTag || "",
      },
    });

    products = res.items.map(mapApiProductToDomain);
    total = res.total;
  } catch {
    products = [];
    total = 0;
  }

  return json<ProductsLoaderData>({
    products,
    total,
    page,
    pageSize,
    search,
    causeTag,
  });
}

export default function ProductsIndex() {
  const { products, total, page, pageSize } =
    useLoaderData<ProductsLoaderData>();
  const [searchParams, setSearchParams] = useSearchParams();

  const pagination = usePagination({ page, pageSize, totalItems: total });

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
              Discover handmade, eco-friendly products from creators across Sri Lanka.
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

        <ProductGrid products={products} />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
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
