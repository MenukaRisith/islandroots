// app/routes/makers.$slug.tsx

import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { AppLayout } from "~/components/layout/AppLayout";
import {
  ROUTES,
  CAUSE_LABELS,
  TAG_KEYS,
  type TagKey,
} from "~/config/constants";
import { apiRequest } from "~/utils/api.server";

interface MakerProductApi {
  id: string;
  slug: string;
  name: string;
  mainImage?: string | null;
  price: number;
  currency: string;
  tags: string[];
}

interface MakerDetailApi {
  id: string;
  name: string;
  slug: string;
  locationDistrict?: string | null;
  story?: string | null;
  avatarUrl?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  tags: string[];
  products: MakerProductApi[];
}

interface MakerDetailLoaderData {
  maker: MakerDetailApi;
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [
      { title: "Maker – IslandRoots Market" },
      {
        name: "description",
        content:
          "Discover Sri Lankan small businesses and student creators on IslandRoots Market.",
      },
    ];
  }

  return [
    { title: `${data.maker.name} – IslandRoots Maker Story` },
    {
      name: "description",
      content:
        data.maker.story ??
        `Discover ${data.maker.name}, a Sri Lankan maker on IslandRoots Market.`,
    },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const slug = params.slug;

  if (!slug) {
    throw new Response("Not found", { status: 404 });
  }

  // Public vendor detail by slug
  const maker = await apiRequest<MakerDetailApi>({
    path: `/vendors/slug/${slug}`,
    method: "GET",
  });

  return json<MakerDetailLoaderData>({ maker });
}

export default function MakerDetailRoute() {
  const { maker } = useLoaderData<MakerDetailLoaderData>();

  const impactTags = maker.tags
    .filter((t): t is TagKey => TAG_KEYS.includes(t as TagKey))
    .sort();

  return (
    <AppLayout>
      <section className="space-y-6">
        {/* Header / hero */}
        <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-gray-900 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-gradient-to-tr from-emerald-400 to-emerald-600 text-white shadow-md">
                {maker.avatarUrl ? (
                  // eslint-disable-next-line jsx-a11y/alt-text
                  <img
                    src={maker.avatarUrl}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-base font-semibold">
                    {maker.name
                      .split(" ")
                      .map((p) => p[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[0.7rem] text-emerald-600 shadow">
                  <i className="fa-solid fa-leaf" />
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-400">
                  IslandRoots Maker
                </p>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50 sm:text-xl">
                  {maker.name}
                </h1>
                <p className="text-[0.7rem] text-gray-500 dark:text-gray-400">
                  {maker.locationDistrict
                    ? `${maker.locationDistrict}, Sri Lanka`
                    : "Sri Lanka"}
                </p>
              </div>
            </div>

            {/* Social / contact */}
            <div className="flex flex-col items-start gap-2 text-[0.7rem] sm:items-end">
              {maker.contactPhone && (
                <a
                  href={`tel:${maker.contactPhone}`}
                  className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200"
                >
                  <i className="fa-solid fa-phone text-[0.7rem]" />
                  {maker.contactPhone}
                </a>
              )}
              {maker.contactEmail && (
                <a
                  href={`mailto:${maker.contactEmail}`}
                  className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
                >
                  <i className="fa-regular fa-envelope text-[0.7rem]" />
                  {maker.contactEmail}
                </a>
              )}
              <div className="flex flex-wrap gap-2">
                {maker.instagram && (
                  <a
                    href={normalizeSocialUrl(maker.instagram, "instagram")}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-[#F56040] via-[#C13584] to-[#405DE6] text-white shadow-sm"
                    aria-label="Instagram"
                  >
                    <i className="fa-brands fa-instagram text-xs" />
                  </a>
                )}
                {maker.tiktok && (
                  <a
                    href={normalizeSocialUrl(maker.tiktok, "tiktok")}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black text-white shadow-sm"
                    aria-label="TikTok"
                  >
                    <i className="fa-brands fa-tiktok text-xs" />
                  </a>
                )}
              </div>

              {impactTags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {impactTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[0.6rem] text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-100"
                    >
                      {CAUSE_LABELS[tag]}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Story */}
          {maker.story && (
            <div className="mt-4 rounded-2xl bg-emerald-50/70 p-3 text-[0.7rem] text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-50">
              <p className="mb-1 text-[0.7rem] font-semibold">
                Their story
              </p>
              <p className="whitespace-pre-line">{maker.story}</p>
            </div>
          )}
        </div>

        {/* Products */}
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50">
              Products from {maker.name}
            </h2>
            <Link
              to={ROUTES.PRODUCTS}
              className="inline-flex items-center gap-1 text-[0.7rem] text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
            >
              <span>Browse all products</span>
              <i className="fa-solid fa-arrow-right text-[0.6rem]" />
            </Link>
          </div>

          {maker.products.length === 0 ? (
            <p className="rounded-3xl bg-white p-4 text-xs text-gray-500 shadow-sm dark:bg-gray-900 dark:text-gray-400">
              This maker hasn&apos;t added any products yet. Check back soon or
              explore other creators on IslandRoots Market.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {maker.products.map((product) => (
                <MakerProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </section>
    </AppLayout>
  );
}

/* Mini product card for maker page */

function MakerProductCard({ product }: { product: MakerProductApi }) {
  const impactTags = product.tags
    .filter((t): t is TagKey => TAG_KEYS.includes(t as TagKey))
    .slice(0, 2);

  return (
    <Link
      to={ROUTES.PRODUCT_DETAIL(product.slug)}
      className="group flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white text-xs shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="relative h-40 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        {product.mainImage ? (
          // eslint-disable-next-line jsx-a11y/alt-text
          <img
            src={product.mainImage}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[0.7rem] text-gray-400">
            No image yet
          </div>
        )}
        {impactTags.length > 0 && (
          <div className="pointer-events-none absolute left-2 top-2 flex flex-wrap gap-1">
            {impactTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-emerald-600/90 px-2 py-0.5 text-[0.6rem] text-white shadow-sm"
              >
                {CAUSE_LABELS[tag]}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 px-3 py-3">
        <p className="line-clamp-2 text-[0.8rem] font-semibold text-gray-900 dark:text-gray-50">
          {product.name}
        </p>
        <p className="text-[0.75rem] font-semibold text-emerald-600 dark:text-emerald-400">
          {product.price.toLocaleString("en-LK", {
            minimumFractionDigits: 2,
          })}{" "}
          <span className="text-[0.7rem] font-normal">
            {product.currency}
          </span>
        </p>
      </div>
    </Link>
  );
}

/* helpers */

function normalizeSocialUrl(handleOrUrl: string, type: "instagram" | "tiktok") {
  const trimmed = handleOrUrl.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  const handle = trimmed.startsWith("@") ? trimmed.slice(1) : trimmed;

  if (type === "instagram") {
    return `https://instagram.com/${handle}`;
  }
  return `https://www.tiktok.com/@${handle}`;
}
