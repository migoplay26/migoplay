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
      const { data: { user } } = await supabase.auth.getUser();
      const email = user?.email ?? null;
      setUserEmail(email);
      if (!user) { setIsAdmin(false); return; }
      const { data: adminRow } = await supabase
        .from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
      setIsAdmin(!!adminRow);
    }

    getUserAndAdminStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const email = session?.user?.email ?? null;
      setUserEmail(email);
      if (!session?.user) { setIsAdmin(false); return; }
      const { data: adminRow } = await supabase
        .from("admins").select("user_id").eq("user_id", session.user.id).maybeSingle();
      setIsAdmin(!!adminRow);
    });

    return () => { subscription.unsubscribe(); };
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = search.trim();
    if (!trimmed) { router.push("/browse"); return; }
    router.push(`/browse?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <header className="fixed top-0 z-50 flex w-full flex-row items-center bg-[#070b14]/90 backdrop-blur-md border-b border-white/5 px-8 md:px-16 py-0 -mt-6 justify-between">
      <div className="flex items-center gap-10">
        <Link href="/" className="flex items-center -ml-4">
          <Image
            src="/logo.png"
            alt="MigoPlay Logo"
            width={260}
            height={90}
            className="object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            priority
          />
        </Link>

        <nav className="hidden gap-6 text-sm md:flex">
          {[
            { href: "/", label: "Home" },
            { href: "/browse", label: "Browse" },
            { href: "/movies", label: "Movies" },
            { href: "/shows", label: "Shows" },
            { href: "/my-list", label: "My List" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-gray-400 transition hover:text-white hover:text-shadow"
            >
              {label}
            </Link>
          ))}
          {isAdmin && (
            <Link href="/admin/upload" className="text-amber-400 transition hover:text-amber-300">
              Admin
            </Link>
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
            className="w-56 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500/50 focus:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition backdrop-blur-sm"
          />
        </form>

        {userEmail ? (
          <button
            onClick={handleSignOut}
            className="rounded-full border border-blue-500/30 bg-blue-900/20 px-5 py-2 text-sm font-semibold text-blue-200 backdrop-blur-sm transition hover:bg-blue-900/40 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          >
            Sign Out
          </button>
        ) : (
          <Link
            href="/login"
            className="rounded-full bg-gradient-to-r from-blue-600 to-amber-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] transition hover:shadow-[0_0_25px_rgba(245,158,11,0.4)]"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}