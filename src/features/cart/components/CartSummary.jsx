
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CartSummary() {
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items);
  const products = useSelector((state) => state.products.products);
  console.log(products)

  const items = cartItems
    .map((cartItem) => {
      const product = products.find(
        (product) =>
          Number(product.id) === Number(cartItem.productId)
      );

      if (!product) {
        return null;
      }

      return {
        ...product,
        productId: cartItem.productId,
        size: cartItem.size,
        quantity: cartItem.quantity,
      };
    })
    .filter(Boolean);

  const subtotal = items.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0
  );

  const shipping = subtotal >= 2000 ? 0 : 100;

  const total = subtotal + shipping;

  return (
    <div className="rounded-2xl border border-gray-200 p-5 sm:p-6">
      <h2 className="text-lg font-semibold">
        Order Summary
      </h2>

      <div className="mt-6 space-y-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">
            Subtotal
          </span>

          <span className="font-medium">
            ₹{subtotal.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500">
            Shipping
          </span>

          <span className="font-medium">
            {shipping === 0
              ? "Free"
              : `₹${shipping.toLocaleString("en-IN")}`}
          </span>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold">
              Total
            </span>

            <span className="text-lg font-semibold">
              ₹{total.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        disabled={items.length === 0}
        onClick={() => navigate("/checkout")}
        className="mt-6 w-full cursor-pointer rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}

