import React from "react";
import { Bell, Search, User } from "lucide-react";

function Header() {
  return (
    <header className="flex h-20 items-center justify-between  bg-white px-8">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Welcome back, Admin
        </p>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 rounded-lg border bg-gray-50 px-3 py-2">
          <Search size={18} className="text-gray-400" />

          <input
            type="text"
            placeholder="Search..."
            className="w-48 bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
        </div>

        <button className="relative rounded-lg p-2 text-gray-600 transition hover:bg-gray-100">
          <Bell size={20} />

          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-3 border-l pl-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
            <User size={18} />
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900">
              Admin
            </p>

            <p className="text-xs text-gray-500">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
