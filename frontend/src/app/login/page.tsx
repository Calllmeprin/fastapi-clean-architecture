"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginUser } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginUser(formData);
      router.push("/profile");
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-zinc-950 border border-zinc-800/80 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-xs text-zinc-400">Sign in to your account</p>
        </div>

        {registered && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs p-3 rounded-lg text-center">
            Registration successful! Please sign in.
          </div>
        )}

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-400 mb-1 font-medium">Email Address</label>
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
            <label className="block text-zinc-400 mb-1 font-medium">Password</label>
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
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-zinc-200 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}