"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "", full_name: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerUser(formData);
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-zinc-950 border border-zinc-800/80 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white">Create an Account</h1>
          <p className="text-xs text-zinc-400">Enter your details to get started</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-400 mb-1 font-medium">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-zinc-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1 font-medium">Email Address *</label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-zinc-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1 font-medium">Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-zinc-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-semibold py-2.5 rounded-lg hover:bg-zinc-200 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-500">
          Already have an account?{" "}
          <Link href="/login" className="text-zinc-200 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}