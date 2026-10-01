import { addToCart } from "@/features/cart/cartSlice";
import { addToWishlist, removeFromWishlist } from "@/features/wishlist/wishlistSlice";
import { ArrowArcLeftIcon } from "@phosphor-icons/react";
import { ArrowLeft, Heart, ShoppingBag, Star } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function ProductDetails() {
  const { id } = useParams();
  let [wish,setwish] = useState(null)
  let navigate = useNavigate()
  let dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState(null);

  const { products, isloading, error } = useSelector((state) => state.products);
  const {items} = useSelector(state=>state.wishlist)

  const product = products.find((x) => x.id == id);
  
  const handleAddToCart = () => {
    if (!selectedSize) {
      return;
    }
    dispatch(
      addToCart({
        ...product,
        size: selectedSize,
      }),
    );
  };
  let isWishlisted = items.some(
  (item) => item.id === product.id
);
  const handleAddToWishlist = () => {
  if (isWishlisted) {
    dispatch(removeFromWishlist(product.id));
  } else {
    dispatch(addToWishlist(product));
  }
};
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

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 md:py-12 relative">
         <ArrowLeft className="absolute top-2 left-2 cursor-pointer" size={40} onClick={()=>navigate(-1)}/>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 mt-3">
        <div className="w-full ">
           
          <img
            src={product.image}
            alt={`${product.brand} ${product.name}`}
            className="aspect-square w-full rounded-2xl object-cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-sm text-gray-500">{product.brand}</p>

          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
            {product.name}
          </h1>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star size={18} fill="currentColor" className="text-yellow-500" />

              <span className="font-medium">{product.rating}</span>
            </div>

            <span className="text-gray-400">•</span>

            <span className="text-sm text-gray-500">
              {product.reviews} reviews
            </span>
          </div>

          <p className="mt-4 text-xl font-semibold sm:text-2xl">
            ₹{product.price}
          </p>

          <p className="mt-5 text-sm leading-6 text-gray-600 sm:text-base">
            {product.description}
          </p>
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">Select Size</h2>

              <button className="text-sm text-gray-500 underline">
                Size Guide
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`border py-3 text-sm transition ${
                    selectedSize === size
                      ? "border-black bg-black text-white"
                      : "border-gray-300 hover:border-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className="flex-1 bg-black py-4 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingBag size={18} className="mr-2 inline" />
                Add to Bag
              </button>

              <button
                type="button"
                onClick={handleAddToWishlist}
                className="flex w-14 items-center justify-center border border-gray-300 transition hover:bg-gray-100"
              >
                <Heart size={20}  fill={isWishlisted ? "currentColor" : "none"}
    className={isWishlisted ? "text-red-500" : ""} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
