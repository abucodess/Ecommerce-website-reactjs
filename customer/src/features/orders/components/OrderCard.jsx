import { Link } from "react-router-dom";

export default function OrderCard({ order }) {
  const status = order.status;

  const statusStyles = {
    pending: "bg-gray-100 text-gray-700",
    confirmed: "bg-blue-100 text-blue-700",
    shipped: "bg-orange-100 text-orange-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const statusLabels = {
    pending: "Order Placed",
    confirmed: "Confirmed",
    shipped: "On the Way",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  return (
    <article className="rounded-2xl border border-gray-200 p-5 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="text-xs text-gray-500">
            Order ID
          </p>

          <p className="mt-1 font-medium">
            #{order.id}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleDateString(
              "en-IN",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            )}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">
            Items
          </p>

          <p className="mt-1 font-medium">
            {order.items.length}{" "}
            {order.items.length === 1 ? "item" : "items"}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">
            Total
          </p>

          <p className="mt-1 font-semibold">
            ₹{order.total?.toLocaleString("en-IN")}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">
            Status
          </p>

          <span
            className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-medium ${
              statusStyles[status] || "bg-gray-100 text-gray-500"
            }`}
          >
            {statusLabels[status] || "Unknown"}
          </span>
        </div>

        <Link
          to={`/orders/${order.id}`}
          className="rounded-xl bg-black px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-gray-800"
        >
          View Order
        </Link>

      </div>
    </article>
  );
}
