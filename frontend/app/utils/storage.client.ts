import type { CartItem, WishlistItem } from "~/types/domain";

const CART_KEY = "islandroots_cart_v1";
const WISHLIST_KEY = "islandroots_wishlist_v1";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function safeParseJson<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

/**
 * CART
 */

export function loadCartItemsFromStorage(): CartItem[] {
  if (!isBrowser()) return [];
  const raw = window.localStorage.getItem(CART_KEY);
  const parsed = safeParseJson<CartItem[]>(raw);
  if (!parsed || !Array.isArray(parsed)) return [];
  return parsed;
}

export function saveCartItemsToStorage(items: CartItem[]): void {
  if (!isBrowser()) return;
  try {
    const serialized = JSON.stringify(items);
    window.localStorage.setItem(CART_KEY, serialized);
  } catch {
    // ignore
  }
}

export function clearCartFromStorage(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(CART_KEY);
  } catch {
    // ignore
  }
}

/**
 * WISHLIST
 */

export function loadWishlistFromStorage(): WishlistItem[] {
  if (!isBrowser()) return [];
  const raw = window.localStorage.getItem(WISHLIST_KEY);
  const parsed = safeParseJson<WishlistItem[]>(raw);
  if (!parsed || !Array.isArray(parsed)) return [];
  return parsed;
}

export function saveWishlistToStorage(items: WishlistItem[]): void {
  if (!isBrowser()) return;
  try {
    const serialized = JSON.stringify(items);
    window.localStorage.setItem(WISHLIST_KEY, serialized);
  } catch {
    // ignore
  }
}

export function clearWishlistFromStorage(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(WISHLIST_KEY);
  } catch {
    // ignore
  }
}
