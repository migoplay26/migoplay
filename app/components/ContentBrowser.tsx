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

      if (contentType) query = query.eq("content_type", contentType);

      const { data, error } = await query;

      if (error) setErrorMessage(error.message);
      else setVideos(data || []);

      setLoading(false);
    }

    loadVideos();
  }, [contentType]);

  const genres = useMemo(() => {
    const unique = [...new Set(videos.map((v) => v.genre).filter(Boolean))];
    return ["All", ...unique];
  }, [videos]);

  const filteredVideos = useMemo(() => {
    return videos.filter((v) => {
      const matchesSearch =
        v.title.toLowerCase().includes(search.toLowerCase()) ||
        v.description.toLowerCase().includes(search.toLowerCase());

      const matchesGenre =
        selectedGenre === "All" || v.genre === selectedGenre;

      return matchesSearch && matchesGenre;
    });
  }, [videos, search, selectedGenre]);

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <section className="relative z-10 pt-28 md:pt-36 pb-6 px-4 md:px-12">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-2">
          {pageTitle}
        </h1>
        <p className="text-gray-500 text-sm md:text-base max-w-xl">
          {pageDescription}
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-2xl">
          <input
            type="text"
            placeholder="Search titles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-white/30 transition"
          />
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="rounded-lg border border-white/10 bg-[#0a0a0f] px-4 py-2.5 text-sm text-white outline-none focus:border-white/30 transition"
          >
            {genres.map((genre) => (
              <option key={genre} value={genre} className="bg-[#0d1117]">
                {genre}
              </option>
            ))}
          </select>
        </div>
      </section>

      <div className="mx-4 md:mx-12 h-px bg-white/5 mb-4" />

      <section className="relative z-10 px-4 md:px-12 pb-16">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 animate-ping" />
                <div className="absolute inset-1 rounded-full border-2 border-purple-500 border-t-pink-400 animate-spin" />
                <div className="absolute inset-4 rounded-full border border-pink-400/30" />
              </div>
              <p className="text-gray-500 text-xs tracking-widest uppercase">
                Loading...
              </p>
            </div>
          </div>
        ) : errorMessage ? (
          <p className="text-red-400 text-sm">{errorMessage}</p>
        ) : filteredVideos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No titles found.</p>
          </div>
        ) : (
          <div className="grid gap-2 md:gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredVideos.map((video) => (
              <Link
                key={video.id}
                href={`/watch/${video.id}`}
                className="group relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:z-10"
              >
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="h-[180px] md:h-[260px] w-full object-cover transition duration-500 group-hover:brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end p-2 md:p-3 opacity-0 group-hover:opacity-100 transition duration-300">
                  <h2 className="text-xs md:text-sm font-semibold text-white line-clamp-1 mb-1.5">
                    {video.title}
                  </h2>
                  <div className="flex gap-1.5">
                    <span className="flex-1 rounded bg-white py-1.5 text-center text-xs font-semibold text-black">
                      Play
                    </span>
                    <span className="rounded border border-white/30 px-2 py-1.5 text-xs text-white capitalize">
                      {video.content_type}
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-2 group-hover:opacity-0 transition duration-300">
                  <p className="text-xs font-semibold text-white line-clamp-1">
                    {video.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}