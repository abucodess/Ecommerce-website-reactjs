
import Navbar from "@/components/layout/Navbar";
import Emptywishlist from "@/features/wishlist/components/Emptywishlist";
import WishlistGrid from "@/features/wishlist/components/WishlistGrid";
import { useSelector } from "react-redux";

export default function Wishlist() {
  const {
    items: wishlistItems,
    loading: wishlistLoading,
  } = useSelector((state) => state.wishlist);

  const {
    products,
    isloading: productsLoading,
  } = useSelector((state) => state.products);

  const wishlistIds = new Set(wishlistItems);

  const wishlistProducts = products.filter((product) =>
    wishlistIds.has(String(product.id))
  );

  const loading = wishlistLoading || productsLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-neutral-900">
        <Navbar />

        <main className="flex min-h-screen items-center justify-center">
          <p className="text-neutral-500">
            Loading wishlist...
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pb-24 pt-32">
        <div className="flex items-end justify-between gap-4 border-b border-neutral-200 pb-6">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Wishlist
          </h1>

          {wishlistProducts.length > 0 && (
            <p className="text-neutral-500">
              {wishlistProducts.length}{" "}
              {wishlistProducts.length === 1 ? "pair" : "pairs"}
            </p>
          )}
        </div>

        <div className="mt-10">
          {wishlistProducts.length === 0 ? (
            <Emptywishlist />
          ) : (
            <WishlistGrid items={wishlistProducts} />
          )}
        </div>
      </main>
    </div>
  );
}

