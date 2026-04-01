"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { supabase } from "../../../lib/supabase";
import PageLoader from "../../components/PageLoader";

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

  if (loading) return <PageLoader />;

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] text-white">
        <Navbar />
        <section className="px-4 md:px-12 pt-32">
          <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-500 text-sm">This page is only for MigoPlay admins.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar />

      <section className="relative px-4 md:px-12 pt-28 md:pt-32 pb-6">
        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-2">
          Admin Upload
        </h1>
        <p className="text-sm text-gray-500">Logged in as {userEmail}</p>
      </section>

      <div className="mx-4 md:mx-12 h-px bg-white/5 mb-8" />

      <section className="px-4 md:px-12 pb-16">
        <div className="max-w-2xl rounded-lg border border-white/8 bg-white/3 p-6 md:p-8">
          <h2 className="text-lg font-semibold text-white mb-6">Add New Content</h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {[
              { label: "Title", type: "text", value: title, setter: setTitle, placeholder: "Enter title" },
              { label: "Genre", type: "text", value: genre, setter: setGenre, placeholder: "e.g. Drama, Sci-Fi, Action" },
            ].map(({ label, type, value, setter, placeholder }) => (
              <div key={label}>
                <label className="mb-2 block text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {label}
                </label>
                <input type={type} value={value}
                  onChange={(e) => setter(e.target.value)}
                  placeholder={placeholder}
                  className="w-full rounded border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-white/25 transition"
                  required />
              </div>
            ))}

            <div>
              <label className="mb-2 block text-xs font-medium text-gray-400 uppercase tracking-wider">
                Description
              </label>
              <textarea value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                rows={4}
                className="w-full rounded border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-white/25 transition"
                required />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-gray-400 uppercase tracking-wider">
                Content Type
              </label>
              <select value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full rounded border border-white/10 bg-[#0a0a0f] px-4 py-3 text-sm text-white outline-none focus:border-white/25 transition"
                required>
                <option value="movie">Movie</option>
                <option value="show">Show</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-gray-400 uppercase tracking-wider">
                Thumbnail Image
              </label>
              <input id="thumbnail-file" type="file" accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files?.[0] ?? null)}
                className="w-full rounded border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition file:mr-4 file:rounded file:border-0 file:bg-white file:px-3 file:py-1 file:text-xs file:font-semibold file:text-black"
                required />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-gray-400 uppercase tracking-wider">
                Video File
              </label>
              <input id="video-file" type="file" accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
                className="w-full rounded border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition file:mr-4 file:rounded file:border-0 file:bg-white file:px-3 file:py-1 file:text-xs file:font-semibold file:text-black"
                required />
            </div>

            <button type="submit" disabled={uploading}
              className="w-full rounded bg-white py-3 text-sm font-semibold text-black transition hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
              {uploading ? "Uploading..." : "Upload Content"}
            </button>
          </form>

          {message && (
            <p className={`mt-5 text-xs ${message.startsWith("✅") ? "text-green-400" : "text-gray-500"}`}>
              {message}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}