import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useUser } from "@clerk/clerk-react";
import {
  Search,
  Heart,
  ShoppingCart,
  User,
} from "lucide-react";

import LOGO from "../../assets/images/LOGO.svg";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/products", label: "Explore", end: true },
  { to: "/brand/nike", label: "Nike" },
  { to: "/brand/adidas", label: "Adidas" },
  { to: "/brand/new-balance", label: "New Balance" },
];

const actions = [
  {
    to: "/products",
    Icon: Search,
    label: "Search",
  },
  {
    to: "/wishlist",
    Icon: Heart,
    label: "Wishlist",
  },
  {
    to: "/cart",
    Icon: ShoppingCart,
    label: "Cart",
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navRef = useRef(null);

  const { pathname } = useLocation();

  const { user, isSignedIn } = useUser();

  const cartItems = useSelector(
    (state) => state.cart.items
  );

  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e) {
      if (!navRef.current?.contains(e.target)) {
        setOpen(false);
      }
    }

    function handleEscape(e) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener(
      "pointerdown",
      handleClickOutside
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handleClickOutside
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [open]);

  return (
    <nav
      ref={navRef}
      className="fixed left-[4%] top-5 z-50 max-w-[92%] sm:inset-x-0 sm:mx-auto sm:w-[92%] sm:max-w-6xl"
    >
      <div className="flex items-center rounded-2xl border border-gray-800 bg-black px-3 py-3 shadow-md sm:px-6">

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={
            open ? "Close menu" : "Open menu"
          }
          className="shrink-0 transition active:scale-90 sm:hidden"
        >
          <img
            src={LOGO}
            alt=""
            className="h-8 w-auto"
          />
        </button>

        <NavLink
          to="/"
          className="hidden shrink-0 sm:block"
        >
          <img
            src={LOGO}
            alt="Logo"
            className="h-8 w-auto"
          />
        </NavLink>

        <div
          className={`grid min-w-0 transition-[grid-template-columns] duration-500 ease-out motion-reduce:transition-none sm:flex-1 sm:grid-cols-[1fr] ${
            open
              ? "grid-cols-[1fr]"
              : "grid-cols-[0fr]"
          }`}
        >
          <div className="min-w-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:overflow-visible">
            <div
              className={`flex items-center gap-5 pl-5 transition-[opacity,visibility] duration-300 motion-reduce:transition-none sm:visible sm:pl-0 sm:opacity-100 ${
                open
                  ? "visible opacity-100 delay-200"
                  : "invisible opacity-0"
              }`}
            >

              <div className="flex items-center gap-5 text-sm sm:mx-auto sm:gap-8 sm:text-base">
                {links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                      `whitespace-nowrap font-medium transition ${
                        isActive
                          ? "text-white"
                          : "text-gray-400 hover:text-white"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>

              <div className="flex shrink-0 items-center gap-4">

                {actions.map(
                  ({ to, Icon, label }) => (
                    <NavLink
                      key={label}
                      to={to}
                      aria-label={label}
                      className={({ isActive }) =>
                        `relative transition ${
                          isActive
                            ? "text-white"
                            : "text-gray-400 hover:text-white"
                        }`
                      }
                    >
                      <Icon size={20} />

                      {label === "Wishlist" &&
                        wishlistItems.length > 0 && (
                          <span className="absolute -right-2.5 -top-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
                            {wishlistItems.length}
                          </span>
                        )}

                      {label === "Cart" &&
                        cartCount > 0 && (
                          <span className="absolute -right-2.5 -top-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold leading-none text-black">
                            {cartCount}
                          </span>
                        )}
                    </NavLink>
                  )
                )}


                {isSignedIn ? (
                  <NavLink
                    to="/profile"
                    aria-label="Profile"
                    className={({ isActive }) =>
                      `overflow-hidden rounded-full border transition ${
                        isActive
                          ? "border-white"
                          : "border-gray-700 hover:border-white"
                      }`
                    }
                  >
                    {user?.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt="Profile"
                        className="size-7 object-cover"
                      />
                    ) : (
                      <div className="grid size-7 place-items-center bg-gray-800 text-gray-300">
                        <User size={16} />
                      </div>
                    )}
                  </NavLink>
                ) : (
                  <NavLink
                    to="/login"
                    className="whitespace-nowrap rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-200"
                  >
                    Sign In
                  </NavLink>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
