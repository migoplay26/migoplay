"use client";

import { useEffect, useMemo, useState } from "react";
import HeroBanner from "./HeroBanner";
import FeaturedCarousel from "./FeaturedCarousel";
import ContentRow from "./ContentRow";
import { supabase } from "../../lib/supabase";

type Video = {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  genre: string;
  content_type: string;
};

type WatchHistoryRow = {
  id: number;
  video_id: number;
  progress_seconds: number;
  completed: boolean;
  updated_at: string;
};

export default function HomeShowcase() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [watchHistory, setWatchHistory] = useState<WatchHistoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      const { data: allVideos } = await supabase
        .from("videos")
        .select("id, title, description, thumbnail_url, genre, content_type")
        .order("created_at", { ascending: false });

      setVideos(allVideos || []);

      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: history } = await supabase
          .from("watch_history")
          .select("id, video_id, progress_seconds, completed, updated_at")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false });

        setWatchHistory((history as WatchHistoryRow[]) || []);
      }

      setLoading(false);
    }

    loadHomeData();
  }, []);

  const continueWatching = useMemo(() => {
    const activeHistory = watchHistory.filter(
      (row) => row.progress_seconds > 0 && !row.completed
    );
    return activeHistory
      .map((row) => videos.find((video) => video.id === row.video_id))
      .filter(Boolean) as Video[];
  }, [videos, watchHistory]);

  const continueWatchingIds = continueWatching.map((v) => v.id);
  const featuredVideo = videos.length > 0 ? videos[0] : null;
  const featuredPicks = videos.slice(1, 4);
  const latestVideos = videos.slice(0, 10);
  const movies = videos.filter((v) => v.content_type === "movie");
  const shows = videos.filter((v) => v.content_type === "show");

  const topPicks = useMemo(() => {
    const watchedGenres = continueWatching.map((v) => v.genre);
    if (watchedGenres.length === 0) return videos.slice(0, 8);
    return videos.filter(
      (v) => watchedGenres.includes(v.genre) && !continueWatchingIds.includes(v.id)
    );
  }, [videos, continueWatching, continueWatchingIds]);

  const similarGenre = featuredVideo
    ? videos.filter((v) => v.genre === featuredVideo.genre && v.id !== featuredVideo.id)
    : [];

  if (loading) {
    return (
      <main className="min-h-screen bg-[#060818] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-purple-500 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-purple-300 text-lg">Entering MigoPlay...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#060818] text-white">
      <HeroBanner featuredVideo={featuredVideo} />

      <div className="relative z-20 space-y-2 pb-16">
        <FeaturedCarousel items={featuredPicks} />

        {continueWatching.length > 0 && (
          <ContentRow title="Continue Watching" items={continueWatching} />
        )}

        {topPicks.length > 0 && (
          <ContentRow title="Top Picks For You" items={topPicks} />
        )}

        <ContentRow title="Latest on MigoPlay" items={latestVideos} />
        <ContentRow title="Movies" items={movies} />
        <ContentRow title="Shows" items={shows} />
        <ContentRow title="Because You Watched This Genre" items={similarGenre} />
      </div>
    </main>
  );
}