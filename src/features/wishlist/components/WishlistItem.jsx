import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Trash2 } from "lucide-react";
import { removeWishlist } from "../wishlistSlice";

export default function WishlistItem({ item }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const wishlistId = useSelector(
    (state) => state.wishlist.wishlistId
  );

  const handleRemove = (e) => {
    e.preventDefault()
    e.stopPropagation();

    dispatch(
      removeWishlist({
        wishlistId,
        productId: item.id,
      })
    );
  };

  return (
    <div
      onClick={() => navigate(`/products/${item.id}`)}
      className="cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-black text-white"
    >
      <div className="aspect-square overflow-hidden bg-white/5">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-4">
        <p className="mb-1 text-xs uppercase tracking-wider text-white/50">
          {item.brand}
        </p>

        <h2 className="text-base font-medium">
          {item.name}
        </h2>

        <p className="mt-2 text-lg font-semibold">
          ₹{item.price}
        </p>

        <button
          type="button"
          onClick={handleRemove}
          disabled={!wishlistId}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm font-medium transition hover:border-red-500 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 size={16} />
          Remove from Wishlist
        </button>
      </div>
    </div>
  );
}