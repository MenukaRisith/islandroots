// app/context/CartContext.tsx

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, Product } from "~/types/domain";
import {
  loadCartItemsFromStorage,
  saveCartItemsToStorage,
  clearCartFromStorage,
} from "~/utils/storage.client";

interface CartContextValue {
  items: CartItem[];
  totalQuantity: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load initial cart from localStorage
  useEffect(() => {
    const stored = loadCartItemsFromStorage();
    if (stored.length > 0) {
      setItems(stored);
    }
  }, []);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    saveCartItemsToStorage(items);
  }, [items]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      const index = prev.findIndex((item) => item.productId === product.id);
      if (index === -1) {
        return [
          ...prev,
          {
            productId: product.id,
            product,
            quantity,
          },
        ];
      }
      const updated = [...prev];
      const existing = updated[index];
      updated[index] = {
        ...existing,
        quantity: existing.quantity + quantity,
      };
      return updated;
    });
  }, []);

  const removeFromCart = useCallback((productId: string | number) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const updateQuantity = useCallback(
    (productId: string | number, quantity: number) => {
      if (quantity <= 0) {
        setItems((prev) => prev.filter((item) => item.productId !== productId));
        return;
      }
      setItems((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    },
    []
  );

  const clearCart = useCallback(() => {
    setItems([]);
    clearCartFromStorage();
  }, []);

  const totalQuantity = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalQuantity,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [items, totalQuantity, addToCart, removeFromCart, updateQuantity, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return ctx;
}
