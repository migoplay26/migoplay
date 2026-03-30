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
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-base md:text-lg font-bold text-white">{title}</h2>
        <Link href="/browse" className="text-xs md:text-sm text-blue-400 hover:text-blue-300 transition ml-auto">
          See all →
        </Link>
      </div>

      <div className="flex gap-2 md:gap-3 overflow-x-auto pb-3 scrollbar-hide">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/watch/${item.id}`}
            className="group relative flex-shrink-0 w-[140px] md:w-[200px] overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(37,99,235,0.3)] hover:z-10"
          >
            <img
              src={item.thumbnail_url}
              alt={item.title}
              className="h-[200px] md:h-[290px] w-full object-cover transition duration-500 group-hover:brightness-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-t from-blue-900/40 via-transparent to-white/5" />

            {item.content_type && (
              <div className="absolute top-2 right-2 rounded-full bg-blue-600/80 px-2 py-0.5 text-xs font-semibold text-white capitalize backdrop-blur-sm opacity-0 group-hover:opacity-100 transition duration-300">
                {item.content_type}
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3">
              <div className="bg-black/80 backdrop-blur-sm rounded-lg p-2">
                <h3 className="text-xs md:text-sm font-bold text-white line-clamp-1">{item.title}</h3>
                {item.genre && (
                  <p className="text-xs text-gray-400 mt-0.5 hidden md:block">{item.genre}</p>
                )}
                <div className="mt-1.5 md:mt-2">
                  <span className="block w-full rounded-full bg-white py-1 text-center text-xs font-bold text-black">
                    ▶ Play
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}