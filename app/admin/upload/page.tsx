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
        .from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
      setIsAdmin(!!adminRow);
      setLoading(false);
    }
    checkUser();
  }, [router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!userId) { setMessage("You must be logged in."); return; }
    if (!isAdmin) { setMessage("Access denied."); return; }
    if (!thumbnailFile || !videoFile) { setMessage("Please select both files."); return; }

    setUploading(true);
    setMessage("Uploading...");

    const safeTitle = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const uniquePrefix = `${Date.now()}-${crypto.randomUUID()}`;
    const thumbnailPath = `${userId}/${uniquePrefix}-${safeTitle}-thumbnail.${thumbnailFile.name.split(".").pop()}`;
    const videoPath = `${userId}/${uniquePrefix}-${safeTitle}-video.${videoFile.name.split(".").pop()}`;

    const { error: thumbErr } = await supabase.storage.from("thumbnails")
      .upload(thumbnailPath, thumbnailFile, { cacheControl: "3600", upsert: false, contentType: thumbnailFile.type });
    if (thumbErr) { setMessage(`Thumbnail failed: ${thumbErr.message}`); setUploading(false); return; }

    const { error: vidErr } = await supabase.storage.from("videos")
      .upload(videoPath, videoFile, { cacheControl: "3600", upsert: false, contentType: videoFile.type });
    if (vidErr) { setMessage(`Video failed: ${vidErr.message}`); setUploading(false); return; }

    const { data: thumbPublic } = supabase.storage.from("thumbnails").getPublicUrl(thumbnailPath);
    const { data: vidPublic } = supabase.storage.from("videos").getPublicUrl(videoPath);

    const { error: insertErr } = await supabase.from("videos").insert([{
      title, description, content_type: contentType, genre,
      thumbnail_url: thumbPublic.publicUrl,
      video_url: vidPublic.publicUrl,
      created_by: userId,
    }]);

    if (insertErr) { setMessage(insertErr.message); setUploading(false); return; }

    setMessage("✅ Uploaded successfully!");
    setTitle(""); setDescription(""); setContentType("movie"); setGenre("");
    setThumbnailFile(null); setVideoFile(null);
    setUploading(false);

    const t = document.getElementById("thumbnail-file") as HTMLInputElement | null;
    const v = document.getElementById("video-file") as HTMLInputElement | null;
    if (t) t.value = "";
    if (v) v.value = "";
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a0a0f] text-white">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ping" />
          <div className="absolute inset-1 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] text-white">
        <Navbar />
        <section className="px-6 md:px-12 pt-32">
          <h1 className="text-4xl font-extrabold text-white mb-3">Access Denied</h1>
          <p className="text-gray-400">This page is only for MigoPlay admins.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/8 blur-[120px] pointer-events-none" />

      <section className="relative px-6 md:px-12 pt-32 pb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-8 w-1 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
          <h1 className="text-5xl font-extrabold text-white">Admin Upload</h1>
        </div>
        <p className="text-gray-400 ml-4">Logged in as {userEmail}</p>
      </section>

      <div className="mx-6 md:mx-12 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

      <section className="relative px-6 md:px-12 pb-16">
        <div className="max-w-2xl rounded-2xl border border-white/10 bg-white/3 backdrop-blur-sm p-8">
          <h2 className="text-2xl font-bold text-white mb-7">Add New Content</h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {[
              { label: "Title", type: "text", value: title, setter: setTitle, placeholder: "Enter title" },
              { label: "Genre", type: "text", value: genre, setter: setGenre, placeholder: "e.g. Drama, Sci-Fi" },
            ].map(({ label, type, value, setter, placeholder }) => (
              <div key={label}>
                <label className="mb-2 block text-sm font-medium text-gray-300">{label}</label>
                <input type={type} value={value} onChange={(e) => setter(e.target.value)}
                  placeholder={placeholder}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-blue-500/60 focus:shadow-[0_0_15px_rgba(37,99,235,0.2)] transition"
                  required />
              </div>
            ))}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description" rows={4}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-blue-500/60 focus:shadow-[0_0_15px_rgba(37,99,235,0.2)] transition"
                required />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">Content Type</label>
              <select value={contentType} onChange={(e) => setContentType(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0a0a0f] px-4 py-3 text-white outline-none focus:border-blue-500/60 transition" required>
                <option value="movie">Movie</option>
                <option value="show">Show</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">Thumbnail</label>
              <input id="thumbnail-file" type="file" accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files?.[0] ?? null)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-blue-600 file:px-4 file:py-1 file:text-sm file:font-semibold file:text-white"
                required />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">Video File</label>
              <input id="video-file" type="file" accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-blue-600 file:px-4 file:py-1 file:text-sm file:font-semibold file:text-white"
                required />
            </div>

            <button type="submit" disabled={uploading}
              className="w-full rounded-full bg-blue-600 py-3 font-bold text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] transition hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed">
              {uploading ? "Uploading..." : "Upload Content"}
            </button>
          </form>

          {message && (
            <p className={`mt-5 text-sm ${message.startsWith("✅") ? "text-green-400" : "text-gray-400"}`}>
              {message}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}