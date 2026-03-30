"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { supabase } from "../../../lib/supabase";

export default function AdminUploadPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contentType, setContentType] = useState("movie");
  const [genre, setGenre] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) { router.push("/login"); return; }

      setUserId(user.id);
      setUserEmail(user.email ?? null);

      const { data: adminRow } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      setIsAdmin(!!adminRow);
      setLoading(false);
    }

    checkUser();
  }, [router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!userId) { setMessage("You must be logged in."); return; }
    if (!isAdmin) { setMessage("You are not allowed to upload content."); return; }
    if (!thumbnailFile || !videoFile) { setMessage("Please choose both a thumbnail and a video file."); return; }

    setUploading(true);
    setMessage("Uploading files...");

    const safeTitle = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const uniquePrefix = `${Date.now()}-${crypto.randomUUID()}`;
    const thumbnailPath = `${userId}/${uniquePrefix}-${safeTitle}-thumbnail.${thumbnailFile.name.split(".").pop()}`;
    const videoPath = `${userId}/${uniquePrefix}-${safeTitle}-video.${videoFile.name.split(".").pop()}`;

    const { error: thumbnailUploadError } = await supabase.storage
      .from("thumbnails")
      .upload(thumbnailPath, thumbnailFile, { cacheControl: "3600", upsert: false, contentType: thumbnailFile.type });

    if (thumbnailUploadError) { setMessage(`Thumbnail upload failed: ${thumbnailUploadError.message}`); setUploading(false); return; }

    const { error: videoUploadError } = await supabase.storage
      .from("videos")
      .upload(videoPath, videoFile, { cacheControl: "3600", upsert: false, contentType: videoFile.type });

    if (videoUploadError) { setMessage(`Video upload failed: ${videoUploadError.message}`); setUploading(false); return; }

    const { data: thumbnailPublic } = supabase.storage.from("thumbnails").getPublicUrl(thumbnailPath);
    const { data: videoPublic } = supabase.storage.from("videos").getPublicUrl(videoPath);

    setMessage("Saving content...");

    const { error: insertError } = await supabase.from("videos").insert([{
      title, description, content_type: contentType, genre,
      thumbnail_url: thumbnailPublic.publicUrl,
      video_url: videoPublic.publicUrl,
      created_by: userId,
    }]);

    if (insertError) { setMessage(insertError.message); setUploading(false); return; }

    setMessage("✅ Content uploaded successfully!");
    setTitle(""); setDescription(""); setContentType("movie"); setGenre("");
    setThumbnailFile(null); setVideoFile(null);
    setUploading(false);

    const thumbnailInput = document.getElementById("thumbnail-file") as HTMLInputElement | null;
    const videoInput = document.getElementById("video-file") as HTMLInputElement | null;
    if (thumbnailInput) thumbnailInput.value = "";
    if (videoInput) videoInput.value = "";
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#060818] text-white">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-purple-500 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-purple-300 text-lg">Checking admin access...</p>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-[#060818] text-white">
        <Navbar />
        <section className="px-8 pt-32 pb-12">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-1 h-10 rounded-full bg-gradient-to-b from-red-400 to-red-600 shadow-[0_0_15px_rgba(239,68,68,0.6)]" />
            <h1 className="text-4xl font-extrabold text-white">Access Denied</h1>
          </div>
          <p className="mt-4 max-w-2xl text-gray-400 pl-5">
            This page is only available to the MigoPlay admin account.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#060818] text-white">
      <Navbar />

      {/* Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-700/10 blur-[120px] pointer-events-none" />

      <section className="relative px-8 pt-32 pb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-1 h-10 rounded-full bg-gradient-to-b from-purple-400 to-blue-500 shadow-[0_0_15px_rgba(168,85,247,0.6)]" />
          <h1 className="text-4xl font-extrabold md:text-5xl bg-gradient-to-r from-white via-purple-100 to-blue-200 bg-clip-text text-transparent">
            Admin Upload
          </h1>
        </div>
        <p className="mt-3 text-gray-400 pl-5">Logged in as {userEmail}</p>
      </section>

      <section className="relative px-8 pb-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8">

          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center justify-center text-purple-300">
              ✦
            </div>
            <h2 className="text-2xl font-bold text-white">Add New Content</h2>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm text-purple-300">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter movie or series title"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm outline-none focus:border-purple-500/50 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-purple-300">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter content description"
                rows={5}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm outline-none focus:border-purple-500/50 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-purple-300">Content Type</label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#060818] px-4 py-3 text-white outline-none focus:border-purple-500/50 transition"
                required
              >
                <option value="movie">Movie</option>
                <option value="show">Show</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-purple-300">Genre</label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="e.g. Drama, Action, Sci-Fi"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm outline-none focus:border-purple-500/50 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-purple-300">Thumbnail File</label>
              <input
                id="thumbnail-file"
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files?.[0] ?? null)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-purple-500/50 transition file:mr-4 file:rounded-full file:border-0 file:bg-purple-900/50 file:px-4 file:py-1 file:text-sm file:text-purple-200"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-purple-300">Video File</label>
              <input
                id="video-file"
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-purple-500/50 transition file:mr-4 file:rounded-full file:border-0 file:bg-purple-900/50 file:px-4 file:py-1 file:text-sm file:text-purple-200"
                required
              />
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full rounded-full bg-gradient-to-r from-purple-600 to-blue-600 py-3 font-semibold text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] transition hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? "Uploading..." : "✦ Upload Content"}
            </button>
          </form>

          {message && (
            <p className={`mt-5 text-sm ${message.startsWith("✅") ? "text-green-400" : "text-gray-300"}`}>
              {message}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}