// app/root.tsx

import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from "@remix-run/react";
import type { ReactNode } from "react";

import "./tailwind.css";
import { getServerEnv } from "~/config/env.server";
import { AuthProvider } from "~/context/AuthContext";
import { CartProvider } from "~/context/CartContext";
import { WishlistProvider } from "~/context/WishlistContext";

export const meta: MetaFunction = () => [
  { title: "IslandRoots Market – Support Local, Shop Smart" },
  {
    name: "description",
    content:
      "IslandRoots Market connects Sri Lankan small businesses and student creators with buyers who value eco-friendly, story-driven products.",
  },
];

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Outfit:wght@100..900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

type LoaderData = {
  ENV: {
    PUBLIC_API_BASE_URL: string;
  };
};

export async function loader() {
  const { API_BASE_URL } = getServerEnv();

  return json<LoaderData>({
    ENV: {
      PUBLIC_API_BASE_URL: API_BASE_URL,
    },
  });
}

export function Layout({ children }: { children: ReactNode }) {
  const data = useRouteLoaderData<typeof loader>("root") as LoaderData | undefined;

  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <Meta />
        <Links />

        {data?.ENV && (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.ENV = ${JSON.stringify(data.ENV)};`,
            }}
          />
        )}

        {/* FontAwesome */}
        <script
          src="https://kit.fontawesome.com/f966c5c9b1.js"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="bg-gray-100 dark:bg-[#0D0D14] text-gray-900 dark:text-gray-100">
        <div className="flex min-h-screen flex-col">
          <main className="flex-grow">{children}</main>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Outlet />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
