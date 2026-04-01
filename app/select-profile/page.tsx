"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import Image from "next/image";

type Profile = {
  name: string;
  colour: string;
  initial: string;
  type: "adult" | "kids";
};

export default function SelectProfilePage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<{ type: string; data: Profile }[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUserId(user.id);

      const found: { type: string; data: Profile }[] = [];
      for (const type of ["adult", "kids"]) {
        const saved = localStorage.getItem(`profile_${type}_${user.id}`);
        if (saved) found.push({ type, data: JSON.parse(saved) });
      }
      setProfiles(found);
    }
    load();
  }, [router]);

  function handleSelect(type: string) {
    if (!userId) return;
    localStorage.setItem(`profile_active_${userId}`, type);
    // Update active profile in hook-compatible format
    const saved = localStorage.getItem(`profile_${type}_${userId}`);
    if (saved) {
      localStorage.setItem(`profile_${userId}`, saved);
    }
    router.push("/");
  }

  function handleAddProfile() {
    router.push("/profile-setup");
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(29,78,216,0.08)_0%,_transparent_60%)]" />

      <div className="relative z-10 w-full max-w-lg text-center">
        <div className="flex justify-center mb-8">
          <Image src="/logo.png" alt="MigoPlay" width={200} height={70} className="object-contain" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">Who's Watching?</h1>
        <p className="text-sm text-gray-500 mb-10">Select your profile to continue</p>

        <div className="flex justify-center gap-6 flex-wrap mb-8">
          {profiles.map(({ type, data }) => (
            <button
              key={type}
              onClick={() => handleSelect(type)}
              className="group flex flex-col items-center gap-3"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white transition-all duration-200 group-hover:ring-4 group-hover:ring-white/30 group-hover:ring-offset-2 group-hover:ring-offset-[#0a0a0f] group-hover:scale-105"
                style={{ backgroundColor: data.colour }}
              >
                {data.initial}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{data.name}</p>
                <p className="text-xs text-gray-500 capitalize">{data.type}</p>
              </div>
            </button>
          ))}

          {/* Add profile button if less than 2 */}
          {profiles.length < 2 && (
            <button
              onClick={handleAddProfile}
              className="group flex flex-col items-center gap-3"
            >
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center text-3xl text-gray-500 transition group-hover:border-white/40 group-hover:text-white group-hover:scale-105">
                +
              </div>
              <p className="text-sm text-gray-500 group-hover:text-white transition">Add Profile</p>
            </button>
          )}
        </div>
      </div>
    </main>
  );
}