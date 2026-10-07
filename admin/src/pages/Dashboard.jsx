import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ShoppingBag,
  IndianRupee,
  Users,
  Package,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  MoreHorizontal,
} from "lucide-react";
import { fetchOrders } from "../features/orders/orderSlice";

function Dashboard() {
  const dispatch = useDispatch();

  const { orders = [], loading, error } = useSelector(
    (state) => state.orders
  );

  useEffect(() => {
    if (!orders.length) {
      dispatch(fetchOrders());
    }
  }, [dispatch, orders.length]);

  const stats = useMemo(() => {
    const validOrders = orders.filter(
      (order) => order.status !== "cancelled"
    );

    const revenue = validOrders.reduce(
      (total, order) => total + Number(order.total || 0),
      0
    );

    const productsSold = validOrders.reduce(
      (total, order) =>
        total +
        order.items.reduce(
          (itemTotal, item) => itemTotal + Number(item.quantity || 0),
          0
        ),
      0
    );

    const customers = new Set(orders.map((order) => order.userId)).size;

    const pending = orders.filter(
      (order) => order.status === "pending"
    ).length;

    const cancelled = orders.filter(
      (order) => order.status === "cancelled"
    ).length;

    const completed = orders.filter(
      (order) =>
        order.status === "completed" ||
        order.status === "delivered"
    ).length;

    return {
      revenue,
      totalOrders: orders.length,
      productsSold,
      customers,
      pending,
      cancelled,
      completed,
    };
  }, [orders]);

 
  const bestSellingProducts = useMemo(() => {
    const productMap = {};

    orders
      .filter((order) => order.status !== "cancelled")
      .forEach((order) => {
        order.items.forEach((item) => {
          if (!productMap[item.productId]) {
            productMap[item.productId] = {
              productId: item.productId,
              name: item.name,
              brand: item.brand,
              image: item.image,
              quantity: 0,
              revenue: 0,
            };
          }

          productMap[item.productId].quantity += Number(item.quantity || 0);

          productMap[item.productId].revenue +=
            Number(item.price || 0) * Number(item.quantity || 0);
        });
      });

    return Object.values(productMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [orders]);


  const brandSales = useMemo(() => {
    const brands = {};

    orders
      .filter((order) => order.status !== "cancelled")
      .forEach((order) => {
        order.items.forEach((item) => {
          if (!brands[item.brand]) {
            brands[item.brand] = {
              brand: item.brand,
              quantity: 0,
              revenue: 0,
            };
          }

          brands[item.brand].quantity += Number(item.quantity || 0);

          brands[item.brand].revenue +=
            Number(item.price || 0) * Number(item.quantity || 0);
        });
      });

    return Object.values(brands).sort(
      (a, b) => b.revenue - a.revenue
    );
  }, [orders]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort(
        (a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
      )
      .slice(0, 6);
  }, [orders]);


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-700";

      case "completed":
      case "delivered":
        return "bg-green-50 text-green-700";

      case "cancelled":
        return "bg-red-50 text-red-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

 
  if (loading && !orders.length) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#f7f7f5]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

 
  if (error && !orders.length) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#f7f7f5]">
        <div className="text-center">
          <XCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h2 className="font-semibold text-lg">
            Failed to load dashboard
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f5] p-4 sm:p-6 lg:p-8">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-sm text-gray-500 mb-1">
            Overview
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Dashboard
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Here's what's happening with your store.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 shadow-sm">
          <Clock className="w-4 h-4" />
          <span>
            {new Date().toLocaleDateString("en-IN", {
              weekday: "short",
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Revenue
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(stats.revenue)}
              </h2>

              <div className="flex items-center gap-1 mt-3 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>Excluding cancelled orders</span>
              </div>
            </div>

            <div className="w-11 h-11 rounded-xl bg-black text-white flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Orders
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-2">
                {stats.totalOrders}
              </h2>

              <p className="text-sm text-gray-500 mt-3">
                {stats.pending} pending orders
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-gray-900" />
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Products Sold
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-2">
                {stats.productsSold}
              </h2>

              <p className="text-sm text-gray-500 mt-3">
                Across all valid orders
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center">
              <Package className="w-5 h-5 text-gray-900" />
            </div>
          </div>
        </div>

        {/* Customers */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Customers
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-2">
                {stats.customers}
              </h2>

              <p className="text-sm text-gray-500 mt-3">
                Unique customers
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-gray-900" />
            </div>
          </div>
        </div>

      </div>

      {/* Middle section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">

        {/* Order overview */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-5">

          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-gray-900">
                Order Overview
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Current order status
              </p>
            </div>

            <MoreHorizontal className="w-5 h-5 text-gray-400" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

            <div className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <span className="text-sm text-gray-500">
                  Pending
                </span>
              </div>

              <p className="text-2xl font-bold">
                {stats.pending}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-500">
                  Completed
                </span>
              </div>

              <p className="text-2xl font-bold">
                {stats.completed}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-gray-500">
                  Cancelled
                </span>
              </div>

              <p className="text-2xl font-bold">
                {stats.cancelled}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <ShoppingBag className="w-4 h-4" />
                <span className="text-sm text-gray-500">
                  Total
                </span>
              </div>

              <p className="text-2xl font-bold">
                {stats.totalOrders}
              </p>
            </div>

          </div>

          {/* Simple status bar */}
          <div className="mt-6">
            <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex">

              {stats.pending > 0 && (
                <div
                  className="bg-yellow-400"
                  style={{
                    width: `${
                      (stats.pending / stats.totalOrders) * 100
                    }%`,
                  }}
                />
              )}

              {stats.completed > 0 && (
                <div
                  className="bg-green-500"
                  style={{
                    width: `${
                      (stats.completed / stats.totalOrders) * 100
                    }%`,
                  }}
                />
              )}

              {stats.cancelled > 0 && (
                <div
                  className="bg-red-500"
                  style={{
                    width: `${
                      (stats.cancelled / stats.totalOrders) * 100
                    }%`,
                  }}
                />
              )}

            </div>
          </div>

        </div>

        {/* Brand performance */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">

          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-gray-900">
                Brand Performance
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Revenue by brand
              </p>
            </div>
          </div>

          <div className="space-y-5">

            {brandSales.map((brand) => {
              const totalBrandRevenue = brandSales.reduce(
                (sum, item) => sum + item.revenue,
                0
              );

              const percentage =
                totalBrandRevenue > 0
                  ? (brand.revenue / totalBrandRevenue) * 100
                  : 0;

              return (
                <div key={brand.brand}>

                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm">
                      {brand.brand}
                    </span>

                    <span className="text-sm text-gray-500">
                      {formatCurrency(brand.revenue)}
                    </span>
                  </div>

                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black rounded-full"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>

                  <p className="text-xs text-gray-400 mt-1">
                    {brand.quantity} items sold
                  </p>

                </div>
              );
            })}

          </div>

        </div>

      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Best sellers */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">

          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div>
              <h2 className="font-semibold text-gray-900">
                Best Selling Products
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Top products by quantity sold
              </p>
            </div>

            <ArrowUpRight className="w-5 h-5 text-gray-400" />
          </div>

          <div className="divide-y divide-gray-100">

            {bestSellingProducts.map((product, index) => (
              <div
                key={product.productId}
                className="flex items-center gap-4 p-4"
              >

                <div className="text-sm font-semibold text-gray-400 w-5">
                  #{index + 1}
                </div>

                <img
                  src={product.image}
                  alt={product.name}
                  className="w-14 h-14 rounded-xl object-cover bg-gray-100"
                />

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">
                    {product.name}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    {product.brand}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-sm">
                    {product.quantity} sold
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {formatCurrency(product.revenue)}
                  </p>
                </div>

              </div>
            ))}

          </div>

        </div>

        {/* Recent orders */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">

          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div>
              <h2 className="font-semibold text-gray-900">
                Recent Orders
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Latest customer orders
              </p>
            </div>

            <ArrowUpRight className="w-5 h-5 text-gray-400" />
          </div>

          <div className="divide-y divide-gray-100">

            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center gap-3 p-4"
              >

                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    Order #{order.id.slice(0, 8)}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {order.items.length} product
                    {order.items.length !== 1 ? "s" : ""} ·{" "}
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-sm">
                    {formatCurrency(order.total)}
                  </p>

                  <span
                    className={`inline-block mt-1 px-2 py-1 rounded-full text-[10px] font-medium capitalize ${getStatusStyle(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;
