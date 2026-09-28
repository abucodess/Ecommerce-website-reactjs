import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";

import HeroCarousel from "../components/common/HeroCarousel";
const FeaturedProducts = lazy(
  () => import("../components/product/FearuredProducts"),
);
const ShopByBrand = lazy(() => import("../components/product/ShopByBrand"));
const NewArrival = lazy(() => import("../components/product/NewArrival"));
import { lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchproducts } from "../features/products/productSlice";
import Loader from "../components/common/Loader";
export default function Home() {
  let dispatch = useDispatch();
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
  }, [dispatch]);
  let { products, isloading, error } = useSelector((state) => state.products);

  if (isloading) {
    return <h1>loadinggggg</h1>;
  }
  if (error) {
    return <div>Something went wrong: {error}</div>;
  }
  return (
    <div>
      <Navbar />
      <HeroCarousel />
      <Suspense fallback={<h1>loaddingg</h1>}>
        <FeaturedProducts />
        <ShopByBrand />
        <NewArrival />
      </Suspense>
      <Footer />
    </div>
  );
}
