"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Video = {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  genre: string;
  content_type: string;
};

type ContentBrowserProps = {
  pageTitle: string;
  pageDescription: string;
  contentType?: "movie" | "show";
};

export default function ContentBrowser({
  pageTitle,
  pageDescription,
  contentType,
}: ContentBrowserProps) {
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get("q") ?? "";

  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(queryFromUrl);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setSearch(queryFromUrl);
  }, [queryFromUrl]);

  useEffect(() => {
    async function loadVideos() {
      let query = supabase
        .from("videos")
        .select("id, title, description, thumbnail_url, genre, content_type")
        .order("created_at", { ascending: false });

      if (contentType) {
        query = query.eq("content_type", contentType);
      }

      const { data, error } = await query;

      if (error) {
        setErrorMessage(error.message);
      } else {
        setVideos(data || []);
      }

      setLoading(false);
    }

    loadVideos();
  }, [contentType]);

  const genres = useMemo(() => {
    const uniqueGenres = [...new Set(videos.map((video) => video.genre).filter(Boolean))];
    return ["All", ...uniqueGenres];
  }, [videos]);

  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      const matchesSearch =
        video.title.toLowerCase().includes(search.toLowerCase()) ||
        video.description.toLowerCase().includes(search.toLowerCase());

      const matchesGenre =
        selectedGenre === "All" || video.genre === selectedGenre;

      return matchesSearch && matchesGenre;
    });
  }, [videos, search, selectedGenre]);

  return (
    <section className="pt-32">
      <section className="px-8 pb-8">
        <h1 className="text-4xl font-extrabold md:text-5xl">{pageTitle}</h1>
        <p className="mt-3 max-w-2xl text-gray-400">{pageDescription}</p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Search by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded bg-zinc-800 px-4 py-3 text-white outline-none ring-1 ring-zinc-700 focus:ring-red-600"
          />

          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="w-full rounded bg-zinc-800 px-4 py-3 text-white outline-none ring-1 ring-zinc-700 focus:ring-red-600"
          >
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="px-8 pb-12">
        {loading ? (
          <p className="text-gray-400">Loading content...</p>
        ) : errorMessage ? (
          <p className="text-red-400">{errorMessage}</p>
        ) : filteredVideos.length === 0 ? (
          <p className="text-gray-400">No content found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredVideos.map((video) => (
              <Link
                key={video.id}
                href={`/watch/${video.id}`}
                className="group overflow-hidden rounded-xl bg-zinc-900 transition hover:-translate-y-1 hover:scale-[1.02]"
              >
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="h-[320px] w-full object-cover"
                />

                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="rounded bg-zinc-800 px-2 py-1 text-xs text-gray-300">
                      {video.genre}
                    </span>
                    <span className="rounded bg-red-600/20 px-2 py-1 text-xs text-red-300 capitalize">
                      {video.content_type}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold">{video.title}</h2>
                  <p className="mt-2 line-clamp-3 text-sm text-gray-400">
                    {video.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}