import { useDispatch, useSelector } from "react-redux";
import { setPaymentMethod } from "../checkoutSlice";

export default function PaymentMethod() {
  const dispatch = useDispatch();

  const paymentMethod = useSelector(
    (state) => state.checkout.paymentMethod
  );

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

  return (
    <section className="mt-10">

      <h2 className="text-xl font-semibold mb-5">
        Payment Method
      </h2>

      <div className="border rounded-xl overflow-hidden">

        {methods.map((method) => (
          <label
            key={method.id}
            className="flex items-center gap-3 p-4 border-b last:border-b-0 cursor-pointer"
          >

            <input
              type="radio"
              name="payment"
              value={method.id}
              checked={paymentMethod === method.id}
              onChange={(e) =>
                dispatch(
                  setPaymentMethod(e.target.value)
                )
              }
            />

            <span>{method.label}</span>

          </label>
        ))}

      </div>

    </section>
  );
}