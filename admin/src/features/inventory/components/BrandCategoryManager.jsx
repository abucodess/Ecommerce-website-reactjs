import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import ConfirmDialog from '../../../components/common/ConfirmDialog';

const BrandCategoryManager = ({ type, items, onAdd, onUpdate, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleAddNew = () => {
    setIsAdding(true);
    setFormData({ name: '', description: '' });
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({ name: item.name, description: item.description || '' });
  };

  const handleSaveAdd = async () => {
    if (formData.name.trim()) {
      await onAdd({ ...formData, id: Date.now().toString() });
      setIsAdding(false);
      setFormData({ name: '', description: '' });
    }
  };

  const handleSaveEdit = async (id) => {
    if (formData.name.trim()) {
      await onUpdate(id, formData);
      setEditingId(null);
      setFormData({ name: '', description: '' });
    }
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      await onDelete(itemToDelete.id);
    }
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/50 rounded-t-xl">
        <h2 className="text-lg font-semibold text-gray-900">{type}s</h2>
        {!isAdding && (
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition"
          >
            <Plus size={16} />
            Add {type}
          </button>
        )}
      </div>

      <div className="p-0">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isAdding && (
              <tr className="bg-blue-50/30">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={`${type} Name`}
                    className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-black"
                    autoFocus
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Description"
                    className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-black"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button onClick={handleSaveAdd} className="text-green-600 hover:text-green-900 p-1 bg-green-50 rounded-md">
                      <Check size={16} />
                    </button>
                    <button onClick={() => setIsAdding(false)} className="text-gray-500 hover:text-gray-700 p-1 bg-gray-100 rounded-md">
                      <X size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === item.id ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-black"
                    />
                  ) : (
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === item.id ? (
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-black"
                    />
                  ) : (
                    <div className="text-sm text-gray-500">{item.description || '-'}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {editingId === item.id ? (
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleSaveEdit(item.id)} className="text-green-600 hover:text-green-900 p-1 bg-green-50 rounded-md">
                        <Check size={16} />
                      </button>
                      <button onClick={() => setEditingId(null)} className="text-gray-500 hover:text-gray-700 p-1 bg-gray-100 rounded-md">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-3">
                      <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-900 transition">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(item)} className="text-red-600 hover:text-red-900 transition">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            
            {!isAdding && items.length === 0 && (
              <tr>
                <td colSpan="3" className="px-6 py-8 text-center text-sm text-gray-500">
                  No {type.toLowerCase()}s found. Click 'Add {type}' to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title={`Delete ${type}`}
        message={`Are you sure you want to delete the ${type.toLowerCase()} "${itemToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setItemToDelete(null);
        }}
      />
    </div>
  );
};

export default BrandCategoryManager;
