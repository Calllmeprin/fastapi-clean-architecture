"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getToken } from "@/lib/api";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // เช็กว่ามี Token อยู่ใน localStorage หรือไม่
    const token = getToken();
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-white selection:text-black relative overflow-hidden">
      
      {/* Top Navbar */}
      <header className="w-full border-b border-zinc-800/60 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-white text-black flex items-center justify-center text-xs font-black tracking-tighter">
              FA
            </div>
            <span className="font-semibold text-sm tracking-tight text-white">
              Clean<span className="text-zinc-500">Arch</span>
            </span>
          </div>

          <nav className="hidden sm:flex items-center gap-6 text-xs text-zinc-400 font-medium">
            <a href="#features" className="hover:text-white transition-colors">Architecture</a>
            <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">API Docs</a>
            <a href="https://nextjs.org" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Next.js</a>
          </nav>

          {/* Dynamic Action Buttons */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              // แสดงเมื่อ ล็อกอินแล้ว
              <Link
                href="/profile"
                className="px-4 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold border border-zinc-700 transition-all shadow-sm"
              >
                My Profile
              </Link>
            ) : (
              // แสดงเมื่อ ยังไม่ได้ล็อกอิน
              <>
                <Link
                  href="/login"
                  className="text-xs text-zinc-300 hover:text-white transition-colors px-3 py-1.5 rounded-md border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 rounded-md bg-white hover:bg-zinc-200 text-black text-xs font-semibold transition-all shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#22222215_1px,transparent_1px),linear-gradient(to_bottom,#22222215_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-indigo-600/15 via-purple-500/10 to-transparent blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-4xl w-full text-center space-y-8 relative z-10 my-auto">
          
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-zinc-950/80 border border-zinc-800 text-zinc-300 text-xs font-medium backdrop-blur-xl shadow-sm hover:border-zinc-700 transition-all duration-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-zinc-300 font-normal">
              Full-Stack Prototype • Dev Phase
            </span>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-white leading-[1.15]">
              Next-Gen Fullstack <br />
              <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
                Clean Architecture.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed">
              High-performance backend meets ultra-responsive frontend. Engineered with <span className="text-zinc-200 font-medium">FastAPI</span> and <span className="text-zinc-200 font-medium">Next.js App Router</span>.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href={isLoggedIn ? "/profile" : "/register"}
              className="relative group overflow-hidden rounded-lg p-[1px] font-medium text-sm transition-all duration-300 active:scale-95 shadow-lg shadow-white/5"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-zinc-200 via-white to-zinc-400 rounded-lg" />
              <span className="relative px-7 py-3 block rounded-[7px] bg-white text-black font-semibold hover:bg-opacity-90 transition-all">
                {isLoggedIn ? "Go to Profile" : "Get Started"}
              </span>
            </Link>

            {/* Vercel Deploy Link */}
            <a
              href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noreferrer"
              className="px-7 py-3 rounded-lg bg-zinc-900/90 text-zinc-300 border border-zinc-800 hover:border-zinc-700 hover:text-white font-medium text-sm backdrop-blur-md transition-all duration-300 active:scale-95 flex items-center gap-2"
            >
              <svg className="w-3.5 h-3.5 fill-current text-white" viewBox="0 0 76 65" xmlns="http://www.w3.org/2000/svg">
                <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
              </svg>
              Deploy to Vercel ↗
            </a>

            {/* FastAPI API Reference Link */}
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-lg bg-zinc-950 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200 font-medium text-sm backdrop-blur-md transition-all duration-300 active:scale-95"
            >
              API Reference ↗
            </a>
          </div>

          <div id="features" className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-16 text-left">
            <Card 
              badge="BACKEND"
              title="FastAPI Core"
              description="Python backend built with Clean Architecture pattern"
            />
            <Card 
              badge="PATTERN"
              title="Clean Architecture"
              description="Strict layer separation keeping domain logic fully decoupled from frameworks."
            />
            <Card 
              badge="FRONTEND"
              title="Next.js App Router"
              description="Server components and rapid UI development styled with Tailwind CSS."
            />
          </div>

        </div>
      </main>
    </div>
  );
}

function Card({ badge, title, description }: { badge: string; title: string; description: string }) {
  return (
    <div className="relative group rounded-xl p-[1px] bg-gradient-to-b from-zinc-700/40 via-zinc-800/20 to-transparent hover:from-zinc-500/50 hover:via-zinc-700/30 hover:to-zinc-800/20 transition-all duration-500 shadow-xl hover:-translate-y-1">
      <div className="h-full p-6 rounded-[11px] bg-zinc-950/90 backdrop-blur-xl flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase mb-2 block">{badge}</span>
          <h3 className="font-semibold text-zinc-100 text-sm mb-2 group-hover:text-white transition-colors flex items-center justify-between">
            {title}
            <span className="text-xs text-zinc-600 group-hover:text-zinc-400 transition-colors">↗</span>
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed font-light">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}