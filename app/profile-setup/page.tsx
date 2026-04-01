"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

const AVATAR_COLOURS = [
  { name: "Blue", hex: "#2563eb" },
  { name: "Red", hex: "#dc2626" },
  { name: "Green", hex: "#059669" },
  { name: "Purple", hex: "#9333ea" },
  { name: "Orange", hex: "#f97316" },
  { name: "Pink", hex: "#db2777" },
  { name: "Teal", hex: "#0d9488" },
  { name: "Yellow", hex: "#eab308" },
];

type ProfileType = "adult" | "kids";

export default function ProfileSetupPage() {
  const router = useRouter();
  const [step, setStep] = useState<"choose" | "setup">("choose");
  const [profileType, setProfileType] = useState<ProfileType>("adult");
  const [profileName, setProfileName] = useState("");
  const [selectedColour, setSelectedColour] = useState(AVATAR_COLOURS[0]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUserId(user.id);

      const adult = localStorage.getItem(`profile_adult_${user.id}`);
      const kids = localStorage.getItem(`profile_kids_${user.id}`);
      const active = localStorage.getItem(`profile_active_${user.id}`);

      // If both profiles exist and one is active, go home
      if (adult && kids && active) { router.push("/"); return; }
    }
    check();
  }, [router]);

  async function handleSave() {
    if (!profileName.trim()) { setMessage("Please enter a profile name."); return; }
    if (!userId) return;
    setLoading(true);

    const profileData = {
      name: profileName.trim(),
      colour: selectedColour.hex,
      initial: profileName.trim()[0].toUpperCase(),
      type: profileType,
    };

    localStorage.setItem(`profile_${profileType}_${userId}`, JSON.stringify(profileData));
    localStorage.setItem(`profile_active_${userId}`, profileType);

    // Check if other profile exists
    const otherType = profileType === "adult" ? "kids" : "adult";
    const otherProfile = localStorage.getItem(`profile_${otherType}_${userId}`);

    if (!otherProfile) {
      // Ask if they want to set up second profile
      setStep("choose");
      setProfileName("");
      setSelectedColour(AVATAR_COLOURS[0]);
      setMessage(`${profileType === "adult" ? "Adult" : "Kids"} profile saved! Would you like to set up the ${otherType} profile too?`);
      setLoading(false);
      return;
    }

    router.push("/");
  }

  const initial = profileName.trim()[0]?.toUpperCase() ?? "?";

  if (step === "choose") {
    return (
      <main className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(29,78,216,0.08)_0%,_transparent_60%)]" />
        <div className="relative z-10 w-full max-w-lg">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight text-center">
            Who's Watching?
          </h1>
          <p className="text-sm text-gray-500 text-center mb-10">
            Set up your profiles on MigoPlay
          </p>

          {message && (
            <div className="mb-6 rounded border border-white/10 bg-white/5 p-4 text-sm text-gray-300 text-center">
              {message}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-8">
            {/* Adult profile */}
            <button
              onClick={() => { setProfileType("adult"); setStep("setup"); setMessage(""); }}
              className="group rounded-lg border border-white/10 bg-white/5 p-6 text-center transition hover:border-white/25 hover:bg-white/8"
            >
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold text-white mx-auto mb-3 transition group-hover:ring-2 group-hover:ring-white/20 group-hover:ring-offset-2 group-hover:ring-offset-[#0a0a0f]">
                A
              </div>
              <p className="text-sm font-semibold text-white mb-1">Adult</p>
              <p className="text-xs text-gray-500">All content</p>
            </button>

            {/* Kids profile */}
            <button
              onClick={() => { setProfileType("kids"); setStep("setup"); setMessage(""); }}
              className="group rounded-lg border border-white/10 bg-white/5 p-6 text-center transition hover:border-white/25 hover:bg-white/8"
            >
              <div className="w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center text-2xl font-bold text-white mx-auto mb-3 transition group-hover:ring-2 group-hover:ring-white/20 group-hover:ring-offset-2 group-hover:ring-offset-[#0a0a0f]">
                K
              </div>
              <p className="text-sm font-semibold text-white mb-1">Kids</p>
              <p className="text-xs text-gray-500">Family friendly</p>
            </button>
          </div>

          <button
            onClick={() => router.push("/")}
            className="w-full rounded border border-white/10 bg-white/5 py-2.5 text-sm text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            Skip for now
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(29,78,216,0.08)_0%,_transparent_60%)]" />
      <div className="relative z-10 w-full max-w-md">
        <button onClick={() => setStep("choose")} className="text-xs text-gray-500 hover:text-white transition mb-6 flex items-center gap-2">
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight text-center">
          {profileType === "adult" ? "Adult Profile" : "Kids Profile"}
        </h1>
        <p className="text-sm text-gray-500 text-center mb-10">
          {profileType === "kids" ? "Safe for all ages" : "Full access to all content"}
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

        <div className="mb-6">
          <label className="mb-2 block text-xs font-medium text-gray-400 uppercase tracking-wider">
            Profile Name
          </label>
          <input
            type="text"
            placeholder={profileType === "kids" ? "e.g. Mia, Leo, Junior" : "e.g. Alex, Dad, Mum"}
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            maxLength={20}
            className="w-full rounded border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-white/25 transition"
          />
        </div>

        <div className="mb-8">
          <label className="mb-3 block text-xs font-medium text-gray-400 uppercase tracking-wider">
            Avatar Colour
          </label>
          <div className="grid grid-cols-8 gap-2">
            {AVATAR_COLOURS.map((colour) => (
              <button
                key={colour.hex}
                onClick={() => setSelectedColour(colour)}
                className={`w-8 h-8 rounded-full transition-all duration-200 ${
                  selectedColour.hex === colour.hex
                    ? "ring-2 ring-white ring-offset-2 ring-offset-[#0a0a0f] scale-110"
                    : "hover:scale-110"
                }`}
                style={{ backgroundColor: colour.hex }}
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
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </main>
  );
}