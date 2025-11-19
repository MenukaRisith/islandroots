import { useSearchParams } from "@remix-run/react";
import { TAG_KEYS, CAUSE_LABELS } from "~/config/constants";
import type { TagKey } from "~/config/constants";

export function ProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const causeTag = searchParams.get("causeTag") ?? "";

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    // Always reset to page 1 when filters change
    next.delete("page");
    setSearchParams(next);
  };

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-sm dark:bg-gray-900 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1">
        <label
          htmlFor="products-search"
          className="block text-m font-medium text-gray-500 dark:text-gray-400"
        >
          Search
        </label>
        <input
          id="products-search"
          type="search"
          value={search}
          onChange={(e) => updateParam("search", e.target.value)}
          placeholder="Search by product or maker..."
          className="mt-1 w-full rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>

      <div className="flex flex-wrap items-end gap-2 sm:w-[260px]">
        <div className="min-w-[160px] flex-1">
          <label
            htmlFor="products-cause"
            className="block text-xs font-medium text-gray-500 dark:text-gray-400"
          >
            Shop by cause
          </label>
          <select
            id="products-cause"
            value={causeTag}
            onChange={(e) => updateParam("causeTag", e.target.value)}
            className="mt-1 w-full rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="">All causes</option>
            {TAG_KEYS.map((key) => (
              <option key={key} value={key}>
                {CAUSE_LABELS[key as TagKey]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
