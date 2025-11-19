// app/routes/_index.tsx
import * as React from "react";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  LinksFunction,
} from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { createCookie, json, redirect } from "@remix-run/node";

/* --------------------------- Fonts (Poppins) --------------------------- */
export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href:
      "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap",
  },
];

/* ------------------------------ Cookie -------------------------------- */
export const languageCookie = createCookie("lang", {
  path: "/",
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 365, // 1 year
});

/* ------------------------------- Meta --------------------------------- */
export const meta: MetaFunction = () => ([
  { title: "Select Your Preferred Language — Kindra" },
  { name: "description", content: "Choose your preferred language to continue." },
]);

/* ------------------------------ Loader -------------------------------- */
export async function loader({ request }: LoaderFunctionArgs) {
  const lang = await languageCookie.parse(request.headers.get("Cookie"));
  if (lang) return redirect("/home");
  return json({ ok: true });
}

/* ------------------------------ Action -------------------------------- */
export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const language = String(form.get("language") || "").toLowerCase();
  if (language !== "en") {
    return json({ error: "Only English is available right now." }, { status: 400 });
  }
  return redirect("/home", {
    headers: { "Set-Cookie": await languageCookie.serialize(language) },
  });
}

/* -------------------------------- Icons ------------------------------- */
// eslint-disable-next-line react/prop-types
const Heart = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
    <path d="M12 21s-7.5-4.35-9.75-8.4C.53 9.76 2.14 6 5.73 6 8 6 9.4 7.42 12 10c2.6-2.58 4-4 6.27-4 3.6 0 5.2 3.76 3.48 6.6C19.5 16.65 12 21 12 21z" />
  </svg>
);
// eslint-disable-next-line react/prop-types
const Globe = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor">
    <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
    <path d="M3 12h18M12 3c2.5 2.9 2.5 14.1 0 18M7 7c3.2 2.2 6.8 2.2 10 0" strokeWidth="1.5" />
  </svg>
);

/* ------------------------------- Page --------------------------------- */
export default function IndexPage() {
  const actionData = useActionData<typeof action>();
  const nav = useNavigation();
  const isSubmitting = nav.state !== "idle";

  // Build small set of staggered delays for cards
  const delays = ["0ms", "120ms", "240ms"];

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-rose-50 via-pink-50 to-rose-100"
      style={{
        fontFamily:
          "'Poppins', system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans', sans-serif",
      }}
    >
      {/* Inline CSS (pure CSS animations, no Framer Motion) */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatY {
          0% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0); }
        }
        @keyframes arrowSlideIn {
          from { opacity: 0; transform: translateX(-6px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 450ms ease-out both;
        }
        .animate-card-in {
          animation: fadeInUp 350ms ease-out both;
        }
        .animate-float {
          animation: floatY var(--float-duration, 6s) ease-in-out var(--float-delay, 0s) infinite;
          opacity: 0.35;
        }
        .animate-arrow {
          animation: arrowSlideIn 250ms ease-out both;
        }
        .will-change-transform {
          will-change: transform;
        }
        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-up,
          .animate-card-in,
          .animate-float,
          .animate-arrow {
            animation: none !important;
          }
        }
      `}</style>

      {/* Floating hearts background (z-index behind) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="absolute text-pink-300/40 animate-float will-change-transform"
            style={{
              top: `${8 + (i * 7) % 85}%`,
              left: `${6 + (i * 11) % 90}%`,
              // vary duration & delay a bit
              '--float-duration': `${6 + (i % 6) * 0.6}s`,
              '--float-delay': `${(i % 5) * 0.2}s`,
            } as React.CSSProperties}
          >
            <Heart className="h-6 w-6" />
          </span>
        ))}
      </div>

      {/* Mobile-width content */}
      <div className="relative z-10 w-full max-w-[420px] px-4 py-10">
        <header className="mb-8 text-center animate-fade-in-up">
          <h1 className="text-2xl font-semibold tracking-tight text-rose-700">
            Select Your Preferred Language
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            You can change this later in Settings.
          </p>
        </header>

        <Form method="post" replace className="space-y-5">
          {/* English (enabled) */}
          <div
            className="animate-card-in"
            style={{ animationDelay: delays[0] as React.CSSProperties['animationDelay'] }}
          >
            <button
              type="submit"
              name="language"
              value="en"
              disabled={isSubmitting}
              className="group w-full rounded-2xl border border-rose-100 bg-white px-5 py-5 text-left shadow-lg outline-none ring-rose-300 transition hover:shadow-xl focus:ring-2 active:scale-[0.99]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                  <Globe className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-lg font-semibold text-slate-900">English</p>
                  <p className="text-sm text-slate-600 group-hover:text-slate-700">
                    Continue in English
                  </p>
                </div>
                <span className="text-rose-500 group-hover:animate-arrow">→</span>
              </div>
            </button>
          </div>

          {/* Sinhala (disabled) */}
          <div
            className="animate-card-in"
            style={{ animationDelay: delays[1] as React.CSSProperties['animationDelay'] }}
          >
            <div
              className="w-full cursor-not-allowed rounded-2xl border border-rose-100 bg-white px-5 py-5 opacity-60 shadow-md"
              aria-disabled="true"
              title="Coming soon"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-400">
                  <Globe className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-lg font-semibold text-slate-700">Sinhala</p>
                  <p className="text-sm text-slate-600">Coming soon</p>
                </div>
                <span className="select-none rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-500">
                  Soon
                </span>
              </div>
            </div>
          </div>

          {/* Tamil (disabled) */}
          <div
            className="animate-card-in"
            style={{ animationDelay: delays[2] as React.CSSProperties['animationDelay'] }}
          >
            <div
              className="w-full cursor-not-allowed rounded-2xl border border-rose-100 bg-white px-5 py-5 opacity-60 shadow-md"
              aria-disabled="true"
              title="Coming soon"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-400">
                  <Globe className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-lg font-semibold text-slate-700">Tamil</p>
                  <p className="text-sm text-slate-600">Coming soon</p>
                </div>
                <span className="select-none rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-500">
                  Soon
                </span>
              </div>
            </div>
          </div>

          {actionData && "error" in actionData ? (
            <p className="animate-fade-in-up text-center text-sm font-medium text-rose-600">
              {actionData.error}
            </p>
          ) : null}
        </Form>

        <footer className="mt-8 text-center text-xs text-slate-500 animate-fade-in-up" style={{ animationDelay: "140ms" }}>
          © {new Date().getFullYear()} Kindra
        </footer>
      </div>
    </div>
  );
}
