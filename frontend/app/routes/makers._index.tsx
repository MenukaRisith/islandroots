import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { AppLayout } from "~/components/layout/AppLayout";
import { MakersHero } from "~/components/makers/MakersHero";
import { MakersGrid } from "~/components/makers/MakersGrid";
import { apiRequest } from "~/utils/api.server";
import type { ApiListResponse, ApiVendor } from "~/types/api";
import type { Vendor } from "~/types/domain";

interface MakersIndexLoaderData {
  makers: Vendor[];
  total: number;
}

export const meta: MetaFunction = () => [
  { title: "Makers – IslandRoots Market" },
  {
    name: "description",
    content:
      "Discover Sri Lankan small businesses and student creators behind IslandRoots Market.",
  },
];

export async function loader() {
  let makers: Vendor[] = [];
  let total = 0;

  try {
    const res = await apiRequest<ApiListResponse<ApiVendor>>({
      path: "/vendors",
      method: "GET",
      query: {
        page: 1,
        pageSize: 30,
      },
    });

    makers = res.items.map(mapApiVendorToDomain);
    total = res.total;
  } catch {
    makers = [];
    total = 0;
  }

  return json<MakersIndexLoaderData>({ makers, total });
}

export default function MakersIndexRoute() {
  const { makers, total } = useLoaderData<MakersIndexLoaderData>();

  return (
    <AppLayout>
      <section className="space-y-4">
        <MakersHero />
        <div className="flex items-center justify-between text-[0.7rem] text-gray-500 dark:text-gray-400">
          <span>
            {total === 0
              ? "No makers published yet."
              : `${total} maker${total === 1 ? "" : "s"} currently on IslandRoots.`}
          </span>
        </div>
        <MakersGrid makers={makers} />
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
