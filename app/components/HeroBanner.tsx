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
      <section className="relative flex h-screen items-center justify-center overflow-hidden bg-[#0a0a0f]">
        {/* Stars background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(80)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 2 + 1 + "px",
                height: Math.random() * 2 + 1 + "px",
                top: Math.random() * 100 + "%",
                left: Math.random() * 100 + "%",
                opacity: Math.random() * 0.7 + 0.1,
              }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(37,99,235,0.2)_0%,_transparent_65%)]" />

        <div className="relative z-10 text-center px-8">
          <div className="mb-6 flex justify-center gap-2">
            {["✦", "✦", "✦"].map((star, i) => (
              <span key={i} className="text-blue-400 text-lg opacity-80">✦</span>
            ))}
          </div>
          <h1 className="text-7xl font-extrabold md:text-9xl text-white drop-shadow-[0_0_40px_rgba(37,99,235,0.6)]">
            MigoPlay
          </h1>
          <p className="mt-5 text-xl text-gray-300 max-w-lg mx-auto font-light tracking-wide">
            Where stories come to life
          </p>
          <Link
            href="/browse"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-blue-600 px-10 py-4 font-bold text-white shadow-[0_0_30px_rgba(37,99,235,0.6)] transition hover:bg-blue-500 hover:shadow-[0_0_50px_rgba(37,99,235,0.8)] hover:scale-105"
          >
            ▶ Start Watching
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative flex min-h-screen items-end overflow-hidden bg-[#0a0a0f]">
      {/* Background */}
      <img
        src={featuredVideo.thumbnail_url}
        alt={featuredVideo.title}
        className="absolute inset-0 h-full w-full object-cover opacity-45"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/20 to-transparent" />

      {/* Blue glow */}
      <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-blue-600/10 blur-[120px]" />

      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: "1.5px",
              height: "1.5px",
              top: Math.random() * 60 + "%",
              left: Math.random() * 100 + "%",
              opacity: Math.random() * 0.5 + 0.1,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-3xl px-8 md:px-16 pb-24 pt-32">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px w-8 bg-blue-500" />
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-400">
            Featured {featuredVideo.content_type}
          </p>
        </div>

        <h1 className="mb-5 text-6xl font-extrabold leading-none text-white md:text-8xl drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)]">
          {featuredVideo.title}
        </h1>

        <p className="mb-6 max-w-xl text-lg text-gray-300 leading-relaxed">
          {featuredVideo.description}
        </p>

        <div className="mb-8 flex flex-wrap gap-3">
          <span className="rounded-full border border-blue-500/40 bg-blue-950/60 px-4 py-1.5 text-sm text-blue-200 backdrop-blur-sm">
            {featuredVideo.genre}
          </span>
          <span className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm text-gray-200 capitalize backdrop-blur-sm">
            {featuredVideo.content_type}
          </span>
        </div>

        <div className="flex gap-4">
          <Link
            href={`/watch/${featuredVideo.id}`}
            className="flex items-center gap-2 rounded-full bg-white px-8 py-3.5 font-bold text-black transition hover:bg-gray-100 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105"
          >
            ▶ Play
          </Link>
          <Link
            href={`/watch/${featuredVideo.id}`}
            className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-3.5 font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 hover:border-white/50"
          >
            ⓘ More Info
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
    </section>
  );
}