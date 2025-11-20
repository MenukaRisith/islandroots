import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product, WishlistItem } from "~/types/domain";
import {
  loadWishlistFromStorage,
  saveWishlistToStorage,
  clearWishlistFromStorage,
} from "~/utils/storage.client";

interface WishlistContextValue {
  items: WishlistItem[];
  isInWishlist: (productId: string | number) => boolean;
  toggleWishlist: (product: Product) => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string | number) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(
  undefined
);

interface WishlistProviderProps {
  children: ReactNode;
}

export function WishlistProvider({ children }: WishlistProviderProps) {
  const [items, setItems] = useState<WishlistItem[]>([]);

  // Load initial wishlist from localStorage
  useEffect(() => {
    const stored = loadWishlistFromStorage();
    if (stored.length > 0) {
      setItems(stored);
    }
  }, []);

  // Persist wishlist to localStorage whenever it changes
  useEffect(() => {
    saveWishlistToStorage(items);
  }, [items]);

  const isInWishlist = useCallback(
    (productId: string | number) => {
      return items.some((item) => item.productId === productId);
    },
    [items]
  );

  const addToWishlist = useCallback((product: Product) => {
    setItems((prev) => {
      if (prev.some((item) => item.productId === product.id)) {
        return prev;
      }
      return [
        ...prev,
        {
          productId: product.id,
          product,
          addedAt: new Date().toISOString(),
        },
      ];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string | number) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const toggleWishlist = useCallback(
    (product: Product) => {
      setItems((prev) => {
        const exists = prev.some((item) => item.productId === product.id);
        if (exists) {
          return prev.filter((item) => item.productId !== product.id);
        }
        return [
          ...prev,
          {
            productId: product.id,
            product,
            addedAt: new Date().toISOString(),
          },
        ];
      });
    },
    []
  );

  const clearWishlist = useCallback(() => {
    setItems([]);
    clearWishlistFromStorage();
  }, []);

  const value = useMemo<WishlistContextValue>(
    () => ({
      items,
      isInWishlist,
      toggleWishlist,
      addToWishlist,
      removeFromWishlist,
      clearWishlist,
    }),
    [
      items,
      isInWishlist,
      toggleWishlist,
      addToWishlist,
      removeFromWishlist,
      clearWishlist,
    ]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlistContext(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlistContext must be used within a WishlistProvider");
  }
  return ctx;
}

