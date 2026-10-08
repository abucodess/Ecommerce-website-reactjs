import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoupons, addCoupon, updateCoupon, deleteCoupon } from '../features/coupons/couponSlice';
import { Plus, Edit2, Trash2, CheckCircle2, Ban, Ticket } from 'lucide-react';
import ConfirmDialog from '../components/common/ConfirmDialog';

export default function Coupons() {
  const dispatch = useDispatch();
  const { coupons, loading } = useSelector((state) => state.coupons);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minPurchase: '',
    expiryDate: '',
    isActive: true
  });

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

  const handleOpenModal = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minPurchase: coupon.minPurchase,
        expiryDate: coupon.expiryDate,
        isActive: coupon.isActive
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        minPurchase: '',
        expiryDate: '',
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCoupon(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingCoupon) {
      await dispatch(updateCoupon({ id: editingCoupon.id, ...formData }));
    } else {
      await dispatch(addCoupon({ id: Date.now().toString(), ...formData }));
    }
    handleCloseModal();
  };

  const handleToggleStatus = (coupon) => {
    dispatch(updateCoupon({ id: coupon.id, isActive: !coupon.isActive }));
  };

  const handleDeleteClick = (coupon) => {
    setCouponToDelete(coupon);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (couponToDelete) {
      await dispatch(deleteCoupon(couponToDelete.id));
      setDeleteConfirmOpen(false);
      setCouponToDelete(null);
    }
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
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Coupons</h1>
          <p className="text-sm text-gray-500">Manage discount codes and promotions</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          <Plus size={16} /> Add Coupon
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Purchase</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && coupons.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="flex justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
                    </div>
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">
                    No coupons found. Create one to get started!
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Ticket className="text-gray-400" size={16} />
                        <span className="font-bold text-gray-900 uppercase tracking-wider">{coupon.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{coupon.minPurchase || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(coupon.expiryDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {coupon.isActive ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"><CheckCircle2 size={12} /> Active</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"><Ban size={12} /> Inactive</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-3 items-center">
                        <button
                          onClick={() => handleToggleStatus(coupon)}
                          className={`${coupon.isActive ? 'text-orange-500 hover:text-orange-700' : 'text-green-500 hover:text-green-700'} transition flex items-center`}
                          title={coupon.isActive ? "Deactivate" : "Activate"}
                        >
                          {coupon.isActive ? <Ban size={18} /> : <CheckCircle2 size={18} />}
                        </button>
                        <button
                          onClick={() => handleOpenModal(coupon)}
                          className="text-blue-500 hover:text-blue-700 transition flex items-center"
                          title="Edit Coupon"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(coupon)}
                          className="text-red-500 hover:text-red-700 transition flex items-center"
                          title="Delete Coupon"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <Ban size={20} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 uppercase"
                  placeholder="e.g. SUMMER20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                    placeholder={formData.discountType === 'percentage' ? "20" : "500"}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Purchase Amount (₹)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.minPurchase}
                  onChange={(e) => setFormData({...formData, minPurchase: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  placeholder="0 for no minimum"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input
                  type="date"
                  required
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={handleCloseModal} className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="flex-1 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
                  {editingCoupon ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Delete Coupon"
        message={`Are you sure you want to delete the coupon code ${couponToDelete?.code}?`}
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </div>
  );
}
