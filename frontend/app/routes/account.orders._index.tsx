// app/routes/account.orders_index.tsx

import type { MetaFunction } from "@remix-run/node";
import { useEffect, useState } from "react";
import { Link } from "@remix-run/react";
import { AppLayout } from "~/components/layout/AppLayout";
import {
  ROUTES,
  CAUSE_LABELS,
  TAG_KEYS,
  type TagKey,
} from "~/config/constants";
import { apiClientRequest } from "~/utils/api.client";
import { useAuth } from "~/hooks/useAuth";

export const meta: MetaFunction = () => [
  { title: "My Orders – IslandRoots Market" },
  {
    name: "description",
    content:
      "View your soft-checkout order requests and their status on IslandRoots Market.",
  },
];

type OrderStatus = "PENDING" | "CONTACTED" | "COMPLETED" | "CANCELLED";

interface MyOrderItem {
  productId: string;
  productName: string;
  productSlug?: string | null;
  quantity: number;
  unitPrice: number;
  currency: string;
  tags: string[];
}

interface MyOrderSummary {
  id: string;
  createdAt: string;
  status: OrderStatus;
  totalAmount: number;
  currency: string;
  totalItems: number;
  paymentPreference: "COD" | "BANK_TRANSFER" | "PICKUP";
  itemsPreview: MyOrderItem[];
}

export default function AccountOrdersIndexRoute() {
  const { isAuthenticated } = useAuth();

  const [orders, setOrders] = useState<MyOrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const data = await apiClientRequest<MyOrderSummary[]>({
          path: "/me/orders", // backend: GET /api/me/orders
          method: "GET",
        });

        if (!cancelled) {
          setOrders(data ?? []);
          setError(undefined);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("[account.orders_index] failed to load orders:", err);
        if (!cancelled) {
          setError(
            "We couldn't load your orders right now. Please try again in a moment."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  return (
    <AppLayout>
      <section className="space-y-5">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
            My Orders
          </h1>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            These are your soft-checkout requests. Sellers will contact you via
            phone or WhatsApp to confirm payment and delivery.
          </p>
        </div>

        {/* Not signed in */}
        {!isAuthenticated && (
          <div className="space-y-3 rounded-3xl bg-white p-4 text-xs shadow-sm dark:bg-gray-900">
            <p className="text-[0.75rem] text-gray-700 dark:text-gray-200">
              You need an account to view your orders.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                to={ROUTES.ACCOUNT_LOGIN}
                className="inline-flex items-center rounded-full bg-emerald-600 px-3 py-1.5 text-[0.75rem] font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 dark:ring-offset-gray-900"
              >
                <i className="fa-regular fa-user mr-2 text-[0.7rem]" />
                Sign in
              </Link>
              <Link
                to={ROUTES.PRODUCTS}
                className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1.5 text-[0.75rem] text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                <i className="fa-solid fa-bag-shopping mr-2 text-[0.7rem]" />
                Browse products
              </Link>
            </div>
          </div>
        )}

        {/* Loading state */}
        {isAuthenticated && loading && (
          <div className="space-y-3 rounded-3xl bg-white p-4 text-xs shadow-sm dark:bg-gray-900">
            <div className="flex animate-pulse flex-col gap-3">
              <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="space-y-2">
                <div className="h-12 rounded-2xl bg-gray-100 dark:bg-gray-800" />
                <div className="h-12 rounded-2xl bg-gray-100 dark:bg-gray-800" />
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {isAuthenticated && !loading && error && (
          <div className="rounded-3xl bg-white p-4 text-xs text-rose-500 shadow-sm dark:bg-gray-900">
            {error}
          </div>
        )}

        {/* Orders list */}
        {isAuthenticated && !loading && !error && (
          <>
            {orders.length === 0 ? (
              <div className="space-y-3 rounded-3xl bg-white p-4 text-xs shadow-sm dark:bg-gray-900">
                <p className="text-[0.75rem] text-gray-700 dark:text-gray-200">
                  You haven&apos;t placed any soft checkout requests yet.
                </p>
                <p className="text-[0.7rem] text-gray-500 dark:text-gray-400">
                  Add items to your cart and send an order request. We&apos;ll
                  show them here along with their status: Pending, Contacted,
                  Completed or Cancelled.
                </p>
                <Link
                  to={ROUTES.PRODUCTS}
                  className="inline-flex items-center rounded-full bg-emerald-600 px-3 py-1.5 text-[0.75rem] font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 dark:ring-offset-gray-900"
                >
                  <i className="fa-solid fa-compass mr-2 text-[0.7rem]" />
                  Discover products
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </AppLayout>
  );
}

/* ----- Small components/helpers ----- */

function OrderCard({ order }: { order: MyOrderSummary }) {
  const createdAt = new Date(order.createdAt);
  const impactTags = getOrderImpactTags(order.itemsPreview ?? []);

  return (
    <div className="flex flex-col gap-3 rounded-3xl bg-white p-4 text-xs shadow-sm dark:bg-gray-900">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[0.7rem] font-medium text-gray-500 dark:text-gray-400">
            Order ID
          </p>
          <p className="text-[0.8rem] font-semibold text-gray-900 dark:text-gray-50">
            #{order.id}
          </p>
          <p className="text-[0.7rem] text-gray-500 dark:text-gray-400">
            Placed on{" "}
            {createdAt.toLocaleDateString("en-LK", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}{" "}
            at{" "}
            {createdAt.toLocaleTimeString("en-LK", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="text-right">
          <StatusBadge status={order.status} />
          <p className="mt-1 text-[0.68rem] text-gray-500 dark:text-gray-400">
            {formatPaymentPreference(order.paymentPreference)}
          </p>
          <p className="mt-1 text-[0.8rem] font-semibold text-gray-900 dark:text-gray-50">
            {order.totalAmount.toLocaleString("en-LK", {
              minimumFractionDigits: 2,
            })}{" "}
            <span className="text-[0.7rem] font-normal">{order.currency}</span>
          </p>
        </div>
      </div>

      {/* Items preview */}
      <div className="space-y-1 rounded-2xl bg-gray-50 p-3 dark:bg-gray-900/60">
        {order.itemsPreview.map((item, index) => (
          <div
            key={item.productId}
            className="flex items-center justify-between text-[0.7rem]"
          >
            <div className="flex flex-1 flex-col">
              <p className="line-clamp-1 font-medium text-gray-900 dark:text-gray-50">
                {item.productSlug ? (
                  <Link
                    to={ROUTES.PRODUCT_DETAIL(item.productSlug)}
                    className="hover:underline"
                  >
                    {item.productName}
                  </Link>
                ) : (
                  item.productName
                )}
              </p>
              <p className="text-[0.65rem] text-gray-500 dark:text-gray-400">
                {item.quantity} ×{" "}
                {item.unitPrice.toLocaleString("en-LK", {
                  minimumFractionDigits: 2,
                })}{" "}
                {item.currency}
              </p>
            </div>
            {index === 0 && order.totalItems > item.quantity && (
              <p className="ml-2 whitespace-nowrap text-[0.65rem] text-gray-500 dark:text-gray-400">
                + {order.totalItems - item.quantity} more
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Impact */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[0.68rem] text-gray-500 dark:text-gray-400">
          Impact snapshot
        </p>
        <div className="flex flex-wrap gap-1">
          {impactTags.length === 0 ? (
            <span className="text-[0.65rem] text-gray-400">
              No impact tags yet
            </span>
          ) : (
            impactTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[0.6rem] text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-100"
              >
                <i className="fa-solid fa-heart mr-1 text-[0.55rem]" />
                {CAUSE_LABELS[tag]}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
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

function formatPaymentPreference(
  pref: MyOrderSummary["paymentPreference"]
): string {
  switch (pref) {
    case "COD":
      return "Cash on Delivery";
    case "BANK_TRANSFER":
      return "Bank Transfer";
    case "PICKUP":
      return "Pick up";
    default:
      return pref;
  }
}

function getOrderImpactTags(items: MyOrderItem[]): TagKey[] {
  const raw = items.flatMap((item) => item.tags);
  const unique = Array.from(new Set(raw));

  return unique
    .filter((t): t is TagKey => TAG_KEYS.includes(t as TagKey))
    .sort();
}
