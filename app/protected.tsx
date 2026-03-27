"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Protected({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  const publicRoutes = ["/login", "/signup"];

  useEffect(() => {
    async function checkAccess() {
      // Allow login/signup pages
      if (publicRoutes.includes(pathname)) {
        setAllowed(true);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Not logged in → go to login
      if (!user) {
        window.location.href = "/login";
        return;
      }

      // 🔒 ONLY THIS EMAIL IS ALLOWED
      const allowedEmail = "migoplay26@gmail.com";

      if (user.email === allowedEmail) {
        setAllowed(true);
      } else {
        setAllowed(false);
      }
    }

    checkAccess();
  }, [pathname]);

  if (allowed === null) {
    return <div className="min-h-screen bg-black" />;
  }

  if (!allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <h1 className="text-2xl font-bold">Access Denied</h1>
      </div>
    );
  }

  return <>{children}</>;
}