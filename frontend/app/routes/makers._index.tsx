// app/routes/makers._index.tsx

import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { AppLayout } from "~/components/layout/AppLayout";
import { ROUTES, CAUSE_LABELS, TAG_KEYS, type TagKey } from "~/config/constants";
import { apiRequest } from "~/utils/api.server";

interface MakerListApi {
  id: string;
  name: string;
  slug: string;
  locationDistrict?: string | null;
  avatarUrl?: string | null;
  tags: string[];
  story?: string | null;
}

interface MakersIndexLoaderData {
  makers: MakerListApi[];
}

export const meta: MetaFunction = () => [
  { title: "Makers – IslandRoots Market" },
  {
    name: "description",
    content:
      "Discover Sri Lankan small businesses and student creators on IslandRoots Market.",
  },
];

export async function loader() {
  const makers = await apiRequest<MakerListApi[]>({
    path: "/vendors", // public listing can reuse same endpoint as admin
    method: "GET",
  });

  return json<MakersIndexLoaderData>({ makers });
}

export default function MakersIndexRoute() {
  const { makers } = useLoaderData<MakersIndexLoaderData>();

  return (
    <AppLayout>
      <section className="space-y-6">
        {/* Hero / intro */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 px-4 py-6 text-white shadow-sm sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.22em] text-emerald-100">
                Makers of Sri Lanka
              </p>
              <h1 className="text-xl font-semibold sm:text-2xl">
                Meet the people behind the products
              </h1>
              <p className="max-w-xl text-xs text-emerald-100 sm:text-sm">
                From rural women&apos;s collectives to student-led startups,
                every purchase on IslandRoots Market supports a real story.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-[0.7rem]">
              <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 backdrop-blur">
                <i className="fa-solid fa-heart mr-2 text-[0.65rem]" />
                Women-led businesses
              </span>
              <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 backdrop-blur">
                <i className="fa-solid fa-recycle mr-2 text-[0.65rem]" />
                Eco &amp; zero-waste
              </span>
              <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 backdrop-blur">
                <i className="fa-solid fa-graduation-cap mr-2 text-[0.65rem]" />
                Student creators
              </span>
            </div>
          </div>
        </div>

        {/* Makers list */}
        {makers.length === 0 ? (
          <p className="rounded-3xl bg-white p-4 text-xs text-gray-500 shadow-sm dark:bg-gray-900 dark:text-gray-400">
            No makers have been added yet. Check back soon as we onboard
            Sri Lankan small businesses and student creators.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {makers.map((maker) => (
              <MakerCard key={maker.id} maker={maker} />
            ))}
          </div>
        )}
      </section>
    </AppLayout>
  );
}

interface MakerCardProps {
  maker: MakerListApi;
}

function MakerCard({ maker }: MakerCardProps) {
  const impactTags = maker.tags
    .filter((t): t is TagKey => TAG_KEYS.includes(t as TagKey))
    .slice(0, 3);

  return (
    <Link
      to={ROUTES.MAKER_DETAIL(maker.slug)}
      className="group flex flex-col rounded-3xl border border-gray-100 bg-white p-4 text-xs shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gradient-to-tr from-emerald-400 to-emerald-600 text-white shadow-sm">
          {maker.avatarUrl ? (
            // eslint-disable-next-line jsx-a11y/alt-text
            <img
              src={maker.avatarUrl}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-semibold">
              {maker.name
                .split(" ")
                .map((p) => p[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
          )}
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[0.55rem] text-emerald-600 shadow">
            <i className="fa-solid fa-leaf" />
          </span>
        </div>
        <div className="min-w-0">
          <p className="truncate text-[0.85rem] font-semibold text-gray-900 dark:text-gray-50">
            {maker.name}
          </p>
          <p className="text-[0.65rem] text-gray-500 dark:text-gray-400">
            {maker.locationDistrict || "Sri Lanka"}
          </p>
        </div>
      </div>

      {maker.story && (
        <p className="mb-3 line-clamp-3 text-[0.7rem] text-gray-600 dark:text-gray-300">
          {maker.story}
        </p>
      )}

      {impactTags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {impactTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[0.6rem] text-emerald-800 group-hover:bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-100 dark:group-hover:bg-emerald-900"
            >
              {CAUSE_LABELS[tag]}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between text-[0.65rem] text-gray-500 dark:text-gray-400">
        <span className="inline-flex items-center gap-1">
          <i className="fa-solid fa-store text-[0.6rem]" />
          View maker story
        </span>
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-[0.6rem] text-gray-700 group-hover:bg-emerald-500 group-hover:text-white dark:bg-gray-800 dark:text-gray-200 dark:group-hover:bg-emerald-500">
          <i className="fa-solid fa-arrow-right" />
        </span>
      </div>
    </Link>
  );
}
