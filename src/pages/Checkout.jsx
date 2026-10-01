import AddressSection from "@/features/checkout/components/AddressSection";
import OrderSummary from "@/features/checkout/components/OrderSummary";
import PaymentMethod from "@/features/checkout/components/PaymentMethod";
import { ArrowLeft } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


export default function Checkout() {
  const navigate = useNavigate();

  const {
    addresses,
    selectedAddressId,
    paymentMethod,
  } = useSelector((state) => state.checkout);

  const cartItems = useSelector(
    (state) => state.cart.items
  );

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      return;
    }

    if (!selectedAddressId) {
      alert("Please select a delivery address");
      return;
    }

    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    const selectedAddress = addresses.find(
      (address) =>
        address.id === selectedAddressId
    );

    console.log("Order:", {
      items: cartItems,
      address: selectedAddress,
      paymentMethod,
    });

    // Later:
    // dispatch(createOrder(...))

    navigate("/orders");
  };

  return (
    <div className="min-h-screen bg-white pt-20 pb-20">
        <ArrowLeft onClick={()=>navigate(-1)} className="fixed top-4 left-4 size-10"/>

      <div className="max-w-6xl mx-auto px-5">

        <h1 className="text-3xl font-bold mb-10">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

       
          <div className="lg:col-span-2">

            <AddressSection />

            <PaymentMethod />

          </div>

 
          <OrderSummary
            onPlaceOrder={handlePlaceOrder} 
          />

        </div>

      </div>

    </div>
  );
}