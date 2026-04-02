"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { useProfile } from "../hooks/useProfile";

export default function Navbar() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const profile = useProfile();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function getUserAndAdminStatus() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { setLoggedIn(false); setIsAdmin(false); return; }
      setLoggedIn(true);
      const { data: adminRow } = await supabase
        .from("admins").select("user_id").eq("user_id", session.user.id).maybeSingle();
      setIsAdmin(!!adminRow);
    }

    getUserAndAdminStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) { setLoggedIn(false); setIsAdmin(false); return; }
      setLoggedIn(true);
      const { data: adminRow } = await supabase
        .from("admins").select("user_id").eq("user_id", session.user.id).maybeSingle();
      setIsAdmin(!!adminRow);
    });

    return () => { subscription.unsubscribe(); };
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/login";
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

  const HeadsetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );

  const PencilIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"
      viewBox="0 0 24 24" fill="none" stroke="black"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );

  return (
    <>
      <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0f]/98 backdrop-blur-md border-b border-white/5"
          : "bg-gradient-to-b from-[#0a0a0f]/80 to-transparent"
      } px-4 md:px-12 py-0 -mt-6`}>
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center -ml-2 md:-ml-4"
            onClick={() => setMenuOpen(false)}>
            <Image
              src="/logo.png"
              alt="MigoPlay Logo"
              width={180}
              height={65}
              className="object-contain md:w-[260px] md:h-[90px]"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden gap-6 text-sm font-medium md:flex">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href}
                className="text-gray-400 transition hover:text-white">
                {label}
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin/upload"
                className="text-gray-400 transition hover:text-white">
                Admin
              </Link>
            )}
          </nav>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-3">

            {/* Headset contact button */}
            <Link
              href="/contact"
              className="flex items-center justify-center w-9 h-9 rounded border border-white/10 bg-white/5 text-gray-400 transition hover:bg-white/10 hover:text-white"
              title="Contact Us"
            >
              <HeadsetIcon />
            </Link>

            {/* Search */}
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-48 rounded border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-white/20 transition"
              />
            </form>

            {/* Auth */}
            {loggedIn ? (
              <div className="flex items-center gap-3">
                {profile && (
                  <Link href="/manage-profile" className="flex items-center gap-2 group">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 transition group-hover:ring-2 group-hover:ring-white/40 group-hover:ring-offset-1 group-hover:ring-offset-[#0a0a0f]"
                      style={{ backgroundColor: profile.colour }}
                    >
                      {profile.initial}
                    </div>
                    <span className="text-sm text-gray-300 hidden lg:block group-hover:text-white transition">
                      {profile.name}
                    </span>
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="rounded border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10">
                  Sign Out
                </button>
              </div>
            ) : (
              <Link href="/login"
                className="rounded bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-gray-100">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </header>

      {/* Mobile slide-in menu */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${menuOpen ? "visible" : "invisible"}`}>

        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/70 transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMenuOpen(false)}
        />

        {/* Panel */}
        <div className={`absolute top-0 right-0 h-full w-72 bg-[#0d0d12] border-l border-white/5 transition-transform duration-300 flex flex-col ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>

          {/* Profile header */}
          <div className="flex items-center px-6 pt-8 pb-6 border-b border-white/5">
            {profile ? (
              <button
                onPointerUp={() => {
                  setMenuOpen(false);
                  window.location.href = "/manage-profile";
                }}
                className="flex items-center gap-3 flex-1 text-left"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                {/* Avatar with pencil badge */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white"
                    style={{ backgroundColor: profile.colour }}
                  >
                    {profile.initial}
                  </div>
                  {/* Pencil badge */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-md pointer-events-none">
                    <PencilIcon />
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    {profile.name}
                  </p>
                  <p className="text-xs text-gray-500">Tap to edit profile</p>
                </div>
              </button>
            ) : (
              <Image
                src="/logo.png"
                alt="MigoPlay"
                width={100}
                height={35}
                className="object-contain"
              />
            )}
          </div>

          {/* Search */}
          <div className="px-6 py-4 border-b border-white/5">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Search titles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-white/20 transition"
              />
            </form>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col px-3 py-4 gap-0.5 flex-1">
            {navLinks.map(({ href, label }) => (
              <button
                key={href}
                onPointerUp={() => {
                  setMenuOpen(false);
                  window.location.href = href;
                }}
                className="rounded px-4 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-white text-left w-full"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                {label}
              </button>
            ))}
            {isAdmin && (
              <button
                onPointerUp={() => {
                  setMenuOpen(false);
                  window.location.href = "/admin/upload";
                }}
                className="rounded px-4 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-white text-left w-full"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                Admin
              </button>
            )}
          </nav>

          {/* Contact Us */}
          <div className="px-6 py-4 border-t border-white/5">
            <button
              onPointerUp={() => {
                setMenuOpen(false);
                window.location.href = "/contact";
              }}
              className="flex items-center gap-3 rounded px-4 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-white w-full"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <HeadsetIcon />
              Contact Us
            </button>
          </div>

          {/* Sign in/out */}
          <div className="px-6 pb-8">
            {loggedIn ? (
              <button
                onPointerUp={() => {
                  setMenuOpen(false);
                  handleSignOut();
                }}
                className="w-full rounded border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                Sign Out
              </button>
            ) : (
              <button
                onPointerUp={() => {
                  setMenuOpen(false);
                  window.location.href = "/login";
                }}
                className="block w-full rounded bg-white py-2.5 text-center text-sm font-semibold text-black transition hover:bg-gray-100"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}