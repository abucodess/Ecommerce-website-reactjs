import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers, updateCustomerStatus, fetchCustomerOrders, clearCustomerOrders } from '../features/customers/customerSlice';
import { Search, Eye, Filter, Ban, CheckCircle2, User, Calendar, Clock, Package } from 'lucide-react';
import ConfirmDialog from '../components/common/ConfirmDialog';

function Customers() {
  const dispatch = useDispatch();
  const { customers, customerOrders, loading, ordersLoading } = useSelector((state) => state.customers);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const [statusConfirmOpen, setStatusConfirmOpen] = useState(false);
  const [customerToUpdate, setCustomerToUpdate] = useState(null);

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setIsDetailsOpen(true);
    dispatch(fetchCustomerOrders(customer.id));
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
    setSelectedCustomer(null);
    dispatch(clearCustomerOrders());
  };

  const handleToggleStatusClick = (customer) => {
    setCustomerToUpdate(customer);
    setStatusConfirmOpen(true);
  };

  const confirmToggleStatus = async () => {
    if (customerToUpdate) {
      await dispatch(updateCustomerStatus({ 
        id: customerToUpdate.id, 
        isActive: !customerToUpdate.isActive 
      }));
      setStatusConfirmOpen(false);
      setCustomerToUpdate(null);
      
      // Update selected customer if modal is open
      if (selectedCustomer && selectedCustomer.id === customerToUpdate.id) {
        setSelectedCustomer({ ...selectedCustomer, isActive: !customerToUpdate.isActive });
      }
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(search.toLowerCase()) || 
      customer.email.toLowerCase().includes(search.toLowerCase()) ||
      customer.id.toLowerCase().includes(search.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && customer.isActive) || 
      (statusFilter === 'blocked' && !customer.isActive);
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price || 0);
  };

  const getOrderStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800"><Clock size={10} /> Order Placed</span>;
      case 'confirmed':
        return <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800"><Package size={10} /> Confirmed</span>;
      case 'shipped':
        return <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">Shipped</span>;
      case 'delivered':
        return <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">Delivered</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">Cancelled</span>;
      default:
        return <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500">Manage your store's users and view their purchase history</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Search by Name, Email or ID..."
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
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && customers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center">
                    <div className="flex justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-500">
                    No customers found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-medium border border-gray-200">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          <div className="text-xs text-gray-500">{customer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(customer.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {customer.isActive ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"><CheckCircle2 size={12} /> Active</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800"><Ban size={12} /> Blocked</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-3 items-center">
                        <button
                          onClick={() => handleViewDetails(customer)}
                          className="text-gray-500 hover:text-black transition flex items-center"
                          title="View Details & Orders"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleToggleStatusClick(customer)}
                          className={`${customer.isActive ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'} transition flex items-center`}
                          title={customer.isActive ? "Block Customer" : "Activate Customer"}
                        >
                          {customer.isActive ? <Ban size={18} /> : <CheckCircle2 size={18} />}
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

      {isDetailsOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">Customer Details</h2>
              <button
                onClick={closeDetails}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
              >
                <Ban size={20} className="rotate-45" /> {/* Just using Ban as X icon since X wasn't imported */}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Profile Information */}
                <div className="space-y-6">
                  <div className="bg-gray-50/50 rounded-xl border border-gray-200 p-6 flex flex-col items-center text-center space-y-3">
                    <div className="h-24 w-24 flex-shrink-0 bg-black rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md">
                      {selectedCustomer.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{selectedCustomer.name}</h3>
                      <p className="text-sm text-gray-500">{selectedCustomer.email}</p>
                    </div>
                    <div className="pt-2">
                      {selectedCustomer.isActive ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800"><CheckCircle2 size={14} /> Active Account</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800"><Ban size={14} /> Blocked Account</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleToggleStatusClick(selectedCustomer)}
                      className={`w-full mt-4 rounded-lg py-2 text-sm font-semibold transition ${
                        selectedCustomer.isActive 
                          ? 'border border-red-200 bg-red-50 text-red-600 hover:bg-red-100' 
                          : 'border border-green-200 bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                    >
                      {selectedCustomer.isActive ? 'Block Customer' : 'Activate Customer'}
                    </button>
                  </div>
                  
                  <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Account Info</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-3">
                        <User className="text-gray-400" size={16} />
                        <span className="text-gray-900">ID: {selectedCustomer.id}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="text-gray-400" size={16} />
                        <span className="text-gray-900">Joined {formatDate(selectedCustomer.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order History */}
                <div className="lg:col-span-2">
                  <div className="bg-gray-50/50 rounded-xl border border-gray-200 p-5 h-full flex flex-col">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Order History</h3>
                      <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                        {customerOrders.length} Orders
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                      {ordersLoading ? (
                        <div className="flex justify-center py-10">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-black"></div>
                        </div>
                      ) : customerOrders.length === 0 ? (
                        <div className="text-center py-10 text-sm text-gray-500">
                          This customer hasn't placed any orders yet.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {customerOrders.map(order => (
                            <div key={order.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow transition">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <div className="text-sm font-bold text-gray-900">Order #{order.id}</div>
                                  <div className="text-xs text-gray-500">{formatDate(order.createdAt)}</div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-bold text-gray-900">{formatPrice(order.total)}</div>
                                  <div className="mt-1">{getOrderStatusBadge(order.status)}</div>
                                </div>
                              </div>
                              <div className="border-t border-gray-100 pt-3">
                                <p className="text-xs text-gray-600 font-medium mb-2">Items ({order.items?.length || 0}):</p>
                                <div className="flex flex-wrap gap-2">
                                  {order.items?.slice(0, 3).map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded text-xs">
                                      <img src={item.image || '/placeholder.png'} className="h-6 w-6 rounded object-cover border border-gray-200" alt="" />
                                      <span className="truncate max-w-[120px] text-gray-700">{item.name}</span>
                                    </div>
                                  ))}
                                  {order.items?.length > 3 && (
                                    <div className="flex items-center justify-center bg-gray-50 px-2 py-1 rounded text-xs text-gray-500 font-medium">
                                      +{order.items.length - 3} more
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={statusConfirmOpen}
        title={customerToUpdate?.isActive ? "Block Customer" : "Activate Customer"}
        message={customerToUpdate?.isActive 
          ? `Are you sure you want to block ${customerToUpdate?.name}? They will no longer be able to log in or place orders.`
          : `Are you sure you want to reactivate ${customerToUpdate?.name}? They will regain full access to their account.`}
        confirmText={customerToUpdate?.isActive ? "Block" : "Activate"}
        onConfirm={confirmToggleStatus}
        onCancel={() => {
          setStatusConfirmOpen(false);
          setCustomerToUpdate(null);
        }}
      />
    </div>
  );
}

export default Customers;
