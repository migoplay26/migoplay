"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

const AVATAR_COLOURS = [
  { name: "Blue", bg: "bg-blue-600", hex: "#2563eb" },
  { name: "Red", bg: "bg-red-600", hex: "#dc2626" },
  { name: "Green", bg: "bg-emerald-600", hex: "#059669" },
  { name: "Purple", bg: "bg-purple-600", hex: "#9333ea" },
  { name: "Orange", bg: "bg-orange-500", hex: "#f97316" },
  { name: "Pink", bg: "bg-pink-600", hex: "#db2777" },
  { name: "Teal", bg: "bg-teal-600", hex: "#0d9488" },
  { name: "Yellow", bg: "bg-yellow-500", hex: "#eab308" },
];

export default function ProfileSetupPage() {
  const router = useRouter();
  const [profileName, setProfileName] = useState("");
  const [selectedColour, setSelectedColour] = useState(AVATAR_COLOURS[0]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      // If profile already set up, skip
      const saved = localStorage.getItem(`profile_${user.id}`);
      if (saved) { router.push("/"); return; }
    }
    check();
  }, [router]);

  async function handleSave() {
    if (!profileName.trim()) { setMessage("Please enter a profile name."); return; }
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    localStorage.setItem(`profile_${user.id}`, JSON.stringify({
      name: profileName.trim(),
      colour: selectedColour.hex,
      initial: profileName.trim()[0].toUpperCase(),
    }));

    router.push("/");
  }

  const initial = profileName.trim()[0]?.toUpperCase() ?? "?";

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(29,78,216,0.08)_0%,_transparent_60%)]" />

      <div className="relative z-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight text-center">
          Set Up Your Profile
        </h1>
        <p className="text-sm text-gray-500 text-center mb-10">
          Choose how you appear on MigoPlay
        </p>

        {/* Avatar preview */}
        <div className="flex justify-center mb-8">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-300"
            style={{ backgroundColor: selectedColour.hex }}
          >
            {initial}
          </div>
        </div>

        {/* Profile name */}
        <div className="mb-6">
          <label className="mb-2 block text-xs font-medium text-gray-400 uppercase tracking-wider">
            Profile Name
          </label>
          <input
            type="text"
            placeholder="e.g. Alex, MovieFan, CinemaKing"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            maxLength={20}
            className="w-full rounded border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-white/25 transition"
          />
        </div>

        {/* Colour picker */}
        <div className="mb-8">
          <label className="mb-3 block text-xs font-medium text-gray-400 uppercase tracking-wider">
            Avatar Colour
          </label>
          <div className="grid grid-cols-8 gap-2">
            {AVATAR_COLOURS.map((colour) => (
              <button
                key={colour.hex}
                onClick={() => setSelectedColour(colour)}
                className={`w-8 h-8 rounded-full transition-all duration-200 ${colour.bg} ${
                  selectedColour.hex === colour.hex
                    ? "ring-2 ring-white ring-offset-2 ring-offset-[#0a0a0f] scale-110"
                    : "hover:scale-110"
                }`}
              />
            ))}
          </div>
        </div>

        {message && <p className="text-xs text-gray-500 mb-4">{message}</p>}

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full rounded bg-white py-3 text-sm font-semibold text-black transition hover:bg-gray-100 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Continue to MigoPlay"}
        </button>
      </div>
    </main>
  );
}