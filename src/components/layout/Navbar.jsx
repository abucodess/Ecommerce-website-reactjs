import { NavLink } from "react-router-dom";
import LOGO from "../../assets/images/LOGO.svg";
import {
  Search,
  Heart,
  ShoppingBag,
} from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-6xl">
      <div className="flex items-center justify-between bg-background rounded-2xl px-6 py-3 shadow-md border border-border">

        {/* Logo */}
        <NavLink to="/">
          <img
            src={LOGO}
            alt="Logo"
            className="h-8 w-auto"
          />
        </NavLink>

        {/* Navigation */}
        <div className="hidden sm:flex items-center gap-8">
          <NavLink
            to="/"
            className="text-primary font-medium hover:text-muted transition"
          >
            Home
          </NavLink>

          <NavLink
            to="/shop"
            className="text-primary font-medium hover:text-muted transition"
          >
            Shop
          </NavLink>

          <NavLink
            to="/brand/nike"
            className="text-primary font-medium hover:text-muted transition"
          >
            Nike
          </NavLink>

          <NavLink
            to="/brand/adidas"
            className="text-primary font-medium hover:text-muted transition"
          >
            Adidas
          </NavLink>

          <NavLink
            to="/brand/puma"
            className="text-primary font-medium hover:text-muted transition"
          >
            Puma
          </NavLink>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">

          {/* Search */}
          <NavLink
            to="/search"
            className="text-primary hover:text-muted transition"
          >
            <Search size={20} />
          </NavLink>

          {/* Wishlist */}
          <NavLink
            to="/wishlist"
            className="text-primary hover:text-muted transition"
          >
            <Heart size={20} />
          </NavLink>

          {/* Cart */}
          <NavLink
            to="/cart"
            className="text-primary hover:text-muted transition"
          >
            <ShoppingBag size={20} />
          </NavLink>

        </div>

      </div>
    </nav>
  );
}