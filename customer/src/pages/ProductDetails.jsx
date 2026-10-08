
import { addToCart, buyNow } from "@/features/cart/cartSlice";
import { fetchproducts } from "@/features/products/productSlice";
import {
  addWishlist,
  removeWishlist,
} from "@/features/wishlist/wishlistSlice";

import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Star,
  Zap,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ProductCard from "@/components/product/ProductCard";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
 const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [selectedSize, setSelectedSize] = useState(null);
  const [prevId, setPrevId] = useState(id);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  if (prevId !== id) {
    setPrevId(id);
    setSelectedSize(null);
  }

  const {
    products,
    isloading,
    error,
  } = useSelector((state) => state.products);

  const {
    items,
    wishlistId,
    loading: wishlistLoading,
  } = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(fetchproducts());
    }
  }, [dispatch, products]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const product = products.find(
    (x) => String(x.id) === String(id)
  );

  const similarProducts = useMemo(() => {
    if (!product || !products?.length) return [];
    return products
      .filter((p) => String(p.id) !== String(id))
      .sort((a, b) => {
        const aScore =
          (a.category === product.category ? 2 : 0) +
          (a.brand === product.brand ? 1 : 0);
        const bScore =
          (b.category === product.category ? 2 : 0) +
          (b.brand === product.brand ? 1 : 0);
        return bScore - aScore;
      })
      .slice(0, 4);
  }, [product, products, id]);

  if (isloading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Something went wrong.
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Product not found.
      </div>
    );
  }

  const isWishlisted = items.includes(String(product.id));

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.warn("Please select a size first");
      return;
    }

    if (!user) {
      toast.info("Please sign in to add to your bag");
      navigate("/login");
      return;
    }

    dispatch(
      addToCart({
        userId: user.id,
        product,
        size: selectedSize,
      })
    );
    toast.success("Added to your bag!");
  };

  const handleBuyNow = async () => {
    if (!selectedSize) {
      toast.warn("Please select a size first");
      return;
    }

    if (!user?.id) {
      sessionStorage.setItem(
        "pendingBuyNow",
        JSON.stringify({
          productId: String(product.id),
          size: selectedSize,
        })
      );
      toast.info("Please sign in to complete your purchase");
      navigate("/login?redirect_url=/checkout");
      return;
    }

    try {
      setIsBuyingNow(true);
      await dispatch(
        buyNow({
          userId: user.id,
          product,
          size: selectedSize,
        })
      ).unwrap();
      navigate("/checkout");
    } catch (err) {
      toast.error(err || "Failed to proceed to checkout");
    } finally {
      setIsBuyingNow(false);
    }
  };

  const handleAddToWishlist = () => {
    if (!user) {
      toast.info("Please sign in to use your wishlist");
      navigate("/login");
      return;
    }

    if (isWishlisted) {
      dispatch(
        removeWishlist({
          wishlistId,
          productId: product.id,
        })
      );
      toast.info("Removed from wishlist");
    } else {
      dispatch(
        addWishlist({
          userId: user.id,
          productId: product.id,
        })
      );
      toast.success("Added to wishlist");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-8 md:py-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="mb-4 inline-flex items-center gap-2 rounded-full p-2 text-gray-700 transition hover:bg-gray-100 hover:text-black focus:outline-none"
        >
          <ArrowLeft size={24} />
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
          <div className="w-full">
            <img
              src={product.image}
              alt={`${product.brand} ${product.name}`}
              className="aspect-square w-full rounded-2xl object-cover bg-gray-100 shadow-sm"
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              {product.brand}
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
              {product.name}
            </h1>

            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star
                  size={18}
                  fill="currentColor"
                  className="text-yellow-500"
                />

                <span className="font-semibold">
                  {product.rating}
                </span>
              </div>

              <span className="text-gray-400">
                •
              </span>

              <span className="text-sm text-gray-500">
                {product.reviews} reviews
              </span>
            </div>

            <p className="mt-4 text-2xl font-bold sm:text-3xl text-gray-900">
              ₹{product.price?.toLocaleString("en-IN") || product.price}
            </p>

            <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">
              {product.description}
            </p>

            <div className="mt-6 sm:mt-8">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                  Select Size
                </h2>

                <button
                  type="button"
                  className="text-xs sm:text-sm text-gray-500 underline hover:text-gray-800 transition"
                >
                  Size Guide
                </button>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2.5 sm:grid-cols-6 sm:gap-3">
                {product.sizes.map((s) => {
                  const sizeValue = typeof s === 'object' && s !== null ? s.size : s;
                  const stock = typeof s === 'object' && s !== null ? s.stock : null;
                  const isOutOfStock = stock === 0;

                  return (
                  <button
                    key={sizeValue}
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => setSelectedSize(sizeValue)}
                    className={`rounded-xl border py-3 text-sm font-medium transition ${
                      selectedSize === sizeValue
                        ? "border-black bg-black text-white shadow-sm"
                        : isOutOfStock
                        ? "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
                        : "border-gray-200 bg-white text-gray-900 hover:border-black"
                    }`}
                  >
                    {sizeValue}
                  </button>
                )})}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-stretch">
                <div className="flex gap-3 sm:flex-1">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!selectedSize}
                    className="flex-1 rounded-xl border-2 border-black bg-white py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-black transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center"
                  >
                    <ShoppingBag
                      size={18}
                      className="mr-2 inline"
                    />
                    Add to Bag
                  </button>

                  <button
                    type="button"
                    onClick={handleAddToWishlist}
                    disabled={wishlistLoading}
                    className="flex sm:hidden w-14 shrink-0 items-center justify-center rounded-xl border border-gray-300 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={
                      isWishlisted
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                    aria-pressed={isWishlisted}
                  >
                    <Heart
                      size={20}
                      fill={
                        isWishlisted
                          ? "currentColor"
                          : "none"
                      }
                      className={
                        isWishlisted
                          ? "text-red-500"
                          : "text-black"
                      }
                    />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={isBuyingNow}
                  className="flex-1 rounded-xl bg-black py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center shadow-md active:scale-[0.99]"
                >
                  <Zap
                    size={18}
                    className="mr-2 inline fill-current"
                  />
                  {isBuyingNow ? "Processing..." : "Buy Now"}
                </button>

                <button
                  type="button"
                  onClick={handleAddToWishlist}
                  disabled={wishlistLoading}
                  className="hidden sm:flex w-14 shrink-0 items-center justify-center rounded-xl border border-gray-300 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={
                    isWishlisted
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                  aria-pressed={isWishlisted}
                >
                  <Heart
                    size={20}
                    fill={
                      isWishlisted
                        ? "currentColor"
                        : "none"
                    }
                    className={
                      isWishlisted
                        ? "text-red-500"
                        : "text-black"
                    }
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <section className="mt-16 bg-black px-6 py-20 text-white md:px-10 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="mb-2 text-sm uppercase tracking-widest text-gray-500">
                  You Might Also Like
                </p>

                <h2 className="text-3xl font-bold md:text-5xl">
                  Similar Products
                </h2>
              </div>

              <button
                type="button"
                className="hidden border-b border-white pb-1 text-sm md:block cursor-pointer transition hover:text-gray-300"
                onClick={() => navigate("/products")}
              >
                View All
              </button>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
              {similarProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

