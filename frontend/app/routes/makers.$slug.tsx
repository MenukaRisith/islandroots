import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { AppLayout } from "~/components/layout/AppLayout";
import { apiRequest } from "~/utils/api.server";
import type { ApiVendor, ApiProduct, ApiListResponse } from "~/types/api";
import type { Vendor, Product } from "~/types/domain";
import { ProductGrid } from "~/components/products/ProductGrid";
import { TAG_KEYS, ROUTES } from "~/config/constants";
import type { TagKey } from "~/config/constants";

interface MakerDetailLoaderData {
  maker: Vendor;
  products: Product[];
  totalProducts: number;
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [
      { title: "Maker not found – IslandRoots Market" },
      {
        name: "description",
        content: "This maker profile could not be found.",
      },
    ];
  }

  return [
    { title: `${data.maker.name} – IslandRoots Maker` },
    {
      name: "description",
      content:
        data.maker.story?.slice(0, 150) ??
        `Discover products from ${data.maker.name} on IslandRoots Market.`,
    },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const slug = params.slug;

  if (!slug) {
    throw new Response("Not found", { status: 404 });
  }

  let maker: Vendor;
  let products: Product[] = [];
  let totalProducts = 0;

  try {
    const apiVendor = await apiRequest<ApiVendor>({
      path: `/vendors/${slug}`,
      method: "GET",
    });

    maker = mapApiVendorToDomain(apiVendor);
  } catch {
    throw new Response("Not found", { status: 404 });
  }

  try {
    const res = await apiRequest<ApiListResponse<ApiProduct>>({
      path: "/products",
      method: "GET",
      query: {
        vendorId: maker.id,
        page: 1,
        pageSize: 24,
      },
    });

    products = res.items.map(mapApiProductToDomain);
    totalProducts = res.total;
  } catch {
    products = [];
    totalProducts = 0;
  }

  return json<MakerDetailLoaderData>({ maker, products, totalProducts });
}

export default function MakerDetailRoute() {
  const { maker, products, totalProducts } =
    useLoaderData<MakerDetailLoaderData>();

  return (
    <AppLayout>
      <section className="space-y-6">
        <div className="space-y-3 rounded-3xl bg-white p-4 shadow-sm dark:bg-gray-900">
          <Link
            to={ROUTES.MAKERS}
            className="inline-flex items-center text-[0.7rem] text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
          >
            <i className="fa-solid fa-arrow-left mr-1 text-[0.65rem]" />
            Back to makers
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                <i className="fa-regular fa-user text-lg" />
              </div>
              <div className="space-y-1">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50 sm:text-2xl">
                  {maker.name}
                </h1>
                {maker.locationDistrict && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Based in {maker.locationDistrict}, Sri Lanka
                  </p>
                )}
                {maker.story && (
                  <p className="text-xs text-gray-600 dark:text-gray-300 sm:text-sm">
                    {maker.story}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-xs text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-50">
              <p className="text-[0.7rem] font-semibold">
                IslandRoots impact snapshot
              </p>
              <p className="mt-1">
                {totalProducts === 0
                  ? "No products published yet – this maker is getting ready to launch."
                  : `${totalProducts} product${
                      totalProducts === 1 ? "" : "s"
                    } published on IslandRoots by this maker.`}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50 sm:text-base">
            Products by {maker.name}
          </h2>
          {products.length === 0 ? (
            <p className="rounded-3xl bg-white p-4 text-sm text-gray-500 shadow-sm dark:bg-gray-900 dark:text-gray-400">
              This maker hasn&apos;t published any products yet. Check back
              soon for new arrivals.
            </p>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </section>
    </AppLayout>
  );
}

function mapApiVendorToDomain(api: ApiVendor): Vendor {
  return {
    id: api.id,
    slug: api.slug,
    name: api.name,
    locationDistrict: api.locationDistrict,
    story: api.story,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
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
