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
    setMessage("Account created! Check your email to confirm.");
    setFullName(""); setEmail(""); setPassword("");
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center relative px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(29,78,216,0.08)_0%,_transparent_60%)]" />

      <div className="relative z-10 w-full max-w-sm">
        <div className="flex justify-center mb-10">
          <Link href="/">
            <Image src="/logo.png" alt="MigoPlay Logo" width={720} height={240}
              className="object-contain" priority />
          </Link>
        </div>

        <div className="border border-white/8 bg-white/3 rounded-lg p-8">
          <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">Create Account</h1>
          <p className="text-sm text-gray-500 mb-7">Join MigoPlay today</p>

          <form className="space-y-4" onSubmit={handleSignup}>
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-400 uppercase tracking-wider">Full Name</label>
              <input type="text" placeholder="Your name" value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-white/25 transition"
                required />
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-400 uppercase tracking-wider">Email</label>
              <input type="email" placeholder="your@email.com" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-white/25 transition"
                required />
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-400 uppercase tracking-wider">Password</label>
              <input type="password" placeholder="••••••••" value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-white/25 transition"
                required />
            </div>
            <button type="submit"
              className="w-full rounded bg-white py-3 text-sm font-semibold text-black transition hover:bg-gray-100 mt-2">
              Create Account
            </button>
          </form>

          {message && (
            <p className={`mt-4 text-xs ${message.startsWith("Account created") ? "text-gray-400" : "text-gray-500"}`}>
              {message}
            </p>
          )}

          <p className="mt-6 text-xs text-gray-600 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-white hover:text-gray-300 transition">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}