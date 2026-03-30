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
      <section className="relative flex h-screen items-center justify-center overflow-hidden bg-[#060818]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(88,28,135,0.3)_0%,_transparent_70%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-purple-500/10 animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-blue-500/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-pink-500/10" />
        <div className="relative z-10 text-center px-8">
          <p className="mb-6 text-sm font-semibold uppercase tracking-[0.4em] text-purple-400">
            Step into new worlds
          </p>
          <h1 className="text-7xl font-extrabold md:text-9xl bg-gradient-to-r from-purple-400 via-pink-300 to-blue-400 bg-clip-text text-transparent">
            MigoPlay
          </h1>
          <p className="mt-6 text-xl text-gray-400 max-w-lg mx-auto">
            AI-generated stories from beyond imagination
          </p>
          <Link
            href="/browse"
            className="mt-10 inline-flex rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-10 py-4 font-semibold text-white shadow-[0_0_30px_rgba(168,85,247,0.5)] transition hover:shadow-[0_0_50px_rgba(168,85,247,0.7)] hover:scale-105"
          >
            Enter the Portal →
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#060818]">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={featuredVideo.thumbnail_url}
          alt={featuredVideo.title}
          className="h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(88,28,135,0.4)_0%,_#060818_70%)]" />
      </div>

      {/* Portal rings */}
      <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-purple-500/20 shadow-[0_0_80px_rgba(168,85,247,0.15)] hidden xl:block" />
      <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[380px] h-[380px] rounded-full border border-pink-500/15 hidden xl:block" />
      <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[260px] h-[260px] rounded-full border border-blue-500/20 hidden xl:block" />

      {/* Thumbnail inside portal */}
      <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[230px] h-[230px] rounded-full overflow-hidden hidden xl:block shadow-[0_0_60px_rgba(168,85,247,0.4)]">
        <img
          src={featuredVideo.thumbnail_url}
          alt={featuredVideo.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 rounded-full border-2 border-purple-400/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col justify-center px-8 md:px-16 max-w-3xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-purple-400">
          Now Featuring
        </p>

        <h1 className="text-6xl font-extrabold md:text-8xl leading-none bg-gradient-to-r from-white via-purple-100 to-blue-200 bg-clip-text text-transparent">
          {featuredVideo.title}
        </h1>

        <p className="mt-6 max-w-xl text-lg text-gray-300 leading-relaxed">
          {featuredVideo.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <span className="rounded-full border border-purple-500/30 bg-purple-900/30 px-4 py-1.5 text-sm text-purple-200 backdrop-blur-sm">
            {featuredVideo.genre}
          </span>
          <span className="rounded-full border border-blue-500/30 bg-blue-900/30 px-4 py-1.5 text-sm text-blue-200 capitalize backdrop-blur-sm">
            {featuredVideo.content_type}
          </span>
        </div>

        <div className="mt-10 flex gap-4">
          <Link
            href={`/watch/${featuredVideo.id}`}
            className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-3.5 font-semibold text-white shadow-[0_0_25px_rgba(168,85,247,0.5)] transition hover:shadow-[0_0_40px_rgba(168,85,247,0.7)] hover:scale-105"
          >
            ▶ Watch Now
          </Link>
          <Link
            href={`/watch/${featuredVideo.id}`}
            className="rounded-full border border-white/15 bg-white/5 px-8 py-3.5 font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
          >
            More Info
          </Link>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#060818] to-transparent" />
    </section>
  );
}