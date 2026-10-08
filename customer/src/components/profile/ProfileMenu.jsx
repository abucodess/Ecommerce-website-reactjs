import { Link } from "react-router-dom";
import {
  Package,
  MapPin,
  Settings,
  ChevronRight,
} from "lucide-react";

const menuItems = [
  {
    to: "/orders",
    title: "My Orders",
    description: "View and track your orders",
    icon: Package,
  },
  {
    to: "/addresses",
    title: "Addresses",
    description: "Manage your delivery addresses",
    icon: MapPin,
  },
  {
    to: "/profile/settings",
    title: "Settings",
    description: "Manage your account preferences",
    icon: Settings,
  },
];

export default function ProfileMenu() {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200">
      {menuItems.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.to}
            to={item.to}
            className="flex items-center gap-4 border-b border-gray-200 px-6 py-5 transition hover:bg-gray-50"
          >
            <div className="grid size-10 shrink-0 place-items-center rounded-full bg-gray-100 text-gray-700">
              <Icon size={20} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">
                {item.title}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {item.description}
              </p>
            </div>

            <ChevronRight
              size={18}
              className="shrink-0 text-gray-400"
            />
          </Link>
        );
      })}
    </section>
  );
}
