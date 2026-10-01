import { ArrowLeft, ShoppingBag } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

function EmptyCart() {
  return (
    <div className="flex min-h-[450px] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-[#f0f0f0] px-6 text-center">
               <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white">
                 <ShoppingBag size={28} strokeWidth={1.5} />
               </div>
   
               <h2 className="mt-6 text-xl font-semibold">
                 Your cart is empty
               </h2>
   
               <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                 Looks like you haven't added anything to your cart yet.
                 Discover something you'll want to wear.
               </p>
   
               <Link
                 to="/products"
                 className="mt-7 inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
               >
                 Continue Shopping
                 <ArrowLeft size={16} className="rotate-180" />
               </Link>
             </div>
  )
}

export default EmptyCart
