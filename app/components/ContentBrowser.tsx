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
    <section className="min-h-screen bg-[#060818] pt-32">
      {/* Purple glow top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-700/10 blur-[120px] pointer-events-none" />

      <div className="relative px-8 pb-8">
        {/* Light trail header */}
        <div className="flex items-center gap-4 mb-2">
          <div className="w-1 h-10 rounded-full bg-gradient-to-b from-purple-400 to-blue-500 shadow-[0_0_15px_rgba(168,85,247,0.6)]" />
          <h1 className="text-4xl font-extrabold md:text-5xl bg-gradient-to-r from-white via-purple-100 to-blue-200 bg-clip-text text-transparent">
            {pageTitle}
          </h1>
        </div>
        <p className="mt-3 max-w-2xl text-gray-400 pl-5">{pageDescription}</p>

        {/* Search & filter */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Search by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm outline-none focus:border-purple-500/50 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition"
          />
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white backdrop-blur-sm outline-none focus:border-purple-500/50 transition"
          >
            {genres.map((genre) => (
              <option key={genre} value={genre} className="bg-[#0d1117]">{genre}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="px-8 pb-16">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
          </div>
        ) : errorMessage ? (
          <p className="text-red-400">{errorMessage}</p>
        ) : filteredVideos.length === 0 ? (
          <p className="text-gray-500 italic">No content found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredVideos.map((video) => (
              <Link
                key={video.id}
                href={`/watch/${video.id}`}
                className="group overflow-hidden rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm transition duration-300 hover:scale-[1.02] hover:border-purple-500/30 hover:shadow-[0_0_25px_rgba(168,85,247,0.2)]"
              >
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

                <div className="p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-full border border-purple-500/30 bg-purple-900/30 px-3 py-1 text-xs text-purple-200">
                      {video.genre}
                    </span>
                    <span className="rounded-full border border-blue-500/20 bg-blue-900/20 px-3 py-1 text-xs text-blue-200 capitalize">
                      {video.content_type}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white">{video.title}</h2>
                  <p className="mt-2 line-clamp-3 text-sm text-gray-500 group-hover:text-gray-400 transition">
                    {video.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}