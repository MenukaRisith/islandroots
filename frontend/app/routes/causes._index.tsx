import type { MetaFunction } from "@remix-run/node";
import { AppLayout } from "~/components/layout/AppLayout";
import { CauseHero } from "~/components/causes/CauseHero";
import { CauseGrid } from "~/components/causes/CauseGrid";

export const meta: MetaFunction = () => [
  { title: "Shop by Cause – IslandRoots Market" },
  {
    name: "description",
    content:
      "Browse products by impact causes such as women-led, zero-waste, student creators and more.",
  },
];

export default function CausesIndexRoute() {
  return (
    <AppLayout>
      <section className="space-y-4">
        <CauseHero />
        <CauseGrid />
      </section>
    </AppLayout>
  );
}
