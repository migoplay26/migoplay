"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Protected({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  const publicRoutes = ["/login", "/signup"];
  const skipProfileCheck = ["/login", "/signup", "/profile-setup", "/select-profile"];

  useEffect(() => {
    async function checkAccess() {
      if (publicRoutes.includes(pathname)) { setAllowed(true); return; }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }

      const allowedEmail = "migoplay26@gmail.com";
      if (user.email !== allowedEmail) { setAllowed(false); return; }

      if (!skipProfileCheck.includes(pathname)) {
        const adultProfile = localStorage.getItem(`profile_adult_${user.id}`);
        const kidsProfile = localStorage.getItem(`profile_kids_${user.id}`);
        const activeProfile = localStorage.getItem(`profile_active_${user.id}`);

        // No profiles at all → setup
        if (!adultProfile && !kidsProfile) {
          window.location.href = "/profile-setup";
          return;
        }

        // Has at least one profile but none active → set first found as active
        if (!activeProfile) {
          const firstType = adultProfile ? "adult" : "kids";
          localStorage.setItem(`profile_active_${user.id}`, firstType);
        }
      }

      setAllowed(true);
    }

    checkAccess();
  }, [pathname]);

  if (allowed === null) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 animate-ping" />
            <div className="absolute inset-1 rounded-full border-2 border-purple-500 border-t-pink-400 animate-spin" />
            <div className="absolute inset-4 rounded-full border border-pink-400/30" />
          </div>
          <p className="text-gray-500 text-xs tracking-widest uppercase">Loading...</p>
        </div>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-500 text-sm">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}