import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { AppLayout } from "~/components/layout/AppLayout";
import { AdminLayout } from "~/components/admin/AdminLayout";
import { apiRequest } from "~/utils/api.server";
import {
  ROUTES,
  CAUSE_LABELS,
  TAG_KEYS,
  type TagKey,
} from "~/config/constants";
import type { AdminVendorApi } from "~/components/admin/VendorForm";

interface AdminVendorsIndexLoaderData {
  vendors: AdminVendorApi[];
}

export const meta: MetaFunction = () => [
  { title: "Admin – Makers | IslandRoots Market" },
  {
    name: "description",
    content:
      "Manage makers and student creators on IslandRoots Market.",
  },
];

export async function loader() {
  const vendors = await apiRequest<AdminVendorApi[]>({
    path: "/vendors",
    method: "GET",
  });

  return json<AdminVendorsIndexLoaderData>({ vendors });
}

export default function AdminVendorsIndexRoute() {
  const { vendors } = useLoaderData<AdminVendorsIndexLoaderData>();

  return (
    <AppLayout>
      <AdminLayout>
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                Makers
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Profiles for Sri Lankan small businesses, rural collectives
                and student creators.
              </p>
            </div>

            {/* New maker button as Link */}
            <Link
              to={ROUTES.ADMIN_VENDORS_NEW}
              className="inline-flex items-center rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 dark:ring-offset-gray-900"
            >
              <i className="fa-solid fa-plus mr-2 text-[0.7rem]" />
              New maker
            </Link>
          </div>

          {vendors.length === 0 ? (
            <p className="rounded-2xl bg-white p-4 text-xs text-gray-500 shadow-sm dark:bg-gray-900 dark:text-gray-400">
              No makers yet. Create your first one to start linking products to
              real people and stories.
            </p>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white text-xs shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-[0.7rem] uppercase tracking-[0.14em] text-gray-500 dark:border-gray-800 dark:bg-gray-900">
                    <th className="px-3 py-2 text-left">Maker</th>
                    <th className="px-3 py-2 text-left">District</th>
                    <th className="px-3 py-2 text-left">Impact</th>
                    <th className="px-3 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((vendor, idx) => (
                    <tr
                      key={vendor.id}
                      className={
                        idx % 2 === 0
                          ? "border-t border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900"
                          : "border-t border-gray-100 bg-gray-50/40 dark:border-gray-800 dark:bg-gray-950/40"
                      }
                    >
                      <td className="px-3 py-2 align-top">
                        <div className="flex items-center gap-2">
                          {vendor.avatarUrl && (
                            <div className="h-8 w-8 overflow-hidden rounded-full border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-900">
                              {/* eslint-disable-next-line jsx-a11y/alt-text */}
                              <img
                                src={vendor.avatarUrl}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <p className="text-[0.8rem] font-semibold text-gray-900 dark:text-gray-50">
                              {vendor.name}
                            </p>
                            <p className="text-[0.65rem] text-gray-500 dark:text-gray-400">
                              /makers/{vendor.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 align-top text-[0.75rem] text-gray-700 dark:text-gray-200">
                        {vendor.locationDistrict || (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2 align-top">
                        <div className="flex flex-wrap gap-1">
                          {vendor.tags
                            .filter((t) => TAG_KEYS.includes(t as TagKey))
                            .map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[0.6rem] text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-100"
                              >
                                {CAUSE_LABELS[tag as TagKey]}
                              </span>
                            ))}
                          {vendor.tags.length === 0 && (
                            <span className="text-[0.65rem] text-gray-400">
                              No tags
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2 align-top text-right">
                        <Link
                          to={ROUTES.ADMIN_VENDOR_EDIT(vendor.id)}
                          className="inline-flex items-center rounded-full border border-gray-200 px-2 py-1 text-[0.7rem] text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                        >
                          <i className="fa-solid fa-pen mr-1 text-[0.6rem]" />
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </AdminLayout>
    </AppLayout>
  );
}
