import { useDispatch, useSelector } from "react-redux";

import { setSelectedBrand, setSelectedCategory, setSortBy } from "../productSlice";

export default function ProductFilters() {
  const dispatch = useDispatch();

  const { selectedBrand, selectedCategory, sortBy } = useSelector(
    (state) => state.products,
  );

  const selectClass =
    "px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black cursor-pointer";

  return (
    <div className="flex flex-wrap gap-3 items-center p-4 bg-gray-50 rounded-xl">
      <select
        value={selectedBrand}
        onChange={(e) => dispatch(setSelectedBrand(e.target.value))}
        className={selectClass}
      >
        <option value="all">All Brands</option>
        <option value="Nike">Nike</option>
        <option value="Adidas">Adidas</option>
        <option value="Puma">Puma</option>
      </select>

      <select
        value={selectedCategory}
        onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
        className={selectClass}
      >
        <option value="all">All</option>
        <option value="Running">Running</option>
        <option value="Lifestyle">LifeStyle</option>
      </select>

      <select
        value={sortBy}
        onChange={(e) => dispatch(setSortBy(e.target.value))}
        className={selectClass}
      >
        <option value="featured">Featured</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
      </select>
    </div>
  );
}