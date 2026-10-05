import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Loader from "../components/common/Loader";
import ProductGrid from "../components/product/ProductGrid";
import ProductSearch from "../features/products/components/ProductSearch";
import ProductFilters from "../features/products/components/ProductFilters";
import Navbar from "@/components/layout/Navbar";

const SORTERS = {
  "price-low": (a, b) => a.price - b.price,
  "price-high": (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating,
};

export default function Products() {
  const navigate = useNavigate();

  const { products, isloading, error, searchTerm, selectedBrand, selectedCategory, sortBy } =
    useSelector((state) => state.products);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    const result = products.filter(
      (product) =>
        (!term ||
          product.name.toLowerCase().includes(term) ||
          product.brand.toLowerCase().includes(term)) &&
        (selectedBrand === "all" || product.brand === selectedBrand) &&
        (selectedCategory === "all" || product.category === selectedCategory)
    );

    const sorter = SORTERS[sortBy];
    return sorter ? result.sort(sorter) : result;
  }, [products, searchTerm, selectedBrand, selectedCategory, sortBy]);

  if (isloading) return <Loader />;

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-24 text-center">
        <p className="text-lg font-medium">We couldn't load the shoes.</p>
        <p className="mt-2 text-neutral-500">Check your connection and refresh the page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 py-10 lg:py-14 mt-10">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="grid size-10 place-items-center rounded-full transition hover:bg-neutral-100"
          >
            <ArrowLeft className="size-5" />
          </button>

          <div>
            <h1 className="text-4xl font-semibold tracking-tight">All products</h1>
            <p className="mt-1 text-neutral-500">
              {filteredProducts.length} {filteredProducts.length === 1 ? "pair" : "pairs"}
            </p>
          </div>
        </div>

        <div className="mt-10 space-y-6">
          <ProductSearch />
          <ProductFilters />
        </div>

        <div className="mt-10">
          {filteredProducts.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-lg font-medium">No shoes match your search.</p>
              <p className="mt-2 text-neutral-500">
                Try a different name or clear some filters.
              </p>
            </div>
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
        </div>
      </div>
    </div>
  );
}