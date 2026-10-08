import React, { useState } from 'react';
import { Search, Save, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

const StockManager = ({ products, onUpdate }) => {
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  
  // Local state for the currently edited sizes array
  const [editingSizes, setEditingSizes] = useState(null);

  const filteredProducts = products.filter(p => !p.isDeleted).filter(product => {
    return product.name.toLowerCase().includes(search.toLowerCase()) || 
           (product.sku || '').toLowerCase().includes(search.toLowerCase());
  });

  const toggleExpand = (product) => {
    if (expandedId === product.id) {
      setExpandedId(null);
      setEditingSizes(null);
    } else {
      setExpandedId(product.id);
      
      // Normalize sizes to object format if they aren't already
      const normalizedSizes = (product.sizes || []).map(s => {
        if (typeof s === 'object' && s !== null) {
          return { ...s };
        }
        return { size: s, stock: 0 }; // Default stock to 0 for legacy arrays
      });
      
      setEditingSizes(normalizedSizes);
    }
  };

  const handleStockChange = (index, value) => {
    const newSizes = [...editingSizes];
    newSizes[index].stock = Math.max(0, parseInt(value) || 0);
    setEditingSizes(newSizes);
  };

  const handleSave = async (product) => {
    await onUpdate(product.id, { ...product, sizes: editingSizes });
    setExpandedId(null);
    setEditingSizes(null);
  };

  const calculateTotalStock = (sizes) => {
    if (!Array.isArray(sizes)) return 0;
    return sizes.reduce((total, s) => {
      const stock = typeof s === 'object' && s !== null ? s.stock : 0;
      return total + (stock || 0);
    }, 0);
  };

  const hasLowStock = (sizes) => {
    if (!Array.isArray(sizes)) return false;
    return sizes.some(s => typeof s === 'object' && s !== null && s.stock > 0 && s.stock <= 5);
  };

  const hasOutOfStock = (sizes) => {
    if (!Array.isArray(sizes)) return false;
    return sizes.some(s => typeof s === 'object' && s !== null && s.stock === 0);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200 bg-gray-50/50 rounded-t-xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-900">Size-Level Stock</h2>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm outline-none transition focus:border-black"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
        </div>
      </div>

      <div className="p-0 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Manage</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => {
              const isExpanded = expandedId === product.id;
              const totalStock = calculateTotalStock(product.sizes);
              const isLow = hasLowStock(product.sizes);
              const isOut = hasOutOfStock(product.sizes);
              
              return (
                <React.Fragment key={product.id}>
                  <tr className={`hover:bg-gray-50/50 transition-colors ${isExpanded ? 'bg-gray-50/80' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img className="h-full w-full object-cover" src={product.images?.[0] || product.image || '/placeholder.png'} alt="" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500">{product.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.sku || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {totalStock} units
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        {isOut && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Out of Stock</span>}
                        {isLow && !isOut && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">Low Stock</span>}
                        {!isOut && !isLow && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">In Stock</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => toggleExpand(product)}
                        className="text-gray-500 hover:text-black flex items-center gap-1 justify-end ml-auto"
                      >
                        {isExpanded ? 'Close' : 'Update'}
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="bg-gray-50/80">
                      <td colSpan="5" className="px-6 py-4 border-b border-gray-200">
                        <div className="pl-14">
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">Update Size Quantities</h4>
                          
                          {editingSizes.length === 0 ? (
                            <p className="text-sm text-gray-500">No sizes configured for this product.</p>
                          ) : (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {editingSizes.map((sizeObj, index) => (
                                  <div key={index} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Size {sizeObj.size}</span>
                                      {sizeObj.stock === 0 && <AlertCircle size={14} className="text-red-500" />}
                                    </div>
                                    <input
                                      type="number"
                                      min="0"
                                      value={sizeObj.stock}
                                      onChange={(e) => handleStockChange(index, e.target.value)}
                                      className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm outline-none focus:border-black text-center font-medium"
                                    />
                                  </div>
                                ))}
                              </div>
                              
                              <div className="flex justify-end pt-2">
                                <button
                                  onClick={() => handleSave(product)}
                                  className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition shadow-sm"
                                >
                                  <Save size={16} /> Save Inventory
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
            
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockManager;
