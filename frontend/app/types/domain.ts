import type { TagKey } from "~/config/constants";

export type ID = string | number;

export type CurrencyCode = "LKR" | "USD"; // extend if needed

export type UserRole = "CUSTOMER" | "ADMIN";

export interface User {
  id: ID;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
}

export interface Vendor {
  id: ID;
  name: string;
  slug: string;
  locationDistrict?: string;
  locationCity?: string;
  story?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CauseTag {
  key: TagKey;
  label: string;
  description?: string;
}


export interface Product {
  id: ID;
  slug: string;
  name: string;
  description: string;
  price: number;
  currency: CurrencyCode;
  stock: number;
  category: string;
  images: string[];
  vendorId?: ID;
  vendor?: Vendor;
  tags: TagKey[];
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: ID;
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  productId: ID;
  product: Product;
  addedAt: string;
}

export type OrderStatus =
  | "PENDING"
  | "CONTACTED"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentPreference = "COD" | "BANK_TRANSFER" | "PICKUP";

export interface OrderItem {
  productId: ID;
  product: Product;
  quantity: number;
  unitPrice: number;
  currency: CurrencyCode;
}

export interface Order {
  id: ID;
  userId?: ID;
  items: OrderItem[];
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  deliveryDistrict?: string;
  paymentPreference: PaymentPreference;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImpactStats {
  totalOrders: number;
  womenLedOrders: number;
  zeroWasteOrders: number;
  studentCreatorOrders: number;
}
