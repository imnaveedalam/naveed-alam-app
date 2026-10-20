import type { Metadata } from "next";
import { galleryPhotos } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Placeholder photos from Naveed Alam’s motorcycle trips across Pakistan.",
};

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ember-400">
        From the road
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-sand-50 sm:text-5xl">
        Gallery
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-sand-300">
        Frames from the rides across Pakistan. These are placeholders until the
        trip photos are added.
      </p>

      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {galleryPhotos.map((photo) => (
          <li key={photo.id}>
            <figure className="overflow-hidden rounded-3xl border border-white/10 bg-forest-800">
              <img
                src={photo.src}
                alt={photo.alt}
                className="aspect-[4/3] w-full object-cover"
              />
              <figcaption className="px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ember-400">
                  {photo.place}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-sand-100">
                  {photo.caption}
                </p>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}
