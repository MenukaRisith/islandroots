// app/routes/products.$slug.tsx

import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { AppLayout } from "~/components/layout/AppLayout";
import { ProductDetailInfo } from "~/components/products/ProductDetailInfo";
import { RelatedProducts } from "~/components/products/RelatedProducts";
import type { ApiProduct } from "~/types/api";
import type { Product } from "~/types/domain";
import { TAG_KEYS } from "~/config/constants";
import type { TagKey } from "~/config/constants";

interface ProductDetailLoaderData {
  product: Product;
  related: Product[];
}

// Helper to build backend base URL on the server
function getApiBaseUrl(request: Request): string {
  const url = new URL(request.url);
  const envBase = process.env.PUBLIC_API_BASE_URL?.trim();

  const base =
    envBase && envBase.length > 0 ? envBase : `${url.protocol}//${url.host}`;

  return base.replace(/\/+$/, "");
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

export async function loader({ params, request }: LoaderFunctionArgs) {
  const slug = params.slug;
  if (!slug) {
    throw new Response("Not found", { status: 404 });
  }

  const apiBase = getApiBaseUrl(request);

  let product: Product;
  let related: Product[] = [];

  // 1) Load the main product
  try {
    const productRes = await fetch(
      `${apiBase}/api/products/${encodeURIComponent(slug)}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
      }
    );

    if (!productRes.ok) {
      throw new Error(`Status ${productRes.status}`);
    }

    const apiProduct = (await productRes.json()) as ApiProduct;
    product = mapApiProductToDomain(apiProduct);
  } catch {
    throw new Response("Not found", { status: 404 });
  }

  // 2) Load related products from /products
  try {
    const relatedRes = await fetch(`${apiBase}/api/products`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (relatedRes.ok) {
      const apiProducts = (await relatedRes.json()) as ApiProduct[];

      // Simple related logic: share at least one tag or same category
      const productTagSet = new Set(product.tags);
      const relatedAll = apiProducts
        .filter((p) => p.slug !== product.slug)
        .map(mapApiProductToDomain)
        .filter((p) => {
          const sharesTag = p.tags.some((t) => productTagSet.has(t));
          const sameCategory =
            p.category && product.category
              ? p.category === product.category
              : false;
          return sharesTag || sameCategory;
        });

      related = relatedAll.slice(0, 6);
    } else {
      related = [];
    }
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
    category: api.category ?? "Uncategorized",
    images: api.images,
    vendorId: api.vendorId,
    vendor: undefined,
    tags: tagKeys,
    isFeatured: api.isFeatured,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}
