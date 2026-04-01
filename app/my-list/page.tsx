"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { supabase } from "../../lib/supabase";
import { useProfile } from "../hooks/useProfile";
import PageLoader from "../components/PageLoader";

type JoinedVideo = {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
};

type SavedVideo = {
  id: number;
  user_id: string;
  video_id: number;
  videos: JoinedVideo | JoinedVideo[] | null;
};

export default function MyListPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [savedVideos, setSavedVideos] = useState<SavedVideo[]>([]);
  const [message, setMessage] = useState("");
  const profile = useProfile();

  useEffect(() => {
    async function loadMyList() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data, error } = await supabase
        .from("my_list")
        .select(`id, user_id, video_id, videos (id, title, description, thumbnail_url)`)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) setMessage(error.message);
      else setSavedVideos((data as SavedVideo[]) ?? []);
      setLoading(false);
    }
    loadMyList();
  }, [router]);

  async function handleRemove(id: number) {
    const { error } = await supabase.from("my_list").delete().eq("id", id);
    if (error) { setMessage(error.message); return; }
    setSavedVideos((current) => current.filter((item) => item.id !== id));
  }

  function getVideoDetails(videos: SavedVideo["videos"]) {
    if (!videos) return null;
    if (Array.isArray(videos)) return videos.length > 0 ? videos[0] : null;
    return videos;
  }

  if (loading) return <PageLoader />;

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar />

      <section className="relative px-4 md:px-12 pt-28 md:pt-32 pb-6">
        {/* Profile greeting */}
        {profile && (
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold text-white flex-shrink-0"
              style={{ backgroundColor: profile.colour }}>
              {profile.initial}
            </div>
            <p className="text-sm text-gray-400">{profile.name}'s List</p>
          </div>
        )}

        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-2">My List</h1>
        <p className="text-sm text-gray-500">Titles you've saved to watch later.</p>
        {message && <p className="mt-2 text-xs text-red-400">{message}</p>}
      </section>

      <div className="mx-4 md:mx-12 h-px bg-white/5 mb-6" />

      <section className="px-4 md:px-12 pb-16">
        {savedVideos.length === 0 ? (
          <div className="rounded-lg border border-white/8 bg-white/3 p-10 text-center max-w-md mx-auto">
            <p className="text-2xl mb-3">🎬</p>
            <h2 className="text-lg font-semibold text-white mb-2">Nothing saved yet</h2>
            <p className="text-sm text-gray-500 mb-6">
              Browse content and save titles to watch later.
            </p>
            <Link href="/browse"
              className="inline-flex rounded bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-gray-100">
              Browse Content
            </Link>
          </div>
        ) : (
          <div className="grid gap-2 md:gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {savedVideos.map((item) => {
              const video = getVideoDetails(item.videos);
              if (!video) return null;
              return (
                <div key={item.id}
                  className="group relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:z-10">
                  <Link href={`/watch/${video.id}`}>
                    <img src={video.thumbnail_url} alt={video.title}
                      className="h-[180px] md:h-[260px] w-full object-cover transition duration-500 group-hover:brightness-75" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
                  </Link>

                  <div className="absolute inset-0 flex flex-col justify-end p-2 md:p-3 opacity-0 group-hover:opacity-100 transition duration-300">
                    <h2 className="text-xs md:text-sm font-semibold text-white line-clamp-1 mb-2">{video.title}</h2>
                    <div className="flex gap-1.5">
                      <Link href={`/watch/${video.id}`}
                        className="flex-1 rounded bg-white py-1.5 text-center text-xs font-semibold text-black transition hover:bg-gray-100">
                        Play
                      </Link>
                      <button onClick={() => handleRemove(item.id)}
                        className="rounded border border-white/20 bg-black/50 px-2.5 py-1.5 text-xs text-white transition hover:bg-white/10">
                        ✕
                      </button>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-2 group-hover:opacity-0 transition duration-300">
                    <p className="text-xs font-semibold text-white line-clamp-1">{video.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}