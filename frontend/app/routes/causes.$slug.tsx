import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { AppLayout } from "~/components/layout/AppLayout";
import { ProductGrid } from "~/components/products/ProductGrid";
import { ROUTES, CAUSE_LABELS, TAG_KEYS } from "~/config/constants";
import type { TagKey } from "~/config/constants";
import type { ApiProduct } from "~/types/api";
import type { Product } from "~/types/domain";

interface CauseDetailLoaderData {
  tagKey: TagKey;
  label: string;
  products: Product[];
  total: number;
}

const DESCRIPTION_BY_TAG: Record<TagKey, string> = {
  WOMEN_LED:
    "Every purchase here supports a women-led project, from home bakeries to craft businesses.",
  ZERO_WASTE:
    "These products help you cut down waste with refills, reusables, and low-waste designs.",
  STUDENT_CREATOR:
    "Support student creators who are balancing education with entrepreneurship.",
  LOCAL_FARMER:
    "Choose products that directly benefit local farmers and rural agricultural communities.",
  HANDMADE:
    "Handmade pieces crafted with care, culture, and tradition from across the island.",
  RECYCLED_MATERIALS:
    "Items made using recycled or upcycled materials, keeping waste out of landfills.",
};

function getApiBaseUrl(request: Request): string {
  const url = new URL(request.url);
  const envBase = process.env.PUBLIC_API_BASE_URL?.trim();

  const base =
    envBase && envBase.length > 0 ? envBase : `${url.protocol}//${url.host}`;

  return base.replace(/\/+$/, "");
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [
      { title: "Cause not found – IslandRoots Market" },
      {
        name: "description",
        content: "This impact cause could not be found.",
      },
    ];
  }

  return [
    { title: `${data.label} – IslandRoots Market` },
    {
      name: "description",
      content: DESCRIPTION_BY_TAG[data.tagKey],
    },
  ];
};

export async function loader({ params, request }: LoaderFunctionArgs) {
  const slug = params.slug;

  if (!slug || !TAG_KEYS.includes(slug as TagKey)) {
    throw new Response("Not found", { status: 404 });
  }

  const tagKey = slug as TagKey;
  const label = CAUSE_LABELS[tagKey];

  let products: Product[] = [];
  let total = 0;

  try {
    const apiBase = getApiBaseUrl(request);
    const url = new URL(`${apiBase}/api/products`);
    url.searchParams.set("tag", tagKey); // matches Express: req.query.tag

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      throw new Error(`Failed to load products (status ${res.status})`);
    }

    const data = (await res.json()) as ApiProduct[];
    products = data.map(mapApiProductToDomain);
    total = products.length;
  } catch (err) {
    console.error("[causes.$slug] load error:", err);
    products = [];
    total = 0;
  }

  return json<CauseDetailLoaderData>({
    tagKey,
    label,
    products,
    total,
  });
}

export default function CauseDetailRoute() {
  const { tagKey, label, products, total } =
    useLoaderData<CauseDetailLoaderData>();

  return (
    <AppLayout>
      <section className="space-y-5">
        <div className="space-y-2">
          <Link
            to={ROUTES.CAUSES}
            className="inline-flex items-center text-[0.7rem] text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
          >
            <i className="fa-solid fa-arrow-left mr-1 text-[0.65rem]" />
            Back to all causes
          </Link>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300">
                Impact Cause
              </p>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50 sm:text-2xl">
                {label}
              </h1>
              <p className="mt-1 max-w-xl text-xs text-gray-600 dark:text-gray-300 sm:text-sm">
                {DESCRIPTION_BY_TAG[tagKey]}
              </p>
            </div>
            <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-xs text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100">
              <p className="text-[0.7rem] font-semibold">
                Your impact at a glance
              </p>
              <p className="mt-1">
                {total === 0
                  ? "We’re still onboarding makers under this cause. Check back soon!"
                  : `You are browsing ${total} product${
                      total === 1 ? "" : "s"
                    } that directly support this cause.`}
              </p>
            </div>
          </div>
        </div>

        {products.length === 0 ? (
          <p className="rounded-3xl bg-white p-4 text-sm text-gray-500 shadow-sm dark:bg-gray-900 dark:text-gray-400">
            No products are tagged under this cause yet. We’re curating more
            makers and will update this section soon. 💚
          </p>
        ) : (
          <ProductGrid products={products} />
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
