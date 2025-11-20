// app/routes/logout.tsx

import type { MetaFunction } from "@remix-run/node";
import { useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import { AppLayout } from "~/components/layout/AppLayout";
import { useAuth } from "~/hooks/useAuth";
import { ROUTES } from "~/config/constants";

export const meta: MetaFunction = () => [
  { title: "Signing out – IslandRoots Market" },
];

export default function LogoutRoute() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Clear auth + redirect
    logout?.();
    navigate(ROUTES.HOME, { replace: true });
  }, [logout, navigate]);

  return (
    <AppLayout>
      <section className="flex min-h-[50vh] flex-col items-center justify-center text-center text-xs">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-300">
          <i className="fa-solid fa-right-from-bracket text-sm" />
        </div>
        <h1 className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-50">
          Signing you out…
        </h1>
        <p className="max-w-xs text-[0.7rem] text-gray-500 dark:text-gray-400">
          You&apos;ll be redirected to the home page in a moment.
        </p>
      </section>
    </AppLayout>
  );
}
