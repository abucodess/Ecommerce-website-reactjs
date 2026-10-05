import { Check } from "lucide-react";

export default function OrderTimeline({ status }) {
  const steps = [
    {
      key: "pending",
      label: "Order Placed",
    },
    {
      key: "confirmed",
      label: "Confirmed",
    },
    {
      key: "shipped",
      label: "Shipped",
    },
    {
      key: "delivered",
      label: "Delivered",
    },
  ];

  const currentIndex = steps.findIndex((step) => step.key === status);

  if (status === "cancelled") {
    return (
      <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
        This order has been cancelled.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-4">
      {steps.map((step, index) => {
        const completed = index <= currentIndex;

        return (
          <div key={step.key} className="relative text-center">
            <div
              className={`mx-auto grid size-10 place-items-center rounded-full ${
                completed ? "bg-black text-white" : "bg-gray-100 text-gray-400"
              }`}
            >
              <Check size={18} />
            </div>

            <p
              className={`mt-3 text-sm ${
                completed ? "font-medium text-black" : "text-gray-400"
              }`}
            >
              {step.label}
            </p>

            {index < steps.length - 1 && (
              <div
                className={`absolute left-[calc(50%+20px)] right-[calc(-50%+20px)] top-5 hidden h-px sm:block ${
                  index < currentIndex ? "bg-black" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}