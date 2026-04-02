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

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

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
      }
    }

    load();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session?.user) { setProfile(null); return; }
      load();
    });

    return () => subscription.unsubscribe();
  }, []);

  return profile;
}