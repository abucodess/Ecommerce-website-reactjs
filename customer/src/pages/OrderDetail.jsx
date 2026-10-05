import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { ArrowLeft, Check, AlertTriangle } from "lucide-react";

import api from "@/services/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Modal from "@/components/common/Modal";
import OrderTimeline from "@/features/orders/components/OrderTimeline";

function OrderDetails() {
  const { orderId } = useParams();
  const { user } = useUser();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/orders/${orderId}`);

        if (response.data.userId !== user?.id) {
          setError("You cannot view this order.");
          return;
        }

        setOrder(response.data);
      } catch (error) {
        console.error(error);
        setError("Failed to load order.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id && orderId) {
      fetchOrder();
    }
  }, [orderId, user?.id]);

  const handleCancelOrder = async () => {
    try {
      setCancelling(true);
      setError("");

      const response = await api.patch(`/orders/${order.id}`, {
        status: "cancelled",
      });

      setOrder(response.data);
      setShowCancelModal(false);
    } catch (error) {
      console.error(error);
      setError("Failed to cancel order.");
    } finally {
      setCancelling(false);
    }
  };

  const canCancel =
    order &&
    order.status !== "cancelled" &&
    order.status !== "shipped" &&
    order.status !== "delivered";

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black">
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center">
          <p className="text-sm text-gray-500">Loading order...</p>
        </main>

        <Footer />
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-white text-black">
        <Navbar />

        <main className="flex min-h-[70vh] flex-col items-center justify-center">
          <p className="text-sm text-red-500">{error || "Order not found."}</p>

          <Link
            to="/orders"
            className="mt-5 flex items-center gap-2 text-sm font-medium hover:underline"
          >
            <ArrowLeft size={16} />
            Back to orders
          </Link>
        </main>

        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white text-black">
        <Navbar />

        <main className="flex min-h-[70vh] flex-col items-center justify-center">
          <p className="text-sm text-gray-500">Order not found.</p>

          <Link
            to="/orders"
            className="mt-5 flex items-center gap-2 text-sm font-medium hover:underline"
          >
            <ArrowLeft size={16} />
            Back to orders
          </Link>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <Link
          to="/orders"
          className="mb-8 flex items-center gap-2 text-sm text-gray-500 transition hover:text-black"
        >
          <ArrowLeft size={18} />
          Back to orders
        </Link>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mb-10 text-center">
          <div
            className={`mx-auto mb-5 grid size-16 place-items-center rounded-full ${
              order.status === "cancelled"
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            <Check size={30} />
          </div>

          <h1 className="text-3xl font-semibold">
            {order.status === "cancelled"
              ? "Order Cancelled"
              : "Order Confirmed"}
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {order.status === "cancelled"
              ? "This order has been cancelled."
              : "Thank you for your purchase."}
          </p>

          <p className="mt-1 text-sm text-gray-500">Order #{order.id}</p>
        </div>

        <section className="mb-8 rounded-2xl border border-gray-200 p-6">
          <h2 className="mb-8 text-lg font-semibold">Order Status</h2>

          <OrderTimeline status={order.status} />
        </section>

        {canCancel && (
          <div className="mb-8 flex justify-end">
            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              className="rounded-xl border border-red-200 px-5 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              Cancel Order
            </button>
          </div>
        )}

        <section className="mb-8 rounded-2xl border border-gray-200 p-6">
          <h2 className="mb-5 text-lg font-semibold">Items</h2>

          <div className="divide-y divide-gray-200">
            {order.items?.map((item) => (
              <div
                key={`${item.productId}-${item.size}`}
                className="flex gap-4 py-5"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-24 w-24 rounded-xl bg-gray-100 object-cover"
                />

                <div className="flex-1">
                  <p className="text-xs text-gray-500">{item.brand}</p>

                  <h3 className="mt-1 font-medium">{item.name}</h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Size: {item.size} · Qty: {item.quantity}
                  </p>
                </div>

                <p className="font-medium">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-8 md:grid-cols-2">
          <section className="rounded-2xl border border-gray-200 p-6">
            <h2 className="mb-4 text-lg font-semibold">Delivery Address</h2>

            <div className="text-sm leading-6 text-gray-500">
              <p className="font-medium text-black">
                {order.shippingAddress?.name}
              </p>

              <p>{order.shippingAddress?.address}</p>

              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                {order.shippingAddress?.pincode}
              </p>

              <p>Phone: {order.shippingAddress?.phone}</p>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 p-6">
            <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>

                <span>₹{order.subtotal?.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Delivery</span>

                <span>
                  {order.delivery === 0
                    ? "Free"
                    : `₹${order.delivery?.toLocaleString("en-IN")}`}
                </span>
              </div>

              <div className="flex justify-between border-t border-gray-200 pt-3 font-semibold">
                <span>Total</span>

                <span>₹{order.total?.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />

      <Modal
        isOpen={showCancelModal}
        onClose={() => {
          if (!cancelling) {
            setShowCancelModal(false);
          }
        }}
        title="Cancel Order"
      >
        <div className="space-y-5">
          <div className="flex gap-3 rounded-xl bg-red-50 p-4">
            <div className="shrink-0 text-red-600">
              <AlertTriangle size={20} />
            </div>

            <div>
              <p className="text-sm font-medium text-red-700">
                Cancel order #{order.id}?
              </p>

              <p className="mt-1 text-xs leading-5 text-red-600">
                Once cancelled, this order cannot be restored.
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setShowCancelModal(false)}
              disabled={cancelling}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Keep Order
            </button>

            <button
              type="button"
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {cancelling ? "Cancelling..." : "Cancel Order"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}


export default OrderDetails;
