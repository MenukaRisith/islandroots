import { getServerEnv } from "~/config/env.server";
import type { ID } from "~/types/domain";

export interface ApiErrorPayload {
  message: string;
  code?: string;
  details?: unknown;
}

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(message: string, status: number, payload?: ApiErrorPayload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = payload?.code;
    this.details = payload?.details;
  }
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiRequestOptions<TBody = unknown> {
  method?: HttpMethod;
  path: string; // e.g. "/products", "/orders/123"
  query?: Record<string, string | number | boolean | undefined>;
  body?: TBody;
  authToken?: string | null;
  signal?: AbortSignal;
}

function buildUrl(path: string, query?: ApiRequestOptions["query"]): string {
  const { API_BASE_URL } = getServerEnv();

  const trimmedBase = API_BASE_URL.replace(/\/+$/, "");
  const trimmedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(trimmedBase + trimmedPath);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined) continue;
      url.searchParams.append(key, String(value));
    }
  }

  return url.toString();
}

export async function apiRequest<TResponse, TBody = unknown>(
  options: ApiRequestOptions<TBody>
): Promise<TResponse> {
  const { method = "GET", path, query, body, authToken, signal } = options;

  const url = buildUrl(path, query);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
    signal,
  });

  const contentType = response.headers.get("Content-Type") ?? "";

  let payload: unknown = null;

  if (contentType.includes("application/json")) {
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }
  } else {
    try {
      payload = await response.text();
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    const maybeErrorObj =
      typeof payload === "object" && payload !== null
        ? (payload as Record<string, unknown>)
        : null;

    const apiErrorPayload: ApiErrorPayload | undefined = maybeErrorObj
      ? {
          message:
            typeof maybeErrorObj.message === "string"
              ? maybeErrorObj.message
              : `Request failed with status ${response.status}`,
          code:
            typeof maybeErrorObj.code === "string"
              ? maybeErrorObj.code
              : undefined,
          details: maybeErrorObj.details,
        }
      : undefined;

    throw new ApiError(
      apiErrorPayload?.message ??
        `Request failed with status ${response.status}`,
      response.status,
      apiErrorPayload
    );
  }

  return payload as TResponse;
}

/**
 * Common helpers for CRUD-style operations.
 */

export function getProductBySlugServer(slug: string, authToken?: string) {
  return apiRequest<unknown>({
    path: `/products/slug/${encodeURIComponent(slug)}`,
    method: "GET",
    authToken: authToken ?? null,
  });
}

export function listProductsServer(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  causeTag?: string;
}) {
  return apiRequest<unknown>({
    path: "/products",
    method: "GET",
    query: {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 12,
      search: params?.search ?? "",
      causeTag: params?.causeTag ?? "",
    },
  });
}

export function createOrderRequestServer(body: {
  items: { productId: ID; quantity: number }[];
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  deliveryDistrict?: string;
  paymentPreference: "COD" | "BANK_TRANSFER" | "PICKUP";
  notes?: string;
}) {
  return apiRequest<{ orderId: ID }>({
    path: "/orders",
    method: "POST",
    body,
  });
}
