
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartSummary from "@/features/cart/components/CartSummary";
import CartList from "@/features/cart/components/CartList";
import EmptyCart from "@/features/cart/components/EmptyCart";



export default function Cart() {
  const items = useSelector((state) => state.cart.items);

  const isEmpty = items.length === 0;

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        
        <div className="mb-10">
          <p className="mb-2 text-sm text-gray-500">Your selection</p>

          <div className="flex  justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Your Cart
              </h1>

              {!isEmpty && (
                <p className="mt-2 text-sm text-gray-500">
                  {items.length} {items.length === 1 ? "item" : "items"} in
                  your cart
                </p>
              )}
            </div>
          </div>
        </div>
        {isEmpty ? (
            <EmptyCart/>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
           
            <section className="rounded-2xl border border-gray-200 bg-white">
              <div className="border-b border-gray-200 px-5 py-4 sm:px-6">
                <h2 className="font-medium">Cart Items</h2>
              </div>

              <div className="px-5 sm:px-6">
                <CartList />

              </div>
            </section>
            <aside className="lg:sticky lg:top-28">
              <CartSummary />
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
