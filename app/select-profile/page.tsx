"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PageLoader from "../components/PageLoader";
import { supabase } from "../../lib/supabase";

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
  const [loading, setLoading] = useState(true);

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

      if (found.length === 0) {
        router.push("/profile-setup");
        return;
      }

      setProfiles(found);
      setLoading(false);
    }
    load();
  }, [router]);

  function handleSelect(type: string) {
    if (!userId) return;
    localStorage.setItem(`profile_active_${userId}`, type);
    router.push("/");
  }

  function handleAddProfile() {
    router.push("/profile-setup");
  }

  if (loading) return <PageLoader />;

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(29,78,216,0.08)_0%,_transparent_60%)]" />

      <div className="relative z-10 w-full max-w-lg text-center">
        <div className="flex justify-center mb-8">
          <Image src="/logo.png" alt="MigoPlay" width={200} height={70} className="object-contain" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-1">Who's Watching?</h1>
        <p className="text-sm text-gray-500 mb-10">
          Click your profile to start watching
        </p>

        <div className="flex justify-center gap-8 flex-wrap mb-10">
          {profiles.map(({ type, data }) => (
            <button
              key={type}
              onClick={() => handleSelect(type)}
              className="group flex flex-col items-center gap-3"
            >
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white transition-all duration-200 group-hover:ring-4 group-hover:ring-white/40 group-hover:ring-offset-2 group-hover:ring-offset-[#0a0a0f] group-hover:scale-105 shadow-[0_0_20px_rgba(0,0,0,0.4)]"
                style={{ backgroundColor: data.colour }}
              >
                {data.initial}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{data.name}</p>
                <p className="text-xs text-gray-500 mt-0.5 capitalize">{data.type}</p>
              </div>
            </button>
          ))}

          {profiles.length < 2 && (
            <button
              onClick={handleAddProfile}
              className="group flex flex-col items-center gap-3"
            >
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center text-3xl text-gray-500 transition group-hover:border-white/40 group-hover:text-white group-hover:scale-105">
                +
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Add Profile</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {profiles[0]?.type === "adult" ? "Kids" : "Adult"}
                </p>
              </div>
            </button>
          )}
        </div>

        <p className="text-xs text-gray-600">
          Click a profile above to enter MigoPlay
        </p>
      </div>
    </main>
  );
}