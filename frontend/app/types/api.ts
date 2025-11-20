import type {
  ID,
  CurrencyCode,
  OrderStatus,
  PaymentPreference,
  UserRole,
} from "./domain";

export interface ApiListResponse<TItem> {
  items: TItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiAuthUser {
  id: ID;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
}

export interface ApiAuthResponse {
  token: string;
  user: ApiAuthUser;
}

export interface ApiProduct {
  id: ID;
  slug: string;
  name: string;
  description: string;
  price: number;
  currency: CurrencyCode;
  stock: number;
  category?: string | null;
  images: string[];
  vendorId?: ID;
  tags: string[]; // raw string tag keys from backend
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiVendor {
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

export interface ApiOrderItem {
  productId: ID;
  quantity: number;
  unitPrice: number;
  currency: CurrencyCode;
}

export interface ApiOrder {
  id: ID;
  userId?: ID;
  items: ApiOrderItem[];
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

export interface ApiCreateOrderResponse {
  orderId: ID;
}
