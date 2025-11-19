// app/routes/admin.orders._index.tsx

import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { AppLayout } from "~/components/layout/AppLayout";
import { AdminLayout } from "~/components/admin/AdminLayout";
import { apiRequest } from "~/utils/api.server";
import { ROUTES } from "~/config/constants";

type OrderStatus = "PENDING" | "CONTACTED" | "COMPLETED" | "CANCELLED";

interface AdminOrderApi {
  id: string;
  createdAt: string;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  deliveryDistrict?: string | null;
  totalItems: number;
  totalAmount: number;
  currency: string;
}

interface AdminOrdersListApi {
  items: AdminOrderApi[];
  total: number;
}

interface AdminOrdersLoaderData {
  orders: AdminOrderApi[];
  total: number;
}

export const meta: MetaFunction = () => [
  { title: "Admin – Orders | IslandRoots Market" },
  {
    name: "description",
    content:
      "Review and manage soft-checkout order requests on IslandRoots Market.",
  },
];

export async function loader() {
  let orders: AdminOrderApi[] = [];
  let total = 0;

  try {
    const res = await apiRequest<AdminOrdersListApi>({
      path: "/orders",
      method: "GET",
      query: {
        page: 1,
        pageSize: 50,
      },
    });

    orders = res.items;
    total = res.total;
  } catch {
    orders = [];
    total = 0;
  }

  return json<AdminOrdersLoaderData>({ orders, total });
}

export default function AdminOrdersIndexRoute() {
  const { orders, total } = useLoaderData<AdminOrdersLoaderData>();

  return (
    <AppLayout>
      <AdminLayout>
        <section className="space-y-4">
          <div className="space-y-1">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300">
              Soft checkout
            </p>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50 sm:text-2xl">
              Order requests
            </h1>
            <p className="max-w-xl text-xs text-gray-600 dark:text-gray-300 sm:text-sm">
              These orders were placed without online payments. Contact customers
              via phone or WhatsApp to confirm details and then update the
              status.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-4 text-xs shadow-sm dark:bg-gray-900">
            <div className="mb-3 flex items-center justify-between text-[0.7rem] text-gray-500 dark:text-gray-400">
              <span>
                {total === 0
                  ? "No order requests yet."
                  : `${total} order request${total === 1 ? "" : "s"} in total.`}
              </span>
            </div>

            {orders.length === 0 ? (
              <p className="text-[0.7rem] text-gray-500 dark:text-gray-400">
                Once customers send order requests from the cart, they will
                appear here.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-2 text-left text-[0.7rem]">
                  <thead className="text-[0.68rem] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    <tr>
                      <th className="px-3 py-2">Customer</th>
                      <th className="px-3 py-2">Contact</th>
                      <th className="px-3 py-2">Location</th>
                      <th className="px-3 py-2">Items</th>
                      <th className="px-3 py-2">Total</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Created</th>
                      <th className="px-3 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr
                        key={o.id}
                        className="rounded-2xl bg-gray-50 align-top dark:bg-gray-900/70"
                      >
                        <td className="px-3 py-2">
                          <p className="text-[0.8rem] font-semibold text-gray-900 dark:text-gray-50">
                            {o.customerName}
                          </p>
                        </td>
                        <td className="px-3 py-2">
                          <p className="text-[0.7rem] text-gray-700 dark:text-gray-200">
                            {o.customerPhone}
                          </p>
                        </td>
                        <td className="px-3 py-2">
                          <p className="text-[0.7rem] text-gray-500 dark:text-gray-400">
                            {o.deliveryDistrict || "—"}
                          </p>
                        </td>
                        <td className="px-3 py-2">
                          <p className="text-[0.7rem] text-gray-700 dark:text-gray-200">
                            {o.totalItems} item{o.totalItems === 1 ? "" : "s"}
                          </p>
                        </td>
                        <td className="px-3 py-2">
                          <p className="text-[0.75rem] font-semibold text-gray-900 dark:text-gray-50">
                            {o.totalAmount.toLocaleString("en-LK", {
                              minimumFractionDigits: 2,
                            })}
                          </p>
                          <p className="text-[0.65rem] text-gray-500 dark:text-gray-400">
                            {o.currency}
                          </p>
                        </td>
                        <td className="px-3 py-2">
                          <StatusBadge status={o.status} />
                        </td>
                        <td className="px-3 py-2">
                          <p className="text-[0.65rem] text-gray-500 dark:text-gray-400">
                            {new Date(o.createdAt).toLocaleString("en-LK")}
                          </p>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex justify-end gap-2">
                            <Link
                              to={ROUTES.ADMIN_ORDER_DETAIL(o.id)}
                              className="inline-flex items-center rounded-full bg-gray-900 px-3 py-1 text-[0.65rem] font-medium text-white hover:bg-gray-800 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200"
                            >
                              <i className="fa-regular fa-eye mr-1" />
                              View
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </AdminLayout>
    </AppLayout>
  );
}

interface StatusBadgeProps {
  status: OrderStatus;
}

function StatusBadge({ status }: StatusBadgeProps) {
  let label = "";
  let className =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.65rem] font-medium ";

  switch (status) {
    case "PENDING":
      label = "Pending";
      className +=
        "bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-100";
      break;
    case "CONTACTED":
      label = "Contacted";
      className +=
        "bg-sky-50 text-sky-800 dark:bg-sky-900/30 dark:text-sky-100";
      break;
    case "COMPLETED":
      label = "Completed";
      className +=
        "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-100";
      break;
    case "CANCELLED":
      label = "Cancelled";
      className +=
        "bg-rose-50 text-rose-800 dark:bg-rose-900/30 dark:text-rose-100";
      break;
    default:
      label = status;
      className +=
        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200";
  }

  return <span className={className}>{label}</span>;
}
