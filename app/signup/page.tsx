"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../../lib/supabase";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSignup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("Creating account...");
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: "http://localhost:3000/login", data: { full_name: fullName } },
    });
    if (error) { setMessage(error.message); return; }
    setMessage("Account created. Check your email to confirm your signup.");
    setFullName(""); setEmail(""); setPassword("");
  }

  return (
    <main className="min-h-screen bg-[#070b14] text-white flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.15)_0%,_transparent_70%)]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-blue-500/10 animate-pulse pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-amber-500/5 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image src="/logo.png" alt="MigoPlay Logo" width={720} height={240}
              className="object-contain drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]" priority />
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 shadow-[0_0_40px_rgba(59,130,246,0.1)]">
          <h1 className="mb-2 text-3xl font-extrabold bg-gradient-to-r from-white via-blue-100 to-amber-200 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="mb-6 text-sm text-gray-400">Join MigoPlay and step into new worlds</p>

          <form className="space-y-4" onSubmit={handleSignup}>
            <div>
              <label className="mb-2 block text-sm text-blue-300">Full Name</label>
              <input type="text" placeholder="Enter your full name" value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm outline-none focus:border-blue-500/50 focus:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition"
                required />
            </div>
            <div>
              <label className="mb-2 block text-sm text-blue-300">Email</label>
              <input type="email" placeholder="Enter your email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm outline-none focus:border-blue-500/50 focus:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition"
                required />
            </div>
            <div>
              <label className="mb-2 block text-sm text-blue-300">Password</label>
              <input type="password" placeholder="Create a password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm outline-none focus:border-blue-500/50 focus:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition"
                required />
            </div>
            <button type="submit"
              className="w-full rounded-full bg-gradient-to-r from-blue-600 to-amber-500 py-3 font-semibold text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] transition hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:scale-[1.01]">
              Create Account
            </button>
          </form>

          {message && (
            <p className={`mt-4 text-sm ${message.startsWith("Account created") ? "text-green-400" : "text-gray-400"}`}>
              {message}
            </p>
          )}

          <p className="mt-6 text-sm text-gray-400 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-amber-400 hover:text-amber-300 transition">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}