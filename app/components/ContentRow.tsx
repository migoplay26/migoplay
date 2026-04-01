import Link from "next/link";

type Video = {
  id: number;
  title: string;
  thumbnail_url: string;
  description: string;
  genre?: string;
  content_type?: string;
};

export default function ContentRow({ title, items }: { title: string; items: Video[] }) {
  if (items.length === 0) return null;

  return (
    <section className="px-4 md:px-12 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm md:text-base font-semibold tracking-widest uppercase text-gray-400">{title}</h2>
        <Link href="/browse" className="text-xs text-gray-500 hover:text-white transition tracking-wide">
          See all
        </Link>
      </div>

      <div className="flex gap-2 md:gap-3 overflow-x-auto pb-3 scrollbar-hide">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/watch/${item.id}`}
            className="group relative flex-shrink-0 w-[140px] md:w-[200px] overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:z-10"
          >
            <img
              src={item.thumbnail_url}
              alt={item.title}
              className="h-[200px] md:h-[290px] w-full object-cover transition duration-500 group-hover:brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

            {/* Hover overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition duration-300">
              <h3 className="text-xs md:text-sm font-semibold text-white line-clamp-1 mb-1.5">{item.title}</h3>
              {item.genre && (
                <p className="text-xs text-gray-400 mb-2 hidden md:block">{item.genre}</p>
              )}
              <div className="flex items-center gap-1.5">
                <span className="flex-1 rounded bg-white py-1.5 text-center text-xs font-semibold text-black">
                  Play
                </span>
                {item.content_type && (
                  <span className="rounded border border-white/30 px-2 py-1.5 text-xs text-white capitalize">
                    {item.content_type}
                  </span>
                )}
              </div>
            </div>

            {/* Title always visible at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-2 group-hover:opacity-0 transition duration-300">
              <h3 className="text-xs font-semibold text-white line-clamp-1">{item.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}