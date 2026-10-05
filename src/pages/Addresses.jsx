import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import Modal from "@/components/ui/Modal";

import {
  fetchAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "@/store/checkoutSlice";
import AddressForm from "@/features/checkout/components/AddressForm";

export default function Addresses() {
  const { user } = useUser();
  const dispatch = useDispatch();

  const { addresses, loading } = useSelector(
    (state) => state.checkout
  );

  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAddresses(user.id));
    }
  }, [dispatch, user?.id]);

  const handleAdd = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleSubmit = async (formData) => {
    if (editingAddress) {
      await dispatch(
        updateAddress({
          addressId: editingAddress.id,
          address: formData,
        })
      ).unwrap();
    } else {
      await dispatch(
        addAddress({
          userId: user.id,
          address: formData,
        })
      ).unwrap();
    }

    setShowForm(false);
    setEditingAddress(null);
  };

  const handleDelete = async (addressId) => {
    await dispatch(deleteAddress(addressId)).unwrap();
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">

        <Link
          to="/profile"
          className="mb-8 flex items-center gap-2 text-sm text-gray-500 transition hover:text-black"
        >
          <ArrowLeft size={17} />
          Back to Profile
        </Link>

        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.2em] text-gray-400">
              Account
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              My Addresses
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage your saved delivery addresses.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            <Plus size={17} />
            Add New Address
          </button>
        </div>

        <AddressList
          addresses={addresses}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

      </main>

      <Footer />

      <Modal
        isOpen={showForm}
        onClose={() => {
          if (!loading) {
            setShowForm(false);
            setEditingAddress(null);
          }
        }}
        title={editingAddress ? "Edit Address" : "Add New Address"}
      >
        <AddressForm
          address={editingAddress}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingAddress(null);
          }}
          loading={loading}
        />
      </Modal>
    </div>
  );
}
