"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function Navbar() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function getUserAndAdminStatus() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const email = user?.email ?? null;
      setUserEmail(email);

      if (!user) {
        setIsAdmin(false);
        return;
      }

      const { data: adminRow } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      setIsAdmin(!!adminRow);
    }

    getUserAndAdminStatus();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const email = session?.user?.email ?? null;
      setUserEmail(email);

      if (!session?.user) {
        setIsAdmin(false);
        return;
      }

      const { data: adminRow } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", session.user.id)
        .maybeSingle();

      setIsAdmin(!!adminRow);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmed = search.trim();

    if (!trimmed) {
      router.push("/browse");
      return;
    }

    router.push(`/browse?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <header className="fixed top-0 z-50 flex w-full flex-row items-center bg-gradient-to-b from-black/95 to-transparent px-4 py-0 -mt-6 justify-between">
      <div className="flex items-center gap-8">

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="MigoPlay Logo"
            width={260}
            height={90}
            className="object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]"
            priority
          />
        </Link>

        <nav className="hidden gap-6 text-sm md:flex">
          <Link href="/" className="transition hover:text-gray-300">Home</Link>
          <Link href="/browse" className="transition hover:text-gray-300">Browse</Link>
          <Link href="/movies" className="transition hover:text-gray-300">Movies</Link>
          <Link href="/shows" className="transition hover:text-gray-300">Shows</Link>
          <Link href="/my-list" className="transition hover:text-gray-300">My List</Link>
          {isAdmin && (
            <Link href="/admin/upload" className="transition hover:text-gray-300">Admin</Link>
          )}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="hidden md:block">
          <input
            type="text"
            placeholder="Search titles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 rounded bg-zinc-900/90 px-4 py-2 text-sm text-white outline-none ring-1 ring-zinc-700 focus:ring-red-600"
          />
        </form>

        {userEmail ? (
          <button
            onClick={handleSignOut}
            className="rounded bg-red-600 px-4 py-2 text-sm font-semibold transition hover:bg-red-700"
          >
            Sign Out
          </button>
        ) : (
          <Link
            href="/login"
            className="rounded bg-red-600 px-4 py-2 text-sm font-semibold transition hover:bg-red-700"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}