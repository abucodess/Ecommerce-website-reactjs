import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({ 
  isOpen, 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  onConfirm, 
  onCancel,
  productInfo = null
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle size={20} />
            <h2 className="text-lg font-bold">{title}</h2>
          </div>
          <button
            onClick={onCancel}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 transition"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-gray-700">{message}</p>
          
          {productInfo && (
            <div className="mt-4 flex items-center gap-4 rounded-xl border border-gray-200 p-3 bg-gray-50">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-200">
                <img 
                  src={productInfo.image} 
                  alt={productInfo.name} 
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium text-gray-900">{productInfo.name}</p>
                <p className="text-xs text-gray-500">{productInfo.brand}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-end gap-3 border-t bg-gray-50 px-6 py-4">
          <button
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition shadow-sm"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
