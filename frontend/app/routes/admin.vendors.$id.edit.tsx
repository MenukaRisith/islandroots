import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { AppLayout } from "~/components/layout/AppLayout";
import { AdminLayout } from "~/components/admin/AdminLayout";
import {
  VendorForm,
  type VendorFormValues,
  type AdminVendorApi,
} from "~/components/admin/VendorForm";
import { apiRequest } from "~/utils/api.server";
import { TAG_KEYS, type TagKey } from "~/config/constants";

interface AdminVendorEditLoaderData {
  vendorId: string;
  initialValues: Partial<VendorFormValues>;
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [
      { title: "Admin – Edit Maker | IslandRoots Market" },
      {
        name: "description",
        content: "Edit maker details for IslandRoots Market.",
      },
    ];
  }

  return [
    {
      title: `Admin – Edit Maker ${data.vendorId} | IslandRoots Market`,
    },
    {
      name: "description",
      content:
        "Update maker profile, story and impact tags for IslandRoots Market.",
    },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const idParam = params.id;

  if (!idParam) {
    throw new Response("Not found", { status: 404 });
  }

  const vendorId = idParam.toString();

  let vendor: AdminVendorApi;
  try {
    vendor = await apiRequest<AdminVendorApi>({
      path: `/vendors/${vendorId}`,
      method: "GET",
    });
  } catch {
    throw new Response("Not found", { status: 404 });
  }

  const initialValues: Partial<VendorFormValues> = {
    name: vendor.name,
    slug: vendor.slug,
    locationDistrict: vendor.locationDistrict ?? "",
    story: vendor.story ?? "",
    avatarUrl: vendor.avatarUrl ?? "",
    contactPhone: vendor.contactPhone ?? "",
    contactEmail: vendor.contactEmail ?? "",
    instagram: vendor.instagram ?? "",
    tiktok: vendor.tiktok ?? "",
    tags: vendor.tags
      .filter((t) => TAG_KEYS.includes(t as TagKey))
      .map((t) => t as TagKey),
  };

  return json<AdminVendorEditLoaderData>({
    vendorId,
    initialValues,
  });
}

export default function AdminVendorEditRoute() {
  const { vendorId, initialValues } =
    useLoaderData<AdminVendorEditLoaderData>();

  return (
    <AppLayout>
      <AdminLayout>
        <section className="space-y-4">
          <VendorForm
            mode="edit"
            vendorId={vendorId}
            initialValues={initialValues}
          />
        </section>
      </AdminLayout>
    </AppLayout>
  );
}
