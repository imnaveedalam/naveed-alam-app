import type { Metadata } from "next";
import { Camera } from "lucide-react";
import { loadGalleryPhotos } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photos from Naveed Alam’s motorcycle trips across Pakistan.",
};

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function GalleryPage() {
  const result = await loadGalleryPhotos();

  return (
    <div className="page-shell">
      <p className="kicker inline-flex items-center gap-2">
        <Camera className="h-4 w-4" aria-hidden="true" />
        From the road
      </p>
      <h1 className="page-title">Gallery</h1>
      <p className="lede">
        Frames from the rides across Pakistan — coast roads, high passes, and
        the long miles in between.
      </p>

      {result.status === "missing" ? (
        <p className="panel mt-10 px-6 py-5 text-sm leading-relaxed text-sand-300">
          Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to
          .env.local to load trip photos.
        </p>
      ) : null}

      {result.status === "error" ? (
        <p
          role="alert"
          className="panel mt-10 border-ember-500/50 px-6 py-5 text-sm leading-relaxed text-sand-300"
        >
          The gallery could not be loaded. Confirm the trip-photos bucket and
          gallery_photos table from supabase/schema.sql are set up.
        </p>
      ) : null}

      {result.status === "ready" && result.photos.length === 0 ? (
        <p className="panel mt-10 border-dashed border-sand-400/35 px-6 py-5 text-sm leading-relaxed text-sand-300">
          No trip photos yet. Sign in to Admin and upload the first frame.
        </p>
      ) : null}

      {result.status === "ready" && result.photos.length > 0 ? (
        <ul className="mt-10 columns-1 gap-4 sm:columns-2 sm:gap-5 lg:columns-3">
          {result.photos.map((photo, index) => {
            const tall = index % 5 === 1 || index % 5 === 3;

            return (
              <li key={photo.id} className="mb-4 break-inside-avoid sm:mb-5">
                <figure className="panel panel-hover group overflow-hidden">
                  <div className="overflow-hidden">
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      loading={index < 6 ? "eager" : "lazy"}
                      className={`w-full object-cover transition duration-500 ease-out group-hover:scale-[1.04] ${
                        tall ? "aspect-[3/4]" : "aspect-[4/3]"
                      }`}
                    />
                  </div>
                  {photo.place || photo.caption ? (
                    <figcaption className="border-t border-white/10 px-5 py-4">
                      {photo.place ? (
                        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-ember-400">
                          {photo.place}
                        </p>
                      ) : null}
                      {photo.caption ? (
                        <p
                          className={`text-sm leading-relaxed text-sand-100 ${
                            photo.place ? "mt-2" : ""
                          }`}
                        >
                          {photo.caption}
                        </p>
                      ) : null}
                    </figcaption>
                  ) : null}
                </figure>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
