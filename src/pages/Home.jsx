import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";

import HeroCarousel from "../components/common/HeroCarousel";
const FeaturedProducts = lazy(
  () => import("../components/product/FearuredProducts"),
);
const ShopByBrand = lazy(() => import("../components/product/ShopByBrand"));
const NewArrival = lazy(() => import("../components/product/NewArrival"));
import { lazy, Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchproducts } from "../features/products/productSlice";
import Loader from "../components/common/Loader";
const MIN_LOADER_MS = 1500;
export default function Home() {
  let dispatch = useDispatch();
    const [minTimePassed, setMinTimePassed] = useState(false);
  async function load() {
    try {
      let res = await dispatch(fetchproducts()).unwrap();
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    load();
     const timer = setTimeout(() => setMinTimePassed(true), MIN_LOADER_MS);
    return () => clearTimeout(timer);
  }, [dispatch]);
  let { products, isloading, error } = useSelector((state) => state.products);

  if (isloading ||! minTimePassed) {
    return (<Loader/>);
  }
  if (error) {
    return <div>Something went wrong: {error}</div>;
  }
  return (
    <div className="bg-black text-white">
      <Navbar />
      <HeroCarousel />
      <Suspense fallback={<Loader/>}>
        <FeaturedProducts />
        <ShopByBrand />
        <NewArrival />
      </Suspense>
      <Footer />
    </div>
  );
}
