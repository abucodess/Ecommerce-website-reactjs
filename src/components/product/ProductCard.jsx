import { memo } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "@/features/wishlist/wishlistSlice";
import { addToCart } from "@/features/cart/cartSlice";
import { formatPrice } from "@/lib/formatPrice";

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.wishlist);

  const wishlisted = items.some((item) => item.id === product.id);
  const href = `/products/${product.id}`;

  const handleWishlist = () => {
    dispatch(wishlisted ? removeFromWishlist(product.id) : addToWishlist(product));
  };

  const handleAddToBag = () => {
    dispatch(addToCart(product));
  };

  return (
    <article className="group relative">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100">
        <Link to={href} className="block h-full w-full" aria-label={`View ${product.name}`}>
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
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          <Heart
            size={19}
            strokeWidth={1.5}
            className={wishlisted ? "fill-red-500 text-red-500" : "text-black"}
          />
        </button>

        <button
          type="button"
          onClick={handleAddToBag}
          className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-2 rounded-xl bg-black py-3 text-sm font-medium text-white transition hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:translate-y-2 lg:opacity-0 lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100 lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
        >
          <ShoppingBag size={17} />
          Add to bag
        </button>
      </div>

      <Link to={href} className="mt-4 block">
        <p className="text-sm text-neutral-500">{product.brand}</p>
        <h2 className="mt-1 line-clamp-1 font-medium">{product.name}</h2>
        <p className="mt-2 text-lg font-semibold">{formatPrice(product.price)}</p>
      </Link>
    </article>
  );
}

export default memo(ProductCard);