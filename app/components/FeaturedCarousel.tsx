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
    <section className="px-6 md:px-12 py-12">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-blue-400 text-xs">✦</span>
        <h2 className="text-xl font-bold text-white tracking-wide">Featured Now</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Big spotlight */}
        {items[0] && (
          <Link
            href={`/watch/${items[0].id}`}
            className="group md:col-span-7 relative overflow-hidden rounded-2xl min-h-[400px] transition-all duration-500 hover:shadow-[0_0_50px_rgba(37,99,235,0.25)]"
          >
            <img
              src={items[0].thumbnail_url}
              alt={items[0].title}
              className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

            {/* White glow on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.05)_0%,_transparent_70%)]" />

            <div className="absolute bottom-0 left-0 p-7">
              <div className="flex gap-2 mb-3">
                <span className="rounded-full bg-blue-600/80 px-3 py-1 text-xs font-semibold text-white capitalize backdrop-blur-sm">
                  {items[0].content_type}
                </span>
                <span className="rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs text-gray-300 backdrop-blur-sm">
                  {items[0].genre}
                </span>
              </div>
              <h3 className="text-3xl font-extrabold text-white mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {items[0].title}
              </h3>
              <p className="text-gray-300 text-sm line-clamp-2 max-w-md">{items[0].description}</p>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-black transition group-hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                ▶ Watch Now
              </div>
            </div>
          </Link>
        )}

        {/* Stacked cards */}
        <div className="md:col-span-5 flex flex-col gap-4">
          {items.slice(1, 3).map((item) => (
            <Link
              key={item.id}
              href={`/watch/${item.id}`}
              className="group relative overflow-hidden rounded-2xl min-h-[188px] transition-all duration-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.2)]"
            >
              <img
                src={item.thumbnail_url}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(ellipse_at_left,_rgba(37,99,235,0.15)_0%,_transparent_70%)]" />

              <div className="absolute inset-0 flex items-end p-5">
                <div>
                  <span className="rounded-full bg-blue-600/70 px-3 py-1 text-xs font-semibold text-white capitalize backdrop-blur-sm mb-2 inline-block">
                    {item.content_type}
                  </span>
                  <h3 className="text-xl font-extrabold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-xs mt-1 line-clamp-1">{item.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}