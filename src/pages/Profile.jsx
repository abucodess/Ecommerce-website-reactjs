import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileMenu from "@/components/profile/ProfileMenu";

export default function Profile() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-gray-400">
            Account
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your account and preferences.
          </p>
        </div>

        <ProfileHeader />

        <ProfileMenu />
      </main>

      <Footer />
    </div>
  );
}

