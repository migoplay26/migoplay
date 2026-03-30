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
    <main className="min-h-screen bg-[#070b14] text-white">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-700/10 blur-[150px] pointer-events-none z-0" />

      <section className="relative z-10 pt-36 pb-10 px-8 md:px-16">
        <p className="text-xs font-bold uppercase tracking-[0.4em] text-amber-400 mb-3">MigoPlay</p>
        <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-white via-blue-100 to-amber-200 bg-clip-text text-transparent mb-4">
          {pageTitle}
        </h1>
        <p className="text-gray-400 max-w-xl">{pageDescription}</p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-2xl">
          <input
            type="text"
            placeholder="Search worlds..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-white placeholder-gray-500 backdrop-blur-sm outline-none focus:border-blue-500/50 focus:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition"
          />
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="rounded-full border border-white/10 bg-[#070b14] px-6 py-3 text-white outline-none focus:border-blue-500/50 transition"
          >
            {genres.map((genre) => (
              <option key={genre} value={genre} className="bg-[#0d1117]">{genre}</option>
            ))}
          </select>
        </div>
      </section>

      <div className="flex items-center gap-4 px-8 md:px-16 mb-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      </div>

      <section className="relative z-10 px-8 md:px-16 pb-16">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 animate-ping" />
              <div className="absolute inset-1 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
              <div className="absolute inset-4 rounded-full border border-amber-400/50" />
            </div>
          </div>
        ) : errorMessage ? (
          <p className="text-red-400">{errorMessage}</p>
        ) : filteredVideos.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full border border-blue-500/30 mx-auto mb-4 flex items-center justify-center text-2xl">🌌</div>
            <p className="text-gray-400">No worlds found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[220px]">
            {filteredVideos.map((video, index) => {
              const isWide = index % 6 === 0;
              const isTall = index % 5 === 0 && !isWide;
              return (
                <Link
                  key={video.id}
                  href={`/watch/${video.id}`}
                  className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 transition duration-300 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] ${isWide ? "col-span-2" : "col-span-1"} ${isTall ? "row-span-2" : "row-span-1"}`}
                >
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
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex gap-2 mb-2">
                      <span className="rounded-full border border-blue-500/30 bg-blue-900/30 px-2.5 py-0.5 text-xs text-blue-200 backdrop-blur-sm">
                        {video.genre}
                      </span>
                      <span className="rounded-full border border-amber-500/20 bg-amber-900/20 px-2.5 py-0.5 text-xs text-amber-200 capitalize backdrop-blur-sm">
                        {video.content_type}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-white line-clamp-1">{video.title}</h2>
                    <p className="mt-1 text-xs text-gray-400 line-clamp-2 group-hover:text-gray-300 transition">
                      {video.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}