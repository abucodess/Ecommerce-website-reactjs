import AddressSection from "@/features/checkout/components/AddressSection";
import OrderSummary from "@/features/checkout/components/OrderSummary";
import PaymentMethod from "@/features/checkout/components/PaymentMethod";
import { buyNow, fetchCart } from "@/features/cart/cartSlice";
import { placeOrder } from "@/features/orders/orderSlice";
import { fetchproducts } from "@/features/products/productSlice";
import { useUser } from "@clerk/clerk-react";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useUser();

  const { addresses, selectedAddressId, paymentMethod } = useSelector(
    (state) => state.checkout,
  );

  const cartItems = useSelector((state) => state.cart.items);
  const products = useSelector((state) => state.products.products);
  const placingOrder = useSelector((state) => state.orders.placingOrder);

  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(fetchproducts());
    }
  }, [dispatch, products]);

  useEffect(() => {
    if (!user?.id) return;

    const pendingBuyNowStr = sessionStorage.getItem("pendingBuyNow");
    if (pendingBuyNowStr) {
      try {
        const pendingItem = JSON.parse(pendingBuyNowStr);
        sessionStorage.removeItem("pendingBuyNow");
        dispatch(
          buyNow({
            userId: user.id,
            product: { id: pendingItem.productId },
            size: pendingItem.size,
          }),
        );
        return;
      } catch (e) {
        console.error("Failed to parse pendingBuyNow", e);
      }
    }

    if (!cartItems.length) {
      dispatch(fetchCart(user.id));
    }
  }, [user?.id, dispatch, cartItems.length]);

  const handlePlaceOrder = async () => {
    if (!cartItems.length) {
      alert("Your cart is empty.");
      return;
    }

    if (!selectedAddressId) {
      alert("Please select a delivery address.");
      return;
    }

    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    if (!user?.id) {
      alert("Please sign in to place your order.");
      return;
    }

    const selectedAddress = addresses.find(
      (address) => address.id === selectedAddressId,
    );

    if (!selectedAddress) {
      alert("Selected address not found.");
      return;
    }

    try {
      const order = await dispatch(
        placeOrder({
          userId: user.id,
          shippingAddress: selectedAddress,
          paymentMethod,
        }),
      ).unwrap();

      navigate(`/orders/${order.id}`);
    } catch (error) {
      console.error("Order failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-20 pb-20">
      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="Go back"
        className="fixed top-4 left-4"
      >
        <ArrowLeft className="size-10" />
      </button>

      <div className="mx-auto max-w-6xl px-5">
        <h1 className="mb-10 text-3xl font-bold">Checkout</h1>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AddressSection />
            <PaymentMethod />
          </div>

          <OrderSummary
            onPlaceOrder={handlePlaceOrder}
            loading={placingOrder}
          />
        </div>
      </div>
    </div>
  );
}
