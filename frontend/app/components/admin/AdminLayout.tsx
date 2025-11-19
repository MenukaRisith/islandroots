import type { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] border border-gray-200/70 bg-gray-50/60 shadow-sm dark:border-gray-800 dark:bg-[#05050B]">
      <AdminSidebar />
      <main className="flex-1 overflow-auto px-4 py-4 sm:px-6 sm:py-5">
        {children}
      </main>
    </div>
  );
}
