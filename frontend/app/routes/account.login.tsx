// app/routes/account.login.tsx

import type { MetaFunction } from "@remix-run/node";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "@remix-run/react";
import { AppLayout } from "~/components/layout/AppLayout";
import { Button } from "~/components/ui/Button";
import { useAuth } from "~/hooks/useAuth";
import { ROUTES } from "~/config/constants";

export const meta: MetaFunction = () => [
  { title: "Sign in – IslandRoots Market" },
  {
    name: "description",
    content:
      "Sign in to view your soft checkout orders and wishlist on IslandRoots Market.",
  },
];

interface LoginState {
  email: string;
  password: string;
  submitting: boolean;
  error?: string;
}

export default function AccountLoginRoute() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const [state, setState] = useState<LoginState>({
    email: "",
    password: "",
    submitting: false,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (state.submitting) return;

    setState((prev) => ({
      ...prev,
      submitting: true,
      error: undefined,
    }));

    try {
        await login?.({
            email: state.email,
            password: state.password,
        });
      // If already authenticated or login succeeded, go to account home
      if (isAuthenticated) {
        navigate(ROUTES.ACCOUNT_HOME, { replace: true });
      } else {
        // Fallback: still redirect; context should refresh on next render
        navigate(ROUTES.ACCOUNT_HOME, { replace: true });
      }
    } catch (error) {
      console.error(error);
      setState((prev) => ({
        ...prev,
        submitting: false,
        error: "Invalid email or password. Please try again.",
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      submitting: false,
    }));
  };

  return (
    <AppLayout>
      <section className="mx-auto max-w-md space-y-5 rounded-3xl bg-white p-5 text-xs shadow-sm dark:bg-gray-900">
        <div className="space-y-1 text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30">
            <i className="fa-regular fa-user text-base" />
          </div>
          <h1 className="text-sm font-semibold text-gray-900 dark:text-gray-50 sm:text-base">
            Sign in to IslandRoots
          </h1>
          <p className="text-[0.7rem] text-gray-500 dark:text-gray-400">
            View your soft checkout requests, wishlist and account details.
          </p>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div>
            <label
              htmlFor="login-email"
              className="mb-1 block text-[0.7rem] font-medium text-gray-700 dark:text-gray-200"
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={state.email}
              onChange={(e) =>
                setState((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="login-password"
              className="mb-1 block text-[0.7rem] font-medium text-gray-700 dark:text-gray-200"
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={state.password}
              onChange={(e) =>
                setState((prev) => ({ ...prev, password: e.target.value }))
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Error */}
          {state.error && (
            <p className="text-[0.7rem] text-rose-500">{state.error}</p>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={state.submitting}
            className="mt-1 w-full justify-center"
          >
            {state.submitting ? (
              <>
                <i className="fa-solid fa-spinner mr-2 animate-spin" />
                Signing in…
              </>
            ) : (
              <>
                <i className="fa-regular fa-paper-plane mr-2" />
                Sign in
              </>
            )}
          </Button>
        </form>

        <p className="text-center text-[0.7rem] text-gray-500 dark:text-gray-400">
          Don&apos;t have an account yet?{" "}
          <Link
            to={ROUTES.ACCOUNT_REGISTER}
            className="font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            Create one
          </Link>
          .
        </p>
      </section>
    </AppLayout>
  );
}
