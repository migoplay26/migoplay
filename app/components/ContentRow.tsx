import Link from "next/link";

type Video = {
  id: number;
  title: string;
  thumbnail_url: string;
  description: string;
  genre?: string;
  content_type?: string;
};

type ContentRowProps = {
  title: string;
  items: Video[];
};

export default function ContentRow({ title, items }: ContentRowProps) {
  return (
    <section className="px-8 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-400">No content available yet.</p>
      ) : (
        <div className="flex gap-5 overflow-x-auto pb-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative min-w-[230px] max-w-[230px] overflow-visible"
            >
              <div className="overflow-hidden rounded-xl bg-zinc-900 transition duration-300 group-hover:scale-[1.05] group-hover:shadow-2xl group-hover:shadow-black/60">
                <Link href={`/watch/${item.id}`}>
                  <div className="relative">
                    <img
                      src={item.thumbnail_url}
                      alt={item.title}
                      className="h-[320px] w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

                    <div className="absolute bottom-3 left-3 flex gap-2">
                      {item.genre && (
                        <span className="rounded bg-black/70 px-2 py-1 text-xs text-gray-200">
                          {item.genre}
                        </span>
                      )}
                      {item.content_type && (
                        <span className="rounded bg-red-600/80 px-2 py-1 text-xs capitalize text-white">
                          {item.content_type}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>

                <div className="p-4">
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-gray-400 transition group-hover:text-gray-300">
                    {item.description}
                  </p>

                  <div className="mt-4 hidden gap-2 group-hover:flex">
                    <Link
                      href={`/watch/${item.id}`}
                      className="rounded bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-gray-200"
                    >
                      ▶ Play
                    </Link>
                    <Link
                      href={`/watch/${item.id}`}
                      className="rounded bg-zinc-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-zinc-600"
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