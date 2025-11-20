import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { useState } from "react";
import { AppLayout } from "~/components/layout/AppLayout";
import { AdminLayout } from "~/components/admin/AdminLayout";
import { apiClientRequest } from "~/utils/api.client";
import {
  ROUTES,
  CAUSE_LABELS,
  TAG_KEYS,
  type TagKey,
} from "~/config/constants";

type OrderStatus = "PENDING" | "CONTACTED" | "COMPLETED" | "CANCELLED";

interface AdminOrderItemApi {
  productId: string;
  productName: string;
  productSlug?: string | null;
  quantity: number;
  unitPrice: number;
  currency: string;
  tags: string[];
}

interface AdminOrderDetailApi {
  id: string;
  createdAt: string;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  deliveryAddress: string;
  deliveryDistrict?: string | null;
  notes?: string | null;
  paymentPreference: "COD" | "BANK_TRANSFER" | "PICKUP";
  items: AdminOrderItemApi[];
  totalItems: number;
  totalAmount: number;
  currency: string;
}

interface OrderDetailLoaderData {
  order: AdminOrderDetailApi;
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [
      { title: "Admin – Order | IslandRoots Market" },
      {
        name: "description",
        content: "Review a single order request on IslandRoots Market.",
      },
    ];
  }

  return [
    {
      title: `Admin – Order ${data.order.id} | IslandRoots Market`,
    },
    {
      name: "description",
      content: `Review and update soft-checkout order ${data.order.id} for ${data.order.customerName}.`,
    },
  ];
};

// Helper to build API base URL on the server
function getApiBaseUrl(request: Request): string {
  const url = new URL(request.url);
  const envBase = process.env.PUBLIC_API_BASE_URL?.trim();

  const base =
    envBase && envBase.length > 0 ? envBase : `${url.protocol}//${url.host}`;

  return base.replace(/\/+$/, "");
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const idParam = params.id;

  if (!idParam) {
    throw new Response("Not found", { status: 404 });
  }

  const apiBase = getApiBaseUrl(request);

  let order: AdminOrderDetailApi;

  try {
    const res = await fetch(
      `${apiBase}/api/orders/${encodeURIComponent(idParam)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!res.ok) {
      if (res.status === 404) {
        throw new Response("Not found", { status: 404 });
      }
      throw new Error(`Failed to load order (status ${res.status})`);
    }

    order = (await res.json()) as AdminOrderDetailApi;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[admin.orders.$id] error loading order:", err);
    throw new Response("Not found", { status: 404 });
  }

  return json<OrderDetailLoaderData>({ order });
}

export default function AdminOrderDetailRoute() {
  const { order: initialOrder } = useLoaderData<OrderDetailLoaderData>();

  const [order, setOrder] = useState(initialOrder);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | undefined>(undefined);
  const [updateSuccess, setUpdateSuccess] = useState<string | undefined>(
    undefined
  );

  const whatsappLink = getWhatsAppLink(order.customerPhone);

  const handleStatusChange = async (nextStatus: OrderStatus) => {
    if (nextStatus === order.status) return;

    setUpdating(true);
    setUpdateError(undefined);
    setUpdateSuccess(undefined);

    try {
      const updated = await apiClientRequest<AdminOrderDetailApi>({
        path: `/orders/${order.id}`,
        method: "PATCH",
        body: { status: nextStatus },
      });

      setOrder(updated);
      setUpdateSuccess("Status updated successfully.");
    } catch {
      setUpdateError("Failed to update status. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const impactTags = getOrderImpactTags(order.items);

  return (
    <AppLayout>
      <AdminLayout>
        <section className="space-y-4">
          {/* Header + back link */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <Link
                to={ROUTES.ADMIN_ORDERS}
                className="inline-flex items-center text-[0.7rem] text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
              >
                <i className="fa-solid fa-arrow-left mr-1 text-[0.65rem]" />
                Back to orders
              </Link>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50 sm:text-2xl">
                Order #{order.id}
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Placed by{" "}
                <span className="font-medium">{order.customerName}</span> on{" "}
                {new Date(order.createdAt).toLocaleString("en-LK")}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2 text-xs">
              <StatusBadge status={order.status} />
              {/* WhatsApp CTA */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full border border-emerald-500 bg-emerald-50 px-3 py-1 text-[0.7rem] font-medium text-emerald-700 hover:bg-emerald-100 dark:border-emerald-400 dark:bg-emerald-900/40 dark:text-emerald-100 dark:hover:bg-emerald-900"
              >
                <i className="fa-brands fa-whatsapp mr-2 text-sm" />
                Message on WhatsApp
              </a>
            </div>
          </div>

          {/* Status controls */}
          <section className="space-y-2 rounded-3xl bg-white p-4 text-xs shadow-sm dark:bg-gray-900">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-[0.7rem] font-semibold text-gray-900 dark:text-gray-50">
                  Update status
                </p>
                <p className="text-[0.7rem] text-gray-500 dark:text-gray-400">
                  Soft checkout means you confirm via phone or WhatsApp, then
                  mark the status here.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusActionButton
                  label="Pending"
                  status="PENDING"
                  current={order.status}
                  onClick={handleStatusChange}
                  disabled={updating}
                />
                <StatusActionButton
                  label="Contacted"
                  status="CONTACTED"
                  current={order.status}
                  onClick={handleStatusChange}
                  disabled={updating}
                />
                <StatusActionButton
                  label="Completed"
                  status="COMPLETED"
                  current={order.status}
                  onClick={handleStatusChange}
                  disabled={updating}
                />
                <StatusActionButton
                  label="Cancelled"
                  status="CANCELLED"
                  current={order.status}
                  onClick={handleStatusChange}
                  disabled={updating}
                />
              </div>
            </div>
            {updateError && (
              <p className="text-[0.7rem] text-rose-500">{updateError}</p>
            )}
            {updateSuccess && (
              <p className="text-[0.7rem] text-emerald-500">
                {updateSuccess}
              </p>
            )}
          </section>

          {/* Layout: left (customer + notes), right (order items) */}
          <div className="grid gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)]">
            {/* Customer & delivery */}
            <section className="space-y-3 rounded-3xl bg-white p-4 text-xs shadow-sm dark:bg-gray-900">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                Customer & delivery
              </h2>
              <div className="space-y-2">
                <div>
                  <p className="text-[0.7rem] font-medium text-gray-700 dark:text-gray-200">
                    Customer
                  </p>
                  <p className="text-[0.8rem] text-gray-900 dark:text-gray-50">
                    {order.customerName}
                  </p>
                  <p className="text-[0.7rem] text-gray-600 dark:text-gray-300">
                    {order.customerPhone}
                  </p>
                  {order.customerEmail && (
                    <p className="text-[0.7rem] text-gray-500 dark:text-gray-400">
                      {order.customerEmail}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-[0.7rem] font-medium text-gray-700 dark:text-gray-200">
                    Delivery address
                  </p>
                  <p className="whitespace-pre-line text-[0.7rem] text-gray-700 dark:text-gray-200">
                    {order.deliveryAddress}
                  </p>
                  {order.deliveryDistrict && (
                    <p className="text-[0.7rem] text-gray-500 dark:text-gray-400">
                      {order.deliveryDistrict}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-[0.7rem] font-medium text-gray-700 dark:text-gray-200">
                    Payment preference
                  </p>
                  <p className="text-[0.7rem] text-gray-700 dark:text-gray-200">
                    {formatPaymentPreference(order.paymentPreference)}
                  </p>
                </div>

                {order.notes && (
                  <div>
                    <p className="text-[0.7rem] font-medium text-gray-700 dark:text-gray-200">
                      Customer notes
                    </p>
                    <p className="whitespace-pre-line text-[0.7rem] text-gray-700 dark:text-gray-200">
                      {order.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Impact tags */}
              <div className="mt-2 rounded-2xl bg-emerald-50 p-3 text-[0.7rem] text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-50">
                <p className="mb-1 text-[0.7rem] font-semibold">
                  Impact snapshot
                </p>
                {impactTags.length === 0 ? (
                  <p>
                    This order doesn&apos;t have any impact tags yet. Tag
                    products with causes like{" "}
                    <span className="font-medium">Women-led</span> or{" "}
                    <span className="font-medium">Zero-waste</span> to see them
                    reflected here.
                  </p>
                ) : (
                  <>
                    <p className="mb-2">
                      This order supports{" "}
                      <span className="font-semibold">
                        {impactTags.length}
                      </span>{" "}
                      impact cause{impactTags.length === 1 ? "" : "s"}:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {impactTags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-white/90 px-2 py-0.5 text-[0.65rem] text-emerald-800 shadow-sm dark:bg-emerald-950"
                        >
                          <i className="fa-solid fa-heart mr-1 text-[0.6rem]" />
                          {CAUSE_LABELS[tag]}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* Items & totals */}
            <section className="space-y-3 rounded-3xl bg-white p-4 text-xs shadow-sm dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                  Items ({order.totalItems})
                </h2>
                <div className="text-right text-[0.7rem] text-gray-700 dark:text-gray-200">
                  <p className="text-[0.68rem] uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">
                    Total
                  </p>
                  <p className="text-base font-semibold text-gray-900 dark:text-gray-50">
                    {order.totalAmount.toLocaleString("en-LK", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    <span className="text-[0.75rem] font-normal">
                      {order.currency}
                    </span>
                  </p>
                </div>
              </div>

              <div className="divide-y divide-gray-200 text-xs dark:divide-gray-800">
                {order.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-[0.8rem] font-semibold text-gray-900 dark:text-gray-50">
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
                      <p className="text-[0.7rem] text-gray-500 dark:text-gray-400">
                        {item.quantity} ×{" "}
                        {item.unitPrice.toLocaleString("en-LK", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        {item.currency}
                      </p>
                      {item.tags.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {item.tags
                            .filter((t) => TAG_KEYS.includes(t as TagKey))
                            .map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[0.6rem] text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-100"
                              >
                                {CAUSE_LABELS[tag as TagKey]}
                              </span>
                            ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-[0.8rem] font-semibold text-gray-900 dark:text-gray-50">
                        {(item.unitPrice * item.quantity).toLocaleString(
                          "en-LK",
                          {
                            minimumFractionDigits: 2,
                          }
                        )}{" "}
                        <span className="text-[0.75rem] font-normal">
                          {item.currency}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>
      </AdminLayout>
    </AppLayout>
  );
}

/* Helpers */

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

interface StatusActionButtonProps {
  label: string;
  status: OrderStatus;
  current: OrderStatus;
  disabled?: boolean;
  onClick: (next: OrderStatus) => void;
}

function StatusActionButton({
  label,
  status,
  current,
  disabled,
  onClick,
}: StatusActionButtonProps) {
  const isActive = status === current;

  return (
    <button
      type="button"
      disabled={disabled || isActive}
      onClick={() => onClick(status)}
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-[0.7rem] font-medium transition",
        isActive
          ? "bg-gray-900 text-white dark:bg-gray-50 dark:text-gray-900"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700",
        disabled ? "opacity-60 cursor-not-allowed" : "",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function formatPaymentPreference(
  pref: AdminOrderDetailApi["paymentPreference"]
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

function getOrderImpactTags(items: AdminOrderItemApi[]): TagKey[] {
  const raw = items.flatMap((item) => item.tags);
  const unique = Array.from(new Set(raw));

  return unique
    .filter((t): t is TagKey => TAG_KEYS.includes(t as TagKey))
    .sort();
}

function getWhatsAppLink(phone: string): string {
  const digits = phone.replace(/[^0-9+]/g, "");

  if (digits.startsWith("+")) {
    return `https://wa.me/${digits.slice(1)}`;
  }

  if (digits.startsWith("0")) {
    // assume Sri Lankan number like 07X..., convert to 94
    return `https://wa.me/94${digits.slice(1)}`;
  }

  if (digits.startsWith("94")) {
    return `https://wa.me/${digits}`;
  }

  return `https://wa.me/${digits}`;
}
