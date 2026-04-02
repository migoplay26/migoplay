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

type Profile = {
  name: string;
  colour: string;
  initial: string;
  profile_type: string;
};

export default function ManageProfilePage() {
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<string>("adult");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [editingType, setEditingType] = useState<string | null>(null);
  const [profileName, setProfileName] = useState("");
  const [selectedColour, setSelectedColour] = useState(AVATAR_COLOURS[0]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadProfiles(uid: string) {
    const { data } = await supabase
      .from("profiles")
      .select("name, colour, initial, profile_type")
      .eq("user_id", uid);
    if (data) setProfiles(data);
  }

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUserId(user.id);

      const type = localStorage.getItem(`active_profile_${user.id}`) ?? "adult";
      setActiveType(type);

      await loadProfiles(user.id);
      setPageLoading(false);
    }
    load();
  }, [router]);

  function handleSwitchProfile(type: string) {
    if (!userId) return;
    localStorage.setItem(`active_profile_${userId}`, type);
    setActiveType(type);
    router.push("/");
  }

  function handleStartEdit(profile: Profile) {
    setEditingType(profile.profile_type);
    setProfileName(profile.name);
    const colour = AVATAR_COLOURS.find((c) => c.hex === profile.colour);
    if (colour) setSelectedColour(colour);
    setMessage("");
  }

  function handleCancelEdit() {
    setEditingType(null);
    setProfileName("");
    setMessage("");
  }

  async function handleSave() {
    if (!profileName.trim()) { setMessage("Please enter a name."); return; }
    if (!userId || !editingType) return;
    setSaving(true);

    const { error } = await supabase.from("profiles").upsert({
      user_id: userId,
      profile_type: editingType,
      name: profileName.trim(),
      colour: selectedColour.hex,
      initial: profileName.trim()[0].toUpperCase(),
    }, { onConflict: "user_id,profile_type" });

    if (error) { setMessage(error.message); setSaving(false); return; }

    await loadProfiles(userId);
    setEditingType(null);
    setSaving(false);
    setMessage("");
  }

  const editInitial = profileName.trim()[0]?.toUpperCase() ?? (editingType === "kids" ? "K" : "A");

  if (pageLoading) return <PageLoader />;

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar />

      <section className="relative px-4 md:px-12 pt-28 md:pt-32 pb-6">
        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-2">
          Manage Profiles
        </h1>
        <p className="text-sm text-gray-500">
          Switch between profiles or edit your name and avatar.
        </p>
      </section>

      <div className="mx-4 md:mx-12 h-px bg-white/5 mb-8" />

      <section className="px-4 md:px-12 pb-16">
        <div className="max-w-2xl">

          {!editingType && (
            <>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
                Your Profiles
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {profiles.map((profile) => (
                  <div
                    key={profile.profile_type}
                    className={`rounded-lg border p-5 transition ${
                      activeType === profile.profile_type
                        ? "border-white/20 bg-white/8"
                        : "border-white/8 bg-white/3"
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
                        style={{ backgroundColor: profile.colour }}
                      >
                        {profile.initial}
                      </div>
                      <div>
                        <p className="text-base font-semibold text-white">{profile.name}</p>
                        <p className="text-xs text-gray-500 capitalize mt-0.5">
                          {profile.profile_type} Profile
                          {activeType === profile.profile_type && (
                            <span className="ml-2 text-green-400">● Active</span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {activeType !== profile.profile_type && (
                        <button
                          onClick={() => handleSwitchProfile(profile.profile_type)}
                          className="flex-1 rounded bg-white py-2 text-xs font-semibold text-black transition hover:bg-gray-100"
                        >
                          Switch to this
                        </button>
                      )}
                      <button
                        onClick={() => handleStartEdit(profile)}
                        className="flex-1 rounded border border-white/10 bg-white/5 py-2 text-xs font-medium text-white transition hover:bg-white/10"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}

                {profiles.length < 2 && (
                  <Link
                    href="/profile-setup"
                    className="rounded-lg border border-dashed border-white/10 p-5 flex flex-col items-center justify-center gap-3 transition hover:border-white/20 hover:bg-white/3 min-h-[140px]"
                  >
                    <div className="w-14 h-14 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center text-2xl text-gray-500">
                      +
                    </div>
                    <p className="text-sm text-gray-500">Add Profile</p>
                  </Link>
                )}
              </div>
            </>
          )}

          {editingType && (
            <div className="max-w-md">
              <button
                onClick={handleCancelEdit}
                className="text-xs text-gray-500 hover:text-white transition mb-6 flex items-center gap-2"
              >
                ← Back
              </button>

              <h2 className="text-lg font-bold text-white mb-6 capitalize">
                Edit {editingType} Profile
              </h2>

              <div className="flex flex-col items-center mb-8 gap-2">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white transition-all duration-300"
                  style={{ backgroundColor: selectedColour.hex }}
                >
                  {editInitial}
                </div>
                <p className="text-sm text-white font-semibold">
                  {profileName.trim() || "Your Name"}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {editingType} · {selectedColour.name}
                </p>
              </div>

              <div className="mb-5">
                <label className="mb-2 block text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Profile Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex, Dad, Junior"
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
                <p className="text-xs text-gray-500 mb-4">{message}</p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 rounded bg-white py-3 text-sm font-semibold text-black transition hover:bg-gray-100 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="rounded border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}