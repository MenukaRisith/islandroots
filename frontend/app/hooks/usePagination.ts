// app/hooks/usePagination.ts

import { useMemo } from "react";

export interface PaginationOptions {
  page: number;
  pageSize: number;
  totalItems: number;
}

export interface PaginationResult {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
}

export function usePagination(options: PaginationOptions): PaginationResult {
  const { page, pageSize, totalItems } = options;

  return useMemo(() => {
    const safePageSize = pageSize > 0 ? pageSize : 1;
    const totalPages =
      totalItems <= 0 ? 1 : Math.max(1, Math.ceil(totalItems / safePageSize));

    const currentPage = Math.min(Math.max(page, 1), totalPages);

    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;

    const nextPage = hasNextPage ? currentPage + 1 : null;
    const previousPage = hasPreviousPage ? currentPage - 1 : null;

    return {
      page: currentPage,
      pageSize: safePageSize,
      totalItems,
      totalPages,
      hasNextPage,
      hasPreviousPage,
      nextPage,
      previousPage,
    };
  }, [page, pageSize, totalItems]);
}
