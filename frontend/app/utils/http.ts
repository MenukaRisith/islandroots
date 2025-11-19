// app/utils/http.ts

export type QueryParams = Record<
  string,
  string | number | boolean | undefined | null
>;

export function toQueryString(params?: QueryParams): string {
  if (!params) return "";
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    searchParams.append(key, String(value));
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

export function mergeHeaders(
  base: Record<string, string>,
  extra?: Record<string, string | undefined>
): Record<string, string> {
  if (!extra) return base;

  const result: Record<string, string> = { ...base };

  Object.entries(extra).forEach(([key, value]) => {
    if (typeof value === "string") {
      result[key] = value;
    }
  });

  return result;
}
