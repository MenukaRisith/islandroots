import type { MetaFunction } from "@remix-run/node";
import { AppLayout } from "~/components/layout/AppLayout";
import { AdminLayout } from "~/components/admin/AdminLayout";
import { ProductForm } from "~/components/admin/ProductForm";
import type { ProductFormValues } from "~/components/admin/ProductForm";

export const meta: MetaFunction = () => [
  { title: "Admin – New Product | IslandRoots Market" },
  {
    name: "description",
    content:
      "Create a new product for IslandRoots Market and link it to Sri Lankan makers and impact causes.",
  },
];

const defaultInitialValues: Partial<ProductFormValues> = {
  name: "",
  category: "",
  description: "",
  price: "",
  currency: "LKR",
  stock: "",
  mainImage: "",
  galleryImages: "",
  vendorId: "",
  tags: [],
  isFeatured: false,
};

export default function AdminProductsNewRoute() {
  return (
    <AppLayout>
      <AdminLayout>
        <section className="space-y-4">
          <ProductForm mode="create" initialValues={defaultInitialValues} />
        </section>
      </AdminLayout>
    </AppLayout>
  );
}
