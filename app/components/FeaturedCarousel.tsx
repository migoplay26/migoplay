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
    <section className="px-8 md:px-16 py-16">
      {/* Section label */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-8 h-px bg-gradient-to-r from-transparent to-purple-500" />
        <p className="text-xs font-bold uppercase tracking-[0.4em] text-purple-400">Open a Portal</p>
        <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent" />
      </div>

      {/* Asymmetric grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Large spotlight card */}
        {items[0] && (
          <Link
            href={`/watch/${items[0].id}`}
            className="group md:col-span-7 relative overflow-hidden rounded-3xl border border-white/5 bg-white/5 min-h-[420px] transition duration-500 hover:border-purple-500/30 hover:shadow-[0_0_60px_rgba(168,85,247,0.2)]"
          >
            <img
              src={items[0].thumbnail_url}
              alt={items[0].title}
              className="absolute inset-0 w-full h-full object-cover opacity-60 transition duration-700 group-hover:scale-105 group-hover:opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060818] via-[#060818]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#060818]/60 to-transparent" />

            {/* Portal hover ring */}
            <div className="absolute top-6 right-6 w-20 h-20 rounded-full border border-purple-400/0 group-hover:border-purple-400/60 transition duration-500 shadow-[0_0_0px_rgba(168,85,247,0)] group-hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]" />

            <div className="absolute bottom-0 left-0 p-8">
              <div className="flex gap-2 mb-3">
                <span className="rounded-full border border-purple-500/40 bg-purple-900/40 px-3 py-1 text-xs text-purple-200 backdrop-blur-sm capitalize">
                  {items[0].content_type}
                </span>
                <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-gray-300 backdrop-blur-sm">
                  {items[0].genre}
                </span>
              </div>
              <h3 className="text-3xl font-extrabold text-white mb-2">{items[0].title}</h3>
              <p className="text-gray-300 text-sm line-clamp-2 max-w-md">{items[0].description}</p>
              <div className="mt-5 inline-flex rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] transition group-hover:shadow-[0_0_35px_rgba(168,85,247,0.6)]">
                ▶ Watch Now
              </div>
            </div>
          </Link>
        )}

        {/* Stacked smaller cards */}
        <div className="md:col-span-5 flex flex-col gap-4">
          {items.slice(1, 3).map((item) => (
            <Link
              key={item.id}
              href={`/watch/${item.id}`}
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 min-h-[196px] transition duration-500 hover:border-purple-500/30 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]"
            >
              <img
                src={item.thumbnail_url}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover opacity-50 transition duration-700 group-hover:scale-105 group-hover:opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#060818]/90 via-[#060818]/50 to-transparent" />

              <div className="absolute inset-0 flex items-end p-6">
                <div>
                  <span className="rounded-full border border-purple-500/30 bg-purple-900/30 px-3 py-1 text-xs text-purple-200 backdrop-blur-sm capitalize mb-2 inline-block">
                    {item.content_type}
                  </span>
                  <h3 className="text-xl font-extrabold text-white">{item.title}</h3>
                  <p className="text-gray-400 text-xs mt-1 line-clamp-1">{item.description}</p>
                </div>
              </div>

              {/* Portal ring */}
              <div className="absolute top-4 right-4 w-12 h-12 rounded-full border border-purple-400/0 group-hover:border-purple-400/50 transition duration-500" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}