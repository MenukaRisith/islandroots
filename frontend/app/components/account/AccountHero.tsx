interface AccountHeroProps {
  userName?: string | null;
}

export function AccountHero({ userName }: AccountHeroProps) {
  return (
    <section className="space-y-2">
      <div className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-[0.7rem] font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-200">
        <i className="fa-regular fa-user mr-2 text-[0.75rem]" />
        Your IslandRoots account
      </div>
      <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50 sm:text-2xl">
        Hi {userName || "there"}, here’s your impact.
      </h1>
      <p className="max-w-xl text-xs text-gray-600 dark:text-gray-300 sm:text-sm">
        Track how your orders support Sri Lankan makers, see causes you’ve
        backed, and manage your activity on IslandRoots Market.
      </p>
    </section>
  );
}
