import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, updateOrderStatus, cancelOrder } from '../features/orders/orderSlice';
import { Search, Eye, Filter, CheckCircle2, Clock, XCircle, Truck, Package } from 'lucide-react';
import OrderDetailsModal from '../features/orders/components/OrderDetailsModal';
import ConfirmDialog from '../components/common/ConfirmDialog';

function Orders() {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
  };

  const handleCancelClick = (order) => {
    setOrderToCancel(order);
    setCancelConfirmOpen(true);
  };

  const confirmCancel = async () => {
    if (orderToCancel) {
      await dispatch(cancelOrder(orderToCancel));
      setCancelConfirmOpen(false);
      setOrderToCancel(null);
      
      // If we're cancelling from the details modal, close it
      if (selectedOrder && selectedOrder.id === orderToCancel.id) {
        setIsDetailsOpen(false);
      }
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(search.toLowerCase()) || 
      (order.userId && String(order.userId).toLowerCase().includes(search.toLowerCase())) ||
      (order.shippingAddress?.fullName && order.shippingAddress.fullName.toLowerCase().includes(search.toLowerCase()));
      
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800"><Clock size={12} /> Order Placed</span>;
      case 'confirmed':
        return <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"><Package size={12} /> Confirmed</span>;
      case 'shipped':
        return <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800"><Truck size={12} /> Shipped</span>;
      case 'delivered':
        return <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"><CheckCircle2 size={12} /> Delivered</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800"><XCircle size={12} /> Cancelled</span>;
      default:
        return <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">{status}</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500">Manage and track customer orders</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Search by Order ID or Customer Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm outline-none transition focus:border-black"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={18} className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-48 rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none transition focus:border-black"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Order Placed</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID & Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center">
                    <div className="flex justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">
                    No orders found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                      <div className="text-xs text-gray-500">{formatDate(order.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.shippingAddress?.fullName || `User ID: ${order.userId}`}</div>
                      <div className="text-xs text-gray-500">{order.shippingAddress?.city || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatPrice(order.total)}</div>
                      <div className="text-xs text-gray-500">{order.items?.length || 0} item(s)</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-3 items-center">
                        <select
                          value={order.status || 'pending'}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          disabled={order.status === 'cancelled' || order.status === 'delivered'}
                          className="text-xs rounded border border-gray-300 py-1 pl-2 pr-6 bg-white focus:border-black outline-none disabled:opacity-50 disabled:bg-gray-100"
                        >
                          <option value="pending">Order Placed</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="text-gray-500 hover:text-black transition flex items-center"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        {order.status !== 'cancelled' && order.status !== 'delivered' && (
                          <button
                            onClick={() => handleCancelClick(order)}
                            className="text-red-500 hover:text-red-700 transition flex items-center"
                            title="Cancel Order"
                          >
                            <XCircle size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isDetailsOpen && selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => setIsDetailsOpen(false)} 
          onStatusChange={handleStatusChange}
          onCancel={() => handleCancelClick(selectedOrder)}
        />
      )}

      <ConfirmDialog
        isOpen={cancelConfirmOpen}
        title="Cancel Order"
        message={`Are you sure you want to cancel order #${orderToCancel?.id}? This will restore the inventory for all items in this order. This action cannot be undone.`}
        confirmText="Cancel Order"
        onConfirm={confirmCancel}
        onCancel={() => {
          setCancelConfirmOpen(false);
          setOrderToCancel(null);
        }}
      />
    </div>
  );
}

export default Orders;
