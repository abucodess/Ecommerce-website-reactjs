
import { useSelector } from "react-redux";
import Loader from "../common/Loader";
import ProductCard from "./ProductCard";
import { useNavigate } from "react-router-dom";

export default function FeaturedProducts() {
  const { products, isloading, error } = useSelector(
    (state) => state.products
  );

  let navigate = useNavigate()
  if (isloading) {
    return <Loader />;
  }

  if (error) {
    return (
      <section className="bg-black px-6 py-20 text-white">
        <p className="text-center text-red-400">
          Something went wrong: {error}
        </p>
      </section>
    );
  }

  const featuredProducts = products.filter(
    (product) => product.isFeatured
  );

  return (
    <section className="bg-black px-6 py-20 text-white md:px-10 lg:px-16">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="mb-2 text-sm uppercase tracking-widest text-gray-500">
            Featured
          </p>

          <h2 className="text-4xl font-bold md:text-5xl">
            Trending Now
          </h2>
        </div>

        <button
          type="button"
          className="hidden border-b border-white pb-1 text-sm md:block cursor-pointer"
          onClick={()=>{navigate("/products")}}
        >
          View All
        </button>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
        {featuredProducts.slice(-4).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}

