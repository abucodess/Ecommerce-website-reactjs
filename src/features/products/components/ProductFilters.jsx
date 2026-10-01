import { ChevronDown, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedBrand, setSelectedCategory, setSortBy } from "../productSlice";

const BRANDS = ["Nike", "Adidas", "Puma", "New Balance"];
const CATEGORIES = ["Running", "Lifestyle"];
const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

function Pill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
        active
          ? "border-black bg-black text-white"
          : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
      }`}
    >
      {children}
    </button>
  );
}

export default function ProductFilters() {
  const dispatch = useDispatch();
  const { selectedBrand, selectedCategory, sortBy } = useSelector((state) => state.products);

  const hasFilters = selectedBrand !== "all" || selectedCategory !== "all";

  const clearFilters = () => {
    dispatch(setSelectedBrand("all"));
    dispatch(setSelectedCategory("all"));
  };

  return (
    <div className="space-y-5 border-y border-neutral-200 py-6">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Brand">
        <Pill active={selectedBrand === "all"} onClick={() => dispatch(setSelectedBrand("all"))}>
          All brands
        </Pill>
        {BRANDS.map((brand) => (
          <Pill
            key={brand}
            active={selectedBrand === brand}
            onClick={() => dispatch(setSelectedBrand(brand))}
          >
            {brand}
          </Pill>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Category">
          <Pill
            active={selectedCategory === "all"}
            onClick={() => dispatch(setSelectedCategory("all"))}
          >
            All styles
          </Pill>
          {CATEGORIES.map((category) => (
            <Pill
              key={category}
              active={selectedCategory === category}
              onClick={() => dispatch(setSelectedCategory(category))}
            >
              {category}
            </Pill>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-sm font-medium text-neutral-500 transition hover:text-black"
            >
              <X size={14} />
              Clear filters
            </button>
          )}

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => dispatch(setSortBy(e.target.value))}
              aria-label="Sort products"
              className="cursor-pointer appearance-none rounded-full border border-neutral-200 bg-white py-2 pl-4 pr-10 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}