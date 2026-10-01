import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  addAddress,
  updateAddress,
} from "../checkoutSlice";

const emptyAddress = {
  name: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

export default function AddressForm({
  editingAddress,
  onCancel,
}) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState(emptyAddress);

  useEffect(() => {
    if (editingAddress) {
      setFormData(editingAddress);
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingAddress) {
      dispatch(updateAddress(formData));
    } else {
      dispatch(addAddress(formData));
    }

    onCancel();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border rounded-xl p-5 space-y-4"
    >

      <h2 className="text-lg font-semibold">
        {editingAddress
          ? "Edit Address"
          : "Add New Address"}
      </h2>

      {/* Name */}
      <div>
        <label className="text-sm">
          Name
        </label>

        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded-lg p-3 mt-1"
          placeholder="Enter your name"
          required
        />
      </div>

      {/* Phone */}
      <div>
        <label className="text-sm">
          Phone
        </label>

        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border rounded-lg p-3 mt-1"
          placeholder="Enter phone number"
          required
        />
      </div>

      {/* Address */}
      <div>
        <label className="text-sm">
          Address
        </label>

        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full border rounded-lg p-3 mt-1"
          placeholder="House / Street / Area"
          rows="3"
          required
        />
      </div>

      {/* City + State */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <label className="text-sm">
            City
          </label>

          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 mt-1"
            placeholder="City"
            required
          />
        </div>

        <div>
          <label className="text-sm">
            State
          </label>

          <input
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 mt-1"
            placeholder="State"
            required
          />
        </div>

      </div>

      {/* Pincode */}
      <div>
        <label className="text-sm">
          Pincode
        </label>

        <input
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          className="w-full border rounded-lg p-3 mt-1"
          placeholder="Pincode"
          required
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">

        <button
          type="button"
          onClick={onCancel}
          className="border rounded-lg px-5 py-3"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="bg-black text-white rounded-lg px-5 py-3"
        >
          {editingAddress
            ? "Update Address"
            : "Save Address"}
        </button>

      </div>

    </form>
  );
}