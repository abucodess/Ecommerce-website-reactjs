import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBanners, addBanner, updateBanner, deleteBanner } from '../features/banners/bannerSlice';
import { Plus, Edit2, Trash2, CheckCircle2, Ban, Image as ImageIcon, UploadCloud } from 'lucide-react';
import ConfirmDialog from '../components/common/ConfirmDialog';
import axios from 'axios';

export default function Banners() {
  const dispatch = useDispatch();
  const { banners, loading } = useSelector((state) => state.banners);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    link: '',
    image: '',
    isActive: true,
    order: 0,
    startDate: '',
    endDate: ''
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);

  const handleOpenModal = (banner = null) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title,
        link: banner.link,
        image: banner.image,
        isActive: banner.isActive,
        order: banner.order,
        startDate: banner.startDate || '',
        endDate: banner.endDate || ''
      });
    } else {
      setEditingBanner(null);
      setFormData({
        title: '',
        link: '',
        image: '',
        isActive: true,
        order: banners.length + 1,
        startDate: '',
        endDate: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBanner(null);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingImage(true);
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        form
      );
      setFormData({ ...formData, image: res.data.secure_url });
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingBanner) {
      await dispatch(updateBanner({ id: editingBanner.id, ...formData }));
    } else {
      await dispatch(addBanner({ id: Date.now().toString(), ...formData }));
    }
    handleCloseModal();
  };

  const handleToggleStatus = (banner) => {
    dispatch(updateBanner({ id: banner.id, isActive: !banner.isActive }));
  };

  const handleDeleteClick = (banner) => {
    setBannerToDelete(banner);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (bannerToDelete) {
      await dispatch(deleteBanner(bannerToDelete.id));
      setDeleteConfirmOpen(false);
      setBannerToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Banners</h1>
          <p className="text-sm text-gray-500">Manage homepage hero banners and promotions</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          <Plus size={16} /> Add Banner
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preview</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && banners.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center">
                    <div className="flex justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
                    </div>
                  </td>
                </tr>
              ) : [...banners].sort((a,b)=>a.order - b.order).map((banner) => (
                <tr key={banner.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-16 w-32 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                      {banner.image ? (
                        <img src={banner.image} alt={banner.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{banner.title}</div>
                    <div className="text-xs text-blue-600 truncate max-w-[200px]">{banner.link || 'No Link'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {banner.order}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {banner.isActive ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"><CheckCircle2 size={12} /> Active</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"><Ban size={12} /> Inactive</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-3 items-center">
                      <button
                        onClick={() => handleToggleStatus(banner)}
                        className={`${banner.isActive ? 'text-orange-500 hover:text-orange-700' : 'text-green-500 hover:text-green-700'} transition flex items-center`}
                        title={banner.isActive ? "Deactivate" : "Activate"}
                      >
                        {banner.isActive ? <Ban size={18} /> : <CheckCircle2 size={18} />}
                      </button>
                      <button
                        onClick={() => handleOpenModal(banner)}
                        className="text-blue-500 hover:text-blue-700 transition flex items-center"
                        title="Edit Banner"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(banner)}
                        className="text-red-500 hover:text-red-700 transition flex items-center"
                        title="Delete Banner"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">{editingBanner ? 'Edit Banner' : 'Create Banner'}</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <Ban size={20} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image</label>
                <div className="flex flex-col gap-3">
                  {formData.image && (
                    <div className="h-32 w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
                      <img src={formData.image} alt="Preview" className="h-full w-full object-cover" />
                    </div>
                  )}
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-4 hover:bg-gray-50 transition">
                    <UploadCloud className="text-gray-400" size={24} />
                    <span className="text-sm font-medium text-gray-600">
                      {uploadingImage ? 'Uploading...' : 'Upload Image'}
                    </span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title (Internal Name)</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link / URL Destination</label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  placeholder="/products/category-name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    required
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="w-4 h-4 rounded text-black focus:ring-black"
                    />
                    <span className="text-sm font-medium text-gray-700">Active Banner</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date (Optional)</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date (Optional)</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={handleCloseModal} className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={!formData.image} className="flex-1 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50">
                  {editingBanner ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Delete Banner"
        message={`Are you sure you want to delete the banner "${bannerToDelete?.title}"?`}
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </div>
  );
}
