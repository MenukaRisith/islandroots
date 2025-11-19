import { useState } from "react";
import type { Product } from "~/types/domain";
import { formatCurrency } from "~/utils/format";
import { ImpactBadges } from "./ImpactBadges";
import { useCart } from "~/hooks/useCart";
import { WishlistButton } from "./WishlistButton";
import { MakerMiniCard } from "~/components/makers/MakerMiniCard";

interface ProductDetailInfoProps {
  product: Product;
}

export function ProductDetailInfo({ product }: ProductDetailInfoProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { addToCart } = useCart();

  const activeImage =
    product.images[activeImageIndex] ?? product.images[0] ?? "";

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.5fr)]">
      {/* Gallery */}
      <div className="space-y-3">
        <div className="relative overflow-hidden rounded-3xl bg-gray-100 dark:bg-gray-800">
          {activeImage ? (
            <img
              src={activeImage}
              alt={product.name}
              className="h-72 w-full object-cover sm:h-80"
            />
          ) : (
            <div className="flex h-72 w-full items-center justify-center text-xs text-gray-400 sm:h-80">
              No image available
            </div>
          )}
          <div className="absolute left-3 top-3 flex items-center gap-2">
            <ImpactBadges tags={product.tags} size="sm" />
          </div>
          <div className="absolute right-3 top-3">
            <WishlistButton product={product} />
          </div>
        </div>

        {/* Thumbnails */}
        {product.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {product.images.map((url, index) => (
              <button
                key={url + index.toString()}
                type="button"
                onClick={() => setActiveImageIndex(index)}
                className={`h-16 w-20 flex-shrink-0 overflow-hidden rounded-2xl border ${
                  index === activeImageIndex
                    ? "border-emerald-500 ring-1 ring-emerald-500"
                    : "border-gray-200 dark:border-gray-700"
                }`}
                aria-label={`View image ${index + 1}`}
              >
                <img
                  src={url}
                  alt={`${product.name} "image" ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info + actions */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50 sm:text-2xl">
            {product.name}
          </h1>
          {product.vendor?.locationDistrict && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              From{" "}
              <span className="font-medium">
                {product.vendor.locationDistrict}
              </span>
              , Sri Lanka
            </p>
          )}
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-2xl bg-gray-50 p-3 dark:bg-gray-900/70">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Price
            </p>
            <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(product.price, product.currency)}
            </p>
            {typeof product.stock === "number" && (
              <p className="text-[0.7rem] text-gray-500 dark:text-gray-400">
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Currently made-to-order"}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => addToCart(product, 1)}
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-600"
            >
              <i className="fa-solid fa-bag-shopping mr-2 text-[0.75rem]" />
              Add to cart
            </button>
          </div>
        </div>

        {/* Maker story */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
            Maker story
          </p>
          <MakerMiniCard vendor={product.vendor ?? null} />
        </div>

        {/* Impact explanation */}
        {product.tags.length > 0 && (
          <div className="space-y-1 rounded-2xl bg-emerald-50 p-3 text-[0.7rem] text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100">
            <p className="font-semibold text-[0.75rem]">
              How your purchase helps
            </p>
            <p>
              This product is tagged as part of our impact collection. Each
              order supports real people behind the brand – from rural women
              running home businesses to students funding their education.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
