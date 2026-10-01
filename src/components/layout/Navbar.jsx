import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import LOGO from "../../assets/images/LOGO.svg";
import { Search, Heart, ShoppingBag, ShoppingCart } from "lucide-react";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/products", label: "Shop", end: true },
  { to: "/brand/nike", label: "Nike" },
  { to: "/brand/adidas", label: "Adidas" },
  { to: "/brand/puma", label: "Puma" },
];

const actions = [
  { to: "/products", Icon: Search, label: "Search" },
  { to: "/wishlist", Icon: Heart, label: "Wishlist" },
  { to: "/cart", Icon: ShoppingCart, label: "Cart" },
];

const linkClass = ({ isActive }) =>
  `whitespace-nowrap font-medium transition ${
    isActive ? "text-white" : "text-gray-400 hover:text-white"
  }`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navRef = useRef(null);

  // close after navigating to another page
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // close on outside tap or Escape
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e) => {
      if (!navRef.current?.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <nav
      ref={navRef}
      className="fixed left-[4%] top-5 z-50 max-w-[92%] sm:inset-x-0 sm:mx-auto sm:w-[92%] sm:max-w-6xl"
    >
      <div className="flex items-center rounded-2xl border border-gray-800 bg-black px-3 py-3 shadow-md sm:px-6">
        {/* Phone: logo toggles the menu */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="shrink-0 transition active:scale-90 sm:hidden"
        >
          <img src={LOGO} alt="" className="h-8 w-auto" />
        </button>

        {/* Desktop: logo is a normal link */}
        <NavLink to="/" className="hidden shrink-0 sm:block">
          <img src={LOGO} alt="Logo" className="h-8 w-auto" />
        </NavLink>

        {/* Expanding area */}
        <div
          className={`grid min-w-0 transition-[grid-template-columns] duration-500 ease-out motion-reduce:transition-none sm:flex-1 sm:grid-cols-[1fr] ${
            open ? "grid-cols-[1fr]" : "grid-cols-[0fr]"
          }`}
        >
          <div className="min-w-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:overflow-visible">
            <div
              className={`flex items-center gap-5 pl-5 transition-[opacity,visibility] duration-300 motion-reduce:transition-none sm:visible sm:pl-0 sm:opacity-100 ${
                open ? "visible opacity-100 delay-200" : "invisible opacity-0"
              }`}
            >
              <div className="flex items-center gap-5 text-sm sm:mx-auto sm:gap-8 sm:text-base">
                {links.map(({ to, label, end }) => (
                  <NavLink key={to} to={to} end={end} className={linkClass}>
                    {label}
                  </NavLink>
                ))}
              </div>

              <div className="flex shrink-0 items-center gap-4">
                {actions.map(({ to, Icon, label }) => (
                  <NavLink
                    key={label}
                    to={to}
                    aria-label={label}
                    className={({ isActive }) =>
                      `transition ${isActive ? "text-white" : "text-gray-400 hover:text-white"}`
                    }
                  >
                    <Icon size={20} nonScalingStroke />
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 