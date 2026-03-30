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

      if (!user) {
        router.push("/login");
        return;
      }

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
      <main className="flex min-h-screen items-center justify-center bg-[#060818] text-white">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-purple-500 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-purple-300 text-lg">Loading your list...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#060818] text-white">
      <Navbar />

      {/* Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-700/10 blur-[120px] pointer-events-none" />

      <section className="relative px-8 pt-32 pb-10">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-1 h-10 rounded-full bg-gradient-to-b from-purple-400 to-blue-500 shadow-[0_0_15px_rgba(168,85,247,0.6)]" />
          <h1 className="text-4xl font-extrabold md:text-5xl bg-gradient-to-r from-white via-purple-100 to-blue-200 bg-clip-text text-transparent">
            My List
          </h1>
        </div>
        <p className="mt-3 text-gray-400 pl-5">
          Welcome back{userEmail ? `, ${userEmail}` : ""}.
        </p>
        {message && <p className="mt-3 text-sm text-red-400 pl-5">{message}</p>}
      </section>

      <section className="relative px-8 pb-16">
        {savedVideos.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 text-center">
            <div className="w-16 h-16 rounded-full border-2 border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.3)] mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🎬</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Nothing saved yet</h2>
            <p className="text-gray-400">
              Go to a video page and click "Add to My List" to save titles here.
            </p>
            <Link
              href="/browse"
              className="mt-6 inline-flex rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] transition hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]"
            >
              Browse Content
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {savedVideos.map((item) => {
              const video = getVideoDetails(item.videos);
              if (!video) return null;

              return (
                <div
                  key={item.id}
                  className="group overflow-hidden rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm transition duration-300 hover:scale-[1.02] hover:border-purple-500/30 hover:shadow-[0_0_25px_rgba(168,85,247,0.2)]"
                >
                  <Link href={`/watch/${video.id}`}>
                    <div className="relative overflow-hidden">
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="h-[280px] w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#060818] via-transparent to-transparent" />

                      {/* Portal ring on hover */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                        <div className="w-16 h-16 rounded-full border-2 border-purple-400/60 shadow-[0_0_25px_rgba(168,85,247,0.5)]" />
                        <div className="absolute w-10 h-10 rounded-full border border-pink-400/40" />
                      </div>
                    </div>
                  </Link>

                  <div className="p-4">
                    <h2 className="text-lg font-bold text-white">{video.title}</h2>
                    <p className="mt-2 line-clamp-3 text-sm text-gray-500 group-hover:text-gray-400 transition">
                      {video.description}
                    </p>

                    <div className="mt-4 flex gap-3">
                      <Link
                        href={`/watch/${video.id}`}
                        className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_10px_rgba(168,85,247,0.4)] transition hover:shadow-[0_0_20px_rgba(168,85,247,0.6)]"
                      >
                        ▶ Watch
                      </Link>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="rounded-full border border-red-500/30 bg-red-900/20 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-900/40"
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