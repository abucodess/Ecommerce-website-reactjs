import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Save, AlertCircle } from 'lucide-react';
import { updateProduct } from './productSlice';
import { fetchBrands } from '../inventory/brandSlice';
import { fetchCategories } from '../inventory/categorySlice';
import ProductImageUploader from './components/ProductImageUploader';

const EditProduct = ({ product, onClose }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.products);
  const { brands } = useSelector((state) => state.brands);
  const { categories } = useSelector((state) => state.categories);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    price: '',
    description: '',
    sku: '',
    isNew: false,
    isFeatured: false,
    isActive: true,
  });

  const [sizes, setSizes] = useState('');
  const [images, setImages] = useState([]);

  useEffect(() => {
    dispatch(fetchBrands());
    dispatch(fetchCategories());
    if (product) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: product.name || '',
        brand: product.brand || '',
        category: product.category || '',
        price: product.price || '',
        description: product.description || '',
        sku: product.sku || '',
        isNew: product.isNew || false,
        isFeatured: product.isFeatured || false,
        isActive: product.isActive !== undefined ? product.isActive : true,
      });

      // Handle legacy image vs new images array
      const productImages = product.images?.length > 0 
        ? product.images 
        : (product.image ? [product.image] : []);
      
      setImages(productImages);

      // Extract size value from either array of numbers/strings or objects
      const parsedSizes = Array.isArray(product.sizes) 
        ? product.sizes.map(s => (typeof s === 'object' && s !== null) ? s.size : s).join(', ')
        : '';
      setSizes(parsedSizes);
    }
  }, [product, dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.brand || !formData.category || !formData.price || !formData.description) {
      setError("Please fill in all required fields.");
      return;
    }

    if (images.length === 0) {
      setError("Please upload at least one product image.");
      return;
    }

    const price = Number(formData.price);
    if (isNaN(price) || price <= 0) {
      setError("Please enter a valid price.");
      return;
    }

    let parsedSizes = [];
    if (sizes.trim()) {
      parsedSizes = sizes.split(',').map(s => s.trim()).filter(Boolean);
      if (parsedSizes.length !== new Set(parsedSizes).size) {
        setError("Duplicate sizes are not allowed.");
        return;
      }
      
      // Keep existing object format if any, else use numbers
      parsedSizes = parsedSizes.map(sizeStr => {
        const numSize = isNaN(Number(sizeStr)) ? sizeStr : Number(sizeStr);
        // Find if this size existed in the original product sizes as an object
        const existingSizeObj = Array.isArray(product.sizes) 
          ? product.sizes.find(s => (typeof s === 'object' && s !== null ? s.size : s) === numSize)
          : null;
        
        return existingSizeObj || numSize;
      });
    }

    const updatedProduct = {
      ...product,
      ...formData,
      price,
      images,
      image: images[0], // fallback for legacy
      sizes: parsedSizes,
    };

    try {
      await dispatch(updateProduct({ id: product.id, product: updatedProduct })).unwrap();
      onClose();
    } catch (err) {
      setError(err?.message || "Failed to update product");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex w-full max-w-4xl max-h-[90vh] flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-bold text-gray-900">Edit Product</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form id="edit-product-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Images section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Product Images (Max 6)</h3>
              <ProductImageUploader images={images} onChange={setImages} onError={setError} />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none transition focus:border-black"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">SKU</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none transition focus:border-black"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Brand *</label>
                <input
                  type="text"
                  name="brand"
                  list="edit-brands-list"
                  required
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none transition focus:border-black"
                />
                <datalist id="edit-brands-list">
                  {brands?.map(b => <option key={b.id} value={b.name} />)}
                </datalist>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Category *</label>
                <input
                  type="text"
                  name="category"
                  list="edit-categories-list"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none transition focus:border-black"
                />
                <datalist id="edit-categories-list">
                  {categories?.map(c => <option key={c.id} value={c.name} />)}
                </datalist>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none transition focus:border-black"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Sizes (Comma separated)</label>
                <input
                  type="text"
                  value={sizes}
                  onChange={(e) => setSizes(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none transition focus:border-black"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Description *</label>
              <textarea
                name="description"
                required
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none transition focus:border-black"
              />
            </div>

            <div className="flex flex-wrap gap-6 border-t pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                />
                <span className="text-sm font-medium text-gray-700">Active Product</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isNew"
                  checked={formData.isNew}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                />
                <span className="text-sm font-medium text-gray-700">Mark as New</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                />
                <span className="text-sm font-medium text-gray-700">Featured Product</span>
              </label>
            </div>
          </form>
        </div>

        <div className="flex items-center justify-end gap-3 border-t bg-gray-50 px-6 py-4 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-product-form"
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Save size={18} />
            )}
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
