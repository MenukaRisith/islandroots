// app/config/constants.ts

export const SITE_NAME = "IslandRoots Market";
export const SITE_TAGLINE = "Support Local, Shop Smart";

export const ROUTES = {
  // Public browsing
  HOME: "/",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: (slug: string) => `/products/${slug}`,

  CAUSES: "/causes",
  CAUSE_DETAIL: (slug: string) => `/causes/${slug}`,

  MAKERS: "/makers",
  MAKER_DETAIL: (slug: string) => `/makers/${slug}`,

  // Soft checkout shopping
  CART: "/cart",
  CHECKOUT: "/checkout",
  CHECKOUT_SUCCESS: "/checkout/success",

  WISHLIST: "/wishlist",

  // Quiz experience
  QUIZ: "/quiz",
  QUIZ_RESULTS: "/quiz/results",

  // Account
  ACCOUNT_HOME: "/account",
  ACCOUNT_LOGIN: "/account/login",
  ACCOUNT_REGISTER: "/account/register",
  ACCOUNT_ORDERS: "/account/orders",
  ACCOUNT_WISHLIST: "/account/wishlist",

  // Admin (CMS-style dashboard)
  ADMIN_HOME: "/admin", // dashboard
  ADMIN_LOGIN: "/admin/login",

  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_PRODUCTS_NEW: "/admin/products/new",
  ADMIN_PRODUCT_EDIT: (id: string | number) => `/admin/products/${id}/edit`,

  ADMIN_ORDERS: "/admin/orders",
  ADMIN_ORDER_DETAIL: (id: string | number) => `/admin/orders/${id}`,

  ADMIN_VENDORS: "/admin/vendors",
  ADMIN_VENDORS_NEW: "/admin/vendors/new",
  ADMIN_VENDOR_EDIT: (id: string | number) => `/admin/vendors/${id}/edit`,

  // Auth / Misc
  LOGOUT: "/logout",
} as const;

// Auto-inferred union of ROUTES keys
export type RouteKey = keyof typeof ROUTES;

// Tag keys used for product impact badges
export const TAG_KEYS = [
  "WOMEN_LED",
  "ZERO_WASTE",
  "STUDENT_CREATOR",
  "LOCAL_FARMER",
  "HANDMADE",
  "RECYCLED_MATERIALS",
] as const;

export type TagKey = (typeof TAG_KEYS)[number];

export const CAUSE_LABELS: Record<TagKey, string> = {
  WOMEN_LED: "Support Rural Women",
  ZERO_WASTE: "Zero-Waste Lifestyle",
  STUDENT_CREATOR: "Student Creators",
  LOCAL_FARMER: "Support Local Farmers",
  HANDMADE: "Handmade & Crafted",
  RECYCLED_MATERIALS: "Recycled Materials",
};

// Optional pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 48,
};
