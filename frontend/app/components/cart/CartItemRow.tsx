import type { CartItem } from "~/types/domain";
import { formatCurrency } from "~/utils/format";

interface CartItemRowProps {
  item: CartItem;
  onQuantityChange: (productId: string | number, quantity: number) => void;
  onRemove: (productId: string | number) => void;
}

export function CartItemRow({
  item,
  onQuantityChange,
  onRemove,
}: CartItemRowProps) {
  const { product, quantity } = item;

  const handleQuantityChange = (value: string) => {
    const num = parseInt(value, 10);
    if (Number.isNaN(num) || num <= 0) {
      onQuantityChange(product.id, 1);
      return;
    }
    onQuantityChange(product.id, num);
  };

  const lineTotal = product.price * quantity;

  return (
    <div className="flex gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[0.65rem] text-gray-400">
            No image
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">
              {product.name}
            </p>
            <p className="text-[0.7rem] text-gray-500 dark:text-gray-400">
              {product.vendor?.locationDistrict ?? "Sri Lanka"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onRemove(product.id)}
            className="text-[0.7rem] text-gray-400 hover:text-rose-500"
            aria-label="Remove item"
          >
            <i className="fa-regular fa-trash-can" />
          </button>
        </div>

        <div className="mt-1 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <label
              htmlFor={`cart-qty-${product.id}`}
              className="text-[0.7rem] text-gray-500 dark:text-gray-400"
            >
              Qty
            </label>
            <input
              id={`cart-qty-${product.id}`}
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              className="h-7 w-16 rounded-full border border-gray-200 bg-gray-50 px-2 text-[0.7rem] text-gray-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatCurrency(product.price, product.currency)} each
            </p>
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(lineTotal, product.currency)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
