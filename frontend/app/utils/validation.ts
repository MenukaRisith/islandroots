import type { PaymentPreference } from "~/types/domain";

export interface FieldErrorMap {
  [field: string]: string | undefined;
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateRequired(value: unknown, fieldLabel: string): string | null {
  if (!isNonEmptyString(value)) {
    return `${fieldLabel} is required`;
  }
  return null;
}

export function validateEmail(value: unknown, fieldLabel = "Email"): string | null {
  if (!isNonEmptyString(value)) {
    return null; // handled by required if needed
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value.trim())) {
    return `Please enter a valid ${fieldLabel.toLowerCase()}`;
  }
  return null;
}

export interface CheckoutFormValues {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  deliveryDistrict?: string;
  paymentPreference: PaymentPreference;
  notes?: string;
}

/**
 * Validate checkout form on the client side.
 * Returns an object with field -> error message.
 */
export function validateCheckoutForm(
  values: CheckoutFormValues
): FieldErrorMap {
  const errors: FieldErrorMap = {};

  const nameError = validateRequired(values.customerName, "Name");
  if (nameError) errors.customerName = nameError;

  const phoneError = validateRequired(values.customerPhone, "Phone number");
  if (phoneError) errors.customerPhone = phoneError;

  const addressError = validateRequired(values.deliveryAddress, "Delivery address");
  if (addressError) errors.deliveryAddress = addressError;

  const districtError = validateRequired(
    values.deliveryDistrict,
    "Delivery district"
  );
  if (districtError) errors.deliveryDistrict = districtError;

  const emailError = validateEmail(values.customerEmail, "Email");
  if (emailError) errors.customerEmail = emailError;

  if (!values.paymentPreference) {
    errors.paymentPreference = "Please select a payment method";
  }

  return errors;
}
