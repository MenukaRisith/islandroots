export const ROUTES = {
  HOME: "/",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: (slug: string) => `/products/${slug}`,
  CAUSES: "/causes",
  CAUSE_DETAIL: (slug: string) => `/causes/${slug}`,
  MAKERS: "/makers",
  MAKER_DETAIL: (slug: string) => `/makers/${slug}`,
  CART: "/cart",
  CHECKOUT: "/checkout",
  CHECKOUT_SUCCESS: "/checkout/success",
  WISHLIST: "/wishlist",
  QUIZ: "/quiz",
  QUIZ_RESULTS: "/quiz/results",
  ACCOUNT_HOME: "/account",
  ACCOUNT_LOGIN: "/account/login",
  ACCOUNT_REGISTER: "/account/register",
  ACCOUNT_ORDERS: "/account/orders",
  ACCOUNT_WISHLIST: "/account/wishlist",
  ADMIN_HOME: "/admin",
  ADMIN_LOGIN: "/admin/login",
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_PRODUCTS_NEW: "/admin/products/new",
  ADMIN_PRODUCT_EDIT: (id: string | number) => `/admin/products/${id}/edit`,
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_ORDER_DETAIL: (id: string | number) => `/admin/orders/${id}`,
  ADMIN_VENDORS: "/admin/vendors",
  ADMIN_VENDORS_NEW: "/admin/vendors/new",
  ADMIN_VENDOR_EDIT: (id: string | number) => `/admin/vendors/${id}/edit`,
  LOGOUT: "/logout",
} as const;

export type RouteKey = keyof typeof ROUTES;

// Core tag keys used for causes & impact badges
export const TAG_KEYS = [
  "WOMEN_LED",
  "ZERO_WASTE",
  "STUDENT_CREATOR",
  "LOCAL_FARMER",
  "HANDMADE",
  "RECYCLED_MATERIALS",
] as const;

export type TagKey = (typeof TAG_KEYS)[number];

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 48,
};

export const CAUSE_LABELS: Record<TagKey, string> = {
  WOMEN_LED: "Support Rural Women",
  ZERO_WASTE: "Zero-Waste Lifestyle",
  STUDENT_CREATOR: "Student Creators",
  LOCAL_FARMER: "Support Local Farmers",
  HANDMADE: "Handmade & Crafted",
  RECYCLED_MATERIALS: "Recycled Materials",
};
