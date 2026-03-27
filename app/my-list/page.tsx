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
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUserEmail(user.email ?? null);

      const { data, error } = await supabase
        .from("my_list")
        .select(
          `
          id,
          user_id,
          video_id,
          videos (
            id,
            title,
            description,
            thumbnail_url
          )
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        setMessage(error.message);
      } else {
        setSavedVideos((data as SavedVideo[]) ?? []);
      }

      setLoading(false);
    }

    loadMyList();
  }, [router]);

  async function handleRemove(id: number) {
    const { error } = await supabase.from("my_list").delete().eq("id", id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setSavedVideos((current) => current.filter((item) => item.id !== id));
  }

  function getVideoDetails(videos: SavedVideo["videos"]) {
    if (!videos) return null;
    if (Array.isArray(videos)) {
      return videos.length > 0 ? videos[0] : null;
    }
    return videos;
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-lg">Loading your list...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="px-8 pt-32 pb-10">
        <h1 className="text-4xl font-extrabold md:text-5xl">My List</h1>
        <p className="mt-3 text-gray-400">
          Welcome back{userEmail ? `, ${userEmail}` : ""}.
        </p>
        {message && <p className="mt-3 text-sm text-red-400">{message}</p>}
      </section>

      <section className="px-8 pb-12">
        {savedVideos.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-2xl font-bold">Saved Titles</h2>
            <p className="mt-3 text-gray-400">
              You haven’t added anything yet. Go to a video page and click
              “Add to My List”.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {savedVideos.map((item) => {
              const video = getVideoDetails(item.videos);

              if (!video) return null;

              return (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-xl bg-zinc-900"
                >
                  <Link href={`/watch/${video.id}`}>
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="h-[320px] w-full object-cover"
                    />
                  </Link>

                  <div className="p-4">
                    <h2 className="text-xl font-bold">{video.title}</h2>
                    <p className="mt-2 line-clamp-3 text-sm text-gray-400">
                      {video.description}
                    </p>

                    <div className="mt-4 flex gap-3">
                      <Link
                        href={`/watch/${video.id}`}
                        className="rounded bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-gray-200"
                      >
                        Watch
                      </Link>

                      <button
                        onClick={() => handleRemove(item.id)}
                        className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
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