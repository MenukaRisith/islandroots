// app/routes/account.wishlist_index.tsx

import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { AppLayout } from "~/components/layout/AppLayout";
import { ROUTES, CAUSE_LABELS, TAG_KEYS, type TagKey } from "~/config/constants";
import { useWishlist } from "~/hooks/useWishlist";
import { useAuth } from "~/hooks/useAuth";
import type { WishlistItem } from "~/types/domain";

export const meta: MetaFunction = () => [
  { title: "My Wishlist – IslandRoots Market" },
  {
    name: "description",
    content:
      "View and manage your saved products on IslandRoots Market from your account.",
  },
];

export default function AccountWishlistIndexRoute() {
  const { items, removeFromWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const totalItems = items.length;

  return (
    <AppLayout>
      <section className="space-y-5">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
            My Wishlist
          </h1>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Products you&apos;ve saved for later. You can move them to your cart
            and send a soft checkout request whenever you&apos;re ready.
          </p>
        </div>

        {/* Auth helper */}
        {!isAuthenticated && (
          <div className="space-y-2 rounded-3xl bg-white p-4 text-xs shadow-sm dark:bg-gray-900">
            <p className="text-[0.75rem] text-gray-700 dark:text-gray-200">
              You&apos;re browsing as a guest. Your wishlist is only saved on
              this device.
            </p>
            <p className="text-[0.7rem] text-gray-500 dark:text-gray-400">
              Create an account or sign in if you want to keep your wishlist in
              sync across devices in the future.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                to={ROUTES.ACCOUNT_LOGIN}
                className="inline-flex items-center rounded-full bg-emerald-600 px-3 py-1.5 text-[0.75rem] font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 dark:ring-offset-gray-900"
              >
                <i className="fa-regular fa-user mr-2 text-[0.7rem]" />
                Sign in
              </Link>
              <Link
                to={ROUTES.ACCOUNT_REGISTER}
                className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1.5 text-[0.75rem] text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                <i className="fa-regular fa-id-card mr-2 text-[0.7rem]" />
                Create account
              </Link>
            </div>
          </div>
        )}

        {/* Empty state */}
        {totalItems === 0 ? (
          <div className="space-y-3 rounded-3xl bg-white p-4 text-xs shadow-sm dark:bg-gray-900">
            <p className="text-[0.75rem] font-medium text-gray-800 dark:text-gray-100">
              No saved items yet.
            </p>
            <p className="text-[0.7rem] text-gray-500 dark:text-gray-400">
              Tap the heart icon on any product to add it to your wishlist.
              We&apos;ll keep everything here so you can review and order later.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                to={ROUTES.PRODUCTS}
                className="inline-flex items-center rounded-full bg-emerald-600 px-3 py-1.5 text-[0.75rem] font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 dark:ring-offset-gray-900"
              >
                <i className="fa-solid fa-compass mr-2 text-[0.7rem]" />
                Discover products
              </Link>
              <Link
                to={ROUTES.WISHLIST}
                className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1.5 text-[0.75rem] text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                <i className="fa-regular fa-heart mr-2 text-[0.7rem]" />
                Open public wishlist view
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p className="text-[0.7rem] text-gray-500 dark:text-gray-400">
              You have{" "}
              <span className="font-semibold text-gray-800 dark:text-gray-100">
                {totalItems} item{totalItems === 1 ? "" : "s"}
              </span>{" "}
              saved in your wishlist.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <WishlistProductCard
                  key={item.productId}
                  item={item}
                  onRemove={removeFromWishlist}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </AppLayout>
  );
}

/* ---- Card component ---- */

interface WishlistProductCardProps {
  item: WishlistItem;
  onRemove: (productId: string | number) => void;
}

function WishlistProductCard({ item, onRemove }: WishlistProductCardProps) {
  const { product } = item;
  const mainImage = product.images?.[0];
  const price =
    typeof product.price === "number" ? product.price : undefined;
  const currency = product.currency ?? "LKR";

  const impactTags = product.tags
    ?.filter((t): t is TagKey => TAG_KEYS.includes(t as TagKey))
    .slice(0, 2);

  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white text-xs shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div className="relative h-40 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        {mainImage ? (
          // eslint-disable-next-line jsx-a11y/alt-text
          <img
            src={mainImage}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[0.7rem] text-gray-400">
            No image yet
          </div>
        )}

        <button
          type="button"
          onClick={() => onRemove(item.productId)}
          className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[0.8rem] text-rose-500 shadow-sm hover:bg-rose-50 dark:bg-gray-900/90 dark:hover:bg-gray-900"
          aria-label="Remove from wishlist"
        >
          <i className="fa-solid fa-heart-crack" />
        </button>

        {impactTags && impactTags.length > 0 && (
          <div className="pointer-events-none absolute left-2 top-2 flex flex-wrap gap-1">
            {impactTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-emerald-600/90 px-2 py-0.5 text-[0.6rem] text-white shadow-sm"
              >
                {CAUSE_LABELS[tag]}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 px-3 py-3">
        <Link
          to={ROUTES.PRODUCT_DETAIL(product.slug)}
          className="line-clamp-2 text-[0.8rem] font-semibold text-gray-900 hover:underline dark:text-gray-50"
        >
          {product.name}
        </Link>
        {product.description && (
          <p className="line-clamp-2 text-[0.7rem] text-gray-600 dark:text-gray-300">
            {product.description}
          </p>
        )}
        {price != null && (
          <p className="mt-1 text-[0.75rem] font-semibold text-emerald-600 dark:text-emerald-400">
            {price.toLocaleString("en-LK", {
              minimumFractionDigits: 2,
            })}{" "}
            <span className="text-[0.7rem] font-normal">{currency}</span>
          </p>
        )}
        <div className="mt-2 flex items-center justify-between text-[0.65rem] text-gray-500 dark:text-gray-400">
          <Link
            to={ROUTES.PRODUCT_DETAIL(product.slug)}
            className="inline-flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400"
          >
            <i className="fa-solid fa-arrow-right text-[0.6rem]" />
            View product
          </Link>
          <Link
            to={ROUTES.PRODUCTS}
            className="inline-flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400"
          >
            <i className="fa-solid fa-bag-shopping text-[0.6rem]" />
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
