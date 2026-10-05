
export default function EmptyOrders() {
  return (
    <div className="flex min-h-[45vh] flex-col items-center justify-center rounded-2xl border border-gray-200 px-6 text-center">
      {" "}
      <div className="mb-5 grid size-16 place-items-center rounded-full bg-gray-100">
        {" "}
        <ShoppingBag size={28} />{" "}
      </div>
      <h2 className="text-xl font-semibold">No orders yet</h2>
      <p className="mt-2 max-w-md text-sm text-gray-500">
        You haven't placed any orders yet. Your future shoe addiction will
        appear here.
      </p>
      <Link
        to="/shop"
        className="mt-6 rounded-xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
      >
        Start Shopping
      </Link>
    </div>
  );
}