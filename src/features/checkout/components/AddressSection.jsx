import { useState } from "react";
import { useSelector } from "react-redux";
import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";


export default function AddressSection() {
  const { addresses, selectedAddressId } = useSelector(
    (state) => state.checkout
  );

  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const handleAdd = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  return (
    <section>

      <h2 className="text-xl font-semibold mb-5">
        Delivery Address
      </h2>

      {!showForm && (
        <div className="space-y-4">

          {addresses.length === 0 ? (
            <p className="text-gray-500">
              No saved addresses.
            </p>
          ) : (
            addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                selected={
                  selectedAddressId === address.id
                }
                onEdit={handleEdit}
              />
            ))
          )}

          <button
            onClick={handleAdd}
            className="w-full border border-dashed rounded-xl py-4 text-sm"
          >
            + Add New Address
          </button>

        </div>
      )}

      {showForm && (
        <AddressForm
          editingAddress={editingAddress}
          onCancel={handleCancel}
        />
      )}

    </section>
  );
}