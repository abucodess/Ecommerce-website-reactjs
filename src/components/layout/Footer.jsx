import { NavLink } from "react-router-dom";
import LOGO from "../../assets/images/LOGO.svg";

export default function Footer() {
  return (
    <footer className="border-t-2 border-black mt-3 px-6 py-10">

      {/* Logo */}
      <div className="flex flex-col items-center">
        <img
          src={LOGO}
          alt="Logo"
          className="h-20 w-auto"
        />

        <h1 className="mt-3 text-sm text-gray-600">
          Premium footwear. Built for every step.
        </h1>
      </div>

      {/* Footer Links */}
      <div className="max-w-5xl mx-auto grid grid-cols-3 gap-20 mt-12">

        {/* Shop */}
        <div>
          <h2 className="font-semibold text-lg pb-3 border-b-2 border-black">
            Shop
          </h2>

          <div className="flex flex-col gap-2 mt-4">
            <NavLink to="/shop/nike">Nike</NavLink>
            <NavLink to="/shop/adidas">Adidas</NavLink>
            <NavLink to="/shop/puma">Puma</NavLink>
            <NavLink to="/new-arrivals">New Arrivals</NavLink>
            <NavLink to="/best-sellers">Best Sellers</NavLink>
          </div>
        </div>

        {/* Help */}
        <div>
          <h2 className="font-semibold text-lg pb-3 border-b-2 border-black">
            Help
          </h2>

          <div className="flex flex-col gap-2 mt-4">
            <NavLink to="/contact">Contact Us</NavLink>
            <NavLink to="/shipping">Shipping</NavLink>
            <NavLink to="/returns">Returns</NavLink>
            <NavLink to="/faq">FAQs</NavLink>
            <NavLink to="/size-guide">Size Guide</NavLink>
          </div>
        </div>

        {/* Company */}
        <div>
          <h2 className="font-semibold text-lg pb-3 border-b-2 border-black">
            Company
          </h2>

          <div className="flex flex-col gap-2 mt-4">
            <NavLink to="/about">About Us</NavLink>
            <NavLink to="/story">Our Story</NavLink>
            <NavLink to="/careers">Careers</NavLink>
            <NavLink to="/privacy">Privacy Policy</NavLink>
            <NavLink to="/terms">Terms & Conditions</NavLink>
          </div>
        </div>

      </div>

      {/* Social Media */}
      <div className="max-w-5xl mx-auto w-full border-t-2 border-black mt-12 pt-6">
        <h2 className="font-semibold mb-4">
          Follow Us
        </h2>

        <div className="flex gap-5">
          <span>Instagram</span>
          <span>Facebook</span>
          <span>X</span>
          <span>YouTube</span>
        </div>
      </div>

      {/* Bottom */}
      <div className="max-w-5xl mx-auto w-full border-t-2 border-black mt-8 pt-6 flex justify-between text-sm text-gray-600">
        <p>© 2026 YourBrand</p>
        <p>India 🇮🇳</p>
      </div>

    </footer>
  );
}