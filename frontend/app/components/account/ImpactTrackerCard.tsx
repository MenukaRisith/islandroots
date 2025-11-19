import type { TagKey } from "~/config/constants";
import { CAUSE_LABELS } from "~/config/constants";

export interface ImpactStats {
  totalOrders: number;
  totalItems: number;
  byTag: Partial<Record<TagKey, number>>;
}

interface ImpactTrackerCardProps {
  stats: ImpactStats;
}

export function ImpactTrackerCard({ stats }: ImpactTrackerCardProps) {
  const { totalOrders, totalItems, byTag } = stats;

  const totalTagImpacts = Object.values(byTag).reduce(
    (sum, val) => sum + (val ?? 0),
    0
  );

  const hasImpact = totalOrders > 0 || totalTagImpacts > 0;

  const tagEntries = (Object.entries(byTag) as [TagKey, number | undefined][])
    .filter(([, count]) => (count ?? 0) > 0)
    .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
    .slice(0, 4);

  return (
    <section className="space-y-3 rounded-3xl bg-white p-4 shadow-sm dark:bg-gray-900">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300">
            Impact tracker
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-300 sm:text-sm">
            See how your orders have supported different causes on IslandRoots.
          </p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-200">
          <i className="fa-solid fa-seedling text-sm" />
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        <SummaryStat
          label="Orders placed"
          value={totalOrders}
          helper="Each order is manually confirmed via phone / WhatsApp."
        />
        <SummaryStat
          label="Items requested"
          value={totalItems}
          helper="Across all your order requests so far."
        />
        <SummaryStat
          label="Impact causes touched"
          value={tagEntries.length}
          helper="Unique causes your orders have supported."
        />
      </div>

      {/* Cause chips */}
      {hasImpact ? (
        <div className="space-y-2">
          <p className="text-[0.7rem] font-semibold text-gray-700 dark:text-gray-200">
            Causes you’ve supported
          </p>
          <div className="flex flex-wrap gap-2">
            {tagEntries.map(([tag, count]) => (
              <CauseChip key={tag} tag={tag} count={count ?? 0} />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-[0.7rem] text-gray-500 dark:text-gray-400">
          You haven&apos;t placed any orders yet. Once you send your first
          order request, we&apos;ll show how it supports different IslandRoots
          causes here. 💚
        </p>
      )}

      {/* Hint */}
      <p className="text-[0.65rem] text-gray-400 dark:text-gray-500">
        Note: This tracker is based on the impact tags attached to products
        you’ve ordered, such as{" "}
        <span className="font-medium">Women-led</span>,{" "}
        <span className="font-medium">Zero-Waste</span>, and{" "}
        <span className="font-medium">Student Creators</span>.
      </p>
    </section>
  );
}

interface SummaryStatProps {
  label: string;
  value: number;
  helper: string;
}

function SummaryStat({ label, value, helper }: SummaryStatProps) {
  return (
    <div className="space-y-1 rounded-2xl bg-gray-50 p-3 text-[0.7rem] text-gray-700 dark:bg-gray-900/70 dark:text-gray-200">
      <p className="text-[0.7rem] text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="text-lg font-semibold text-gray-900 dark:text-gray-50">
        {value}
      </p>
      <p className="text-[0.65rem] text-gray-500 dark:text-gray-400">
        {helper}
      </p>
    </div>
  );
}

interface CauseChipProps {
  tag: TagKey;
  count: number;
}

function CauseChip({ tag, count }: CauseChipProps) {
  const label = CAUSE_LABELS[tag];

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[0.7rem] text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-50">
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-[0.65rem]">
        <i className="fa-solid fa-heart" aria-hidden="true" />
      </span>
      <span className="font-medium">{label}</span>
      <span className="text-[0.65rem] opacity-80">
        {count} item{count === 1 ? "" : "s"}
      </span>
    </div>
  );
}
