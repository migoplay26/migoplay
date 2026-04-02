"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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

type Step = "create-adult" | "created-adult" | "create-kids" | "done";

type ProfileData = {
  name: string;
  colour: string;
  initial: string;
};

export default function ProfileSetupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("create-adult");
  const [userId, setUserId] = useState<string | null>(null);
  const [profileName, setProfileName] = useState("");
  const [selectedColour, setSelectedColour] = useState(AVATAR_COLOURS[0]);
  const [adultProfile, setAdultProfile] = useState<ProfileData | null>(null);
  const [kidsProfile, setKidsProfile] = useState<ProfileData | null>(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUserId(user.id);

      // Load existing profiles from Supabase
      const { data: existingProfiles } = await supabase
        .from("profiles")
        .select("name, colour, initial, profile_type")
        .eq("user_id", user.id);

      const adult = existingProfiles?.find((p) => p.profile_type === "adult");
      const kids = existingProfiles?.find((p) => p.profile_type === "kids");

      if (adult && kids) {
        // Both exist — go straight to select
        router.push("/select-profile");
        return;
      }

      if (adult) {
        setAdultProfile({ name: adult.name, colour: adult.colour, initial: adult.initial });
        setStep("created-adult");
        setPageLoading(false);
        return;
      }

      setPageLoading(false);
    }
    check();
  }, [router]);

  async function handleSaveAdult() {
    if (!profileName.trim()) { setMessage("Please enter a name."); return; }
    if (!userId) return;
    setSaving(true);

    const data: ProfileData = {
      name: profileName.trim(),
      colour: selectedColour.hex,
      initial: profileName.trim()[0].toUpperCase(),
    };

    const { error } = await supabase.from("profiles").upsert({
      user_id: userId,
      profile_type: "adult",
      name: data.name,
      colour: data.colour,
      initial: data.initial,
    }, { onConflict: "user_id,profile_type" });

    if (error) { setMessage(error.message); setSaving(false); return; }

    setAdultProfile(data);
    setProfileName("");
    setSelectedColour(AVATAR_COLOURS[0]);
    setMessage("");
    setSaving(false);
    setStep("created-adult");
  }

  async function handleSaveKids() {
    if (!profileName.trim()) { setMessage("Please enter a name."); return; }
    if (!userId) return;
    setSaving(true);

    const data: ProfileData = {
      name: profileName.trim(),
      colour: selectedColour.hex,
      initial: profileName.trim()[0].toUpperCase(),
    };

    const { error } = await supabase.from("profiles").upsert({
      user_id: userId,
      profile_type: "kids",
      name: data.name,
      colour: data.colour,
      initial: data.initial,
    }, { onConflict: "user_id,profile_type" });

    if (error) { setMessage(error.message); setSaving(false); return; }

    setKidsProfile(data);
    setMessage("");
    setSaving(false);
    setStep("done");
  }

  function handleSelectProfile(type: "adult" | "kids") {
    if (!userId) return;
    localStorage.setItem(`active_profile_${userId}`, type);
    window.dispatchEvent(new Event("profileChanged"));
    router.push("/");
  }

  function handleEnterWithAdultOnly() {
    if (!userId) return;
    localStorage.setItem(`active_profile_${userId}`, "adult");
    window.dispatchEvent(new Event("profileChanged"));
    router.push("/");
  }

  const initial = profileName.trim()[0]?.toUpperCase() ?? (step === "create-kids" ? "K" : "A");

  if (pageLoading) return <PageLoader />;

  // Step 1 — Create adult profile
  if (step === "create-adult") {
    return (
      <main className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(29,78,216,0.08)_0%,_transparent_60%)]" />
        <div className="relative z-10 w-full max-w-md">
          <div className="flex justify-center mb-8">
            <Image src="/logo.png" alt="MigoPlay" width={200} height={70} className="object-contain" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-1 tracking-tight text-center">
            Create Your Profile
          </h1>
          <p className="text-sm text-gray-500 text-center mb-8">
            Set up your adult profile to get started
          </p>

          {/* Avatar preview */}
          <div className="flex flex-col items-center mb-6 gap-2">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
              style={{ backgroundColor: selectedColour.hex }}
            >
              {initial}
            </div>
            <p className="text-sm font-semibold text-white">
              {profileName.trim() || "Your Name"}
            </p>
            <p className="text-xs text-gray-500">{selectedColour.name} · Adult</p>
          </div>

          <div className="border border-white/8 bg-white/3 rounded-lg p-6 space-y-5">
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-400 uppercase tracking-wider">
                Profile Name
              </label>
              <input
                type="text"
                placeholder="e.g. Alex, Dad, Mum"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                maxLength={20}
                className="w-full rounded border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-white/25 transition"
              />
            </div>

            <div>
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

            {message && <p className="text-xs text-red-400">{message}</p>}

            <button
              onClick={handleSaveAdult}
              disabled={saving}
              className="w-full rounded bg-white py-3 text-sm font-semibold text-black transition hover:bg-gray-100 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Step 2 — Adult created, show profile and option to add kids
  if (step === "created-adult") {
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
            {adultProfile && (
              <button
                onClick={handleEnterWithAdultOnly}
                className="group flex flex-col items-center gap-3"
              >
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white transition-all duration-200 group-hover:ring-4 group-hover:ring-white/40 group-hover:ring-offset-2 group-hover:ring-offset-[#0a0a0f] group-hover:scale-105 shadow-[0_0_20px_rgba(0,0,0,0.4)]"
                  style={{ backgroundColor: adultProfile.colour }}
                >
                  {adultProfile.initial}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{adultProfile.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Adult</p>
                </div>
              </button>
            )}

            <button
              onClick={() => setStep("create-kids")}
              className="group flex flex-col items-center gap-3"
            >
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center text-3xl text-gray-500 transition group-hover:border-white/40 group-hover:text-white group-hover:scale-105">
                +
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Add Kids</p>
                <p className="text-xs text-gray-500 mt-0.5">Family friendly</p>
              </div>
            </button>
          </div>

          <p className="text-xs text-gray-600">
            Click your profile above to enter MigoPlay
          </p>
        </div>
      </main>
    );
  }

  // Step 3 — Create kids profile
  if (step === "create-kids") {
    return (
      <main className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(29,78,216,0.08)_0%,_transparent_60%)]" />
        <div className="relative z-10 w-full max-w-md">
          <button
            onClick={() => { setStep("created-adult"); setProfileName(""); setMessage(""); }}
            className="text-xs text-gray-500 hover:text-white transition mb-6 flex items-center gap-2"
          >
            ← Back
          </button>

          <h1 className="text-2xl font-bold text-white mb-1 tracking-tight text-center">
            Kids Profile
          </h1>
          <p className="text-sm text-gray-500 text-center mb-8">
            Safe and family friendly content
          </p>

          {/* Avatar preview */}
          <div className="flex flex-col items-center mb-6 gap-2">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
              style={{ backgroundColor: selectedColour.hex }}
            >
              {initial}
            </div>
            <p className="text-sm font-semibold text-white">
              {profileName.trim() || "Kids Name"}
            </p>
            <p className="text-xs text-gray-500">{selectedColour.name} · Kids</p>
          </div>

          <div className="border border-white/8 bg-white/3 rounded-lg p-6 space-y-5">
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-400 uppercase tracking-wider">
                Profile Name
              </label>
              <input
                type="text"
                placeholder="e.g. Mia, Leo, Junior"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                maxLength={20}
                className="w-full rounded border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-white/25 transition"
              />
            </div>

            <div>
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

            {message && <p className="text-xs text-red-400">{message}</p>}

            <button
              onClick={handleSaveKids}
              disabled={saving}
              className="w-full rounded bg-white py-3 text-sm font-semibold text-black transition hover:bg-gray-100 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Kids Profile"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Step 4 — Both profiles done, select who's watching
  if (step === "done") {
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
            {adultProfile && (
              <button
                onClick={() => handleSelectProfile("adult")}
                className="group flex flex-col items-center gap-3"
              >
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white transition-all duration-200 group-hover:ring-4 group-hover:ring-white/40 group-hover:ring-offset-2 group-hover:ring-offset-[#0a0a0f] group-hover:scale-105 shadow-[0_0_20px_rgba(0,0,0,0.4)]"
                  style={{ backgroundColor: adultProfile.colour }}
                >
                  {adultProfile.initial}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{adultProfile.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Adult</p>
                </div>
              </button>
            )}

            {kidsProfile && (
              <button
                onClick={() => handleSelectProfile("kids")}
                className="group flex flex-col items-center gap-3"
              >
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white transition-all duration-200 group-hover:ring-4 group-hover:ring-white/40 group-hover:ring-offset-2 group-hover:ring-offset-[#0a0a0f] group-hover:scale-105 shadow-[0_0_20px_rgba(0,0,0,0.4)]"
                  style={{ backgroundColor: kidsProfile.colour }}
                >
                  {kidsProfile.initial}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{kidsProfile.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Kids</p>
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

  return null;
}