import { useNavigate } from "react-router-dom";

export default function WishlistItem({ item }) {
    let navigate = useNavigate()
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black text-white" onClick={()=>{navigate(`/products/${item.id}`)}}>
      <div className="aspect-square overflow-hidden bg-white/5">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-4">
        <p className="mb-1 text-xs uppercase tracking-wider text-white/50">
          {item.brand}
        </p>

        <h2 className="text-base font-medium">
          {item.name}
        </h2>

        <p className="mt-2 text-lg font-semibold">
          ₹{item.price}
        </p>
      </div>
    </div>
  );
}

