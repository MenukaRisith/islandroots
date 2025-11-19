// app/routes/products.$slug.tsx

import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { AppLayout } from "~/components/layout/AppLayout";
import { ProductDetailInfo } from "~/components/products/ProductDetailInfo";
import { RelatedProducts } from "~/components/products/RelatedProducts";
import { apiRequest } from "~/utils/api.server";
import type { ApiProduct, ApiListResponse } from "~/types/api";
import type { Product } from "~/types/domain";
import { TAG_KEYS } from "~/config/constants";
import type { TagKey } from "~/config/constants";

interface ProductDetailLoaderData {
  product: Product;
  related: Product[];
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [
      { title: "Product not found – IslandRoots Market" },
      { name: "description", content: "This product could not be found." },
    ];
  }

  return [
    { title: `${data.product.name} – IslandRoots Market` },
    {
      name: "description",
      content: data.product.description.slice(0, 150),
    },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const slug = params.slug;
  if (!slug) {
    throw new Response("Not found", { status: 404 });
  }

  let product: Product;
  let related: Product[] = [];

  try {
    const apiProduct = await apiRequest<ApiProduct>({
      path: `/products/${slug}`,
      method: "GET",
    });

    product = mapApiProductToDomain(apiProduct);
  } catch {
    throw new Response("Not found", { status: 404 });
  }

  // Fetch related products (adjust this to match your backend later)
  try {
    const relatedRes = await apiRequest<ApiListResponse<ApiProduct>>({
      path: "/products",
      method: "GET",
      query: {
        relatedTo: product.id,
        limit: 6,
      },
    });

    related = relatedRes.items
      .filter((item) => item.id !== product.id)
      .map(mapApiProductToDomain);
  } catch {
    related = [];
  }

  return json<ProductDetailLoaderData>({ product, related });
}

export default function ProductDetailRoute() {
  const { product, related } = useLoaderData<ProductDetailLoaderData>();

  return (
    <AppLayout>
      <section className="space-y-6">
        <ProductDetailInfo product={product} />
        <RelatedProducts products={related} />
      </section>
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
    // For now we don't hydrate vendor here; can be loaded separately by vendorId
    vendor: undefined,
    tags: tagKeys,
    isFeatured: api.isFeatured,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}
