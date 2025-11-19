// app/components/products/ImpactBadges.tsx

import { CAUSE_LABELS } from "~/config/constants";
import type { TagKey } from "~/config/constants";

interface ImpactBadgesProps {
  tags: TagKey[];
  className?: string;
  size?: "sm" | "md";
}

export function ImpactBadges({
  tags,
  className = "",
  size = "sm",
}: ImpactBadgesProps) {
  if (tags.length === 0) return null;

  const base =
    "inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-200";
  const sizeClass =
    size === "sm"
      ? "px-2.5 py-0.5 text-[0.65rem]"
      : "px-3 py-1 text-[0.7rem]";

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {tags.map((tag) => (
        <span key={tag} className={`${base} ${sizeClass}`}>
          <i className="fa-solid fa-leaf mr-1 text-[0.6rem]" aria-hidden="true" />
          {CAUSE_LABELS[tag]}
        </span>
      ))}
    </div>
  );
}
