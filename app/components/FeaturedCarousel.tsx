import Link from "next/link";

type Video = {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  genre: string;
  content_type: string;
};

export default function FeaturedCarousel({ items }: { items: Video[] }) {
  if (items.length === 0) return null;

  return (
    <section className="px-8 py-10">
      {/* Section header */}
      <div className="mb-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-purple-500/50 to-transparent" />
        <h2 className="text-xl font-bold tracking-widest uppercase text-purple-300">
          Featured Picks
        </h2>
        <div className="h-px flex-1 bg-gradient-to-l from-purple-500/50 to-transparent" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => (
          <Link
            key={item.id}
            href={`/watch/${item.id}`}
            className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm transition duration-300 hover:scale-[1.02] hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]"
          >
            <div className="relative overflow-hidden">
              <img
                src={item.thumbnail_url}
                alt={item.title}
                className="h-[240px] w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060818] via-[#060818]/50 to-transparent" />

              {/* Portal ring on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                <div className="w-20 h-20 rounded-full border-2 border-purple-400/60 shadow-[0_0_30px_rgba(168,85,247,0.5)]" />
                <div className="absolute w-14 h-14 rounded-full border border-pink-400/40" />
              </div>
            </div>

            <div className="p-5">
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-purple-500/30 bg-purple-900/30 px-3 py-1 text-xs text-purple-200 capitalize">
                  {item.content_type}
                </span>
                <span className="rounded-full border border-blue-500/20 bg-blue-900/20 px-3 py-1 text-xs text-blue-200">
                  {item.genre}
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-white">{item.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-gray-400 group-hover:text-gray-300 transition">
                {item.description}
              </p>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600/80 to-blue-600/80 px-5 py-2 text-sm font-semibold text-white shadow-[0_0_15px_rgba(168,85,247,0.3)] transition group-hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]">
                ▶ Watch Now
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}