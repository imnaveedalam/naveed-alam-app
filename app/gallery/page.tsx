import type { Metadata } from "next";
import Link from "next/link";
import { Camera, Images } from "lucide-react";
import { loadGalleryAlbums } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photo albums from Naveed Alam’s motorcycle trips across Pakistan.",
  openGraph: {
    title: "Gallery · Naveed Alam",
    description:
      "Trip albums from Pakistan — covers and frames from the road.",
  },
};

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function GalleryPage() {
  const result = await loadGalleryAlbums();

  return (
    <div className="page-shell">
      <p className="kicker">
        <Camera className="h-4 w-4" aria-hidden="true" />
        From the road
      </p>
      <h1 className="page-title">Gallery</h1>
      <p className="lede">
        Trip albums from Pakistan — open a cover to see every frame from that
        ride.
      </p>

      {result.status === "missing" ? (
        <p className="panel mt-10 px-6 py-5 text-sm leading-relaxed text-sand-300">
          Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to
          .env.local to load albums.
        </p>
      ) : null}

      {result.status === "error" ? (
        <p
          role="alert"
          className="panel mt-10 border-ember-500/50 px-6 py-5 text-sm leading-relaxed text-sand-300"
        >
          Could not load albums. Run supabase/trip-photos.sql so gallery_albums
          and gallery_photos exist, then try again.
        </p>
      ) : null}

      {result.status === "ready" && result.albums.length === 0 ? (
        <p className="panel mt-10 border-dashed border-sand-400/35 px-6 py-5 text-sm leading-relaxed text-sand-300">
          No albums yet. Sign in to Admin and upload the first album.
        </p>
      ) : null}

      {result.status === "ready" && result.albums.length > 0 ? (
        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {result.albums.map((album, index) => (
            <li key={album.id}>
              <Link
                href={`/gallery/${album.id}`}
                className="group relative flex h-full flex-col overflow-visible rounded-sm border border-white/10 border-l-[3px] border-l-ember-500 bg-forest-800/95 shadow-card transition-[border-color,box-shadow] duration-300 hover:border-ember-400 hover:border-l-ember-400 hover:shadow-lift focus-visible:border-ember-400 focus-visible:border-l-ember-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-400"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-[1px]">
                  <img
                    src={album.coverSrc}
                    alt={`${album.title} cover`}
                    loading={index < 6 ? "eager" : "lazy"}
                    decoding="async"
                    className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-110"
                  />
                  <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 bg-forest-950/80 px-2.5 py-1 font-display text-[0.65rem] tracking-[0.16em] text-sand-50 backdrop-blur-sm">
                    <Images
                      className="h-3.5 w-3.5 text-ember-400"
                      aria-hidden="true"
                    />
                    {album.photoCount}{" "}
                    {album.photoCount === 1 ? "photo" : "photos"}
                  </span>
                </div>
                <div className="h-0.5 w-full bg-gradient-to-r from-flame-500 via-ember-500 to-ember-400" />
                <div className="px-5 py-4">
                  {album.place ? (
                    <p className="font-display text-[0.72rem] tracking-[0.22em] text-ember-400">
                      {album.place}
                    </p>
                  ) : null}
                  <h2
                    className={`font-display text-2xl tracking-[0.04em] text-sand-50 ${
                      album.place ? "mt-2" : ""
                    }`}
                  >
                    {album.title}
                  </h2>
                  {album.description ? (
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-sand-300">
                      {album.description}
                    </p>
                  ) : null}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
