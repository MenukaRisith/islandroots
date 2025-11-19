import { Link } from "@remix-run/react";
import { ROUTES, CAUSE_LABELS } from "~/config/constants";
import type { TagKey } from "~/config/constants";

interface CauseCardProps {
  tagKey: TagKey;
}

const ICON_BY_TAG: Record<TagKey, string> = {
  WOMEN_LED: "fa-solid fa-venus",
  ZERO_WASTE: "fa-solid fa-recycle",
  STUDENT_CREATOR: "fa-solid fa-graduation-cap",
  LOCAL_FARMER: "fa-solid fa-seedling",
  HANDMADE: "fa-solid fa-hand-sparkles",
  RECYCLED_MATERIALS: "fa-solid fa-bottle-water",
};

const DESCRIPTION_BY_TAG: Record<TagKey, string> = {
  WOMEN_LED:
    "Support women-led microbusinesses and home-based entrepreneurs across Sri Lanka.",
  ZERO_WASTE:
    "Discover products designed to reduce waste, from reusable items to refills.",
  STUDENT_CREATOR:
    "Help students fund their education through creative products and services.",
  LOCAL_FARMER:
    "Back small-scale farmers by choosing locally grown or produced items.",
  HANDMADE:
    "Celebrate handcrafted items made with care, skill, and cultural heritage.",
  RECYCLED_MATERIALS:
    "Shop products that give new life to discarded or recycled materials.",
};

export function CauseCard({ tagKey }: CauseCardProps) {
  const label = CAUSE_LABELS[tagKey];
  const icon = ICON_BY_TAG[tagKey];
  const description = DESCRIPTION_BY_TAG[tagKey];

  return (
    <Link
      to={ROUTES.CAUSE_DETAIL(tagKey)}
      className="group flex flex-col justify-between rounded-3xl border border-gray-200 bg-white p-4 text-xs shadow-sm transition hover:-translate-y-1 hover:border-emerald-500 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[0.65rem] font-semibold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-200">
            <i className={`${icon} mr-1 text-[0.65rem]`} aria-hidden="true" />
            Impact cause
          </div>
          <h2 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-50 sm:text-base">
            {label}
          </h2>
          <p className="mt-1 text-[0.7rem] text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[0.7rem] text-gray-500 dark:text-gray-400">
          Browse products tagged with this cause.
        </span>
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 transition group-hover:bg-emerald-500 group-hover:text-white dark:bg-emerald-900/40 dark:text-emerald-200">
          <i className="fa-solid fa-arrow-right text-[0.7rem]" />
        </span>
      </div>
    </Link>
  );
}
