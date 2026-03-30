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
      <section className="relative flex h-[70vh] items-center justify-center overflow-hidden bg-[#060818]">
        {/* Glow orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-700/20 blur-[120px]" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-blue-600/20 blur-[100px]" />

        {/* Portal ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full border-2 border-purple-500/30 shadow-[0_0_60px_rgba(168,85,247,0.3)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full border border-pink-500/20 shadow-[0_0_40px_rgba(236,72,153,0.2)]" />

        <div className="relative z-10 text-center px-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-purple-400">
            Welcome to
          </p>
          <h1 className="text-6xl font-extrabold md:text-8xl bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            MigoPlay
          </h1>
          <p className="mt-5 text-xl text-gray-300 max-w-xl mx-auto">
            Step into new worlds
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative flex h-[75vh] items-end overflow-hidden bg-[#060818] text-white">
      {/* Background image */}
      <img
        src={featuredVideo.thumbnail_url}
        alt={featuredVideo.title}
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#060818] via-[#060818]/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#060818] via-[#060818]/40 to-transparent" />

      {/* Purple glow */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[300px] bg-purple-700/20 blur-[100px]" />

      {/* Portal ring decoration */}
      <div className="absolute right-[15%] top-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border border-purple-500/30 shadow-[0_0_80px_rgba(168,85,247,0.2)] hidden lg:block" />
      <div className="absolute right-[15%] top-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full border border-pink-500/20 shadow-[0_0_40px_rgba(236,72,153,0.15)] hidden lg:block" />

      <div className="relative z-10 max-w-3xl px-8 pb-20 pt-32">
        {/* Badge */}
        <p className="mb-4 inline-block rounded-full border border-purple-500/40 bg-purple-900/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-purple-300 backdrop-blur-sm">
          Featured {featuredVideo.content_type}
        </p>

        <h1 className="mb-4 text-5xl font-extrabold md:text-7xl bg-gradient-to-r from-white via-purple-100 to-blue-200 bg-clip-text text-transparent">
          {featuredVideo.title}
        </h1>

        <p className="mb-6 max-w-2xl text-lg text-gray-300">
          {featuredVideo.description}
        </p>

        <div className="mb-8 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full border border-purple-500/30 bg-purple-900/30 px-4 py-1 text-purple-200 backdrop-blur-sm">
            {featuredVideo.genre}
          </span>
          <span className="rounded-full border border-blue-500/30 bg-blue-900/30 px-4 py-1 text-blue-200 capitalize backdrop-blur-sm">
            {featuredVideo.content_type}
          </span>
        </div>

        <div className="flex gap-4">
          <Link
            href={`/watch/${featuredVideo.id}`}
            className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-3 font-semibold text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] transition hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:scale-105"
          >
            ▶ Play
          </Link>
          <Link
            href={`/watch/${featuredVideo.id}`}
            className="rounded-full border border-white/20 bg-white/10 px-8 py-3 font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            More Info
          </Link>
        </div>
      </div>
    </section>
  );
}