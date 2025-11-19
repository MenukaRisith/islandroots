import { NavLink } from "@remix-run/react";
import { ROUTES } from "~/config/constants";

export function AdminSidebar() {
  return (
    <aside className="hidden w-52 flex-shrink-0 border-r border-gray-200 bg-white/80 px-3 py-4 text-xs dark:border-gray-800 dark:bg-[#080814]/80 md:block">
      <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
        Admin
      </p>
      <nav className="space-y-1">
        <AdminLink
          to={ROUTES.ADMIN_HOME}
          icon="fa-solid fa-gauge"
          label="Overview"
        />
        <AdminLink
          to={ROUTES.ADMIN_PRODUCTS}
          icon="fa-solid fa-bag-shopping"
          label="Products"
        />
        <AdminLink
          to={ROUTES.ADMIN_ORDERS}
          icon="fa-solid fa-receipt"
          label="Orders"
        />
        <AdminLink
          to={ROUTES.ADMIN_VENDORS}
          icon="fa-solid fa-people-group"
          label="Makers"
        />
      </nav>
    </aside>
  );
}

interface AdminLinkProps {
  to: string;
  icon: string;
  label: string;
}

function AdminLink({ to, icon, label }: AdminLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "flex items-center gap-2 rounded-xl px-2 py-2 transition-colors",
          isActive
            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200"
            : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
        ].join(" ")
      }
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gray-100 text-[0.75rem] dark:bg-gray-900">
        <i className={icon} />
      </span>
      <span className="text-[0.8rem] font-medium">{label}</span>
    </NavLink>
  );
}
