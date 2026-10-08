import React from 'react';
import { X, MapPin, Phone, Mail, User, Clock, Package, Truck, CheckCircle2, XCircle } from 'lucide-react';

const OrderDetailsModal = ({ order, onClose, onStatusChange, onCancel }) => {
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800"><Clock size={14} /> Order Placed</span>;
      case 'confirmed':
        return <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"><Package size={14} /> Confirmed</span>;
      case 'shipped':
        return <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800"><Truck size={14} /> Shipped</span>;
      case 'delivered':
        return <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800"><CheckCircle2 size={14} /> Delivered</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800"><XCircle size={14} /> Cancelled</span>;
      default:
        return <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">{status}</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price || 0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-gray-900">Order #{order.id}</h2>
            {getStatusBadge(order.status)}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-50/50 rounded-xl border border-gray-200 p-5">
                <h3 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-3 mb-4">Order Items</h3>
                <div className="space-y-4">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex gap-4 items-center">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white">
                        <img src={item.image || '/placeholder.png'} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">{item.brand} | Size: {item.size}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{formatPrice(item.price)}</div>
                        <div className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</div>
                      </div>
                      <div className="text-right w-24">
                        <div className="text-sm font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50/50 rounded-xl border border-gray-200 p-5">
                <h3 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-3 mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery</span>
                    <span className="font-medium text-gray-900">{order.delivery === 0 ? 'Free' : formatPrice(order.delivery)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50/50 rounded-xl border border-gray-200 p-5 space-y-4">
                <h3 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-3">Customer Information</h3>
                
                <div className="flex items-start gap-3 text-sm">
                  <User className="text-gray-400 shrink-0 mt-0.5" size={16} />
                  <div>
                    <p className="font-medium text-gray-900">{order.shippingAddress?.fullName || 'Guest User'}</p>
                    <p className="text-gray-500">ID: {order.userId}</p>
                  </div>
                </div>
                
                {order.shippingAddress?.email && (
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="text-gray-400 shrink-0" size={16} />
                    <p className="text-gray-600">{order.shippingAddress.email}</p>
                  </div>
                )}
                
                {order.shippingAddress?.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="text-gray-400 shrink-0" size={16} />
                    <p className="text-gray-600">{order.shippingAddress.phone}</p>
                  </div>
                )}
              </div>

              <div className="bg-gray-50/50 rounded-xl border border-gray-200 p-5 space-y-4">
                <h3 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-3">Shipping Address</h3>
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="text-gray-400 shrink-0 mt-0.5" size={16} />
                  <div className="text-gray-600">
                    <p>{order.shippingAddress?.address}</p>
                    {order.shippingAddress?.apartment && <p>{order.shippingAddress.apartment}</p>}
                    <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50/50 rounded-xl border border-gray-200 p-5 space-y-4">
                <h3 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-3">Order Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Placed on</span>
                    <span className="font-medium text-gray-900">{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment</span>
                    <span className="font-medium text-gray-900">Credit Card</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Update Status</h3>
                <select
                  value={order.status || 'pending'}
                  onChange={(e) => onStatusChange(order.id, e.target.value)}
                  disabled={order.status === 'cancelled' || order.status === 'delivered'}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-black disabled:opacity-50 disabled:bg-gray-100"
                >
                  <option value="pending">Order Placed</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
                
                {order.status !== 'cancelled' && order.status !== 'delivered' && (
                  <button
                    onClick={onCancel}
                    className="w-full mt-2 rounded-lg border border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
