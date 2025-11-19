import type { Vendor } from "~/types/domain";

interface MakerMiniCardProps {
  vendor?: Vendor | null;
}

export function MakerMiniCard({ vendor }: MakerMiniCardProps) {
  if (!vendor) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-3 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-900/40 dark:text-gray-400">
        This product is part of our IslandRoots community of Sri Lankan makers.
      </div>
    );
  }

  return (
    <div className="flex gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-3 text-xs shadow-sm dark:border-gray-800 dark:bg-gray-900/60">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-200">
        <i className="fa-regular fa-user text-sm" aria-hidden="true" />
      </div>
      <div className="space-y-0.5">
        <p className="text-[0.75rem] font-semibold text-gray-900 dark:text-gray-50">
          {vendor.name}
        </p>
        {vendor.locationDistrict && (
          <p className="text-[0.7rem] text-gray-500 dark:text-gray-400">
            Based in {vendor.locationDistrict}, Sri Lanka
          </p>
        )}
        {vendor.story && (
          <p className="text-[0.7rem] text-gray-500 dark:text-gray-400">
            {vendor.story.length > 120
              ? `${vendor.story.slice(0, 117)}...`
              : vendor.story}
          </p>
        )}
      </div>
    </div>
  );
}
