import { useSelector } from "react-redux";

export default function OrderSummary({
  onPlaceOrder,
}) {
  const cartItems = useSelector(
    (state) => state.cart.items
  );

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const delivery = subtotal > 0 ? 0 : 0;

  const total = subtotal + delivery;

  return (
    <aside className="border rounded-2xl p-5 h-fit lg:sticky lg:top-24">

      <h2 className="text-xl font-semibold mb-5">
        Order Summary
      </h2>

      {/* Products */}
      <div className="space-y-4">

        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex gap-3"
          >

            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-lg bg-gray-100"
            />

            <div className="flex-1">

              <h3 className="text-sm font-medium">
                {item.name}
              </h3>

              <p className="text-sm text-gray-500">
                Qty: {item.quantity}
              </p>

            </div>

            <p className="text-sm font-medium">
              ₹{item.price * item.quantity}
            </p>

          </div>
        ))}

      </div>

      <div className="border-t my-5" />

      {/* Price */}
      <div className="space-y-3 text-sm">

        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        <div className="flex justify-between">
          <span>Delivery</span>
          <span>
            {delivery === 0
              ? "Free"
              : `₹${delivery}`}
          </span>
        </div>

      </div>

      <div className="border-t my-5" />

      <div className="flex justify-between text-lg font-semibold">
        <span>Total</span>
        <span>₹{total}</span>
      </div>

      <button
        onClick={onPlaceOrder}
        className="w-full bg-black text-white rounded-xl py-4 mt-6"
      >
        Place Order
      </button>

    </aside>
  );
}