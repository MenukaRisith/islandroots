import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { AppLayout } from "~/components/layout/AppLayout";
import { Button } from "~/components/ui/Button";
import { ROUTES, CAUSE_LABELS, TAG_KEYS } from "~/config/constants";
import type { TagKey } from "~/config/constants";
import { apiRequest } from "~/utils/api.server";
import type { ApiListResponse, ApiProduct } from "~/types/api";
import type { Product } from "~/types/domain";
import { formatCurrency, truncateText } from "~/utils/format";

interface HomeLoaderData {
  featuredProducts: Product[];
}

export const meta: MetaFunction = () => [
  { title: "IslandRoots Market – Support Local, Shop Smart" },
  {
    name: "description",
    content:
      "Discover eco-friendly, story-driven products from Sri Lankan small businesses and student creators.",
  },
];

export async function loader() {
  // Adjust path ("/products/featured") to match your actual backend.
  let featured: Product[] = [];

  try {
    const res = await apiRequest<ApiListResponse<ApiProduct>>({
      path: "/products/featured",
      method: "GET",
    });

    featured = res.items.map(mapApiProductToDomain);
  } catch {
    // fail silently for now; UI will show empty state
    featured = [];
  }

  return json<HomeLoaderData>({
    featuredProducts: featured,
  });
}

export default function Index() {
  const { featuredProducts } = useLoaderData<HomeLoaderData>();

  return (
    <AppLayout>
      {/* Hero */}
      <section className="grid gap-8 py-8 sm:grid-cols-2 sm:items-center">
        <div className="space-y-5">
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-200">
            <i className="fa-solid fa-leaf mr-2" />
            Every purchase supports local Sri Lankan creators
          </span>

          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl lg:text-5xl">
            Story-driven shopping for{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
              eco-friendly
            </span>{" "}
            Sri Lankan products.
          </h1>

          <p className="max-w-xl text-sm text-gray-600 dark:text-gray-300 sm:text-base">
            Discover handmade crafts, sustainable snacks, and digital creations
            from rural women, student founders, and local makers – all in one
            marketplace.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              onClick={() => {
                // you can navigate via Link for real usage; this is just extra UX
                const anchor = document.getElementById("featured-products");
                if (anchor) anchor.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explore featured products
            </Button>
            <Link to={ROUTES.QUIZ}>
              <Button variant="secondary">
                <span className="mr-2">
                  <i className="fa-solid fa-wand-magic-sparkles" />
                </span>
                Product Match Quiz
              </Button>
            </Link>
          </div>

          <div className="mt-4 grid max-w-md grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-300 sm:text-sm">
            {TAG_KEYS.slice(0, 4).map((tagKey) => (
              <div
                key={tagKey}
                className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-sm dark:bg-gray-900/80"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[0.7rem] text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-200">
                  <i className="fa-solid fa-circle-dot" />
                </span>
                <span className="text-xs font-medium">
                  {CAUSE_LABELS[tagKey]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Placeholder hero visual */}
        <div className="relative hidden h-72 rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-sky-500 p-[1px] shadow-xl shadow-emerald-500/30 sm:block">
          <div className="h-full w-full rounded-3xl bg-[#05050A] p-6">
            <div className="space-y-4 text-sm text-gray-100">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Impact Snapshot
              </p>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <ImpactStat label="Women-led makers" value="24+" />
                <ImpactStat label="Student creators" value="18+" />
                <ImpactStat label="Eco-friendly items" value="120+" />
              </div>
              <div className="mt-2 rounded-2xl bg-gray-900/70 p-3">
                <p className="text-[0.7rem] text-gray-300">
                  “Every order funds tuition, workshops, and home-based
                  businesses across the island.”
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section id="featured-products" className="mt-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 sm:text-xl">
            Featured products
          </h2>
          <Link
            to={ROUTES.PRODUCTS}
            className="text-xs font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
          >
            View all products →
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No featured products yet. Check back soon as we onboard local
            makers. 💚
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={ROUTES.PRODUCT_DETAIL(product.slug)}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="relative h-40 overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                      No image
                    </div>
                  )}
                  {product.tags.length > 0 && (
                    <div className="absolute left-2 top-2 rounded-full bg-black/70 px-3 py-1 text-[0.6rem] font-medium text-emerald-100">
                      {CAUSE_LABELS[product.tags[0] as TagKey] ??
                        "Impact product"}
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-1 p-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                    {product.name}
                  </h3>
                  <p className="text-[0.7rem] text-gray-500 dark:text-gray-400">
                    {truncateText(product.description, 80)}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(product.price, product.currency)}
                    </span>
                    <span className="text-[0.7rem] text-gray-500 dark:text-gray-400">
                      {product.vendor?.locationDistrict ?? "Sri Lanka"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </AppLayout>
  );
}

interface ImpactStatProps {
  label: string;
  value: string;
}

function ImpactStat({ label, value }: ImpactStatProps) {
  return (
    <div className="rounded-2xl bg-gray-900/70 p-3">
      <p className="text-xs font-semibold text-emerald-300">{value}</p>
      <p className="mt-1 text-[0.65rem] text-gray-400">{label}</p>
    </div>
  );
}

/**
 * Local mapping function from API product → domain product.
 * You can later move this logic into a dedicated mapper util if you want.
 */
function mapApiProductToDomain(api: ApiProduct): Product {
  // Map tags (string[]) into TagKey[] when they match known TAG_KEYS
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
    vendor: undefined, // you can populate this if your API includes vendor data
    tags: tagKeys,
    isFeatured: api.isFeatured,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}
