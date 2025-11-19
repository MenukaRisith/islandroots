import { useMemo } from "react";
import { useCartContext } from "~/context/CartContext";
import { formatCurrency } from "~/utils/format";
import type { CurrencyCode } from "~/types/domain";

export function useCart(defaultCurrency: CurrencyCode = "LKR") {
  const { items, totalQuantity, addToCart, removeFromCart, updateQuantity, clearCart } =
    useCartContext();

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      ),
    [items]
  );

  const formattedSubtotal = useMemo(
    () => formatCurrency(subtotal, defaultCurrency),
    [subtotal, defaultCurrency]
  );

  return useMemo(
    () => ({
      items,
      totalQuantity,
      subtotal,
      formattedSubtotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [
      items,
      totalQuantity,
      subtotal,
      formattedSubtotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    ]
  );
}
