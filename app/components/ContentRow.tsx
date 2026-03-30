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
    <section className="px-8 md:px-16 py-10">
      {/* Section header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
        <h2 className="text-lg font-bold tracking-wide text-white">{title}</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-purple-500/20 to-transparent" />
      </div>

      {/* Mosaic-style varying card sizes */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 auto-rows-[180px]">
        {items.map((item, index) => {
          // Every 7th item is wide, every 5th is tall
          const isWide = index % 7 === 0;
          const isTall = index % 5 === 0 && !isWide;
          const colSpan = isWide ? "col-span-2" : "col-span-1";
          const rowSpan = isTall ? "row-span-2" : "row-span-1";

          return (
            <Link
              key={item.id}
              href={`/watch/${item.id}`}
              className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 transition duration-300 hover:border-purple-500/30 hover:shadow-[0_0_25px_rgba(168,85,247,0.2)] ${colSpan} ${rowSpan}`}
            >
              <img
                src={item.thumbnail_url}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover opacity-60 transition duration-500 group-hover:scale-105 group-hover:opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060818] via-transparent to-transparent" />

              {/* Portal ring on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                <div className="w-14 h-14 rounded-full border-2 border-purple-400/50 shadow-[0_0_20px_rgba(168,85,247,0.4)]" />
                <div className="absolute w-9 h-9 rounded-full border border-pink-400/30" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-3">
                {item.genre && (
                  <span className="rounded-full bg-black/50 border border-white/10 px-2 py-0.5 text-xs text-gray-300 backdrop-blur-sm mb-1 inline-block">
                    {item.genre}
                  </span>
                )}
                <h3 className="text-sm font-bold text-white line-clamp-1">{item.title}</h3>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}