import { memo } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleWishlist = (e) => {
    e.stopPropagation();
    // dispatch wishlist action here
  };

  const handleAddToBag = (e) => {
    e.stopPropagation();
    // dispatch add-to-cart action here
  };

  return (
    <div
      className="group m-1 cursor-pointer border-3"
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={`${product.brand} ${product.name}`}
          width="400"
          height="400"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <button
          type="button"
          onClick={handleWishlist}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white transition duration-300 hover:scale-110"
        >
          <Heart size={19} strokeWidth={1.5} />
        </button>
        <button
          type="button"
          onClick={handleAddToBag}
          className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2 bg-black py-3 text-sm font-medium text-white opacity-0 transition group-hover:opacity-100"
        >
          <ShoppingBag size={17} />
          Add to Bag
        </button>
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-500">{product.brand}</p>
        <h2 className="mt-1 font-medium">{product.name}</h2>
        <p className="mt-2 font-semibold">₹{product.price}</p>
      </div>
    </div>
  );
}

export default memo(ProductCard);