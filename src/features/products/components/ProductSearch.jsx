import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { useDebounce } from "../../../hooks/useDebounce";
import { setSearchTerm } from "../productSlice";

export default function ProductSearch() {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    dispatch(setSearchTerm(debouncedQuery.trim()));
  }, [debouncedQuery, dispatch]);

  return (
    <div className="relative">
      <Search
        size={20}
        className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400"
      />

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search shoes, brands, styles"
        aria-label="Search products"
        className="w-full rounded-full border border-neutral-200 bg-white py-4 pl-14 pr-14 text-base text-neutral-900 shadow-sm outline-none transition placeholder:text-neutral-400 hover:border-neutral-300 focus:border-black focus:ring-4 focus:ring-black/5 [&::-webkit-search-cancel-button]:hidden"
      />

      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-neutral-500 transition hover:bg-neutral-100 hover:text-black"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}