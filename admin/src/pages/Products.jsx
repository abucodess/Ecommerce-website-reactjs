import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  deleteProduct,
  setSearch,
  setBrandFilter,
  setCategoryFilter,
  setSelectedProduct,
} from "../features/products/productSlice";


import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
  Star,
  Loader2,
  X,
} from "lucide-react";
import AddProduct from "../features/products/AddProduct";
import EditProduct from "../features/products/EditProduct";
import ConfirmDialog from "../components/common/ConfirmDialog";

function Products() {
  const dispatch = useDispatch();

  const {
    products,
    loading,
    error,
    filters,
    selectedProduct,
  } = useSelector((state) => state.products);

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // =========================
  // Fetch Products
  // =========================

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // =========================
  // Unique Brands
  // =========================

  const brands = useMemo(() => {
    return [...new Set(products.map((product) => product.brand))];
  }, [products]);

  // =========================
  // Unique Categories
  // =========================

  const categories = useMemo(() => {
    return [...new Set(products.map((product) => product.category))];
  }, [products]);

  // =========================
  // Filter Products
  // =========================

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (product.isDeleted) return false;

      const searchMatch =
        product.name
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        product.brand
          .toLowerCase()
          .includes(filters.search.toLowerCase());

      const brandMatch =
        filters.brand === "all" ||
        product.brand === filters.brand;

      const categoryMatch =
        filters.category === "all" ||
        product.category === filters.category;

      return searchMatch && brandMatch && categoryMatch;
    });
  }, [products, filters]);

  // =========================
  // Open Edit
  // =========================

  const handleEdit = (product) => {
    dispatch(setSelectedProduct(product));
    setShowEditProduct(true);
  };

  // =========================
  // Close Edit
  // =========================

  const handleCloseEdit = () => {
    setShowEditProduct(false);
    dispatch(setSelectedProduct(null));
  };

  // =========================
  // Delete Product
  // =========================

  const handleDelete = (product) => {
    setProductToDelete(product);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      dispatch(deleteProduct(productToDelete.id));
    }
    setDeleteConfirmOpen(false);
    setProductToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* =========================
          Header
      ========================= */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Products
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your store products
          </p>
        </div>

        <button
          onClick={() => setShowAddProduct(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          <Plus size={18} />
          Add Product
        </button>

      </div>

      {/* =========================
          Stats
      ========================= */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Products
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {products.length}
              </p>
            </div>

            <div className="rounded-lg bg-gray-100 p-3">
              <Package size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Featured
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {products.filter((product) => product.isFeatured).length}
              </p>
            </div>

            <div className="rounded-lg bg-gray-100 p-3">
              <Star size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                New Products
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {products.filter((product) => product.isNew).length}
              </p>
            </div>

            <div className="rounded-lg bg-gray-100 p-3">
              <Package size={22} />
            </div>
          </div>
        </div>

      </div>

      {/* =========================
          Filters
      ========================= */}

      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4">

        <div className="flex flex-col gap-3 lg:flex-row">

          {/* Search */}

          <div className="relative flex-1">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={filters.search}
              onChange={(e) =>
                dispatch(setSearch(e.target.value))
              }
              placeholder="Search products..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-black focus:bg-white"
            />

          </div>

          {/* Brand */}

          <select
            value={filters.brand}
            onChange={(e) =>
              dispatch(setBrandFilter(e.target.value))
            }
            className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-black"
          >
            <option value="all">All Brands</option>

            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>

          {/* Category */}

          <select
            value={filters.category}
            onChange={(e) =>
              dispatch(setCategoryFilter(e.target.value))
            }
            className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-black"
          >
            <option value="all">All Categories</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

        </div>

      </div>

      {/* =========================
          Error
      ========================= */}

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <X size={18} />
          {error}
        </div>
      )}

      {/* =========================
          Product Table
      ========================= */}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

        <div className="overflow-x-auto">

          <table className="w-full min-w-225">

            <thead className="border-b border-gray-200 bg-gray-50">

              <tr>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Product
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Brand
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Category
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Price
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Rating
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-gray-100">

              {loading && products.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center"
                  >
                    <div className="flex flex-col items-center gap-3 text-gray-500">

                      <Loader2
                        size={28}
                        className="animate-spin"
                      />

                      <span className="text-sm">
                        Loading products...
                      </span>

                    </div>
                  </td>
                </tr>
              )}

              {/* Empty */}

              {!loading && filteredProducts.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center"
                  >
                    <Package
                      size={36}
                      className="mx-auto mb-3 text-gray-300"
                    />

                    <p className="font-medium text-gray-700">
                      No products found
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              )}

              {/* Products */}

              {filteredProducts.map((product) => (

                <tr
                  key={product.id}
                  className="transition hover:bg-gray-50"
                >

                  {/* Product */}

                  <td className="px-6 py-4">

                    <div className="flex items-center gap-4">

                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">

                        <img
                          src={product.images?.[0] || product.image || '/placeholder.png'}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />

                      </div>

                      <div>

                        <p className="font-medium text-gray-900">
                          {product.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          ID: {product.id}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* Brand */}

                  <td className="px-6 py-4 text-sm text-gray-700">
                    {product.brand}
                  </td>

                  {/* Category */}

                  <td className="px-6 py-4">

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      {product.category}
                    </span>

                  </td>

                  {/* Price */}

                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    ₹{product.price.toLocaleString("en-IN")}
                  </td>

                  {/* Rating */}

                  <td className="px-6 py-4">

                    <div className="flex items-center gap-1">

                      <Star
                        size={15}
                        className="fill-yellow-400 text-yellow-400"
                      />

                      <span className="text-sm font-medium">
                        {product.rating}
                      </span>

                      <span className="text-xs text-gray-400">
                        ({product.reviews})
                      </span>

                    </div>

                  </td>

                  {/* Status */}

                  <td className="px-6 py-4">

                    <div className="flex flex-wrap gap-2">

                      {product.isNew && (
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                          New
                        </span>
                      )}

                      {product.isFeatured && (
                        <span className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-600">
                          Featured
                        </span>
                      )}
                      
                      {!product.isActive ? (
                        <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">
                          Inactive
                        </span>
                      ) : (
                        !product.isNew && !product.isFeatured && (
                          <span className="text-xs text-gray-400">
                            Standard
                          </span>
                        )
                      )}

                    </div>

                  </td>

                  {/* Actions */}

                  <td className="px-6 py-4">

                    <div className="flex justify-end gap-2">

                      <button
                        onClick={() => handleEdit(product)}
                        className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-100 hover:text-black"
                        title="Edit product"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(product)}
                        className="rounded-lg border border-red-200 p-2 text-red-500 transition hover:bg-red-50"
                        title="Delete product"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* =========================
          Add Product
      ========================= */}

      {showAddProduct && (
        <AddProduct
          onClose={() => setShowAddProduct(false)}
        />
      )}

      {/* =========================
          Edit Product
      ========================= */}

      {showEditProduct && selectedProduct && (
        <EditProduct
          product={selectedProduct}
          onClose={handleCloseEdit}
        />
      )}

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be fully undone. It will be soft-deleted to preserve historical orders."
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setProductToDelete(null);
        }}
        productInfo={productToDelete ? {
          name: productToDelete.name,
          brand: productToDelete.brand,
          image: productToDelete.images?.[0] || productToDelete.image || '/placeholder.png'
        } : null}
      />
    </div>
  );
}

export default Products;