import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import Loader from "../common/Loader";



export default function ShopByBrand() {
    let {products,isloading,error} = useSelector(state=>state.products)
    if(isloading){
        return <Loader/>
    }
    let brands = products.slice(0,3)

  return (
    <section className="px-6 py-20 md:px-10 lg:px-16">
      
      <div className="mb-10">
        <p className="mb-2 text-sm uppercase tracking-[0.2em] text-gray-500">
          Explore
        </p>

        <h2 className="text-4xl font-bold md:text-5xl">
          Shop By Brand
        </h2>
      </div>

      
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {brands.map((brand) => (
          <NavLink
            key={brand.name}
            to={`/products?brand=${brand.name.toLowerCase()}`}
            className="group relative h-105 overflow-hidden"
          >
            <img
              src={brand.image}
              alt={brand.name}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 transition duration-300 group-hover:bg-black/40" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <h3 className="text-4xl font-bold tracking-wide">
                {brand.name}
              </h3>

              <span className="mt-4 border-b border-white pb-1 text-sm font-medium">
                SHOP NOW
              </span>
            </div>
          </NavLink>
        ))}
      </div>
    </section>
  );
}