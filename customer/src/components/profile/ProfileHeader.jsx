import { Link } from "react-router-dom";
import { Mail, Pencil, User } from "lucide-react";
import { useSelector } from "react-redux";

export default function ProfileHeader() {
let {user,isAuthenticated} = useSelector(state=>state.auth)
  if (!user) return null;

  return (
    <section className="mb-8 rounded-2xl border border-gray-200 p-6 sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="size-20 shrink-0 overflow-hidden rounded-full bg-gray-100">
          {user.imageUrl ? (
            <img
              src={user.imageUrl}
              alt={user.fullName || "Profile"}
              className="size-full object-cover"
            />
          ) : (
            <div className="grid size-full place-items-center text-gray-500">
              <User size={32} />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-semibold">
            {user.fullName || "User"}
          </h2>
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
            <Mail size={15} />
            <span className="truncate">
              {user.primaryEmailAddress?.emailAddress}
            </span>
          </div>
        </div>

        <Link
          to="/profile/edit"
          className="flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          <Pencil size={16} />
          Edit Profile
        </Link>

      </div>
    </section>
  );
}
