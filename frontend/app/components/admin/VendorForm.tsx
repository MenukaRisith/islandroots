import { useState } from "react";
import { Button } from "~/components/ui/Button";
import {
  TAG_KEYS,
  CAUSE_LABELS,
  type TagKey,
} from "~/config/constants";
import { apiClientRequest } from "~/utils/api.client";

export type VendorFormMode = "create" | "edit";

export interface VendorFormValues {
  name: string;
  slug: string;
  locationDistrict: string;
  story: string;
  avatarUrl: string;
  contactPhone: string;
  contactEmail: string;
  instagram: string;
  tiktok: string;
  tags: TagKey[];
}

const defaultValues: VendorFormValues = {
  name: "",
  slug: "",
  locationDistrict: "",
  story: "",
  avatarUrl: "",
  contactPhone: "",
  contactEmail: "",
  instagram: "",
  tiktok: "",
  tags: [],
};

interface VendorFormProps {
  mode: VendorFormMode;
  vendorId?: string;
  initialValues?: Partial<VendorFormValues>;
}

interface VendorFormState {
  values: VendorFormValues;
  errors: Partial<Record<keyof VendorFormValues, string>>;
  submitting: boolean;
  submitError?: string;
  submitSuccess?: string;
}

export interface AdminVendorApi {
  id: string;
  name: string;
  slug: string;
  locationDistrict?: string | null;
  story?: string | null;
  avatarUrl?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export function VendorForm({ mode, vendorId, initialValues }: VendorFormProps) {
  const [state, setState] = useState<VendorFormState>(() => ({
    values: { ...defaultValues, ...initialValues },
    errors: {},
    submitting: false,
  }));

  const handleChange = <K extends keyof VendorFormValues>(
    field: K,
    value: VendorFormValues[K]
  ) => {
    setState((prev) => ({
      ...prev,
      values: { ...prev.values, [field]: value },
      errors: { ...prev.errors, [field]: undefined },
      submitError: undefined,
      submitSuccess: undefined,
    }));
  };

  const toggleTag = (tag: TagKey) => {
    setState((prev) => {
      const exists = prev.values.tags.includes(tag);
      const tags = exists
        ? prev.values.tags.filter((t) => t !== tag)
        : [...prev.values.tags, tag];
      return {
        ...prev,
        values: { ...prev.values, tags },
        submitError: undefined,
        submitSuccess: undefined,
      };
    });
  };

  const validate = (values: VendorFormValues): VendorFormState["errors"] => {
    const errors: VendorFormState["errors"] = {};

    if (!values.name.trim()) {
      errors.name = "Name is required.";
    }
    if (!values.slug.trim()) {
      errors.slug = "Slug is required.";
    } else if (!/^[a-z0-9-]+$/.test(values.slug)) {
      errors.slug = "Use only lowercase letters, numbers and dashes.";
    }

    if (values.contactEmail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.contactEmail)) {
      errors.contactEmail = "Enter a valid email address.";
    }

    return errors;
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const errors = validate(state.values);
    const hasErrors = Object.values(errors).some(Boolean);

    if (hasErrors) {
      setState((prev) => ({
        ...prev,
        errors,
        submitError: "Please fix the highlighted fields.",
        submitSuccess: undefined,
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      submitting: true,
      submitError: undefined,
      submitSuccess: undefined,
    }));

    const body = {
      name: state.values.name.trim(),
      slug: state.values.slug.trim(),
      locationDistrict: state.values.locationDistrict.trim() || null,
      story: state.values.story.trim() || null,
      avatarUrl: state.values.avatarUrl.trim() || null,
      contactPhone: state.values.contactPhone.trim() || null,
      contactEmail: state.values.contactEmail.trim() || null,
      instagram: state.values.instagram.trim() || null,
      tiktok: state.values.tiktok.trim() || null,
      tags: state.values.tags,
    };

    try {
      if (mode === "create") {
        await apiClientRequest<AdminVendorApi>({
          path: "/vendors",
          method: "POST",
          body,
        });

        setState({
          values: defaultValues,
          errors: {},
          submitting: false,
          submitError: undefined,
          submitSuccess: "Maker created successfully.",
        });
      } else {
        if (!vendorId) {
          throw new Error("Missing vendorId for edit mode");
        }

        await apiClientRequest<AdminVendorApi>({
          path: `/vendors/${vendorId}`,
          method: "PUT",
          body,
        });

        setState((prev) => ({
          ...prev,
          submitting: false,
          submitError: undefined,
          submitSuccess: "Maker updated successfully.",
        }));
      }
    } catch (error) {
      console.error(error);
      setState((prev) => ({
        ...prev,
        submitting: false,
        submitError: "Something went wrong. Please try again.",
        submitSuccess: undefined,
      }));
    }
  };

  const title = mode === "create" ? "Add new maker" : "Edit maker";
  const subtitle =
    mode === "create"
      ? "Create a profile for a Sri Lankan small business or student creator."
      : "Update this maker’s profile and story.";

  return (
    <section className="space-y-4 rounded-3xl bg-white p-4 text-xs shadow-sm dark:bg-gray-900">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50 sm:text-base">
          {title}
        </h2>
        <p className="text-[0.7rem] text-gray-600 dark:text-gray-300">
          {subtitle}
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-4 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.4fr)]">
          {/* Left column */}
          <div className="space-y-3">
            {/* Name */}
            <div>
              <label
                htmlFor="vendor-name"
                className="block text-[0.7rem] font-medium text-gray-700 dark:text-gray-200"
              >
                Name
              </label>
              <input
                id="vendor-name"
                type="text"
                value={state.values.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={`mt-1 w-full rounded-xl border bg-gray-50 px-3 py-2 text-xs text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-gray-800 dark:text-gray-50 ${
                  state.errors.name
                    ? "border-rose-400"
                    : "border-gray-200 dark:border-gray-700"
                }`}
                placeholder="Eg: Ruhunu Weaving Collective"
              />
              {state.errors.name && (
                <p className="mt-1 text-[0.68rem] text-rose-500">
                  {state.errors.name}
                </p>
              )}
            </div>

            {/* Slug */}
            <div>
              <label
                htmlFor="vendor-slug"
                className="block text-[0.7rem] font-medium text-gray-700 dark:text-gray-200"
              >
                URL slug
              </label>
              <input
                id="vendor-slug"
                type="text"
                value={state.values.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
                className={`mt-1 w-full rounded-xl border bg-gray-50 px-3 py-2 text-xs text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-gray-800 dark:text-gray-50 ${
                  state.errors.slug
                    ? "border-rose-400"
                    : "border-gray-200 dark:border-gray-700"
                }`}
                placeholder="Eg: ruhunu-weaving"
              />
              <p className="mt-1 text-[0.65rem] text-gray-500 dark:text-gray-400">
                Used in URLs like{" "}
                <span className="font-mono text-[0.62rem]">
                  /makers/ruhunu-weaving
                </span>
              </p>
              {state.errors.slug && (
                <p className="mt-1 text-[0.68rem] text-rose-500">
                  {state.errors.slug}
                </p>
              )}
            </div>

            {/* District */}
            <div>
              <label
                htmlFor="vendor-district"
                className="block text-[0.7rem] font-medium text-gray-700 dark:text-gray-200"
              >
                District (optional)
              </label>
              <input
                id="vendor-district"
                type="text"
                value={state.values.locationDistrict}
                onChange={(e) =>
                  handleChange("locationDistrict", e.target.value)
                }
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
                placeholder="Eg: Hambantota"
              />
            </div>

            {/* Story */}
            <div>
              <label
                htmlFor="vendor-story"
                className="block text-[0.7rem] font-medium text-gray-700 dark:text-gray-200"
              >
                Story
              </label>
              <textarea
                id="vendor-story"
                rows={4}
                value={state.values.story}
                onChange={(e) => handleChange("story", e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
                placeholder="Share their mission, background, and how each purchase helps."
              />
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-3">
            {/* Avatar */}
            <div>
              <label
                htmlFor="vendor-avatar"
                className="block text-[0.7rem] font-medium text-gray-700 dark:text-gray-200"
              >
                Avatar image URL (optional)
              </label>
              <input
                id="vendor-avatar"
                type="url"
                value={state.values.avatarUrl}
                onChange={(e) => handleChange("avatarUrl", e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
                placeholder="https://..."
              />
              {state.values.avatarUrl && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-10 w-10 overflow-hidden rounded-full border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-900">
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <img
                      src={state.values.avatarUrl}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="text-[0.65rem] text-gray-500 dark:text-gray-400">
                    Preview of the maker&apos;s avatar
                  </p>
                </div>
              )}
            </div>

            {/* Contact */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="vendor-phone"
                  className="block text-[0.7rem] font-medium text-gray-700 dark:text-gray-200"
                >
                  Phone (optional)
                </label>
                <input
                  id="vendor-phone"
                  type="text"
                  value={state.values.contactPhone}
                  onChange={(e) =>
                    handleChange("contactPhone", e.target.value)
                  }
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
                  placeholder="+94..."
                />
              </div>
              <div>
                <label
                  htmlFor="vendor-email"
                  className="block text-[0.7rem] font-medium text-gray-700 dark:text-gray-200"
                >
                  Email (optional)
                </label>
                <input
                  id="vendor-email"
                  type="email"
                  value={state.values.contactEmail}
                  onChange={(e) =>
                    handleChange("contactEmail", e.target.value)
                  }
                  className={`mt-1 w-full rounded-xl border bg-gray-50 px-3 py-2 text-xs text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-gray-800 dark:text-gray-50 ${
                    state.errors.contactEmail
                      ? "border-rose-400"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                  placeholder="maker@example.com"
                />
                {state.errors.contactEmail && (
                  <p className="mt-1 text-[0.68rem] text-rose-500">
                    {state.errors.contactEmail}
                  </p>
                )}
              </div>
            </div>

            {/* Socials */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="vendor-instagram"
                  className="block text-[0.7rem] font-medium text-gray-700 dark:text-gray-200"
                >
                  Instagram (optional)
                </label>
                <input
                  id="vendor-instagram"
                  type="text"
                  value={state.values.instagram}
                  onChange={(e) => handleChange("instagram", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
                  placeholder="@islandroots_maker"
                />
              </div>
              <div>
                <label
                  htmlFor="vendor-tiktok"
                  className="block text-[0.7rem] font-medium text-gray-700 dark:text-gray-200"
                >
                  TikTok (optional)
                </label>
                <input
                  id="vendor-tiktok"
                  type="text"
                  value={state.values.tiktok}
                  onChange={(e) => handleChange("tiktok", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
                  placeholder="@islandroots_maker"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <p className="mb-1 text-[0.7rem] font-medium text-gray-700 dark:text-gray-200">
                Impact tags
              </p>
              <p className="mb-2 text-[0.65rem] text-gray-500 dark:text-gray-400">
                What causes does this maker represent?
              </p>
              <div className="flex flex-wrap gap-2">
                {TAG_KEYS.map((tag) => {
                  const selected = state.values.tags.includes(tag);
                  const label = CAUSE_LABELS[tag];
                  const inputId = `vendor-tag-${tag.toLowerCase()}`;
                  return (
                    <div key={tag} className="inline-flex items-center gap-1">
                      <input
                        id={inputId}
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleTag(tag)}
                        className="h-3 w-3 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <label
                        htmlFor={inputId}
                        className={`cursor-pointer rounded-full border px-2 py-0.5 text-[0.65rem] ${
                          selected
                            ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-400 dark:bg-emerald-900/40 dark:text-emerald-100"
                            : "border-gray-200 bg-white text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                        }`}
                      >
                        {label}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {state.submitError && (
          <p className="text-[0.7rem] text-rose-500">{state.submitError}</p>
        )}
        {state.submitSuccess && (
          <p className="text-[0.7rem] text-emerald-500">
            {state.submitSuccess}
          </p>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            disabled={state.submitting}
            className="inline-flex items-center px-4 py-2 text-xs"
          >
            {state.submitting ? (
              <>
                <i className="fa-solid fa-spinner mr-2 animate-spin" />
                Saving...
              </>
            ) : mode === "create" ? (
              <>
                <i className="fa-solid fa-check mr-2" />
                Create maker
              </>
            ) : (
              <>
                <i className="fa-solid fa-check mr-2" />
                Save changes
              </>
            )}
          </Button>
        </div>
      </form>
    </section>
  );
}
