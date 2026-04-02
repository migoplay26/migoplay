import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Profile = {
  name: string;
  colour: string;
  initial: string;
  type: "adult" | "kids";
};

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setProfile(null); return; }

    // Get active type from localStorage — default to adult
    const activeType = localStorage.getItem(`active_profile_${user.id}`) ?? "adult";

    const { data } = await supabase
      .from("profiles")
      .select("name, colour, initial, profile_type")
      .eq("user_id", user.id)
      .eq("profile_type", activeType)
      .maybeSingle();

    if (data) {
      setProfile({
        name: data.name,
        colour: data.colour,
        initial: data.initial,
        type: data.profile_type as "adult" | "kids",
      });
    } else {
      // Fallback — try loading any profile for this user
      const { data: anyProfile } = await supabase
        .from("profiles")
        .select("name, colour, initial, profile_type")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();

      if (anyProfile) {
        // Save this as the active type
        localStorage.setItem(`active_profile_${user.id}`, anyProfile.profile_type);
        setProfile({
          name: anyProfile.name,
          colour: anyProfile.colour,
          initial: anyProfile.initial,
          type: anyProfile.profile_type as "adult" | "kids",
        });
      } else {
        setProfile(null);
      }
    }
  }

  useEffect(() => {
    loadProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session?.user) { setProfile(null); return; }
      loadProfile();
    });

    // Re-load profile when localStorage changes
    // (e.g. when user switches profile in another tab or after select-profile)
    const handleStorage = () => loadProfile();
    window.addEventListener("storage", handleStorage);
    window.addEventListener("profileChanged", handleStorage);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("profileChanged", handleStorage);
    };
  }, []);

  return profile;
}