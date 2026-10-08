import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import {
  fetchOrders,
  cancelOrder,
} from "@/features/orders/orderSlice";

import OrderCard from "@/features/orders/components/OrderCard";
import EmptyOrders from "@/features/orders/components/EmptyOrders";

export default function Orders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux authentication
  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const {
    orders,
    loading,
    error,
  } = useSelector((state) => state.orders);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    dispatch(fetchOrders(user.id));
  }, [isAuthenticated, user?.id, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black">
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center">
          <p className="text-sm text-gray-500">
            Loading your orders...
          </p>
        </main>

        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white text-black">
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center">
          <p className="text-sm text-red-500">
            Failed to load your orders.
          </p>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">

        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-8 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-black"
        >
          <ArrowLeft size={18} />
          Go back
        </button>

        <div className="mb-10">
          <p className="mb-2 text-sm text-gray-500">
            Your purchases
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            My Orders
          </h1>
        </div>

        {orders.length === 0 ? (
          <EmptyOrders />
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                userId={user.id}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
