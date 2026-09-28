import { useSelector } from "react-redux";
import Loader from "../common/Loader";
import ProductCard from "./ProductCard";

export default function FeaturedProducts() {
      let {products ,isloading,error} = useSelector(state=>state.products)

  const featuredProducts = products.slice(0, 4);
  if(isloading){
    return <Loader/>
  }

  return (
    <section className="px-6 py-20 md:px-10 lg:px-16">

      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="mb-2 text-sm uppercase tracking-widest text-gray-500">
            Featured
          </p>

          <h2 className="text-4xl font-bold md:text-5xl">
            Trending Now
          </h2>
        </div>

        <button className="hidden border-b border-black pb-1 text-sm md:block">
          View All
        </button>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
        {featuredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

    </section>
  );
}