import { getClientEnv } from "~/config/env.client";
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

export interface ApiClientRequestOptions<TBody = unknown> {
  method?: HttpMethod;
  path: string; // e.g. "/products", "/orders/123"
  query?: Record<string, string | number | boolean | undefined>;
  body?: TBody;
  authToken?: string | null;
  signal?: AbortSignal;
}

function buildClientUrl(
  path: string,
  query?: ApiClientRequestOptions["query"]
): string {
  const { PUBLIC_API_BASE_URL } = getClientEnv();

  const apiPrefix = "/api";
  const trimmedBase = PUBLIC_API_BASE_URL.replace(/\/+$/, "");
  const trimmedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(trimmedBase + apiPrefix + trimmedPath);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined) continue;
      url.searchParams.append(key, String(value));
    }
  }

  return url.toString();
}

/**
 * Browser-side API client for hooks/components.
 */
export async function apiClientRequest<TResponse, TBody = unknown>(
  options: ApiClientRequestOptions<TBody>
): Promise<TResponse> {
  const { method = "GET", path, query, body, authToken, signal } = options;

  const url = buildClientUrl(path, query);

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

export function loginClient(body: {
  email: string;
  password: string;
}) {
  return apiClientRequest<{
    token: string;
    user: { id: ID; name: string; email: string; role: "CUSTOMER" | "ADMIN" };
  }>({
    path: "/auth/login",
    method: "POST",
    body,
  });
}

export function registerClient(body: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) {
  return apiClientRequest<{
    token: string;
    user: { id: ID; name: string; email: string; role: "CUSTOMER" | "ADMIN" };
  }>({
    path: "/auth/register",
    method: "POST",
    body,
  });
}

export function fetchCurrentUserClient(authToken: string) {
  return apiClientRequest<{
    id: ID;
    name: string;
    email: string;
    phone?: string;
    role: "CUSTOMER" | "ADMIN";
  }>({
    path: "/auth/me",
    method: "GET",
    authToken,
  });
}
