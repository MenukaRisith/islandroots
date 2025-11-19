// app/routes/wishlist._index.tsx

import type { MetaFunction } from "@remix-run/node";
import { AppLayout } from "~/components/layout/AppLayout";
import { WishlistEmptyState } from "~/components/wishlist/WishlistEmptyState";
import { WishlistItemCard } from "~/components/wishlist/WishlistItemCard";
import { useWishlist } from "~/hooks/useWishlist";

export const meta: MetaFunction = () => [
  { title: "Wishlist – IslandRoots Market" },
  {
    name: "description",
    content:
      "Save your favourite eco-friendly products from Sri Lankan makers and student creators.",
  },
];

export default function WishlistIndex() {
  const { items, totalItems } = useWishlist();

  return (
    <AppLayout>
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
              Wishlist
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {totalItems === 0
                ? "You haven't added any products yet."
                : `You have ${totalItems} product${
                    totalItems === 1 ? "" : "s"
                  } saved for later.`}
            </p>
          </div>
        </div>

        {totalItems === 0 ? (
          <WishlistEmptyState />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((item) => (
              <WishlistItemCard key={item.productId} item={item} />
            ))}
          </div>
        )}
      </section>
    </AppLayout>
  );
}
