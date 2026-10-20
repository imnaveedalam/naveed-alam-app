import type { Metadata } from "next";
import { galleryPhotos } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Placeholder photos from Naveed Alam’s motorcycle trips across Pakistan.",
};

export default function GalleryPage() {
  return (
    <div className="page-shell">
      <p className="kicker">From the road</p>
      <h1 className="page-title">Gallery</h1>
      <p className="lede">
        Frames from the rides across Pakistan. These are placeholders until the
        trip photos are added.
      </p>

      <ul className="mt-10 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {galleryPhotos.map((photo) => (
          <li key={photo.id} className="panel panel-hover group overflow-hidden">
            <figure>
              <div className="overflow-hidden">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="aspect-[4/3] w-full object-cover transition duration-500 ease-out group-hover:scale-[1.05]"
                />
              </div>
              <figcaption className="border-t border-white/10 px-5 py-5">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-ember-400">
                  {photo.place}
                </p>
                <p className="mt-2.5 text-sm leading-relaxed text-sand-100">
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
