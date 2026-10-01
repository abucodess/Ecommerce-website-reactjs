import Navbar from "@/components/layout/Navbar";
import Emptywishlist from "@/features/wishlist/components/Emptywishlist";
import WishlistGrid from "@/features/wishlist/components/WishlistGrid";
import { useSelector } from "react-redux";

export default function Wishlist() {
  const { items } = useSelector((state) => state.wishlist);

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pb-24 pt-32">
        <div className="flex items-end justify-between gap-4 border-b border-neutral-200 pb-6">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Wishlist
          </h1>

          {items.length > 0 && (
            <p className="text-neutral-500">
              {items.length} {items.length === 1 ? "pair" : "pairs"}
            </p>
          )}
        </div>

        <div className="mt-10">
          {items.length === 0 ? (
            <Emptywishlist />
          ) : (
            <WishlistGrid items={items} />
          )}
        </div>
      </main>
    </div>
  );
}