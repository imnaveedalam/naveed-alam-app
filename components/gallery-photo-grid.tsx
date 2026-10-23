"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type GalleryGridPhoto = {
  id: string;
  src: string;
  alt: string;
  title?: string;
};

type GalleryPhotoGridProps = {
  photos: GalleryGridPhoto[];
  fallbackTitle?: string;
};

export function GalleryPhotoGrid({
  photos,
  fallbackTitle = "Trip photo",
}: GalleryPhotoGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const activePhoto =
    activeIndex === null ? null : photos[activeIndex] ?? null;

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveIndex(null);
        return;
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === null
            ? null
            : (current - 1 + photos.length) % photos.length,
        );
        return;
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((current) =>
          current === null ? null : (current + 1) % photos.length,
        );
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, photos.length]);

  if (photos.length === 0) {
    return null;
  }

  return (
    <>
      <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {photos.map((photo, index) => (
          <li key={photo.id}>
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              className="panel panel-hover group block w-full overflow-hidden text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-400"
              aria-label={`Open ${photo.title || photo.alt}`}
            >
              <span className="block aspect-square overflow-hidden bg-forest-900">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading={index < 8 ? "eager" : "lazy"}
                  decoding="async"
                  className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
                />
              </span>
            </button>
          </li>
        ))}
      </ul>

      {activePhoto && activeIndex !== null ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-forest-950/92 p-3 backdrop-blur-sm sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={() => setActiveIndex(null)}
        >
          <button
            type="button"
            className="absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center border border-white/15 bg-forest-900/90 text-sand-50 transition hover:border-ember-400 hover:text-ember-300 sm:right-5 sm:top-5"
            aria-label="Close photo"
            onClick={() => setActiveIndex(null)}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>

          {photos.length > 1 ? (
            <>
              <button
                type="button"
                className="absolute left-2 top-1/2 z-[1] inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/15 bg-forest-900/90 text-sand-50 transition hover:border-ember-400 hover:text-ember-300 sm:left-5"
                aria-label="Previous photo"
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveIndex(
                    (activeIndex - 1 + photos.length) % photos.length,
                  );
                }}
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="absolute right-2 top-1/2 z-[1] inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/15 bg-forest-900/90 text-sand-50 transition hover:border-ember-400 hover:text-ember-300 sm:right-5"
                aria-label="Next photo"
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveIndex((activeIndex + 1) % photos.length);
                }}
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </>
          ) : null}

          <figure
            className="relative flex max-h-[min(88vh,920px)] w-full max-w-5xl flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative flex max-h-[min(78vh,820px)] w-full items-center justify-center overflow-hidden border border-white/10 bg-forest-900">
              <img
                src={activePhoto.src}
                alt={activePhoto.alt}
                className="max-h-[min(78vh,820px)] w-auto max-w-full object-contain"
              />
              <figcaption className="pointer-events-none absolute bottom-4 left-4 max-w-[min(88%,26rem)] text-left sm:bottom-5 sm:left-5">
                <p
                  className="font-display text-lg font-bold uppercase tracking-[0.05em] text-ember-400 sm:text-xl"
                  style={{
                    textShadow:
                      "0 2px 4px rgba(0,0,0,0.85), 0 8px 24px rgba(0,0,0,0.55), 0 0 20px rgba(232,93,4,0.25)",
                  }}
                >
                  {activePhoto.title || activePhoto.alt || fallbackTitle}
                </p>
              </figcaption>
            </div>
          </figure>
        </div>
      ) : null}
    </>
  );
}
