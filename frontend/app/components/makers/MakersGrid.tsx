import type { Vendor } from "~/types/domain";
import { MakerCard } from "./MakerCard";

interface MakersGridProps {
  makers: Vendor[];
}

export function MakersGrid({ makers }: MakersGridProps) {
  if (makers.length === 0) {
    return (
      <p className="rounded-3xl bg-white p-4 text-sm text-gray-500 shadow-sm dark:bg-gray-900 dark:text-gray-400">
        We&apos;re still onboarding makers. Check back soon as we add more
        stories from across Sri Lanka. 💚
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {makers.map((maker) => (
        <MakerCard key={maker.id} maker={maker} />
      ))}
    </div>
  );
}
