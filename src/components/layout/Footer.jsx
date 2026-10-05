
import { NavLink } from "react-router-dom";
import LOGO from "../../assets/images/LOGO.svg";

const shopLinks = [
  { label: "Nike", to: "/brand/nike" },
  { label: "Adidas", to: "/brand/adidas" },
  { label: "New Balance", to: "/brand/new-balance" },
  { label: "New Arrivals", to: "/new-arrivals" },
  { label: "Best Sellers", to: "/best-sellers" },
];

const helpLinks = [
  { label: "Contact Us", to: "/contact" },
  { label: "Shipping", to: "/shipping" },
  { label: "Returns", to: "/returns" },
  { label: "FAQs", to: "/faq" },
  { label: "Size Guide", to: "/size-guide" },
];

const companyLinks = [
  { label: "About Us", to: "/about" },
  { label: "Our Story", to: "/story" },
  { label: "Careers", to: "/careers" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms & Conditions", to: "/terms" },
];

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-10">

        <div className="flex flex-col items-center text-center">
          <img
            src={LOGO}
            alt="Logo"
            className="h-16 w-auto"
          />

          <p className="mt-4 max-w-sm text-sm leading-6 text-gray-400">
            Premium footwear. Built for every step.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 border-t border-gray-800 pt-10 sm:grid-cols-3 sm:gap-8">

          <FooterColumn title="Shop" links={shopLinks} />

          <FooterColumn title="Help" links={helpLinks} />

          <FooterColumn title="Company" links={companyLinks} />

        </div>

        <div className="mt-12 border-t border-gray-800 pt-8">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">
            Follow Us
          </h2>

          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-400">
            <a
              href="#"
              className="transition hover:text-white"
            >
              Instagram
            </a>

            <a
              href="#"
              className="transition hover:text-white"
            >
              Facebook
            </a>

            <a
              href="#"
              className="transition hover:text-white"
            >
              X
            </a>

            <a
              href="#"
              className="transition hover:text-white"
            >
              YouTube
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-gray-800 pt-6 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 YourBrand. All rights reserved.</p>

          <p>Made in India 🇮🇳</p>
        </div>

      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-gray-200">
        {title}
      </h2>

      <div className="flex flex-col items-start gap-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className="text-sm text-gray-400 transition hover:text-white"
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
