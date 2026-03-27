import Link from "next/link";

type Video = {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  genre: string;
  content_type: string;
};

type FeaturedCarouselProps = {
  items: Video[];
};

export default function FeaturedCarousel({
  items,
}: FeaturedCarouselProps) {
  if (items.length === 0) return null;

  return (
    <section className="px-8 py-8">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Featured Picks</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/watch/${item.id}`}
            className="group relative overflow-hidden rounded-2xl bg-zinc-900 transition duration-300 hover:scale-[1.02]"
          >
            <img
              src={item.thumbnail_url}
              alt={item.title}
              className="h-[260px] w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="rounded bg-red-600/80 px-2 py-1 text-xs capitalize text-white">
                  {item.content_type}
                </span>
                <span className="rounded bg-black/70 px-2 py-1 text-xs text-gray-200">
                  {item.genre}
                </span>
              </div>

              <h3 className="text-2xl font-extrabold">{item.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-gray-200">
                {item.description}
              </p>

              <div className="mt-4 inline-flex rounded bg-white px-4 py-2 text-sm font-semibold text-black transition group-hover:bg-gray-200">
                Watch Now
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}