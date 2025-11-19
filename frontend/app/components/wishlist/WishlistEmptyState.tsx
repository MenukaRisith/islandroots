import { Link } from "@remix-run/react";
import { ROUTES } from "~/config/constants";
import { Button } from "~/components/ui/Button";

export function WishlistEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-8 text-center shadow-sm dark:bg-gray-900">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500 dark:bg-rose-900/40 dark:text-rose-200">
        <i className="fa-regular fa-heart text-xl" />
      </div>
      <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50 sm:text-base">
        Your wishlist is empty
      </h2>
      <p className="mt-1 max-w-xs text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
        Save handmade, eco-friendly products you love and come back when
        you&apos;re ready to support local creators.
      </p>
      <div className="mt-4">
        <Link to={ROUTES.PRODUCTS}>
          <Button variant="primary">
            <i className="fa-solid fa-compass mr-2 text-xs" />
            Start exploring
          </Button>
        </Link>
      </div>
    </div>
  );
}
