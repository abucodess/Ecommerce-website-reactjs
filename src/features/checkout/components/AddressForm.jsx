import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useDispatch, useSelector } from "react-redux";

import { addAddress, updateAddress } from "../checkoutSlice";

const emptyAddress = {
  name: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

export default function AddressForm({ editingAddress, onCancel }) {
  const dispatch = useDispatch();
  const { user } = useUser();

  const loading = useSelector((state) => state.checkout.loading);

  const [formData, setFormData] = useState(emptyAddress);

  useEffect(() => {
    if (editingAddress) {
      setFormData({
        name: editingAddress.name || "",
        phone: editingAddress.phone || "",
        address: editingAddress.address || "",
        city: editingAddress.city || "",
        state: editingAddress.state || "",
        pincode: editingAddress.pincode || "",
      });
    } else {
      setFormData(emptyAddress);
    }
  }, [editingAddress]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) return;

    try {
      if (editingAddress) {
        await dispatch(
          updateAddress({
            addressId: editingAddress.id,
            address: formData,
          }),
        ).unwrap();
      } else {
        await dispatch(
          addAddress({
            userId: user.id,
            address: formData,
          }),
        ).unwrap();
      }

      onCancel();
    } catch (error) {
      console.error("Failed to save address:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border p-5">
      {" "}
      <h2 className="text-lg font-semibold">
        {editingAddress ? "Edit Address" : "Add New Address"}{" "}
      </h2>
      <div>
        <label className="text-sm">Name</label>

        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 w-full rounded-lg border p-3"
          placeholder="Enter your name"
          required
        />
      </div>
      <div>
        <label className="text-sm">Phone</label>

        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="mt-1 w-full rounded-lg border p-3"
          placeholder="Enter phone number"
          inputMode="numeric"
          required
        />
      </div>
      <div>
        <label className="text-sm">Address</label>

        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="mt-1 w-full rounded-lg border p-3"
          placeholder="House / Street / Area"
          rows="3"
          required
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm">City</label>

          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border p-3"
            placeholder="City"
            required
          />
        </div>

        <div>
          <label className="text-sm">State</label>

          <input
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border p-3"
            placeholder="State"
            required
          />
        </div>
      </div>
      <div>
        <label className="text-sm">Pincode</label>

        <input
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          className="mt-1 w-full rounded-lg border p-3"
          placeholder="Pincode"
          inputMode="numeric"
          required
        />
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-lg border px-5 py-3 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading || !user?.id}
          className="rounded-lg bg-black px-5 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : editingAddress
              ? "Update Address"
              : "Save Address"}
        </button>
      </div>
    </form>
  );
}
