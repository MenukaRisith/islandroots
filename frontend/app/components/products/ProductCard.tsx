import { Link } from "@remix-run/react";
import type { Product } from "~/types/domain";
import { ROUTES, CAUSE_LABELS } from "~/config/constants";
import { formatCurrency, truncateText } from "~/utils/format";
import { useCart } from "~/hooks/useCart";
import { WishlistButton } from "./WishlistButton";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const primaryTagLabel =
    product.tags.length > 0
      ? CAUSE_LABELS[product.tags[0] as keyof typeof CAUSE_LABELS]
      : undefined;

  return (
    <Link
      to={ROUTES.PRODUCT_DETAIL(product.slug)}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="relative h-44 overflow-hidden bg-gray-100 dark:bg-gray-800">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
            No image
          </div>
        )}

        {/* Tag pill */}
        {primaryTagLabel && (
          <div className="absolute left-2 top-2 rounded-full bg-black/70 px-3 py-1 text-[0.6rem] font-medium text-emerald-100">
            {primaryTagLabel}
          </div>
        )}

        {/* Wishlist button */}
        <div className="absolute right-2 top-2">
          <WishlistButton product={product} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50">
          {product.name}
        </h3>
        <p className="text-[0.7rem] text-gray-500 dark:text-gray-400">
          {truncateText(product.description, 90)}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(product.price, product.currency)}
          </span>
          <span className="text-[0.7rem] text-gray-500 dark:text-gray-400">
            {product.vendor?.locationDistrict ?? "Sri Lanka"}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart(product, 1);
          }}
          className="mt-2 inline-flex items-center justify-center rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-600"
        >
          <i className="fa-solid fa-bag-shopping mr-1.5 text-[0.7rem]" />
          Add to cart
        </button>
      </div>
    </Link>
  );
}
