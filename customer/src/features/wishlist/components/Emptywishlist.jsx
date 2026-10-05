import { ArrowRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function Emptywishlist() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-neutral-200 bg-neutral-50 px-6 py-16 text-center">
      <div className="grid size-16 place-items-center rounded-full bg-white shadow-sm ring-1 ring-neutral-200">
        <Heart size={28} strokeWidth={1.5} className="text-neutral-700" />
      </div>

      <h2 className="mt-6 text-2xl font-semibold tracking-tight">
        Your wishlist is empty
      </h2>

      <p className="mt-2 max-w-sm leading-relaxed text-neutral-500">
        Tap the heart on any shoe to save it here.
      </p>

      <Link
        to="/products"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-black px-7 py-3.5 font-medium text-white transition hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
      >
        Browse shoes
        <ArrowRight size={18} />
      </Link>
    </div>
  );
}