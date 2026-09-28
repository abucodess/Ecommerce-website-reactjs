
import { ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import ProductCard from "./ProductCard";
import Loader from "../common/Loader";
import { useSelector } from "react-redux";



export default function NewArrivals() {
          let {products ,isloading,error} = useSelector(state=>state.products)

  const newArrivals = products.slice(0,6);
  if(isloading){
    return <Loader/>
  }
  if(error){
    return <h1>something is wrong : {error}</h1>
  }
  return (
    <section className="px-6 py-20 md:px-10 lg:px-16">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-gray-500">
            Just In
          </p>
          <h2 className="text-4xl font-bold md:text-5xl">
            New Arrivals
          </h2>
        </div>
        <NavLink
          to="/products"
          className="hidden items-center gap-2 border-b border-black pb-1 text-sm font-medium md:flex"
        >
          View All
          <ArrowRight size={16} />
        </NavLink>
      </div>
      <div className="flex gap-5 overflow-x-auto pb-5 scrollbar-hide">
        {newArrivals.map((product) => (
          <div
            key={product.id}
            className="min-w-70 sm:min-w-[320px] md:min-w-87.5"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-center md:hidden">
        <NavLink
          to="/products"
          className="flex items-center gap-2 border-b border-black pb-1 text-sm font-medium"
        >
          View All
          <ArrowRight size={16} />
        </NavLink>
      </div>
    </section>
  );
}

