import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import HeroCarousel from "../components/common/HeroCarousel";
import { lazy, Suspense, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loader from "../components/common/Loader";
const FeaturedProducts = lazy(
  () => import("../components/product/FearuredProducts")
);

const ShopByBrand = lazy(
  () => import("../components/product/ShopByBrand")
);

const NewArrival = lazy(
  () => import("../components/product/NewArrival")
);
const MIN_LOADER_MS = 1500;

export default function Home() {
  const [minTimePassed, setMinTimePassed] = useState(false);

  const {
    isloading,
    error,
  } = useSelector((state) => state.products);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimePassed(true);
    }, MIN_LOADER_MS);

    return () => clearTimeout(timer);
  }, []);

  if (isloading || !minTimePassed) {
    return <Loader />;
  }

  if (error) {
    return (
      <div>
        Something went wrong: {error}
      </div>
    );
  }

  return (
    <div className="bg-black text-white">
      <Navbar />

      <HeroCarousel />

      <Suspense fallback={<Loader />}>
        <FeaturedProducts />
        <ShopByBrand />
        <NewArrival />
      </Suspense>

      <Footer />
    </div>
  );
}