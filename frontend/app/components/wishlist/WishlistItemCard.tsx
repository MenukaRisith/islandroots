import { Link } from "@remix-run/react";
import type { WishlistItem } from "~/types/domain";
import { ROUTES, CAUSE_LABELS } from "~/config/constants";
import { formatCurrency, truncateText } from "~/utils/format";
import { useCart } from "~/hooks/useCart";
import { useWishlist } from "~/hooks/useWishlist";

interface WishlistItemCardProps {
  item: WishlistItem;
}

export function WishlistItemCard({ item }: WishlistItemCardProps) {
  const { product } = item;
  const { addToCart } = useCart();
  const { removeFromWishlist } = useWishlist();

  const primaryTagLabel =
    product.tags.length > 0
      ? CAUSE_LABELS[product.tags[0] as keyof typeof CAUSE_LABELS]
      : undefined;

  return (
    <div className="flex gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Image */}
      <Link
        to={ROUTES.PRODUCT_DETAIL(product.slug)}
        className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800"
      >
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[0.65rem] text-gray-400">
            No image
          </div>
        )}
        {primaryTagLabel && (
          <span className="absolute left-1 top-1 rounded-full bg-black/70 px-2 py-0.5 text-[0.55rem] font-medium text-emerald-100">
            {primaryTagLabel}
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between gap-1">
        <div>
          <Link
            to={ROUTES.PRODUCT_DETAIL(product.slug)}
            className="text-sm font-semibold text-gray-900 hover:underline dark:text-gray-50"
          >
            {product.name}
          </Link>
          <p className="text-[0.7rem] text-gray-500 dark:text-gray-400">
            {truncateText(product.description, 80)}
          </p>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(product.price, product.currency)}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => addToCart(product, 1)}
              className="inline-flex items-center rounded-full bg-emerald-500 px-3 py-1 text-[0.7rem] font-semibold text-white hover:bg-emerald-600"
            >
              <i className="fa-solid fa-bag-shopping mr-1 text-[0.65rem]" />
              Add to cart
            </button>
            <button
              type="button"
              onClick={() => removeFromWishlist(product.id)}
              className="inline-flex items-center rounded-full border border-gray-200 px-2.5 py-1 text-[0.7rem] text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <i className="fa-regular fa-trash-can mr-1 text-[0.65rem]" />
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
