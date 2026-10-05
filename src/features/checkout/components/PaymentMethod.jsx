import { useDispatch, useSelector } from "react-redux";
import { setPaymentMethod } from "../checkoutSlice";

export default function PaymentMethod() {
  const dispatch = useDispatch();

  const paymentMethod = useSelector((state) => state.checkout.paymentMethod);

  const methods = [
    {
      id: "cod",
      label: "Cash on Delivery",
    },
    {
      id: "upi",
      label: "UPI",
    },
    {
      id: "card",
      label: "Credit / Debit Card",
    },
  ];

  const handlePaymentChange = (method) => {
    dispatch(setPaymentMethod(method));
  };

  return (
    <section className="mt-10">
      {" "}
      <h2 className="mb-5 text-xl font-semibold">Payment Method </h2>
      <div className="overflow-hidden rounded-xl border">
        {methods.map((method) => {
          const selected = paymentMethod === method.id;

          return (
            <label
              key={method.id}
              className={`flex cursor-pointer items-center gap-3 border-b p-4 last:border-b-0 transition ${
                selected ? "bg-gray-50" : "hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value={method.id}
                checked={selected}
                onChange={() => handlePaymentChange(method.id)}
                className="accent-black"
              />

              <span className={selected ? "font-medium" : "text-gray-700"}>
                {method.label}
              </span>
            </label>
          );
        })}
      </div>
    </section>
  );
}
