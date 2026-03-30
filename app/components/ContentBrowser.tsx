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

export default function ContentBrowser({ pageTitle, pageDescription, contentType }: ContentBrowserProps) {
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get("q") ?? "";

  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(queryFromUrl);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => { setSearch(queryFromUrl); }, [queryFromUrl]);

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
      const matchesGenre = selectedGenre === "All" || v.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    });
  }, [videos, search, selectedGenre]);

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/8 blur-[150px] pointer-events-none z-0" />

      {/* Header */}
      <section className="relative z-10 pt-36 pb-8 px-6 md:px-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-1 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
          <h1 className="text-5xl md:text-6xl font-extrabold text-white">
            {pageTitle}
          </h1>
        </div>
        <p className="text-gray-400 max-w-xl ml-4">{pageDescription}</p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-2xl">
          <input
            type="text"
            placeholder="Search titles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder-gray-500 backdrop-blur-sm outline-none focus:border-blue-500/60 focus:shadow-[0_0_20px_rgba(37,99,235,0.2)] transition"
          />
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="rounded-full border border-white/10 bg-[#0a0a0f] px-5 py-3 text-white outline-none focus:border-blue-500/60 transition"
          >
            {genres.map((genre) => (
              <option key={genre} value={genre} className="bg-[#0d1117]">{genre}</option>
            ))}
          </select>
        </div>
      </section>

      <div className="mx-6 md:mx-12 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

      {/* Grid */}
      <section className="relative z-10 px-6 md:px-12 pb-16">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ping" />
              <div className="absolute inset-1 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
            </div>
          </div>
        ) : errorMessage ? (
          <p className="text-red-400">{errorMessage}</p>
        ) : filteredVideos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🎬</p>
            <p className="text-gray-400 text-lg">No titles found.</p>
          </div>
        ) : (
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredVideos.map((video) => (
              <Link
                key={video.id}
                href={`/watch/${video.id}`}
                className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(37,99,235,0.3)] hover:z-10"
              >
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="h-[260px] w-full object-cover transition duration-500 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-t from-blue-900/50 via-transparent to-white/5" />

                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex gap-1.5 mb-1.5">
                    <span className="rounded-full bg-blue-600/80 px-2 py-0.5 text-xs font-semibold text-white capitalize backdrop-blur-sm">
                      {video.genre}
                    </span>
                  </div>
                  <h2 className="text-sm font-bold text-white line-clamp-1">{video.title}</h2>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}