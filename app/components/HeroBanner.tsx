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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(37,99,235,0.2)_0%,_transparent_65%)]" />
        <div className="relative z-10 text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-blue-400">
            Step into new worlds
          </p>
          <h1 className="text-5xl font-extrabold md:text-9xl text-white drop-shadow-[0_0_40px_rgba(37,99,235,0.6)] mb-6">
            MigoPlay
          </h1>
          <p className="text-lg text-gray-300 max-w-sm mx-auto mb-8">
            Where stories come to life
          </p>
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 font-bold text-white shadow-[0_0_30px_rgba(37,99,235,0.6)] transition hover:bg-blue-500 hover:scale-105 text-base"
          >
            ▶ Start Watching
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
        className="absolute inset-0 h-full w-full object-cover opacity-45"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-blue-600/10 blur-[100px]" />

      <div className="relative z-10 w-full px-6 md:px-16 pb-16 pt-32 max-w-2xl">
        <div className="mb-3 flex items-center gap-3">
          <div className="h-px w-6 bg-blue-500" />
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-400">
            Featured {featuredVideo.content_type}
          </p>
        </div>

        <h1 className="mb-4 text-4xl font-extrabold leading-tight text-white md:text-7xl">
          {featuredVideo.title}
        </h1>

        <p className="mb-5 text-base text-gray-300 leading-relaxed line-clamp-3 md:line-clamp-none">
          {featuredVideo.description}
        </p>

        <div className="mb-6 flex flex-wrap gap-2">
          <span className="rounded-full border border-blue-500/40 bg-blue-950/60 px-3 py-1 text-xs text-blue-200 backdrop-blur-sm">
            {featuredVideo.genre}
          </span>
          <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-gray-200 capitalize backdrop-blur-sm">
            {featuredVideo.content_type}
          </span>
        </div>

        <div className="flex gap-3">
          <Link
            href={`/watch/${featuredVideo.id}`}
            className="flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-black transition hover:bg-gray-100 hover:scale-105 text-sm"
          >
            ▶ Play
          </Link>
          <Link
            href={`/watch/${featuredVideo.id}`}
            className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 text-sm"
          >
            ⓘ More Info
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
    </section>
  );
}