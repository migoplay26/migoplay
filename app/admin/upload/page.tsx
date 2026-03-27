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

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

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

    if (!userId) {
      setMessage("You must be logged in.");
      return;
    }

    if (!isAdmin) {
      setMessage("You are not allowed to upload content.");
      return;
    }

    if (!thumbnailFile || !videoFile) {
      setMessage("Please choose both a thumbnail and a video file.");
      return;
    }

    setMessage("Uploading files...");

    const safeTitle = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const uniquePrefix = `${Date.now()}-${crypto.randomUUID()}`;

    const thumbnailExtension = thumbnailFile.name.split(".").pop();
    const videoExtension = videoFile.name.split(".").pop();

    const thumbnailPath = `${userId}/${uniquePrefix}-${safeTitle}-thumbnail.${thumbnailExtension}`;
    const videoPath = `${userId}/${uniquePrefix}-${safeTitle}-video.${videoExtension}`;

    const { error: thumbnailUploadError } = await supabase.storage
      .from("thumbnails")
      .upload(thumbnailPath, thumbnailFile, {
        cacheControl: "3600",
        upsert: false,
        contentType: thumbnailFile.type,
      });

    if (thumbnailUploadError) {
      setMessage(`Thumbnail upload failed: ${thumbnailUploadError.message}`);
      return;
    }

    const { error: videoUploadError } = await supabase.storage
      .from("videos")
      .upload(videoPath, videoFile, {
        cacheControl: "3600",
        upsert: false,
        contentType: videoFile.type,
      });

    if (videoUploadError) {
      setMessage(`Video upload failed: ${videoUploadError.message}`);
      return;
    }

    const { data: thumbnailPublic } = supabase.storage
      .from("thumbnails")
      .getPublicUrl(thumbnailPath);

    const { data: videoPublic } = supabase.storage
      .from("videos")
      .getPublicUrl(videoPath);

    const thumbnailUrl = thumbnailPublic.publicUrl;
    const videoUrl = videoPublic.publicUrl;

    setMessage("Saving content...");

    const { error: insertError } = await supabase.from("videos").insert([
      {
        title,
        description,
        content_type: contentType,
        genre,
        thumbnail_url: thumbnailUrl,
        video_url: videoUrl,
        created_by: userId,
      },
    ]);

    if (insertError) {
      setMessage(insertError.message);
      return;
    }

    setMessage("Content uploaded successfully.");
    setTitle("");
    setDescription("");
    setContentType("movie");
    setGenre("");
    setThumbnailFile(null);
    setVideoFile(null);

    const thumbnailInput = document.getElementById(
      "thumbnail-file"
    ) as HTMLInputElement | null;
    const videoInput = document.getElementById(
      "video-file"
    ) as HTMLInputElement | null;

    if (thumbnailInput) thumbnailInput.value = "";
    if (videoInput) videoInput.value = "";
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-lg">Checking admin access...</p>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar />
        <section className="px-8 pt-32 pb-12">
          <h1 className="text-4xl font-extrabold md:text-5xl">Access Denied</h1>
          <p className="mt-4 max-w-2xl text-gray-400">
            This page is only available to the MigoPlay admin account.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="px-8 pt-32 pb-8">
        <h1 className="text-4xl font-extrabold md:text-5xl">Admin Upload</h1>
        <p className="mt-3 text-gray-400">Logged in as {userEmail}</p>
      </section>

      <section className="px-8 pb-12">
        <div className="mx-auto max-w-3xl rounded-xl border border-zinc-800 bg-zinc-900 p-8">
          <h2 className="mb-6 text-2xl font-bold">Add New Content</h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm text-gray-300">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter movie or series title"
                className="w-full rounded bg-zinc-800 px-4 py-3 text-white outline-none ring-1 ring-zinc-700 focus:ring-red-600"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter content description"
                rows={5}
                className="w-full rounded bg-zinc-800 px-4 py-3 text-white outline-none ring-1 ring-zinc-700 focus:ring-red-600"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Content Type
              </label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full rounded bg-zinc-800 px-4 py-3 text-white outline-none ring-1 ring-zinc-700 focus:ring-red-600"
                required
              >
                <option value="movie">Movie</option>
                <option value="show">Show</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">Genre</label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="e.g. Drama, Action, Sci-Fi"
                className="w-full rounded bg-zinc-800 px-4 py-3 text-white outline-none ring-1 ring-zinc-700 focus:ring-red-600"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Thumbnail File
              </label>
              <input
                id="thumbnail-file"
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files?.[0] ?? null)}
                className="w-full rounded bg-zinc-800 px-4 py-3 text-white outline-none ring-1 ring-zinc-700 focus:ring-red-600"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Video File
              </label>
              <input
                id="video-file"
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
                className="w-full rounded bg-zinc-800 px-4 py-3 text-white outline-none ring-1 ring-zinc-700 focus:ring-red-600"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded bg-red-600 py-3 font-semibold transition hover:bg-red-700"
            >
              Upload Content
            </button>
          </form>

          {message && <p className="mt-5 text-sm text-gray-300">{message}</p>}
        </div>
      </section>
    </main>
  );
}