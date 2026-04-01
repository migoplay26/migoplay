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
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a0f] px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(29,78,216,0.15)_0%,_transparent_65%)]" />
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-gray-500">
            Original AI Content
          </p>
          <h1 className="text-6xl font-bold md:text-8xl text-white tracking-tight mb-5">
            MigoPlay
          </h1>
          <p className="text-base text-gray-400 max-w-md mx-auto mb-10 leading-relaxed">
            Discover AI-generated stories unlike anything you've seen before.
          </p>
          <Link
            href="/browse"
            className="inline-flex items-center gap-3 rounded bg-white px-8 py-3.5 font-semibold text-black text-sm transition hover:bg-gray-100"
          >
            Start Watching
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative flex min-h-screen items-end overflow-hidden bg-[#0a0a0f]">
      <img
        src={featuredVideo.thumbnail_url}
        alt={featuredVideo.title}
        className="absolute inset-0 h-full w-full object-cover opacity-50"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />

      <div className="relative z-10 w-full px-6 md:px-16 pb-16 pt-32 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400 mb-4">
          {featuredVideo.content_type} — {featuredVideo.genre}
        </p>

        <h1 className="mb-4 text-4xl font-bold leading-tight text-white md:text-6xl tracking-tight">
          {featuredVideo.title}
        </h1>

        <p className="mb-8 text-sm md:text-base text-gray-400 leading-relaxed line-clamp-3 md:line-clamp-none max-w-lg">
          {featuredVideo.description}
        </p>

        <div className="flex gap-3">
          <Link
            href={`/watch/${featuredVideo.id}`}
            className="flex items-center gap-2 rounded bg-white px-6 py-3 font-semibold text-black text-sm transition hover:bg-gray-100"
          >
            Play
          </Link>
          <Link
            href={`/watch/${featuredVideo.id}`}
            className="flex items-center gap-2 rounded border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white text-sm backdrop-blur-sm transition hover:bg-white/15"
          >
            More Info
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
    </section>
  );
}