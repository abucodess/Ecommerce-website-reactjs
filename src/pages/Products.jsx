import { useSelector } from "react-redux";
import ProductCard from "../components/product/ProductCard";
import ProductSearch from "../features/products/components/ProductSearch";
import { useDebounce } from "../hooks/useDebounce";
import Loader from "../components/common/Loader";
import { useState } from "react";
import ProductFilters from "../features/products/components/ProductFilters";
import Navbar from "../components/layout/Navbar";
import ProductGrid from "../components/product/ProductGrid";

export default function Products() {
const {
  products,
  isloading,
  error,
  searchTerm,
  selectedBrand,
  selectedCategory,
  sortBy
} = useSelector(state => state.products);
let debouncedSearch = useDebounce(searchTerm,500) 
if(isloading){
  return (<Loader/>)
}
let filteredProducts = products.filter((product) =>
  product.name
    .toLowerCase()
    .includes(debouncedSearch.toLowerCase().trim()) || product.brand.toLowerCase().includes(debouncedSearch.toLowerCase().trim())
);
 if(selectedBrand !=="all"){
  filteredProducts=  filteredProducts.filter(x=>x.brand == selectedBrand)
 }
 if (selectedCategory !== "all") {
  filteredProducts = filteredProducts.filter(
    product => product.category === selectedCategory
  );
}
if(sortBy!== "featured"){
 switch (sortBy) {
  case "price-low":
    filteredProducts = [...filteredProducts].sort(
      (a, b) => a.price - b.price
    );
    break;

  case "price-high":
    filteredProducts = [...filteredProducts].sort(
      (a, b) => b.price - a.price
    );
    break;

  case "rating":
    filteredProducts = [...filteredProducts].sort(
      (a, b) => b.rating - a.rating
    );
    break;
}
}
return (
 <div>
   {/* <Navbar /> */}
   <h1 className="text-3xl font-bold mt-1 ">All Products</h1>

  <p className="text-gray-500">
    {filteredProducts.length} products
  </p>
  <ProductSearch/>
  <ProductFilters/>
 <ProductGrid products={filteredProducts}>
 </ProductGrid>
 </div>

  );
}
