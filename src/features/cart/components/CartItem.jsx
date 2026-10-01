import { Minus, Plus, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "../cartSlice";

export default function CartItem({ item }) {
  const dispatch = useDispatch();
  const total = (item.price * item.quantity).toLocaleString("en-IN");

  return (
    <div className="flex gap-3 border-b border-gray-200 py-4 sm:gap-5 sm:py-6">
      {/* Product Image */}
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-32 sm:w-32">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Product Information */}
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs text-gray-500 sm:text-sm">{item.brand}</p>
              <h3 className="mt-1 line-clamp-2 text-base font-medium sm:text-lg">
                {item.name}
              </h3>
            </div>

            {/* Price (mobile) */}
            <p className="shrink-0 text-sm font-medium sm:hidden">₹{total}</p>
          </div>

          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Size: {item.size}
          </p>
        </div>

        {/* Bottom Controls */}
        <div className="mt-3 flex items-center justify-between gap-2 sm:mt-4">
          {/* Quantity */}
          <div className="flex items-center rounded-lg border border-gray-300">
            <button
              onClick={() => dispatch(decreaseQuantity(item))}
              aria-label="Decrease quantity"
              className="p-2 hover:bg-gray-100"
            >
              <Minus size={16} />
            </button>

            <span className="min-w-8 px-2 text-center text-sm sm:px-4">
              {item.quantity}
            </span>

            <button
              onClick={() => dispatch(increaseQuantity(item))}
              aria-label="Increase quantity"
              className="p-2 hover:bg-gray-100"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Remove */}
          <button
            onClick={() => dispatch(removeFromCart(item))}
            aria-label="Remove item"
            className="flex items-center gap-2 p-2 text-sm text-gray-500 hover:text-black"
          >
            <Trash2 size={16} />
            <span className="hidden sm:inline">Remove</span>
          </button>
        </div>
      </div>

      {/* Price (tablet/desktop) */}
      <div className="hidden text-right sm:block">
        <p className="font-medium">₹{total}</p>
      </div>
    </div>
  );
}