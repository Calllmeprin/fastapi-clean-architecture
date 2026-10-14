"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getMe, removeToken } from "@/lib/api";
import { User } from "@/types";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const userData = await getMe();
        setUser(userData);
      } catch (err: any) {
        setError(err.message || "Failed to load user profile");
        // ถ้าเกิด Error หรือ Token หมดอายุ ให้ Redirect กลับไปหน้า Login หลัง 2 วินาที
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, [router]);

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] text-zinc-100 flex items-center justify-center">
        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
          Loading profile data...
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-[#030303] text-zinc-100 flex items-center justify-center p-6">
        <div className="max-w-sm w-full bg-zinc-950 border border-zinc-800 rounded-xl p-6 text-center space-y-4">
          <div className="text-rose-400 text-xs">{error || "Unauthorized access"}</div>
          <p className="text-xs text-zinc-500">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="w-full border-b border-zinc-800/60 bg-[#030303]/60 backdrop-blur-2xl">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-white text-black flex items-center justify-center text-xs font-black">
              FA
            </div>
            <span className="font-semibold text-sm text-white">CleanArch</span>
          </Link>

          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-rose-950 hover:text-rose-400 hover:border-rose-800/50 text-zinc-300 border border-zinc-800 text-xs font-medium transition-all"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Profile Card */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-zinc-950 border border-zinc-800/80 rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-zinc-200 p-[1px]">
              <div className="w-full h-full bg-zinc-950 rounded-full flex items-center justify-center font-bold text-white uppercase text-base">
                {user.email[0]}
              </div>
            </div>
            <div>
              <h1 className="text-base font-semibold text-white">
                {user.full_name || "User Account"}
              </h1>
              <p className="text-xs text-zinc-400">{user.email}</p>
            </div>
          </div>

          <div className="border-t border-zinc-800/60 pt-4 space-y-3 text-xs">
            <div className="flex justify-between py-1">
              <span className="text-zinc-500">User ID</span>
              <span className="text-zinc-300 font-mono">#{user.id}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-500">Auth Status</span>
              <span className="text-emerald-400 font-medium">Authenticated (JWT)</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/"
              className="block w-full text-center py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-medium transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}