import type { Product } from "~/types/domain";
import { useWishlist } from "~/hooks/useWishlist";

interface WishlistButtonProps {
  product: Product;
  className?: string;
}

export function WishlistButton({ product, className = "" }: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const active = isInWishlist(product.id);

  const base =
    "inline-flex h-9 w-9 items-center justify-center rounded-full border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2";
  const style = active
    ? "border-rose-500 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
    : "border-gray-200 bg-white/80 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/80 dark:text-gray-300 dark:hover:bg-gray-800";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
      }}
      aria-pressed={active}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className={`${base} ${style} ${className}`}
    >
      <i className={active ? "fa-solid fa-heart" : "fa-regular fa-heart"} />
    </button>
  );
}
