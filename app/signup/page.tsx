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
    <main className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center relative overflow-hidden">
      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(60)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{ width: "1.5px", height: "1.5px", top: Math.random() * 100 + "%", left: Math.random() * 100 + "%", opacity: Math.random() * 0.6 + 0.1 }} />
        ))}
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(37,99,235,0.12)_0%,_transparent_65%)]" />

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image src="/logo.png" alt="MigoPlay Logo" width={720} height={240}
              className="object-contain drop-shadow-[0_0_20px_rgba(37,99,235,0.5)]" priority />
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/4 backdrop-blur-md p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <h1 className="mb-1 text-3xl font-extrabold text-white">Create Account</h1>
          <p className="mb-7 text-sm text-gray-400">Join MigoPlay today</p>

          <form className="space-y-4" onSubmit={handleSignup}>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">Full Name</label>
              <input type="text" placeholder="Your full name" value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-blue-500/60 focus:shadow-[0_0_15px_rgba(37,99,235,0.2)] transition"
                required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">Email</label>
              <input type="email" placeholder="your@email.com" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-blue-500/60 focus:shadow-[0_0_15px_rgba(37,99,235,0.2)] transition"
                required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">Password</label>
              <input type="password" placeholder="••••••••" value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-blue-500/60 focus:shadow-[0_0_15px_rgba(37,99,235,0.2)] transition"
                required />
            </div>
            <button type="submit"
              className="w-full rounded-full bg-blue-600 py-3 font-bold text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] transition hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:scale-[1.01]">
              Create Account
            </button>
          </form>

          {message && (
            <p className={`mt-4 text-sm ${message.startsWith("Account created") ? "text-green-400" : "text-gray-400"}`}>
              {message}
            </p>
          )}

          <p className="mt-6 text-sm text-gray-500 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}