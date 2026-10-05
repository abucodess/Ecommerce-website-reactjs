
import { memo, useState } from "react";
import { Heart, ShoppingBag, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";

import { buyNow } from "@/features/cart/cartSlice";
import {
  addWishlist,
  removeWishlist,
} from "@/features/wishlist/wishlistSlice";

import { formatPrice } from "@/lib/formatPrice";

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useUser();

  const [isBuyingNow, setIsBuyingNow] = useState(false);

  const { items, loading, wishlistId } = useSelector(
    (state) => state.wishlist
  );

  const wishlisted = items.includes(Number(product.id));

  const href = `/products/${product.id}`;

  const handleWishlist = (e) => {
    e?.stopPropagation?.();
    e?.preventDefault?.();

    if (!user) {
      toast.info("Please sign in to use your wishlist");
      navigate("/login");
      return;
    }

    if (wishlisted) {
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

  const handleAddToBag = (e) => {
    e?.stopPropagation?.();
    e?.preventDefault?.();
    navigate(href);
  };

  const handleBuyNow = async (e) => {
    e?.stopPropagation?.();
    e?.preventDefault?.();

    const selectedSize = product.sizes?.[0] || 8;

    if (!user?.id) {
      sessionStorage.setItem(
        "pendingBuyNow",
        JSON.stringify({
          productId: Number(product.id),
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

  return (
    <article className="group relative">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100">
        <Link
          to={href}
          className="block h-full w-full"
          aria-label={`View ${product.name}`}
        >
          <img
            src={product.image}
            alt={`${product.brand} ${product.name}`}
            width="400"
            height="400"
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>

        <button
          type="button"
          onClick={handleWishlist}
          disabled={loading}
          aria-label={
            wishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          aria-pressed={wishlisted}
          className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Heart
            size={19}
            strokeWidth={1.5}
            className={
              wishlisted
                ? "fill-red-500 text-red-500"
                : "text-black"
            }
          />
        </button>

        <div className="absolute inset-x-2.5 bottom-2.5 flex gap-1.5 sm:inset-x-3 sm:bottom-3 sm:gap-2 lg:translate-y-2 lg:opacity-0 lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 transition-all duration-300">
          <button
            type="button"
            onClick={handleAddToBag}
            className="flex-1 flex items-center justify-center gap-1 rounded-xl border border-black/80 bg-white/95 py-2.5 text-xs font-semibold text-black backdrop-blur transition hover:bg-neutral-100 shadow-sm active:scale-95"
            aria-label={`View ${product.name} and add to bag`}
          >
            <ShoppingBag size={14} className="shrink-0" />
            <span>
              <span className="hidden sm:inline">Add to </span>Bag
            </span>
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            disabled={isBuyingNow}
            className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-black py-2.5 text-xs font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm active:scale-95"
            aria-label={`Buy ${product.name} now`}
          >
            <Zap size={14} className="shrink-0 fill-current" />
            <span>{isBuyingNow ? "..." : "Buy Now"}</span>
          </button>
        </div>
      </div>

      <Link to={href} className="mt-4 block">
        <p className="text-sm text-neutral-500">
          {product.brand}
        </p>

        <h2 className="mt-1 line-clamp-1 font-medium">
          {product.name}
        </h2>

        <p className="mt-2 text-lg font-semibold">
          {formatPrice(product.price)}
        </p>
      </Link>
    </article>
  );
}

export default memo(ProductCard);

