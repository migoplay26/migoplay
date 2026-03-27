"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
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
      email,
      password,
      options: {
        emailRedirectTo: "http://localhost:3000/login",
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Account created. Check your email to confirm your signup.");
    setFullName("");
    setEmail("");
    setPassword("");
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="relative flex min-h-screen items-center justify-center bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 w-full max-w-md rounded-lg bg-black/80 p-8 shadow-2xl">
          <h1 className="mb-6 text-4xl font-bold">Create Account</h1>

          <form className="space-y-4" onSubmit={handleSignup}>
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded bg-zinc-800 px-4 py-3 text-white outline-none ring-1 ring-zinc-700 focus:ring-red-600"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded bg-zinc-800 px-4 py-3 text-white outline-none ring-1 ring-zinc-700 focus:ring-red-600"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Password
              </label>
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded bg-zinc-800 px-4 py-3 text-white outline-none ring-1 ring-zinc-700 focus:ring-red-600"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded bg-red-600 py-3 font-semibold transition hover:bg-red-700"
            >
              Sign Up
            </button>
          </form>

          {message && (
            <p className="mt-4 text-sm text-gray-300">{message}</p>
          )}

          <p className="mt-6 text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-white hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}