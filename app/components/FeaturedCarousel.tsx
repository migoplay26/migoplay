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
    <section className="px-4 md:px-12 py-8">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-6">
        Featured Now
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
        {items[0] && (
          <Link
            href={`/watch/${items[0].id}`}
            className="group md:col-span-7 relative overflow-hidden rounded-lg min-h-[240px] md:min-h-[400px] transition-all duration-500 hover:shadow-[0_8px_40px_rgba(0,0,0,0.7)]"
          >
            <img
              src={items[0].thumbnail_url}
              alt={items[0].title}
              className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105 group-hover:brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

            <div className="absolute bottom-0 left-0 p-5 md:p-7">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">
                {items[0].content_type} — {items[0].genre}
              </p>
              <h3 className="text-xl md:text-3xl font-bold text-white mb-3 tracking-tight">
                {items[0].title}
              </h3>
              <p className="text-gray-400 text-xs md:text-sm line-clamp-2 max-w-md hidden md:block mb-4">
                {items[0].description}
              </p>
              <div className="inline-flex items-center gap-2 rounded bg-white px-5 py-2.5 text-xs md:text-sm font-semibold text-black transition group-hover:bg-gray-100">
                Play
              </div>
            </div>
          </Link>
        )}

        <div className="md:col-span-5 grid grid-cols-2 md:grid-cols-1 gap-3">
          {items.slice(1, 3).map((item) => (
            <Link
              key={item.id}
              href={`/watch/${item.id}`}
              className="group relative overflow-hidden rounded-lg min-h-[130px] md:min-h-[188px] transition-all duration-500 hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
            >
              <img
                src={item.thumbnail_url}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105 group-hover:brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex items-end p-3 md:p-5">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1 hidden md:block">
                    {item.content_type}
                  </p>
                  <h3 className="text-sm md:text-lg font-bold text-white tracking-tight line-clamp-1">
                    {item.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}