import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { AppLayout } from "~/components/layout/AppLayout";
import { AdminLayout } from "~/components/admin/AdminLayout";
import { ProductForm } from "~/components/admin/ProductForm";
import { apiRequest } from "~/utils/api.server";
import type { ApiProduct } from "~/types/api";
import type { ProductFormValues } from "~/components/admin/ProductForm";
import { TAG_KEYS, type TagKey } from "~/config/constants";

interface AdminProductEditLoaderData {
  productId: string;
  initialValues: Partial<ProductFormValues>;
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [
      { title: "Admin – Edit Product | IslandRoots Market" },
      {
        name: "description",
        content: "Edit product details for IslandRoots Market.",
      },
    ];
  }

  return [
    { title: `Admin – Edit Product ${data.productId} | IslandRoots Market` },
    {
      name: "description",
      content:
        "Edit product details, images and impact tags for IslandRoots Market.",
    },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const idParam = params.id;

  if (!idParam) {
    throw new Response("Not found", { status: 404 });
  }

  const productId = idParam.toString();

  let apiProduct: ApiProduct;
  try {
    apiProduct = await apiRequest<ApiProduct>({
      path: `/products/${productId}`,
      method: "GET",
    });
  } catch {
    throw new Response("Not found", { status: 404 });
  }

  const initialValues: Partial<ProductFormValues> = {
    name: apiProduct.name,
    category: apiProduct.category,
    description: apiProduct.description,
    price: apiProduct.price != null ? String(apiProduct.price) : "",
    currency: apiProduct.currency ?? "LKR",
    stock:
      typeof apiProduct.stock === "number" ? String(apiProduct.stock) : "",
    mainImage: apiProduct.images[0] ?? "",
    galleryImages:
      apiProduct.images.length > 1
        ? apiProduct.images.slice(1).join("\n")
        : "",
    // ✅ FIX: convert numeric ID to string for the form
    vendorId:
      apiProduct.vendorId != null ? String(apiProduct.vendorId) : "",
    tags: apiProduct.tags
      .filter((t) => TAG_KEYS.includes(t as TagKey))
      .map((t) => t as TagKey),
    isFeatured: Boolean(apiProduct.isFeatured),
  };

  return json<AdminProductEditLoaderData>({
    productId,
    initialValues,
  });
}

export default function AdminProductEditRoute() {
  const { productId, initialValues } =
    useLoaderData<AdminProductEditLoaderData>();

  return (
    <AppLayout>
      <AdminLayout>
        <section className="space-y-4">
          <ProductForm
            mode="edit"
            productId={productId}
            initialValues={initialValues}
          />
        </section>
      </AdminLayout>
    </AppLayout>
  );
}
