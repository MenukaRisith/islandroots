import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { AppLayout } from "~/components/layout/AppLayout";
import { AccountHero } from "~/components/account/AccountHero";
import {
  ImpactTrackerCard,
  type ImpactStats,
} from "~/components/account/ImpactTrackerCard";
import { apiRequest } from "~/utils/api.server";
import { useAuth } from "~/hooks/useAuth";

/**
 * Shape expected from backend at GET /account/impact-summary
 * You can implement this in Express later to aggregate from orders.
 */
interface ImpactSummaryApi {
  totalOrders: number;
  totalItems: number;
  byTag: Record<string, number>;
}

interface AccountHomeLoaderData {
  impact: ImpactStats;
}

export const meta: MetaFunction = () => [
  { title: "My Account – IslandRoots Market" },
  {
    name: "description",
    content:
      "View your IslandRoots account, track your impact, and see how your orders support Sri Lankan makers.",
  },
];

export async function loader() {
  let impact: ImpactStats = {
    totalOrders: 0,
    totalItems: 0,
    byTag: {},
  };

  try {
    const res = await apiRequest<ImpactSummaryApi>({
      path: "/account/impact-summary",
      method: "GET",
    });

    impact = {
      totalOrders: res.totalOrders ?? 0,
      totalItems: res.totalItems ?? 0,
      // We'll map keys that match TagKey at usage time; for now keep raw
      byTag: res.byTag,
    } as ImpactStats;
  } catch {
    // It’s fine if this endpoint doesn’t exist yet; we show zero impact state.
    impact = {
      totalOrders: 0,
      totalItems: 0,
      byTag: {},
    };
  }

  return json<AccountHomeLoaderData>({ impact });
}

export default function AccountHomeRoute() {
  const { impact } = useLoaderData<AccountHomeLoaderData>();
  const { user } = useAuth();

  return (
    <AppLayout>
      <section className="space-y-5">
        <AccountHero userName={user?.name} />

        <ImpactTrackerCard stats={impact} />

        {/* Placeholder for future sections: recent orders, saved items, etc. */}
        <section className="space-y-2 rounded-3xl bg-white p-4 text-xs shadow-sm dark:bg-gray-900">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50">
            Coming soon: order history & saved items
          </h2>
          <p className="text-[0.7rem] text-gray-600 dark:text-gray-300">
            You&apos;ll soon be able to view past order requests, reorder
            favourites, and see a timeline of your IslandRoots journey here.
          </p>
        </section>
      </section>
    </AppLayout>
  );
}
