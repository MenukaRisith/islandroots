// app/routes/cart._index.tsx

import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";
import { AppLayout } from "~/components/layout/AppLayout";
import { CartItemRow } from "~/components/cart/CartItemRow";
import { useCart } from "~/hooks/useCart";
import { validateCheckoutForm } from "~/utils/validation";
import type { CheckoutFormValues } from "~/utils/validation";
import type { PaymentPreference } from "~/types/domain";
import { Button } from "~/components/ui/Button";
import { apiClientRequest } from "~/utils/api.client";

export const meta: MetaFunction = () => [
  { title: "Cart & Checkout – IslandRoots Market" },
  {
    name: "description",
    content:
      "Review your cart and send an order request. A seller will confirm payment and delivery with you directly.",
  },
];

interface CheckoutState {
  values: CheckoutFormValues;
  // key is always one of the CheckoutFormValues fields
  errors: Partial<Record<keyof CheckoutFormValues, string>>;
  submitting: boolean;
  submittedOrderId?: string;
  submitError?: string;
}

const initialValues: CheckoutFormValues = {
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  deliveryAddress: "",
  deliveryDistrict: "",
  paymentPreference: "COD",
  notes: "",
};

// Fields we consider “required” for the progress bar
const REQUIRED_FIELDS: (keyof CheckoutFormValues)[] = [
  "customerName",
  "customerPhone",
  "deliveryAddress",
  "paymentPreference",
];

export default function CartIndex() {
  const { items, formattedSubtotal, updateQuantity, removeFromCart, clearCart } =
    useCart();

  const [state, setState] = useState<CheckoutState>({
    values: initialValues,
    errors: {},
    submitting: false,
  });

  const handleChange = (
    field: keyof CheckoutFormValues,
    value: string | PaymentPreference
  ) => {
    setState((prev) => {
      const nextValues: CheckoutFormValues = {
        ...prev.values,
        [field]: value as CheckoutFormValues[typeof field],
      };

      // Run validation and only update error for the changed field
      const validationErrors = validateCheckoutForm(nextValues);

      return {
        ...prev,
        values: nextValues,
        errors: {
          ...prev.errors,
          [field]: validationErrors[field],
        },
        submitError: undefined,
        submittedOrderId: undefined,
      };
    });
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      setState((prev) => ({
        ...prev,
        submitError: "Your cart is empty.",
      }));
      return;
    }

    const errors = validateCheckoutForm(state.values);
    const hasErrors = Object.values(errors).some((val) => val != null);

    if (hasErrors) {
      setState((prev) => ({
        ...prev,
        errors,
        submitError: "Please fix the highlighted fields.",
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      submitting: true,
      submitError: undefined,
      submittedOrderId: undefined,
    }));

    try {
      const body = {
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        customerName: state.values.customerName,
        customerPhone: state.values.customerPhone,
        customerEmail: state.values.customerEmail || undefined,
        deliveryAddress: state.values.deliveryAddress,
        deliveryDistrict: state.values.deliveryDistrict || undefined,
        paymentPreference: state.values.paymentPreference,
        notes: state.values.notes || undefined,
      };

      const res = await apiClientRequest<{ orderId: string }>({
        path: "/orders",
        method: "POST",
        body,
      });

      clearCart();
      setState({
        values: initialValues,
        errors: {},
        submitting: false,
        submittedOrderId: res.orderId,
        submitError: undefined,
      });
    } catch (err) {
      console.error("[cart._index] order submit failed:", err);
      setState((prev) => ({
        ...prev,
        submitting: false,
        submitError:
          "Something went wrong while sending your order request. Please try again.",
      }));
    }
  };

  // --- Interactive checkout progress calculation ---
  const completedRequired = REQUIRED_FIELDS.filter((field) => {
    const value = state.values[field];
    if (typeof value === "string") {
      return value.trim().length > 0;
    }
    return Boolean(value);
  }).length;

  const hasItems = items.length > 0;
  const totalSteps = REQUIRED_FIELDS.length + 1; // +1 for “cart has items”
  const completedSteps = completedRequired + (hasItems ? 1 : 0);
  const progressPercent =
    totalSteps > 0
      ? Math.min(100, Math.round((completedSteps / totalSteps) * 100))
      : 0;

  return (
    <AppLayout>
      <section className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)]">
        {/* Cart items */}
        <div className="space-y-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
              Cart
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Review your items and send an order request. No online payments –
              confirmation happens via phone or WhatsApp.
            </p>
          </div>

          {items.length === 0 ? (
            <p className="rounded-3xl bg-white p-4 text-sm text-gray-500 shadow-sm dark:bg-gray-900 dark:text-gray-400">
              Your cart is empty. Add some products from the marketplace to get
              started.
            </p>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <CartItemRow
                  key={item.productId}
                  item={item}
                  onQuantityChange={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>
          )}
        </div>

        {/* Soft checkout form */}
        <div className="space-y-3 rounded-3xl bg-white p-4 shadow-sm dark:bg-gray-900">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50 sm:text-base">
            Order Request Details
          </h2>

          {/* Interactive progress bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[0.7rem] text-gray-500 dark:text-gray-400">
              <span>Checkout progress</span>
              <span>{progressPercent}% complete</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-[width]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
            <span>
              Items subtotal{" "}
              {items.length > 0 && (
                <span className="text-[0.7rem] text-gray-400">
                  · {items.length} item{items.length === 1 ? "" : "s"}
                </span>
              )}
            </span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {formattedSubtotal}
            </span>
          </div>

          <form className="space-y-3 text-xs" onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div>
              <label
                htmlFor="checkout-name"
                className="block text-[0.7rem] font-medium text-gray-600 dark:text-gray-300"
              >
                Full name
              </label>
              <input
                id="checkout-name"
                type="text"
                value={state.values.customerName}
                onChange={(e) => handleChange("customerName", e.target.value)}
                className={`mt-1 w-full rounded-xl border bg-gray-50 px-3 py-2 text-xs text-gray-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-gray-800 dark:text-gray-100 ${
                  state.errors.customerName
                    ? "border-rose-400"
                    : "border-gray-200 dark:border-gray-700"
                }`}
                placeholder="Eg: Nimal Perera"
              />
              {state.errors.customerName && (
                <p className="mt-1 text-[0.68rem] text-rose-500">
                  {state.errors.customerName}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="checkout-phone"
                className="block text-[0.7rem] font-medium text-gray-600 dark:text-gray-300"
              >
                Phone number (WhatsApp preferred)
              </label>
              <input
                id="checkout-phone"
                type="tel"
                value={state.values.customerPhone}
                onChange={(e) => handleChange("customerPhone", e.target.value)}
                className={`mt-1 w-full rounded-xl border bg-gray-50 px-3 py-2 text-xs text-gray-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-gray-800 dark:text-gray-100 ${
                  state.errors.customerPhone
                    ? "border-rose-400"
                    : "border-gray-200 dark:border-gray-700"
                }`}
                placeholder="+94..."
              />
              {state.errors.customerPhone && (
                <p className="mt-1 text-[0.68rem] text-rose-500">
                  {state.errors.customerPhone}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="checkout-email"
                className="block text-[0.7rem] font-medium text-gray-600 dark:text-gray-300"
              >
                Email (optional)
              </label>
              <input
                id="checkout-email"
                type="email"
                value={state.values.customerEmail ?? ""}
                onChange={(e) => handleChange("customerEmail", e.target.value)}
                className={`mt-1 w-full rounded-xl border bg-gray-50 px-3 py-2 text-xs text-gray-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-gray-800 dark:text-gray-100 ${
                  state.errors.customerEmail
                    ? "border-rose-400"
                    : "border-gray-200 dark:border-gray-700"
                }`}
                placeholder="Eg: you@example.com"
              />
              {state.errors.customerEmail && (
                <p className="mt-1 text-[0.68rem] text-rose-500">
                  {state.errors.customerEmail}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="checkout-address"
                className="block text-[0.7rem] font-medium text-gray-600 dark:text-gray-300"
              >
                Delivery address
              </label>
              <textarea
                id="checkout-address"
                value={state.values.deliveryAddress}
                onChange={(e) => handleChange("deliveryAddress", e.target.value)}
                rows={3}
                className={`mt-1 w-full rounded-xl border bg-gray-50 px-3 py-2 text-xs text-gray-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-gray-800 dark:text-gray-100 ${
                  state.errors.deliveryAddress
                    ? "border-rose-400"
                    : "border-gray-200 dark:border-gray-700"
                }`}
                placeholder="House No, Street, Town"
              />
              {state.errors.deliveryAddress && (
                <p className="mt-1 text-[0.68rem] text-rose-500">
                  {state.errors.deliveryAddress}
                </p>
              )}
            </div>

            {/* District */}
            <div>
              <label
                htmlFor="checkout-district"
                className="block text-[0.7rem] font-medium text-gray-600 dark:text-gray-300"
              >
                District
              </label>
              <input
                id="checkout-district"
                type="text"
                value={state.values.deliveryDistrict ?? ""}
                onChange={(e) =>
                  handleChange("deliveryDistrict", e.target.value)
                }
                className={`mt-1 w-full rounded-xl border bg-gray-50 px-3 py-2 text-xs text-gray-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-gray-800 dark:text-gray-100 ${
                  state.errors.deliveryDistrict
                    ? "border-rose-400"
                    : "border-gray-200 dark:border-gray-700"
                }`}
                placeholder="Eg: Colombo"
              />
              {state.errors.deliveryDistrict && (
                <p className="mt-1 text-[0.68rem] text-rose-500">
                  {state.errors.deliveryDistrict}
                </p>
              )}
            </div>

            {/* Payment preference */}
            <div>
              <span className="block text-[0.7rem] font-medium text-gray-600 dark:text-gray-300">
                Preferred payment method
              </span>
              <div className="mt-1 flex flex-wrap gap-2">
                <PaymentChip
                  label="Cash on Delivery"
                  value="COD"
                  selected={state.values.paymentPreference === "COD"}
                  onSelect={(val) => handleChange("paymentPreference", val)}
                />
                <PaymentChip
                  label="Bank Transfer"
                  value="BANK_TRANSFER"
                  selected={state.values.paymentPreference === "BANK_TRANSFER"}
                  onSelect={(val) => handleChange("paymentPreference", val)}
                />
                <PaymentChip
                  label="Pick up"
                  value="PICKUP"
                  selected={state.values.paymentPreference === "PICKUP"}
                  onSelect={(val) => handleChange("paymentPreference", val)}
                />
              </div>
              {state.errors.paymentPreference && (
                <p className="mt-1 text-[0.68rem] text-rose-500">
                  {state.errors.paymentPreference}
                </p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="checkout-notes"
                className="block text-[0.7rem] font-medium text-gray-600 dark:text-gray-300"
              >
                Notes for the seller (optional)
              </label>
              <textarea
                id="checkout-notes"
                value={state.values.notes ?? ""}
                onChange={(e) => handleChange("notes", e.target.value)}
                rows={2}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                placeholder="Eg: Please deliver after 6PM, or share tracking via WhatsApp"
              />
            </div>

            {/* Messages */}
            {state.submitError && (
              <p className="text-[0.7rem] text-rose-500">
                {state.submitError}
              </p>
            )}
            {state.submittedOrderId && (
              <p className="text-[0.7rem] text-emerald-500">
                Order request sent! Your reference ID is{" "}
                <span className="font-semibold">{state.submittedOrderId}</span>.
                A seller will contact you via phone/WhatsApp to confirm payment
                and delivery.
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={state.submitting || items.length === 0}
              className="w-full justify-center"
            >
              {state.submitting ? (
                <>
                  <i className="fa-solid fa-spinner mr-2 animate-spin" />
                  Sending order request...
                </>
              ) : (
                <>
                  <i className="fa-regular fa-paper-plane mr-2" />
                  Send order request
                </>
              )}
            </Button>
            <p className="text-[0.65rem] text-gray-500 dark:text-gray-400">
              By sending an order request, you agree to be contacted via phone
              or WhatsApp to confirm payment and delivery details.
            </p>
          </form>
        </div>
      </section>
    </AppLayout>
  );
}

interface PaymentChipProps {
  label: string;
  value: PaymentPreference;
  selected: boolean;
  onSelect: (value: PaymentPreference) => void;
}

function PaymentChip({ label, value, selected, onSelect }: PaymentChipProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={[
        "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[0.7rem] font-medium transition-colors",
        selected
          ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-900/40 dark:text-emerald-200"
          : "border-gray-200 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800",
      ].join(" ")}
    >
      {selected && (
        <i className="fa-solid fa-check text-[0.65rem]" aria-hidden="true" />
      )}
      <span>{label}</span>
    </button>
  );
}
