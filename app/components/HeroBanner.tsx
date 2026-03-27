import Link from "next/link";

type HeroBannerProps = {
  featuredVideo?: {
    id: number;
    title: string;
    description: string;
    thumbnail_url: string;
    genre: string;
    content_type: string;
  } | null;
};

export default function HeroBanner({ featuredVideo }: HeroBannerProps) {
  if (!featuredVideo) {
    return (
      <section className="relative flex h-[85vh] items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold md:text-7xl">MigoPlay</h1>
          <p className="mt-4 text-lg text-gray-400">
            Stream original content and discover fresh stories.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative flex h-[90vh] items-end overflow-hidden bg-black text-white">
      <img
        src={featuredVideo.thumbnail_url}
        alt={featuredVideo.title}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

      <div className="relative z-10 max-w-3xl px-8 pb-20 pt-32">
        <p className="mb-3 inline-block rounded bg-red-600/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-300">
          Featured {featuredVideo.content_type}
        </p>

        <h1 className="mb-4 text-5xl font-extrabold md:text-7xl">
          {featuredVideo.title}
        </h1>

        <p className="mb-6 max-w-2xl text-lg text-gray-200">
          {featuredVideo.description}
        </p>

        <div className="mb-6 flex flex-wrap gap-3 text-sm text-gray-300">
          <span className="rounded bg-zinc-800/80 px-3 py-1">
            {featuredVideo.genre}
          </span>
          <span className="rounded bg-zinc-800/80 px-3 py-1 capitalize">
            {featuredVideo.content_type}
          </span>
        </div>

        <div className="flex gap-4">
          <Link
            href={`/watch/${featuredVideo.id}`}
            className="rounded bg-white px-6 py-3 font-semibold text-black transition hover:bg-gray-200"
          >
            ▶ Play
          </Link>

          <Link
            href={`/watch/${featuredVideo.id}`}
            className="rounded bg-zinc-700/80 px-6 py-3 font-semibold text-white transition hover:bg-zinc-600"
          >
            More Info
          </Link>
        </div>
      </div>
    </section>
  );
}