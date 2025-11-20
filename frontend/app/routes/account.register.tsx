// app/routes/account.register.tsx

import type { MetaFunction } from "@remix-run/node";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "@remix-run/react";
import { AppLayout } from "~/components/layout/AppLayout";
import { Button } from "~/components/ui/Button";
import { ROUTES } from "~/config/constants";
import { apiClientRequest } from "~/utils/api.client";

export const meta: MetaFunction = () => [
  { title: "Create account – IslandRoots Market" },
  {
    name: "description",
    content:
      "Create an IslandRoots Market account to track your soft checkout orders and wishlist.",
  },
];

interface RegisterState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  submitting: boolean;
  error?: string;
  success?: string;
}

export default function AccountRegisterRoute() {
  const navigate = useNavigate();
  const [state, setState] = useState<RegisterState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    submitting: false,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (state.submitting) return;

    if (state.password !== state.confirmPassword) {
      setState((prev) => ({
        ...prev,
        error: "Passwords do not match.",
        success: undefined,
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      submitting: true,
      error: undefined,
      success: undefined,
    }));

    try {
      await apiClientRequest<unknown>({
        path: "/auth/register",
        method: "POST",
        body: {
          name: state.name,
          email: state.email,
          password: state.password,
        },
      });

      setState((prev) => ({
        ...prev,
        submitting: false,
        success: "Account created successfully. You can now sign in.",
      }));

      // Small delay then redirect to login
      setTimeout(() => {
        navigate(ROUTES.ACCOUNT_LOGIN);
      }, 800);
    } catch (error) {
      console.error(error);
      setState((prev) => ({
        ...prev,
        submitting: false,
        error:
          "Could not create your account. Please check your details or try again.",
        success: undefined,
      }));
    }
  };

  return (
    <AppLayout>
      <section className="mx-auto max-w-md space-y-5 rounded-3xl bg-white p-5 text-xs shadow-sm dark:bg-gray-900">
        <div className="space-y-1 text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30">
            <i className="fa-regular fa-id-card text-base" />
          </div>
          <h1 className="text-sm font-semibold text-gray-900 dark:text-gray-50 sm:text-base">
            Create an IslandRoots account
          </h1>
          <p className="text-[0.7rem] text-gray-500 dark:text-gray-400">
            Save your wishlist and track your soft checkout order requests.
          </p>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div>
            <label
              htmlFor="register-name"
              className="mb-1 block text-[0.7rem] font-medium text-gray-700 dark:text-gray-200"
            >
              Full name
            </label>
            <input
              id="register-name"
              type="text"
              value={state.name}
              onChange={(e) =>
                setState((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
              placeholder="Eg: Nimal Perera"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="register-email"
              className="mb-1 block text-[0.7rem] font-medium text-gray-700 dark:text-gray-200"
            >
              Email
            </label>
            <input
              id="register-email"
              type="email"
              value={state.email}
              onChange={(e) =>
                setState((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Passwords */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="register-password"
                className="mb-1 block text-[0.7rem] font-medium text-gray-700 dark:text-gray-200"
              >
                Password
              </label>
              <input
                id="register-password"
                type="password"
                value={state.password}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, password: e.target.value }))
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label
                htmlFor="register-password-confirm"
                className="mb-1 block text-[0.7rem] font-medium text-gray-700 dark:text-gray-200"
              >
                Confirm password
              </label>
              <input
                id="register-password-confirm"
                type="password"
                value={state.confirmPassword}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Messages */}
          {state.error && (
            <p className="text-[0.7rem] text-rose-500">{state.error}</p>
          )}
          {state.success && (
            <p className="text-[0.7rem] text-emerald-500">{state.success}</p>
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
                Creating account…
              </>
            ) : (
              <>
                <i className="fa-solid fa-check mr-2" />
                Create account
              </>
            )}
          </Button>
        </form>

        <p className="text-center text-[0.7rem] text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to={ROUTES.ACCOUNT_LOGIN}
            className="font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            Sign in
          </Link>
          .
        </p>
      </section>
    </AppLayout>
  );
}
