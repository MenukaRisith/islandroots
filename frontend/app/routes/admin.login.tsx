// app/routes/admin.login.tsx

import type { MetaFunction } from "@remix-run/node";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "@remix-run/react";
import { ROUTES } from "~/config/constants";
import { AppLayout } from "~/components/layout/AppLayout";
import { Button } from "~/components/ui/Button";
import { useAuth } from "~/hooks/useAuth";

export const meta: MetaFunction = () => [
  { title: "Admin Login – IslandRoots Market" },
  {
    name: "description",
    content: "Secure login page for IslandRoots Market administration.",
  },
];

interface State {
  email: string;
  password: string;
  submitting: boolean;
  error?: string;
}

export default function AdminLoginRoute() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isAdmin } = useAuth();
  const [state, setState] = useState<State>({
    email: "",
    password: "",
    submitting: false,
  });

  // If already logged in and admin → instant redirect
  if (isAuthenticated && isAdmin) {
    navigate(ROUTES.ADMIN_HOME, { replace: true });
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!state.email.trim() || !state.password.trim()) {
      setState((prev) => ({
        ...prev,
        error: "Email and password are required.",
      }));
      return;
    }

    setState((prev) => ({ ...prev, submitting: true, error: undefined }));

    try {
      await login?.({
        email: state.email,
        password: state.password,
      });

      navigate(ROUTES.ADMIN_HOME, { replace: true });
    } catch {
      setState((prev) => ({
        ...prev,
        submitting: false,
        error: "Incorrect email or password.",
      }));
      return;
    }
  };

  return (
    <AppLayout>
      <section className="mx-auto max-w-md space-y-5 rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
            Admin Login
          </h1>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Restricted access — authorized users only
          </p>
        </div>

        <form className="space-y-4 text-xs" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="admin-login-email"
              className="block text-[0.7rem] font-medium text-gray-600 dark:text-gray-300"
            >
              Email
            </label>
            <input
              id="admin-login-email"
              type="email"
              value={state.email}
              onChange={(e) =>
                setState((prev) => ({ ...prev, email: e.target.value }))
              }
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="admin-login-password"
              className="block text-[0.7rem] font-medium text-gray-600 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="admin-login-password"
              type="password"
              value={state.password}
              onChange={(e) =>
                setState((prev) => ({ ...prev, password: e.target.value }))
              }
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              placeholder="••••••••"
            />
          </div>

          {state.error && (
            <p className="text-[0.7rem] text-rose-500">{state.error}</p>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={state.submitting}
            className="w-full justify-center"
          >
            {state.submitting ? (
              <>
                <i className="fa-solid fa-spinner mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <i className="fa-solid fa-shield-halved mr-2" />
                Login as Admin
              </>
            )}
          </Button>
        </form>

        <p className="text-center text-[0.65rem] text-gray-500 dark:text-gray-400">
          Not a staff member?{" "}
          <Link
            to={ROUTES.HOME}
            className="text-emerald-600 hover:underline dark:text-emerald-400"
          >
            Return to site
          </Link>
        </p>
      </section>
    </AppLayout>
  );
}
