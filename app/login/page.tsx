"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("Signing in...");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) { setMessage(error.message); return; }

    setMessage("Login successful.");
    router.push("/browse");
  }

  return (
    <main className="min-h-screen bg-[#060818] text-white flex items-center justify-center relative overflow-hidden">

      {/* Glow orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-purple-700/15 blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] rounded-full bg-pink-600/10 blur-[100px] pointer-events-none" />

      {/* Portal rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full border border-purple-500/10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-blue-500/5 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-4">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="MigoPlay Logo"
              width={180}
              height={60}
              className="object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]"
              priority
            />
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 shadow-[0_0_40px_rgba(168,85,247,0.1)]">
          <h1 className="mb-2 text-3xl font-extrabold bg-gradient-to-r from-white via-purple-100 to-blue-200 bg-clip-text text-transparent">
            Welcome back
          </h1>
          <p className="mb-6 text-sm text-gray-400">Sign in to continue your journey</p>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="mb-2 block text-sm text-purple-300">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm outline-none focus:border-purple-500/50 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-purple-300">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm outline-none focus:border-purple-500/50 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-purple-600 to-blue-600 py-3 font-semibold text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] transition hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:scale-[1.01]"
            >
              Sign In
            </button>
          </form>

          {message && (
            <p className="mt-4 text-sm text-gray-400">{message}</p>
          )}

          <p className="mt-6 text-sm text-gray-400 text-center">
            New to MigoPlay?{" "}
            <Link href="/signup" className="text-purple-300 hover:text-purple-200 transition">
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}