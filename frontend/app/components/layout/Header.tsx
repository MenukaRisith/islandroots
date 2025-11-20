import { Link, NavLink } from "@remix-run/react";
import { useMemo } from "react";
import { ROUTES } from "~/config/constants";
import { useCart } from "~/hooks/useCart";
import { useWishlist } from "~/hooks/useWishlist";
import { useAuth } from "~/hooks/useAuth";

export function Header() {
  const { totalQuantity } = useCart();
  const { totalItems } = useWishlist();
  const { isAuthenticated, isAdmin, user } = useAuth();

  const cartBadge = useMemo(
    () => (totalQuantity > 0 ? totalQuantity.toString() : ""),
    [totalQuantity]
  );

  const wishlistBadge = useMemo(
    () => (totalItems > 0 ? totalItems.toString() : ""),
    [totalItems]
  );

  const accountLinkTo = isAdmin ? ROUTES.ADMIN_HOME : ROUTES.ACCOUNT_HOME;

  return (
    <header className="border-b border-gray-200/60 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-[#080814]/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <div className="flex h-9 w-auto items-center justify-center overflow-hidden rounded-xl text-white shadow-md">
              <img
                src="/logo.png"
                alt="IslandRoots Market logo"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight sm:text-base">
                IslandRoots Market
              </span>
              <span className="hidden text-xs text-gray-500 dark:text-gray-400 sm:block">
                Support Local, Shop Smart
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-4 text-sm font-medium text-gray-600 dark:text-gray-300 md:flex">
          <NavItem to={ROUTES.HOME} label="Home" />
          <NavItem to={ROUTES.PRODUCTS} label="Products" />
          <NavItem to={ROUTES.CAUSES} label="Causes" />
          <NavItem to={ROUTES.MAKERS} label="Makers" />
          <NavItem to={ROUTES.QUIZ} label="Product Match Quiz" />

          <div className="ml-4 flex items-center gap-3">
            {/* Wishlist */}
            <Link
              to={ROUTES.WISHLIST}
              className="relative inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <i className="fa-regular fa-heart text-sm" />
              <span>Wishlist</span>
              {wishlistBadge && (
                <span className="ml-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-rose-500 px-1 text-[0.65rem] font-semibold text-white">
                  {wishlistBadge}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to={ROUTES.CART}
              className="relative inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-600"
            >
              <i className="fa-solid fa-bag-shopping text-sm" />
              <span>Cart</span>
              {cartBadge && (
                <span className="ml-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-white/90 px-1 text-[0.65rem] font-semibold text-emerald-700">
                  {cartBadge}
                </span>
              )}
            </Link>

            {/* Account */}
            {isAuthenticated ? (
              <Link
                to={accountLinkTo}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                <i className="fa-regular fa-user text-sm" />
                <span className="max-w-[120px] truncate">
                  {user?.name || (isAdmin ? "Admin dashboard" : "Account")}
                </span>
                {isAdmin && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[0.65rem] font-semibold text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
                    Admin
                  </span>
                )}
              </Link>
            ) : (
              <Link
                to={ROUTES.ACCOUNT_LOGIN}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                <i className="fa-regular fa-user text-sm" />
                <span>Sign in</span>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

interface NavItemProps {
  to: string;
  label: string;
}

function NavItem({ to, label }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "inline-flex items-center rounded-full px-3 py-1 transition-colors",
          isActive
            ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
            : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
        ].join(" ")
      }
    >
      {label}
    </NavLink>
  );
}
