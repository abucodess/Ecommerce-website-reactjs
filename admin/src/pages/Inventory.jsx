import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Package, Tag, Layers } from 'lucide-react';
import { fetchBrands, addBrand, updateBrand, deleteBrand } from '../features/inventory/brandSlice';
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '../features/inventory/categorySlice';
import { fetchProducts, updateProduct } from '../features/products/productSlice';
import BrandCategoryManager from '../features/inventory/components/BrandCategoryManager';
import StockManager from '../features/inventory/components/StockManager';

function Inventory() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('stock');

  const { brands, loading: brandsLoading } = useSelector(state => state.brands);
  const { categories, loading: categoriesLoading } = useSelector(state => state.categories);
  const { products, loading: productsLoading } = useSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchBrands());
    dispatch(fetchCategories());
    dispatch(fetchProducts());
  }, [dispatch]);

  const loading = brandsLoading || categoriesLoading || productsLoading;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Inventory</h1>
          <p className="text-sm text-gray-500">Manage your product stock, brands, and categories.</p>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('stock')}
            className={`${
              activeTab === 'stock'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            <Package className="mr-2 h-5 w-5" />
            Stock Management
          </button>
          <button
            onClick={() => setActiveTab('brands')}
            className={`${
              activeTab === 'brands'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            <Tag className="mr-2 h-5 w-5" />
            Brands
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`${
              activeTab === 'categories'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            <Layers className="mr-2 h-5 w-5" />
            Categories
          </button>
        </nav>
      </div>

      <div className="mt-6">
        {loading && products.length === 0 ? (
          <div className="flex justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
          </div>
        ) : (
          <>
            {activeTab === 'stock' && (
              <StockManager products={products} onUpdate={(id, data) => dispatch(updateProduct({ id, product: data }))} />
            )}
            {activeTab === 'brands' && (
              <BrandCategoryManager 
                type="Brand" 
                items={brands} 
                onAdd={(data) => dispatch(addBrand(data))}
                onUpdate={(id, data) => dispatch(updateBrand({ id, data }))}
                onDelete={(id) => dispatch(deleteBrand(id))}
              />
            )}
            {activeTab === 'categories' && (
              <BrandCategoryManager 
                type="Category" 
                items={categories} 
                onAdd={(data) => dispatch(addCategory(data))}
                onUpdate={(id, data) => dispatch(updateCategory({ id, data }))}
                onDelete={(id) => dispatch(deleteCategory(id))}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Inventory;
