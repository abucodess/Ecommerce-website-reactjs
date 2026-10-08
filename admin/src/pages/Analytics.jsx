import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../features/orders/orderSlice';
import { fetchCustomers } from '../features/customers/customerSlice';
import { BarChart3, TrendingUp, Users, Package, Download, Calendar } from 'lucide-react';

export default function Analytics() {
  const dispatch = useDispatch();
  
  const { orders } = useSelector((state) => state.orders);
  const { customers } = useSelector((state) => state.customers);

  const [dateRange, setDateRange] = useState('30'); // '7', '30', '90', 'all'

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchCustomers());
  }, [dispatch]);

  const filteredOrders = useMemo(() => {
    if (dateRange === 'all') return orders;
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(dateRange));
    
    return orders.filter(order => new Date(order.createdAt) >= cutoffDate);
  }, [orders, dateRange]);

  const stats = useMemo(() => {
    const totalOrders = filteredOrders.length;
    const completedOrders = filteredOrders.filter(o => o.status !== 'cancelled');
    const totalSales = completedOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const averageOrderValue = completedOrders.length > 0 ? totalSales / completedOrders.length : 0;
    
    // Simple product performance
    const productSales = {};
    completedOrders.forEach(order => {
      order.items?.forEach(item => {
        if (!productSales[item.name]) {
          productSales[item.name] = { qty: 0, rev: 0 };
        }
        productSales[item.name].qty += item.quantity || 1;
        productSales[item.name].rev += (item.price || 0) * (item.quantity || 1);
      });
    });

    const topProducts = Object.entries(productSales)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.rev - a.rev)
      .slice(0, 5);

    return {
      totalOrders,
      totalSales,
      averageOrderValue,
      totalCustomers: customers.length,
      topProducts
    };
  }, [filteredOrders, customers]);

  const exportToCSV = () => {
    // Generate CSV string
    const headers = ['Order ID', 'Date', 'Customer ID', 'Total Amount', 'Status', 'Items Count'];
    const rows = filteredOrders.map(order => [
      order.id,
      new Date(order.createdAt).toISOString().split('T')[0],
      order.userId,
      order.total,
      order.status,
      order.items?.length || 0
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sales_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Analytics & Reports</h1>
          <p className="text-sm text-gray-500">Track your store's performance and sales metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-4 pr-10 text-sm font-medium outline-none transition focus:border-black"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 3 Months</option>
              <option value="all">All Time</option>
            </select>
            <Calendar className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={16} />
          </div>
          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric Cards */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Total Sales</p>
            <div className="rounded-full bg-green-100 p-2 text-green-600">
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold text-gray-900">{formatCurrency(stats.totalSales)}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Total Orders</p>
            <div className="rounded-full bg-blue-100 p-2 text-blue-600">
              <BarChart3 size={20} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Avg. Order Value</p>
            <div className="rounded-full bg-orange-100 p-2 text-orange-600">
              <Package size={20} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold text-gray-900">{formatCurrency(stats.averageOrderValue)}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Total Customers</p>
            <div className="rounded-full bg-purple-100 p-2 text-purple-600">
              <Users size={20} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold text-gray-900">{stats.totalCustomers}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-gray-900">Top Performing Products</h2>
          {stats.topProducts.length > 0 ? (
            <div className="space-y-4">
              {stats.topProducts.map((prod, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-gray-900">{prod.name}</p>
                    <p className="text-xs text-gray-500">{prod.qty} units sold</p>
                  </div>
                  <p className="font-bold text-gray-900">{formatCurrency(prod.rev)}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center text-sm text-gray-500">
              No sales data for this period
            </div>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-gray-900">Recent Transactions</h2>
          <div className="space-y-4">
            {filteredOrders.slice(0, 5).map(order => (
              <div key={order.id} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium text-gray-900">Order #{order.id}</p>
                  <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{formatCurrency(order.total)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            {filteredOrders.length === 0 && (
              <div className="flex h-40 items-center justify-center text-sm text-gray-500">
                No transactions for this period
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
