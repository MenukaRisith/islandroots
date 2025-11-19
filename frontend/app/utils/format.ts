import type { CurrencyCode } from "~/types/domain";

/**
 * Format currency amounts. Defaults to LKR with no decimals.
 */
export function formatCurrency(
  amount: number,
  currency: CurrencyCode = "LKR"
): string {
  if (Number.isNaN(amount)) return "–";

  if (currency === "LKR") {
    return `Rs ${amount.toLocaleString("en-LK", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  }

  return amount.toLocaleString("en-US", {
    style: "currency",
    currency,
  });
}

/**
 * Format a date string (ISO) into a nice human-readable format.
 */
export function formatDate(dateString: string): string {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "";

  return d.toLocaleDateString("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Truncate long text with ellipsis.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}
