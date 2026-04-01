"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/Navbar";
import PageLoader from "../components/PageLoader";
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

export default function EditProfilePage() {
  const router = useRouter();
  const [profileName, setProfileName] = useState("");
  const [selectedColour, setSelectedColour] = useState(AVATAR_COLOURS[0]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<string>("adult");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUserId(user.id);

      const type = localStorage.getItem(`profile_active_${user.id}`) ?? "adult";
      setActiveType(type);

      const saved = localStorage.getItem(`profile_${type}_${user.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setProfileName(parsed.name ?? "");
        const colour = AVATAR_COLOURS.find((c) => c.hex === parsed.colour);
        if (colour) setSelectedColour(colour);
      }
      setPageLoading(false);
    }
    load();
  }, [router]);

  async function handleSave() {
    if (!profileName.trim()) { setMessage("Please enter a profile name."); return; }
    if (!userId) return;
    setLoading(true);

    const profileData = {
      name: profileName.trim(),
      colour: selectedColour.hex,
      initial: profileName.trim()[0].toUpperCase(),
      type: activeType,
    };

    localStorage.setItem(`profile_${activeType}_${userId}`, JSON.stringify(profileData));

    setMessage("Profile updated!");
    setLoading(false);
    setTimeout(() => router.push("/"), 1000);
  }

  const initial = profileName.trim()[0]?.toUpperCase() ?? "?";

  if (pageLoading) return <PageLoader />;

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar />

      <section className="relative px-4 md:px-12 pt-28 md:pt-32 pb-6">
        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-2">
          Edit Profile
        </h1>
        <p className="text-sm text-gray-500">
          Editing your <span className="text-white capitalize">{activeType}</span> profile.
        </p>
      </section>

      <div className="mx-4 md:mx-12 h-px bg-white/5 mb-8" />

      <section className="px-4 md:px-12 pb-16">
        <div className="max-w-md">

          {/* Avatar preview */}
          <div className="flex items-center gap-5 mb-8">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white flex-shrink-0 transition-all duration-300"
              style={{ backgroundColor: selectedColour.hex }}
            >
              {initial}
            </div>
            <div>
              <p className="text-base font-semibold text-white">{profileName || "Your Name"}</p>
              <p className="text-xs text-gray-500 mt-0.5 capitalize">{activeType} Profile</p>
            </div>
          </div>

          {/* Profile name */}
          <div className="mb-6">
            <label className="mb-2 block text-xs font-medium text-gray-400 uppercase tracking-wider">
              Profile Name
            </label>
            <input
              type="text"
              placeholder="e.g. Alex, MovieFan"
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
            <div className="flex gap-3 flex-wrap">
              {AVATAR_COLOURS.map((colour) => (
                <button
                  key={colour.hex}
                  onClick={() => setSelectedColour(colour)}
                  className={`w-9 h-9 rounded-full transition-all duration-200 ${
                    selectedColour.hex === colour.hex
                      ? "ring-2 ring-white ring-offset-2 ring-offset-[#0a0a0f] scale-110"
                      : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: colour.hex }}
                />
              ))}
            </div>
          </div>

          {message && (
            <p className={`text-xs mb-4 ${message === "Profile updated!" ? "text-green-400" : "text-gray-500"}`}>
              {message}
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 rounded bg-white py-3 text-sm font-semibold text-black transition hover:bg-gray-100 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <Link href="/"
              className="rounded border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10">
              Cancel
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}