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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-[#0a0a0f]/95 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.8)]" : "bg-gradient-to-b from-[#0a0a0f] to-transparent"} px-6 md:px-12 py-0 -mt-6`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center -ml-4">
            <Image
              src="/logo.png"
              alt="MigoPlay Logo"
              width={260}
              height={90}
              className="object-contain drop-shadow-[0_0_12px_rgba(37,99,235,0.6)]"
              priority
            />
          </Link>

          <nav className="hidden gap-6 text-sm font-medium md:flex">
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
                className="text-gray-300 transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              >
                {label}
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin/upload" className="text-blue-400 transition hover:text-blue-300 hover:drop-shadow-[0_0_8px_rgba(37,99,235,0.8)]">
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
              className="w-52 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500/60 focus:bg-white/8 focus:shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all backdrop-blur-sm"
            />
          </form>

          {userEmail ? (
            <button
              onClick={handleSignOut}
              className="rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10 hover:border-white/40 hover:shadow-[0_0_15px_rgba(255,255,255,0.15)]"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] transition hover:bg-blue-500 hover:shadow-[0_0_25px_rgba(37,99,235,0.7)]"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}