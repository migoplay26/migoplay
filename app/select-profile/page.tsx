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
  profile_type: string;
};

export default function SelectProfilePage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { router.push("/login"); return; }

      setUserId(session.user.id);

      const { data, error } = await supabase
        .from("profiles")
        .select("name, colour, initial, profile_type")
        .eq("user_id", session.user.id)
        .order("profile_type", { ascending: true });

      if (error || !data || data.length === 0) {
        router.push("/profile-setup");
        return;
      }

      setProfiles(data);
      setLoading(false);
    }
    load();
  }, [router]);

  function handleSelect(type: string) {
    if (!userId || selecting) return;
    setSelecting(type);

    // Save to localStorage first
    localStorage.setItem(`active_profile_${userId}`, type);

    // Fire event so navbar updates
    window.dispatchEvent(new Event("profileChanged"));

    // Use window.location instead of router.push to force full reload
    // This ensures protected.tsx re-reads localStorage properly
    window.location.href = "/";
  }

  function handleAddProfile() {
    router.push("/profile-setup");
  }

  if (loading) return <PageLoader />;

  const hasKids = profiles.some((p) => p.profile_type === "kids");

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(29,78,216,0.08)_0%,_transparent_60%)]" />

      <div className="relative z-10 w-full max-w-lg text-center">
        <div className="flex justify-center mb-10">
          <Image
            src="/logo.png"
            alt="MigoPlay"
            width={220}
            height={75}
            className="object-contain"
          />
        </div>

        <h1 className="text-2xl font-bold text-white mb-1">Who's Watching?</h1>
        <p className="text-sm text-gray-500 mb-12">
          Select your profile to continue
        </p>

        <div className="flex justify-center gap-10 flex-wrap mb-12">
          {profiles.map((profile) => (
            <button
              key={profile.profile_type}
              onClick={() => handleSelect(profile.profile_type)}
              disabled={!!selecting}
              className="group flex flex-col items-center gap-4 disabled:opacity-70"
            >
              <div
                className={`w-28 h-28 rounded-full flex items-center justify-center text-4xl font-bold text-white transition-all duration-200 shadow-[0_8px_30px_rgba(0,0,0,0.5)] ${
                  selecting === profile.profile_type
                    ? "ring-4 ring-white/50 ring-offset-4 ring-offset-[#0a0a0f] scale-110"
                    : "group-hover:ring-4 group-hover:ring-white/50 group-hover:ring-offset-4 group-hover:ring-offset-[#0a0a0f] group-hover:scale-110"
                }`}
                style={{ backgroundColor: profile.colour }}
              >
                {selecting === profile.profile_type ? (
                  <div className="w-8 h-8 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  profile.initial
                )}
              </div>
              <div>
                <p className="text-base font-semibold text-white group-hover:text-gray-300 transition">
                  {profile.name}
                </p>
                <p className="text-xs text-gray-600 mt-0.5 capitalize">
                  {profile.profile_type}
                </p>
              </div>
            </button>
          ))}

          {!hasKids && !selecting && (
            <button
              onClick={handleAddProfile}
              className="group flex flex-col items-center gap-4"
            >
              <div className="w-28 h-28 rounded-full border-2 border-dashed border-white/15 flex items-center justify-center text-4xl text-gray-600 transition-all duration-200 group-hover:border-white/30 group-hover:text-gray-400 group-hover:scale-110">
                +
              </div>
              <div>
                <p className="text-base font-semibold text-gray-500 group-hover:text-white transition">
                  Add Kids
                </p>
                <p className="text-xs text-gray-600 mt-0.5">Family friendly</p>
              </div>
            </button>
          )}
        </div>

        <p className="text-xs text-gray-700">
          Select a profile to enter MigoPlay
        </p>
      </div>
    </main>
  );
}