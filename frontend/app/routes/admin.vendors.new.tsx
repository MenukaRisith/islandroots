import type { MetaFunction } from "@remix-run/node";
import { AppLayout } from "~/components/layout/AppLayout";
import { AdminLayout } from "~/components/admin/AdminLayout";
import { VendorForm } from "~/components/admin/VendorForm";

export const meta: MetaFunction = () => [
  { title: "Admin – New Maker | IslandRoots Market" },
  {
    name: "description",
    content:
      "Create a new maker profile for a Sri Lankan small business or student creator.",
  },
];

export default function AdminVendorsNewRoute() {
  return (
    <AppLayout>
      <AdminLayout>
        <section className="space-y-4">
          <VendorForm mode="create" />
        </section>
      </AdminLayout>
    </AppLayout>
  );
}
