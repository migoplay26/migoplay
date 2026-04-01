"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import { supabase } from "../../../lib/supabase";
import { useParams } from "next/navigation";
import PageLoader from "../../components/PageLoader";

type Video = {
  id: number;
  title: string;
  description: string;
  genre: string;
  video_url: string;
};

type WatchHistoryRow = {
  progress_seconds: number;
  completed: boolean;
};

function getYouTubeEmbedUrl(url: string) {
  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${id}`;
  }
  if (url.includes("youtube.com/watch?v=")) {
    const id = url.split("v=")[1].split("&")[0];
    return `https://www.youtube.com/embed/${id}`;
  }
  return null;
}

export default function WatchPage() {
  const params = useParams();
  const id = params.id as string;
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [video, setVideo] = useState<Video | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [inList, setInList] = useState(false);
  const [resumeTime, setResumeTime] = useState(0);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const { data: videoData, error: videoError } = await supabase
        .from("videos").select("*").eq("id", Number(id)).single();

      if (videoError || !videoData) {
        setMessage("Could not load video.");
        setLoading(false);
        return;
      }

      setVideo(videoData);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: existing } = await supabase
          .from("my_list").select("id").eq("user_id", user.id).eq("video_id", Number(id)).maybeSingle();
        setInList(!!existing);

        const { data: history } = await supabase
          .from("watch_history").select("progress_seconds, completed")
          .eq("user_id", user.id).eq("video_id", Number(id)).maybeSingle();

        const typedHistory = history as WatchHistoryRow | null;
        if (typedHistory && !typedHistory.completed && typedHistory.progress_seconds > 0) {
          setResumeTime(typedHistory.progress_seconds);
        }
      }
      setLoading(false);
    }
    loadData();
  }, [id]);

  useEffect(() => {
    const player = videoRef.current;
    if (!player || resumeTime <= 0) return;
    const handleLoadedMetadata = () => {
      if (player.duration && resumeTime < player.duration - 5) {
        player.currentTime = resumeTime;
      }
    };
    player.addEventListener("loadedmetadata", handleLoadedMetadata);
    return () => player.removeEventListener("loadedmetadata", handleLoadedMetadata);
  }, [resumeTime, video]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const player = videoRef.current;
      if (!player) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const currentTime = Math.floor(player.currentTime || 0);
      const duration = Math.floor(player.duration || 0);
      const completed = duration > 0 && currentTime >= duration - 10;
      if (currentTime <= 0) return;
      await supabase.from("watch_history").upsert(
        { user_id: user.id, video_id: Number(id), progress_seconds: currentTime, completed, updated_at: new Date().toISOString() },
        { onConflict: "user_id,video_id" }
      );
    }, 10000);
    return () => clearInterval(interval);
  }, [id]);

  async function handleToggleList() {
    setMessage("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setMessage("You must be logged in."); return; }

    if (inList) {
      const { error } = await supabase.from("my_list").delete()
        .eq("user_id", user.id).eq("video_id", Number(id));
      if (error) { setMessage(error.message); return; }
      setInList(false);
      setMessage("Removed from My List.");
      return;
    }

    const { error } = await supabase.from("my_list").insert([{ user_id: user.id, video_id: Number(id) }]);
    if (error) {
      if (error.message.toLowerCase().includes("duplicate") || error.message.toLowerCase().includes("unique")) {
        setInList(true);
        setMessage("Already in My List.");
        return;
      }
      setMessage(error.message);
      return;
    }
    setInList(true);
    setMessage("Added to My List.");
  }

  if (loading) return <PageLoader />;

  if (!video) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] text-white">
        <Navbar />
        <div className="px-4 md:px-12 pt-28">
          <h1 className="text-2xl font-bold">Video not found</h1>
        </div>
      </main>
    );
  }

  const youtubeEmbedUrl = getYouTubeEmbedUrl(video.video_url);

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-blue-600/8 blur-[120px] pointer-events-none" />

      <section className="relative px-4 md:px-12 pt-28 md:pt-32 pb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-6 md:h-8 w-1 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
          <h1 className="text-2xl md:text-4xl font-extrabold text-white">{video.title}</h1>
        </div>

        <p className="mt-3 text-sm md:text-base text-gray-300 max-w-3xl ml-4">{video.description}</p>

        <div className="mt-3 ml-4">
          <span className="rounded-full border border-blue-500/30 bg-blue-950/60 px-3 py-1 text-xs text-blue-200">
            {video.genre}
          </span>
        </div>

        {resumeTime > 0 && !youtubeEmbedUrl && (
          <p className="mt-3 ml-4 text-xs text-yellow-300/80">
            ⏱ Resume from {Math.floor(resumeTime / 60)}:{String(resumeTime % 60).padStart(2, "0")}
          </p>
        )}

        <div className="mt-5 ml-4 flex items-center gap-3 flex-wrap">
          <button
            onClick={handleToggleList}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              inList
                ? "border border-white/20 bg-white/10 text-white hover:bg-white/20"
                : "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:bg-blue-500 hover:shadow-[0_0_25px_rgba(37,99,235,0.6)]"
            }`}
          >
            {inList ? "✓ In My List" : "+ Add to My List"}
          </button>
          {message && <p className="text-xs text-gray-400">{message}</p>}
        </div>
      </section>

      <section className="px-4 md:px-12 pb-16">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-xl md:rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(37,99,235,0.1)]">
          {youtubeEmbedUrl ? (
            <iframe
              width="100%"
              height="250"
              src={youtubeEmbedUrl}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full md:h-[560px]"
            />
          ) : (
            <video ref={videoRef} controls className="w-full bg-black" src={video.video_url}>
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </section>
    </main>
  );
}