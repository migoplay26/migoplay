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
      <main className="flex min-h-screen items-center justify-center bg-[#0a0a0f] text-white">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ping" />
          <div className="absolute inset-1 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/8 blur-[120px] pointer-events-none" />

      <section className="relative px-6 md:px-12 pt-32 pb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-8 w-1 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
          <h1 className="text-5xl font-extrabold text-white">My List</h1>
        </div>
        <p className="text-gray-400 ml-4">Welcome back{userEmail ? `, ${userEmail}` : ""}.</p>
        {message && <p className="mt-2 text-sm text-red-400 ml-4">{message}</p>}
      </section>

      <div className="mx-6 md:mx-12 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

      <section className="relative px-6 md:px-12 pb-16">
        {savedVideos.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/3 p-12 text-center">
            <p className="text-5xl mb-4">🎬</p>
            <h2 className="text-2xl font-bold text-white mb-2">Your list is empty</h2>
            <p className="text-gray-400 mb-6">Save titles to watch them later</p>
            <Link
              href="/browse"
              className="inline-flex rounded-full bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] transition hover:bg-blue-500 hover:shadow-[0_0_25px_rgba(37,99,235,0.6)]"
            >
              Browse Content
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {savedVideos.map((item) => {
              const video = getVideoDetails(item.videos);
              if (!video) return null;
              return (
                <div key={item.id} className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(37,99,235,0.3)] hover:z-10">
                  <Link href={`/watch/${video.id}`}>
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="h-[260px] w-full object-cover transition duration-500 group-hover:brightness-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-t from-blue-900/50 via-transparent to-white/5" />
                  </Link>

                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h2 className="text-sm font-bold text-white line-clamp-1 mb-2">{video.title}</h2>
                    <div className="flex gap-1.5">
                      <Link
                        href={`/watch/${video.id}`}
                        className="flex-1 rounded-full bg-white py-1.5 text-center text-xs font-bold text-black transition hover:bg-gray-100"
                      >
                        ▶ Play
                      </Link>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="rounded-full border border-red-500/40 bg-red-950/50 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-900/60"
                      >
                        ✕
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