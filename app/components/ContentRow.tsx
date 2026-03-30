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
  return (
    <section className="px-8 py-6">
      {/* Section header with light trail */}
      <div className="mb-5 flex items-center gap-4">
        <div className="w-1 h-6 rounded-full bg-gradient-to-b from-purple-400 to-blue-500 shadow-[0_0_10px_rgba(168,85,247,0.6)]" />
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-purple-500/30 to-transparent" />
      </div>

      {items.length === 0 ? (
        <p className="text-gray-500 italic">No content available yet.</p>
      ) : (
        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative min-w-[210px] max-w-[210px] overflow-visible"
            >
              <div className="overflow-hidden rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm transition duration-300 group-hover:scale-[1.05] group-hover:border-purple-500/30 group-hover:shadow-[0_0_25px_rgba(168,85,247,0.2)]">
                <Link href={`/watch/${item.id}`}>
                  <div className="relative overflow-hidden">
                    <img
                      src={item.thumbnail_url}
                      alt={item.title}
                      className="h-[300px] w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060818] via-[#060818]/20 to-transparent opacity-80" />

                    {/* Portal ring on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                      <div className="w-16 h-16 rounded-full border-2 border-purple-400/60 shadow-[0_0_25px_rgba(168,85,247,0.5)]" />
                      <div className="absolute w-10 h-10 rounded-full border border-pink-400/40" />
                    </div>

                    <div className="absolute bottom-3 left-3 flex gap-2">
                      {item.genre && (
                        <span className="rounded-full bg-black/50 border border-white/10 px-2 py-1 text-xs text-gray-200 backdrop-blur-sm">
                          {item.genre}
                        </span>
                      )}
                      {item.content_type && (
                        <span className="rounded-full bg-purple-900/60 border border-purple-500/30 px-2 py-1 text-xs capitalize text-purple-200 backdrop-blur-sm">
                          {item.content_type}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>

                <div className="p-4">
                  <h3 className="text-base font-bold text-white">{item.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-gray-500 group-hover:text-gray-400 transition">
                    {item.description}
                  </p>

                  <div className="mt-3 hidden gap-2 group-hover:flex">
                    <Link
                      href={`/watch/${item.id}`}
                      className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_0_10px_rgba(168,85,247,0.4)] transition hover:shadow-[0_0_20px_rgba(168,85,247,0.6)]"
                    >
                      ▶ Play
                    </Link>
                    <Link
                      href={`/watch/${item.id}`}
                      className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                    >
                      Info
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}