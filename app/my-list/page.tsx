"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { supabase } from "../../lib/supabase";

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
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [savedVideos, setSavedVideos] = useState<SavedVideo[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadMyList() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUserEmail(user.email ?? null);

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

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070b14] text-white">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 animate-ping" />
            <div className="absolute inset-1 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
            <div className="absolute inset-4 rounded-full border border-amber-400/50" />
          </div>
          <p className="text-blue-300 text-sm tracking-widest uppercase">Loading your list...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070b14] text-white">
      <Navbar />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-700/10 blur-[120px] pointer-events-none" />

      <section className="relative px-8 md:px-16 pt-32 pb-10">
        <p className="text-xs font-bold uppercase tracking-[0.4em] text-amber-400 mb-3">Your Space</p>
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-white via-blue-100 to-amber-200 bg-clip-text text-transparent">
          My List
        </h1>
        <p className="mt-3 text-gray-400">Welcome back{userEmail ? `, ${userEmail}` : ""}.</p>
        {message && <p className="mt-3 text-sm text-red-400">{message}</p>}
      </section>

      <section className="relative px-8 md:px-16 pb-16">
        {savedVideos.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-12 text-center">
            <div className="w-16 h-16 rounded-full border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.2)] mx-auto mb-4 flex items-center justify-center text-2xl">🎬</div>
            <h2 className="text-2xl font-bold text-white mb-2">Nothing saved yet</h2>
            <p className="text-gray-400 mb-6">Go to a video page and click "Add to My List"</p>
            <Link
              href="/browse"
              className="inline-flex rounded-full bg-gradient-to-r from-blue-600 to-amber-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] transition hover:shadow-[0_0_25px_rgba(245,158,11,0.4)]"
            >
              Browse Content
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[220px]">
            {savedVideos.map((item, index) => {
              const video = getVideoDetails(item.videos);
              if (!video) return null;
              const isWide = index % 6 === 0;
              return (
                <div
                  key={item.id}
                  className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 transition duration-300 hover:border-blue-500/30 hover:shadow-[0_0_25px_rgba(59,130,246,0.2)] ${isWide ? "col-span-2" : "col-span-1"}`}
                >
                  <Link href={`/watch/${video.id}`}>
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-55 transition duration-500 group-hover:scale-105 group-hover:opacity-70"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-transparent to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                      <div className="w-14 h-14 rounded-full border-2 border-blue-400/50 shadow-[0_0_20px_rgba(59,130,246,0.4)]" />
                      <div className="absolute w-9 h-9 rounded-full border border-amber-400/30" />
                    </div>
                  </Link>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h2 className="text-base font-bold text-white mb-3">{video.title}</h2>
                    <div className="flex gap-2">
                      <Link
                        href={`/watch/${video.id}`}
                        className="rounded-full bg-gradient-to-r from-blue-600 to-amber-500 px-4 py-1.5 text-xs font-semibold text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                      >
                        ▶ Watch
                      </Link>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="rounded-full border border-red-500/30 bg-red-900/20 px-4 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-900/40"
                      >
                        Remove
                      </button>
                    </div>
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