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
      // Public routes — allow immediately
      if (publicRoutes.includes(pathname)) {
        setAllowed(true);
        return;
      }

      // Get session — faster than getUser() on mobile
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        window.location.href = "/login";
        return;
      }

      const user = session.user;

      const allowedEmail = "migoplay26@gmail.com";
      if (user.email !== allowedEmail) {
        setAllowed(false);
        return;
      }

      // Skip profile check for profile pages
      if (skipProfileCheck.includes(pathname)) {
        setAllowed(true);
        return;
      }

      // Check if active profile is selected
      const activeProfile = localStorage.getItem(`active_profile_${user.id}`);

      if (!activeProfile) {
        // Check Supabase for profiles — only if no active profile in localStorage
        const { data: profiles } = await supabase
          .from("profiles")
          .select("profile_type")
          .eq("user_id", user.id)
          .limit(1);

        if (!profiles || profiles.length === 0) {
          window.location.href = "/profile-setup";
          return;
        }

        // Has profiles but none selected — go to select
        window.location.href = "/select-profile";
        return;
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
          <p className="text-gray-500 text-sm">
            You don't have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}