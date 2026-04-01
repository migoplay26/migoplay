"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Protected({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  const publicRoutes = ["/login", "/signup"];
  const skipProfileCheck = ["/login", "/signup", "/profile-setup"];

  useEffect(() => {
    async function checkAccess() {
      // Allow login/signup pages
      if (publicRoutes.includes(pathname)) {
        setAllowed(true);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();

      // Not logged in → go to login
      if (!user) {
        window.location.href = "/login";
        return;
      }

      // Only this email is allowed
      const allowedEmail = "migoplay26@gmail.com";
      if (user.email !== allowedEmail) {
        setAllowed(false);
        return;
      }

      // Check if profile has been set up
      if (!skipProfileCheck.includes(pathname)) {
        const savedProfile = localStorage.getItem(`profile_${user.id}`);
        if (!savedProfile) {
          window.location.href = "/profile-setup";
          return;
        }
      }

      setAllowed(true);
    }

    checkAccess();
  }, [pathname]);

  if (allowed === null) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
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