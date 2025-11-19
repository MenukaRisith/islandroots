import { Link } from "@remix-run/react";

export function Footer() {
  return (
    <footer className="border-t border-gray-200/60 bg-white/80 py-4 text-xs text-gray-500 backdrop-blur dark:border-gray-800 dark:bg-[#080814]/80 dark:text-gray-400">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6 lg:px-8">
        <p>
          © {new Date().getFullYear()} IslandRoots Market. Built to support
          Sri Lankan creators.
        </p>
        <div className="flex items-center gap-4">
          <Link to="/about" className="hover:text-emerald-500">
            About
          </Link>
          <Link to="/contact" className="hover:text-emerald-500">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
