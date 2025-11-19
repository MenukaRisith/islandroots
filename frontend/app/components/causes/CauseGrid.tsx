import { TAG_KEYS } from "~/config/constants";
import type { TagKey } from "~/config/constants";
import { CauseCard } from "./CauseCard";

export function CauseGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {TAG_KEYS.map((tag) => (
        <CauseCard key={tag} tagKey={tag as TagKey} />
      ))}
    </div>
  );
}
