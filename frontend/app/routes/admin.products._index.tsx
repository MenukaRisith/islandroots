import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { AppLayout } from "~/components/layout/AppLayout";
import { AdminLayout } from "~/components/admin/AdminLayout";
import { apiRequest } from "~/utils/api.server";
import type { ApiListResponse, ApiProduct } from "~/types/api";
import type { Product } from "~/types/domain";
import { TAG_KEYS, CAUSE_LABELS, ROUTES } from "~/config/constants";
import type { TagKey } from "~/config/constants";

interface AdminProductsLoaderData {
  products: Product[];
  total: number;
}

export const meta: MetaFunction = () => [
  { title: "Admin – Products | IslandRoots Market" },
  {
    name: "description",
    content:
      "Manage products for the IslandRoots Market – add, edit and curate local, impact-focused items.",
  },
];

export async function loader() {
  let products: Product[] = [];
  let total = 0;

  try {
    const res = await apiRequest<ApiListResponse<ApiProduct>>({
      path: "/products",
      method: "GET",
      query: {
        page: 1,
        pageSize: 50,
      },
    });

    products = res.items.map(mapApiProductToDomain);
    total = res.total;
  } catch {
    products = [];
    total = 0;
  }

  return json<AdminProductsLoaderData>({ products, total });
}

export default function AdminProductsIndexRoute() {
  const { products, total } = useLoaderData<AdminProductsLoaderData>();

  return (
    <AppLayout>
      <AdminLayout>
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300">
                Product management
              </p>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50 sm:text-2xl">
                Products
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-300 sm:text-sm">
                Curate the catalog of Sri Lankan handmade, eco-friendly and
                student-created products.
              </p>
            </div>
            <Link
              to={ROUTES.ADMIN_PRODUCTS_NEW}
              className="inline-flex items-center rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-600"
            >
              <i className="fa-solid fa-plus mr-2 text-[0.7rem]" />
              Add new product
            </Link>
          </div>

          <div className="rounded-3xl bg-white p-4 text-xs shadow-sm dark:bg-gray-900">
            <div className="mb-3 flex items-center justify-between text-[0.7rem] text-gray-500 dark:text-gray-400">
              <span>
                {total === 0
                  ? "No products found."
                  : `${total} product${total === 1 ? "" : "s"} in total.`}
              </span>
            </div>

            {products.length === 0 ? (
              <p className="text-[0.7rem] text-gray-500 dark:text-gray-400">
                Use the &quot;Add new product&quot; button to publish your first
                item.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-2 text-left text-[0.7rem]">
                  <thead className="text-[0.68rem] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    <tr>
                      <th className="px-3 py-2">Product</th>
                      <th className="px-3 py-2">Price</th>
                      <th className="px-3 py-2">Stock</th>
                      <th className="px-3 py-2">Tags</th>
                      <th className="px-3 py-2">Updated</th>
                      <th className="px-3 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr
                        key={p.id}
                        className="rounded-2xl bg-gray-50 align-top dark:bg-gray-900/70"
                      >
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            {p.images[0] && (
                              <img
                                src={p.images[0]}
                                alt={p.name}
                                className="h-9 w-9 rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <p className="max-w-[220px] truncate text-[0.8rem] font-semibold text-gray-900 dark:text-gray-50">
                                {p.name}
                              </p>
                              <p className="text-[0.65rem] text-gray-500 dark:text-gray-400">
                                {p.category}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <p className="text-[0.75rem] font-semibold text-gray-900 dark:text-gray-50">
                            {p.price.toLocaleString("en-LK", {
                              minimumFractionDigits: 2,
                            })}
                          </p>
                          <p className="text-[0.65rem] text-gray-500 dark:text-gray-400">
                            {p.currency}
                          </p>
                        </td>
                        <td className="px-3 py-2">
                          <p className="text-[0.75rem] text-gray-900 dark:text-gray-50">
                            {typeof p.stock === "number" ? p.stock : "—"}
                          </p>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex flex-wrap gap-1">
                            {p.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[0.6rem] text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-100"
                              >
                                {CAUSE_LABELS[tag]}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <p className="text-[0.65rem] text-gray-500 dark:text-gray-400">
                            {new Date(p.updatedAt).toLocaleDateString("en-LK")}
                          </p>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex justify-end gap-2">
                            <Link
                              to={ROUTES.ADMIN_PRODUCT_EDIT(p.id)}
                              className="inline-flex items-center rounded-full bg-gray-900 px-3 py-1 text-[0.65rem] font-medium text-white hover:bg-gray-800 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200"
                            >
                              <i className="fa-regular fa-pen-to-square mr-1" />
                              Edit
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
    category: api.category,
    images: api.images,
    vendorId: api.vendorId,
    vendor: undefined,
    tags: tagKeys,
    isFeatured: api.isFeatured,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}
