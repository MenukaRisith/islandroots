// app/hooks/useWishlist.ts

import { useMemo } from "react";
import { useWishlistContext } from "~/context/WishlistContext";
import type { Product } from "~/types/domain";

export function useWishlist() {
  const {
    items,
    isInWishlist,
    toggleWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
  } = useWishlistContext();

  const totalItems = items.length;

  const productIds = useMemo(
    () => items.map((item) => item.productId),
    [items]
  );

  const isProductInWishlist = (productId: string | number): boolean =>
    isInWishlist(productId);

  const handleToggle = (product: Product): void => {
    toggleWishlist(product);
  };

  return useMemo(
    () => ({
      items,
      totalItems,
      productIds,
      isInWishlist: isProductInWishlist,
      toggleWishlist: handleToggle,
      addToWishlist,
      removeFromWishlist,
      clearWishlist,
    }),
    [
      items,
      totalItems,
      productIds,
      isProductInWishlist,
      handleToggle,
      addToWishlist,
      removeFromWishlist,
      clearWishlist,
    ]
  );
}
