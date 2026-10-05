import { NavLink } from "react-router-dom";

import nikeImage from "../../../public/images/brand/nike.jpg";
import adidasImage from "../../../public/images/brand/adidas.jpg";
import newBalanceImage from "../../../public/images/brand/newbalance.jpg";

const brands = [
  {
    name: "Nike",
    image: nikeImage,
    link: "/brand/nike",
  },
  {
    name: "Adidas",
    image: adidasImage,
    link: "/brand/adidas",
  },
  {
    name: "New Balance",
    image: newBalanceImage,
    link: "/brand/new-balance",
  },
];

export default function ShopByBrand() {
  return (
    <section className="bg-black px-6 py-20 text-white md:px-10 lg:px-16">

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
            to={brand.link}
            className="group relative h-[420px] overflow-hidden rounded-xl"
          >
            <img
              src={brand.image}
              alt={brand.name}
              className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-black/30 transition duration-300 group-hover:bg-black/50" />

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <h3 className="text-4xl font-bold tracking-wide">
                {brand.name}
              </h3>

              <span className="mt-4 border-b border-white pb-1 text-sm font-medium tracking-wider transition group-hover:border-gray-300">
                SHOP NOW
              </span>
            </div>
          </NavLink>
        ))}
      </div>
    </section>
  );
}
