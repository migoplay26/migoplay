import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Profile = {
  name: string;
  colour: string;
  initial: string;
};

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const saved = localStorage.getItem(`profile_${user.id}`);
      if (saved) setProfile(JSON.parse(saved));
    }
    load();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_e, session) => {
      if (!session?.user) { setProfile(null); return; }
      const saved = localStorage.getItem(`profile_${session.user.id}`);
      if (saved) setProfile(JSON.parse(saved));
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return profile;
}