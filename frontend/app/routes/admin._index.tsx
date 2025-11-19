// app/routes/admin._index.tsx

import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { AppLayout } from "~/components/layout/AppLayout";
import { AdminLayout } from "~/components/admin/AdminLayout";
import { useAuth } from "~/hooks/useAuth";

interface AdminOverviewData {
  totals: {
    products: number;
    ordersPending: number;
    ordersAll: number;
    vendors: number;
  };
}

export const meta: MetaFunction = () => [
  { title: "Admin – IslandRoots Market" },
  {
    name: "description",
    content:
      "Admin dashboard for managing products, orders and makers on IslandRoots Market.",
  },
];

export async function loader() {
  // For now, static placeholders – you can later call your backend for real stats
  const totals: AdminOverviewData["totals"] = {
    products: 0,
    ordersPending: 0,
    ordersAll: 0,
    vendors: 0,
  };

  return json<AdminOverviewData>({ totals });
}

export default function AdminIndexRoute() {
  const { totals } = useLoaderData<AdminOverviewData>();
  const { user } = useAuth(); // Client-side; you can later guard this route by role

  return (
    <AppLayout>
      <AdminLayout>
        <section className="space-y-4">
          <div className="space-y-1">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300">
              Admin dashboard
            </p>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50 sm:text-2xl">
              Welcome back{user?.name ? `, ${user.name}` : ""}.
            </h1>
            <p className="max-w-xl text-xs text-gray-600 dark:text-gray-300 sm:text-sm">
              Manage products, makers and orders for IslandRoots Market. Soft
              checkout keeps everything manual and human: you confirm payments
              via phone or WhatsApp.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <DashStat
              label="Products"
              value={totals.products}
              icon="fa-solid fa-bag-shopping"
            />
            <DashStat
              label="Pending orders"
              value={totals.ordersPending}
              icon="fa-solid fa-circle-exclamation"
              highlight
            />
            <DashStat
              label="All orders"
              value={totals.ordersAll}
              icon="fa-solid fa-receipt"
            />
            <DashStat
              label="Makers"
              value={totals.vendors}
              icon="fa-solid fa-people-group"
            />
          </div>

          <div className="rounded-3xl bg-white p-4 text-xs text-gray-600 shadow-sm dark:bg-gray-900 dark:text-gray-300">
            <h2 className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-50">
              What this dashboard is for
            </h2>
            <ul className="list-disc space-y-1 pl-4 text-[0.7rem]">
              <li>Review new order requests and update their status.</li>
              <li>Publish or unpublish products from small businesses.</li>
              <li>Highlight makers and impact causes on the home page.</li>
            </ul>
          </div>
        </section>
      </AdminLayout>
    </AppLayout>
  );
}

interface DashStatProps {
  label: string;
  value: number;
  icon: string;
  highlight?: boolean;
}

function DashStat({ label, value, icon, highlight }: DashStatProps) {
  return (
    <div
      className={[
        "flex items-center justify-between rounded-2xl border px-3 py-3 text-xs",
        highlight
          ? "border-amber-400 bg-amber-50 dark:border-amber-500 dark:bg-amber-900/30"
          : "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/70",
      ].join(" ")}
    >
      <div>
        <p className="text-[0.7rem] text-gray-500 dark:text-gray-400">
          {label}
        </p>
        <p className="text-lg font-semibold text-gray-900 dark:text-gray-50">
          {value}
        </p>
      </div>
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm dark:bg-gray-950 dark:text-gray-100">
        <i className={icon} />
      </div>
    </div>
  );
}
