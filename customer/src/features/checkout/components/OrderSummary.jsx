import { useSelector } from "react-redux";

export default function OrderSummary({ onPlaceOrder }) {
  const cartItems = useSelector((state) => state.cart.items);
  const products = useSelector((state) => state.products.products);

  const items = cartItems
    .map((cartItem) => {
      const product = products.find(
        (product) => String(product.id) === String(cartItem.productId),
      );

      if (!product) return null;

      return {
        ...product,
        productId: cartItem.productId,
        size: cartItem.size,
        quantity: cartItem.quantity,
      };
    })
    .filter(Boolean);

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const delivery = subtotal >= 2000 || subtotal === 0 ? 0 : 100;
  const total = subtotal + delivery;

  return (
    <aside className="h-fit rounded-2xl border p-5 lg:sticky lg:top-24">
      {" "}
      <h2 className="mb-5 text-xl font-semibold">Order Summary </h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={`${item.productId}-${item.size}`} className="flex gap-3">
            <img
              src={item.image}
              alt={item.name}
              className="h-16 w-16 rounded-lg bg-gray-100 object-cover"
            />

            <div className="flex-1">
              <h3 className="text-sm font-medium">{item.name}</h3>

              <p className="text-sm text-gray-500">Size: {item.size}</p>

              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>

            <p className="text-sm font-medium">
              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </div>
      <div className="my-5 border-t" />
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{subtotal.toLocaleString("en-IN")}</span>
        </div>

        <div className="flex justify-between">
          <span>Delivery</span>
          <span>
            {delivery === 0 ? "Free" : `₹${delivery.toLocaleString("en-IN")}`}
          </span>
        </div>
      </div>
      <div className="my-5 border-t" />
      <div className="flex justify-between text-lg font-semibold">
        <span>Total</span>
        <span>₹{total.toLocaleString("en-IN")}</span>
      </div>
      <button
        type="button"
        onClick={onPlaceOrder}
        disabled={items.length === 0}
        className="mt-6 w-full rounded-xl bg-black py-4 text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        Place Order
      </button>
    </aside>
  );
}
