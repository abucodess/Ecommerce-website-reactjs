import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviews, updateReviewStatus, deleteReview } from '../features/reviews/reviewSlice';
import { fetchProducts } from '../features/products/productSlice';
import { Search, Filter, EyeOff, Eye, Trash2, Star } from 'lucide-react';
import ConfirmDialog from '../components/common/ConfirmDialog';

function Reviews() {
  const dispatch = useDispatch();
  const { reviews, loading } = useSelector((state) => state.reviews);
  const { products } = useSelector((state) => state.products);
  
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all, visible, hidden
  const [ratingFilter, setRatingFilter] = useState('all');
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchReviews());
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const handleToggleHide = (review) => {
    dispatch(updateReviewStatus({ id: review.id, isHidden: !review.isHidden }));
  };

  const handleDeleteClick = (review) => {
    setReviewToDelete(review);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (reviewToDelete) {
      await dispatch(deleteReview(reviewToDelete.id));
      setDeleteConfirmOpen(false);
      setReviewToDelete(null);
    }
  };

  const getProductInfo = (productId) => {
    const product = products.find(p => String(p.id) === String(productId));
    return product ? { name: product.name, image: product.images?.[0] || product.image } : { name: 'Unknown Product', image: null };
  };

  const filteredReviews = reviews.filter((review) => {
    const product = getProductInfo(review.productId);
    const searchString = `${review.userName || ''} ${review.comment || ''} ${product.name}`.toLowerCase();
    
    const matchesSearch = searchString.includes(search.toLowerCase());
    
    const matchesStatus = filter === 'all' || 
      (filter === 'hidden' && review.isHidden) || 
      (filter === 'visible' && !review.isHidden);
      
    const matchesRating = ratingFilter === 'all' || Number(review.rating) === Number(ratingFilter);
    
    return matchesSearch && matchesStatus && matchesRating;
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            size={14} 
            className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Reviews</h1>
          <p className="text-sm text-gray-500">Manage and moderate customer product reviews</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="relative w-full lg:w-96">
          <input
            type="text"
            placeholder="Search reviews, customers, or products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm outline-none transition focus:border-black"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full sm:w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-black"
            >
              <option value="all">All Status</option>
              <option value="visible">Visible</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <Star size={18} className="text-gray-400" />
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="w-full sm:w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-black"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">Review</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && reviews.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center">
                    <div className="flex justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">
                    No reviews found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review) => {
                  const product = getProductInfo(review.productId);
                  return (
                    <tr key={review.id} className={`hover:bg-gray-50/50 transition-colors ${review.isHidden ? 'bg-gray-50/50 opacity-75' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                            <img src={product.image || '/placeholder.png'} alt={product.name} className="h-full w-full object-cover" />
                          </div>
                          <div className="text-sm font-medium text-gray-900 max-w-[150px] truncate" title={product.name}>
                            {product.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 mb-1">{review.userName || 'Anonymous'}</div>
                        <p className="text-sm text-gray-600 line-clamp-2" title={review.comment}>{review.comment}</p>
                        <div className="text-xs text-gray-400 mt-1">{formatDate(review.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderStars(review.rating)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {review.isHidden ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600"><EyeOff size={12} /> Hidden</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"><Eye size={12} /> Visible</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-3 items-center">
                          <button
                            onClick={() => handleToggleHide(review)}
                            className={`${review.isHidden ? 'text-green-600 hover:text-green-800' : 'text-orange-500 hover:text-orange-700'} transition flex items-center`}
                            title={review.isHidden ? "Make Visible" : "Hide Review"}
                          >
                            {review.isHidden ? <Eye size={18} /> : <EyeOff size={18} />}
                          </button>
                          <button
                            onClick={() => handleDeleteClick(review)}
                            className="text-red-500 hover:text-red-700 transition flex items-center"
                            title="Delete Review"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Delete Review"
        message={`Are you sure you want to delete this review by ${reviewToDelete?.userName || 'this user'}? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setReviewToDelete(null);
        }}
      />
    </div>
  );
}

export default Reviews;
