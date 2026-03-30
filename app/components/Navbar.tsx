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
  const [menuOpen, setMenuOpen] = useState(false);

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
    setMenuOpen(false);
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/browse", label: "Browse" },
    { href: "/movies", label: "Movies" },
    { href: "/shows", label: "Shows" },
    { href: "/my-list", label: "My List" },
  ];

  return (
    <>
      <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-[#0a0a0f]/95 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.8)]" : "bg-gradient-to-b from-[#0a0a0f] to-transparent"} px-4 md:px-12 py-0 -mt-6`}>
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center -ml-2 md:-ml-4" onClick={() => setMenuOpen(false)}>
            <Image
              src="/logo.png"
              alt="MigoPlay Logo"
              width={200}
              height={70}
              className="object-contain drop-shadow-[0_0_12px_rgba(37,99,235,0.6)] md:w-[260px] md:h-[90px]"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden gap-6 text-sm font-medium md:flex">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href}
                className="text-gray-300 transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                {label}
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin/upload" className="text-blue-400 transition hover:text-blue-300">Admin</Link>
            )}
          </nav>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-3">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Search titles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-52 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500/60 focus:shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all backdrop-blur-sm"
              />
            </form>

            {userEmail ? (
              <button onClick={handleSignOut}
                className="rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10 hover:border-white/40">
                Sign Out
              </button>
            ) : (
              <Link href="/login"
                className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] transition hover:bg-blue-500">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm"
          >
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </header>

      {/* Mobile slide-in menu */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${menuOpen ? "visible" : "invisible"}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMenuOpen(false)}
        />

        {/* Slide panel */}
        <div className={`absolute top-0 right-0 h-full w-72 bg-[#0a0a0f] border-l border-white/10 shadow-[-10px_0_40px_rgba(0,0,0,0.5)] transition-transform duration-300 flex flex-col ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>

          {/* Panel header */}
          <div className="flex items-center justify-between px-6 pt-8 pb-6 border-b border-white/10">
            <Image src="/logo.png" alt="MigoPlay" width={120} height={40} className="object-contain" />
            <button onClick={() => setMenuOpen(false)} className="text-gray-400 hover:text-white text-2xl">✕</button>
          </div>

          {/* Search */}
          <div className="px-6 py-4 border-b border-white/10">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Search titles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500/60 transition"
              />
            </form>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col px-4 py-4 gap-1 flex-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3.5 text-base font-medium text-gray-300 transition hover:bg-white/5 hover:text-white"
              >
                {label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin/upload"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3.5 text-base font-medium text-blue-400 transition hover:bg-blue-900/20"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Sign in/out */}
          <div className="px-6 py-6 border-t border-white/10">
            {userEmail ? (
              <>
                <p className="text-xs text-gray-500 mb-3 truncate">{userEmail}</p>
                <button
                  onClick={() => { handleSignOut(); setMenuOpen(false); }}
                  className="w-full rounded-full border border-white/20 bg-white/5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="block w-full rounded-full bg-blue-600 py-3 text-center text-sm font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] transition hover:bg-blue-500"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}