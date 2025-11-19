import { useState } from "react";
import { TAG_KEYS, CAUSE_LABELS, type TagKey } from "~/config/constants";
import { Button } from "~/components/ui/Button";
import { apiClientRequest } from "~/utils/api.client";
import type { ApiProduct } from "~/types/api";

export type ProductFormMode = "create" | "edit";

export interface ProductFormValues {
  name: string;
  category: string;
  description: string;
  price: string; // numeric string
  currency: string;
  stock: string; // numeric string, can be empty
  mainImage: string;
  galleryImages: string; // comma or newline separated URLs
  vendorId: string;
  tags: TagKey[];
  isFeatured: boolean;
}

interface ProductFormProps {
  mode: ProductFormMode;
  productId?: string; // required for edit mode
  initialValues?: Partial<ProductFormValues>;
}

interface FormState {
  values: ProductFormValues;
  errors: Partial<Record<keyof ProductFormValues, string>>;
  submitting: boolean;
  submitError?: string;
  submitSuccess?: string;
}

const defaultValues: ProductFormValues = {
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

export function ProductForm({ mode, productId, initialValues }: ProductFormProps) {
  const [state, setState] = useState<FormState>(() => ({
    values: { ...defaultValues, ...initialValues },
    errors: {},
    submitting: false,
  }));

  const handleChange = <K extends keyof ProductFormValues>(
    field: K,
    value: ProductFormValues[K]
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

  const validate = (values: ProductFormValues): FormState["errors"] => {
    const errors: FormState["errors"] = {};

    if (!values.name.trim()) {
      errors.name = "Name is required.";
    }
    if (!values.category.trim()) {
      errors.category = "Category is required.";
    }
    if (!values.price.trim()) {
      errors.price = "Price is required.";
    } else if (Number.isNaN(Number(values.price))) {
      errors.price = "Price must be a number.";
    }

    if (!values.currency.trim()) {
      errors.currency = "Currency is required.";
    }

    if (values.stock && Number.isNaN(Number(values.stock))) {
      errors.stock = "Stock must be a number.";
    }

    if (!values.mainImage.trim()) {
      errors.mainImage = "Main image URL is required.";
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

    const images = [
      state.values.mainImage.trim(),
      ...state.values.galleryImages
        .split(/[\n,]/)
        .map((s) => s.trim())
        .filter(Boolean),
    ];

    const body = {
      name: state.values.name.trim(),
      category: state.values.category.trim(),
      description: state.values.description.trim(),
      price: Number(state.values.price),
      currency: state.values.currency.trim(),
      stock: state.values.stock ? Number(state.values.stock) : null,
      images,
      vendorId: state.values.vendorId.trim() || null,
      tags: state.values.tags,
      isFeatured: state.values.isFeatured,
    };

    try {
      if (mode === "create") {
        await apiClientRequest<ApiProduct>({
          path: "/products",
          method: "POST",
          body,
        });
        setState({
          values: defaultValues,
          errors: {},
          submitting: false,
          submitError: undefined,
          submitSuccess: "Product created successfully.",
        });
      } else {
        if (!productId) {
          throw new Error("Missing productId for edit mode");
        }

        await apiClientRequest<ApiProduct>({
          path: `/products/${productId}`,
          method: "PUT",
          body,
        });

        setState((prev) => ({
          ...prev,
          submitting: false,
          submitError: undefined,
          submitSuccess: "Product updated successfully.",
        }));
      }
    } catch (err) {
      console.error(err);
      setState((prev) => ({
        ...prev,
        submitting: false,
        submitError:
          "Something went wrong while saving the product. Please try again.",
        submitSuccess: undefined,
      }));
    }
  };

  const title = mode === "create" ? "Add new product" : "Edit product";
  const subtitle =
    mode === "create"
      ? "Publish a new product from a Sri Lankan maker, student or small business."
      : "Update details for this product. Changes will be reflected on the storefront.";

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
        <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
          {/* Left column: main details */}
          <div className="space-y-3">
            {/* Name */}
            <div>
              <label
                htmlFor="product-name"
                className="block text-[0.7rem] font-medium text-gray-700 dark:text-gray-200"
              >
                Product name
              </label>
              <input
                id="product-name"
                type="text"
                value={state.values.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={`mt-1 w-full rounded-xl border bg-gray-50 px-3 py-2 text-xs text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-gray-800 dark:text-gray-50 ${
                  state.errors.name
                    ? "border-rose-400"
                    : "border-gray-200 dark:border-gray-700"
                }`}
                placeholder="Eg: Handwoven Palmyrah Basket"
              />
              {state.errors.name && (
                <p className="mt-1 text-[0.68rem] text-rose-500">
                  {state.errors.name}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="product-category"
                className="block text-[0.7rem] font-medium text-gray-700 dark:text-gray-200"
              >
                Category
              </label>
              <input
                id="product-category"
                type="text"
                value={state.values.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className={`mt-1 w-full rounded-xl border bg-gray-50 px-3 py-2 text-xs text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-gray-800 dark:text-gray-50 ${
                  state.errors.category
                    ? "border-rose-400"
                    : "border-gray-200 dark:border-gray-700"
                }`}
                placeholder="Eg: Home Decor, Snacks, Digital Notes"
              />
              {state.errors.category && (
                <p className="mt-1 text-[0.68rem] text-rose-500">
                  {state.errors.category}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="product-description"
                className="block text-[0.7rem] font-medium text-gray-700 dark:text-gray-200"
              >
                Description
              </label>
              <textarea
                id="product-description"
                rows={4}
                value={state.values.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
                placeholder="Tell the story of this product and the maker behind it."
              />
            </div>

            {/* Pricing & stock */}
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="product-price"
                  className="block text-[0.7rem] font-medium text-gray-700 dark:text-gray-200"
                >
                  Price
                </label>
                <input
                  id="product-price"
                  type="text"
                  value={state.values.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  className={`mt-1 w-full rounded-xl border bg-gray-50 px-3 py-2 text-xs text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-gray-800 dark:text-gray-50 ${
                    state.errors.price
                      ? "border-rose-400"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                  placeholder="Eg: 2500"
                />
                {state.errors.price && (
                  <p className="mt-1 text-[0.68rem] text-rose-500">
                    {state.errors.price}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="product-currency"
                  className="block text-[0.7rem] font-medium text-gray-700 dark:text-gray-200"
                >
                  Currency
                </label>
                <input
                  id="product-currency"
                  type="text"
                  value={state.values.currency}
                  onChange={(e) => handleChange("currency", e.target.value)}
                  className={`mt-1 w-full rounded-xl border bg-gray-50 px-3 py-2 text-xs text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-gray-800 dark:text-gray-50 ${
                    state.errors.currency
                      ? "border-rose-400"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                  placeholder="Eg: LKR"
                />
                {state.errors.currency && (
                  <p className="mt-1 text-[0.68rem] text-rose-500">
                    {state.errors.currency}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="product-stock"
                  className="block text-[0.7rem] font-medium text-gray-700 dark:text-gray-200"
                >
                  Stock (optional)
                </label>
                <input
                  id="product-stock"
                  type="text"
                  value={state.values.stock}
                  onChange={(e) => handleChange("stock", e.target.value)}
                  className={`mt-1 w-full rounded-xl border bg-gray-50 px-3 py-2 text-xs text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-gray-800 dark:text-gray-50 ${
                    state.errors.stock
                      ? "border-rose-400"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                  placeholder="Eg: 10"
                />
                {state.errors.stock && (
                  <p className="mt-1 text-[0.68rem] text-rose-500">
                    {state.errors.stock}
                  </p>
                )}
              </div>
            </div>

            {/* Vendor */}
            <div>
              <label
                htmlFor="product-vendor"
                className="block text-[0.7rem] font-medium text-gray-700 dark:text-gray-200"
              >
                Vendor ID (optional)
              </label>
              <input
                id="product-vendor"
                type="text"
                value={state.values.vendorId}
                onChange={(e) => handleChange("vendorId", e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
                placeholder="Link this to a maker/vendor record"
              />
            </div>
          </div>

          {/* Right column: media & tags */}
          <div className="space-y-3">
            {/* Main image */}
            <div>
              <label
                htmlFor="product-main-image"
                className="block text-[0.7rem] font-medium text-gray-700 dark:text-gray-200"
              >
                Main image URL
              </label>
              <input
                id="product-main-image"
                type="url"
                value={state.values.mainImage}
                onChange={(e) => handleChange("mainImage", e.target.value)}
                className={`mt-1 w-full rounded-xl border bg-gray-50 px-3 py-2 text-xs text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-gray-800 dark:text-gray-50 ${
                  state.errors.mainImage
                    ? "border-rose-400"
                    : "border-gray-200 dark:border-gray-700"
                }`}
                placeholder="https://..."
              />
              {state.errors.mainImage && (
                <p className="mt-1 text-[0.68rem] text-rose-500">
                  {state.errors.mainImage}
                </p>
              )}
              {state.values.mainImage && (
                <div className="mt-2">
                  <p className="mb-1 text-[0.65rem] text-gray-500 dark:text-gray-400">
                    Preview
                  </p>
                  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900">
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <img
                      src={state.values.mainImage}
                      className="h-32 w-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Gallery images */}
            <div>
              <label
                htmlFor="product-gallery-images"
                className="block text-[0.7rem] font-medium text-gray-700 dark:text-gray-200"
              >
                Additional image URLs (optional)
              </label>
              <textarea
                id="product-gallery-images"
                rows={3}
                value={state.values.galleryImages}
                onChange={(e) => handleChange("galleryImages", e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
                placeholder="Separate URLs with commas or new lines."
              />
            </div>

            {/* Tags */}
            <div>
              <p className="mb-1 text-[0.7rem] font-medium text-gray-700 dark:text-gray-200">
                Impact tags
              </p>
              <p className="mb-2 text-[0.65rem] text-gray-500 dark:text-gray-400">
                These power the &quot;Shop by Cause&quot; and impact tracking
                experiences.
              </p>
              <div className="flex flex-wrap gap-2">
                {TAG_KEYS.map((tag) => {
                  const selected = state.values.tags.includes(tag);
                  const label = CAUSE_LABELS[tag];
                  const inputId = `tag-${tag.toLowerCase()}`;
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

            {/* Featured toggle */}
            <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-3 py-2 text-[0.7rem] text-gray-700 dark:bg-gray-900/70 dark:text-gray-200">
              <div>
                <p className="font-medium">Feature on home page</p>
                <p className="text-[0.65rem] text-gray-500 dark:text-gray-400">
                  Highlight this product in the hero &amp; featured sections.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleChange("isFeatured", !state.values.isFeatured)
                }
                className={[
                  "inline-flex h-6 w-11 items-center rounded-full border px-0.5 transition",
                  state.values.isFeatured
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-gray-300 bg-gray-200 dark:border-gray-600 dark:bg-gray-700",
                ].join(" ")}
                aria-pressed={state.values.isFeatured}
              >
                <span
                  className={[
                    "inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
                    state.values.isFeatured ? "translate-x-5" : "translate-x-0",
                  ].join(" ")}
                />
              </button>
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
                Create product
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
