import { Pencil, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { deleteAddress, selectAddress } from "../checkoutSlice";


export default function AddressCard({ address, selected, onEdit }){
  
  const dispatch = useDispatch();
  const select = () => dispatch(selectAddress(address.id));
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      select();
    }
  };
  return (
    <div
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onClick={select}
      onKeyDown={handleKeyDown}
      className={`cursor-pointer rounded-2xl border-2 p-5 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
        selected
          ? "border-black bg-neutral-50"
          : "border-neutral-200 bg-white hover:border-neutral-400"
      }`}
    >
      <div className="flex gap-4">
        <div
          className={`mt-1 grid size-5 shrink-0 place-items-center rounded-full border-2 ${
            selected ? "border-black" : "border-neutral-300"
          }`}
        >
          {selected && <div className="size-2.5 rounded-full bg-black" />}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <h3 className="text-lg font-semibold">{address.name}</h3>
            <p className="text-neutral-500">{address.phone}</p>
          </div>

          <p className="mt-2 leading-relaxed text-neutral-600">
            {address.address}
            <br />
            {address.city}, {address.state} {address.pincode}
          </p>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(address);
              }}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-200"
            >
              <Pencil size={14} />
              Edit
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(deleteAddress(address.id));
              }}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}