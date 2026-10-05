import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useDispatch, useSelector } from "react-redux";

import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";

import { fetchAddresses, selectAddress } from "../checkoutSlice";

export default function AddressSection() {
  const dispatch = useDispatch();
  const { user } = useUser();

  const {
    addresses,
    selectedAddressId,
    loading,
  } = useSelector((state) => state.checkout);

  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    if (!user?.id) return;

    dispatch(fetchAddresses(user.id));
  }, [user?.id, dispatch]);

  const handleAdd = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleSelect = (addressId) => {
    dispatch(selectAddress(addressId));
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  return (
    <section>
      <h2 className="mb-5 text-xl font-semibold">
        Delivery Address
      </h2>

      {showForm ? (
        <AddressForm
          editingAddress={editingAddress}
          onCancel={handleCancel}
          userId={user.id}
          onSuccess={handleCancel}
        />
      ) : (
        <div className="space-y-4">

          {loading && addresses.length === 0 && (
            <p className="text-sm text-gray-500">
              Loading addresses...
            </p>
          )}

          {!loading && addresses.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center">
              <p className="text-sm text-gray-500">
                No saved addresses.
              </p>
            </div>
          )}

          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              selected={
                String(selectedAddressId) ===
                String(address.id)
              }
              onSelect={() => handleSelect(address.id)}
              onEdit={handleEdit}
            />
          ))}

          <button
            type="button"
            onClick={handleAdd}
            className="w-full rounded-xl border border-dashed border-gray-300 py-4 text-sm transition hover:border-black hover:bg-gray-50"
          >
            + Add New Address
          </button>

        </div>
      )}
    </section>
  );
}
