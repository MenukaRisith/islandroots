import { Link } from "@remix-run/react";
import type { Vendor } from "~/types/domain";
import { ROUTES } from "~/config/constants";

interface MakerCardProps {
  maker: Vendor;
}

export function MakerCard({ maker }: MakerCardProps) {
  return (
    <Link
      to={ROUTES.MAKER_DETAIL(maker.slug)}
      className="group flex flex-col justify-between rounded-3xl border border-gray-200 bg-white p-4 text-xs shadow-sm transition hover:-translate-y-1 hover:border-emerald-500 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
          <i className="fa-regular fa-user text-sm" aria-hidden="true" />
        </div>
        <div className="space-y-0.5">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50">
            {maker.name}
          </h2>
          {maker.locationDistrict && (
            <p className="text-[0.7rem] text-gray-500 dark:text-gray-400">
              {maker.locationDistrict}, Sri Lanka
            </p>
          )}
          {maker.story && (
            <p className="text-[0.7rem] text-gray-500 dark:text-gray-400">
              {maker.story.length > 120
                ? `${maker.story.slice(0, 117)}...`
                : maker.story}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[0.7rem] text-gray-500 dark:text-gray-400">
          View maker story & products.
        </span>
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 transition group-hover:bg-emerald-500 group-hover:text-white dark:bg-emerald-900/40 dark:text-emerald-200">
          <i className="fa-solid fa-arrow-right text-[0.7rem]" />
        </span>
      </div>
    </Link>
  );
}
