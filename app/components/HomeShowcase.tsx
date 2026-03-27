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

      const {
        data: { user },
      } = await supabase.auth.getUser();

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

  const continueWatchingIds = continueWatching.map((video) => video.id);

  const featuredVideo = videos.length > 0 ? videos[0] : null;
  const latestVideos = videos.slice(0, 10);
  const featuredPicks = videos.slice(1, 4);
  const movies = videos.filter((video) => video.content_type === "movie");
  const shows = videos.filter((video) => video.content_type === "show");

  const topPicks = useMemo(() => {
    const watchedGenres = continueWatching.map((video) => video.genre);

    if (watchedGenres.length === 0) {
      return videos.slice(0, 8);
    }

    return videos.filter(
      (video) =>
        watchedGenres.includes(video.genre) &&
        !continueWatchingIds.includes(video.id)
    );
  }, [videos, continueWatching, continueWatchingIds]);

  const featuredGenre = featuredVideo?.genre;
  const similarGenre =
    featuredGenre
      ? videos.filter(
          (video) =>
            video.genre === featuredGenre && video.id !== featuredVideo.id
        )
      : [];

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white">
        <HeroBanner featuredVideo={null} />
        <div className="px-8 py-10 text-gray-400">Loading homepage...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <HeroBanner featuredVideo={featuredVideo} />

      <div className="-mt-16 relative z-20 space-y-2 pb-12">
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
        <ContentRow title="Because you watched this genre" items={similarGenre} />
      </div>
    </main>
  );
}