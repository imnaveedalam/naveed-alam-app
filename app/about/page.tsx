import type { Metadata } from "next";
import Link from "next/link";
import { galleryPhotos } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "About",
  description:
    "Naveed Alam rides a motorcycle across Pakistan, through Balochistan, Sindh, Punjab, KPK, Azad Kashmir, and Gilgit Baltistan.",
};

const previewPhotos = galleryPhotos.slice(0, 3);

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ember-400">
        The traveler
      </p>
      <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-sand-50 sm:text-5xl">
        About Naveed Alam
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-sand-100">
        A motorcycle traveler who has spent the last three years riding across
        Pakistan.
      </p>

      <div className="mt-8 max-w-2xl space-y-4 text-base leading-relaxed text-sand-300">
        <p>
          The bike is how Naveed Alam sees the country. Not the fast way
          through it, and not only the famous viewpoints. The point is the road
          itself: heat on the coastal highway, dust on the plains, and cold air
          once the passes start to climb.
        </p>
        <p>
          In three years those rides have covered Balochistan, Sindh, Punjab,
          Khyber Pakhtunkhwa, Azad Kashmir, and Gilgit Baltistan. The map is
          not a single loop. It is a set of roads taken when the season, the
          bike, and the route lined up.
        </p>
        <p>
          In the south, the Makran coast runs from Karachi toward Gwadar, a
          long desert road beside the Arabian Sea. Across Punjab and Sindh the
          miles open up: farmland, river towns, and highways that stay straight
          for a long time. Farther north the road changes. The Karakoram
          Highway climbs from Hassan Abdal toward Khunjerab Pass. Neelum Valley
          narrows between Muzaffarabad and Kel. Lowari Pass crosses from Dir
          into Chitral.
        </p>
        <p>
          This site keeps the record of that riding. The trips, the distances,
          and a place to ask about a road before you take it yourself.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/trips"
          className="inline-flex items-center justify-center rounded-full bg-ember-500 px-5 py-3 text-sm font-semibold text-forest-950 transition-colors hover:bg-ember-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-300"
        >
          View trips
        </Link>
        <Link
          href="/gallery"
          className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-sand-50 transition-colors hover:border-ember-500 hover:text-ember-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-400"
        >
          Open the gallery
        </Link>
      </div>

      <section className="mt-16" aria-labelledby="about-gallery-heading">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ember-400">
              From the road
            </p>
            <h2
              id="about-gallery-heading"
              className="mt-3 text-3xl font-semibold tracking-tight text-sand-50"
            >
              Gallery
            </h2>
          </div>
          <Link
            href="/gallery"
            className="shrink-0 text-sm font-medium text-ember-400 hover:text-ember-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-400"
          >
            See all
          </Link>
        </div>

        <ul className="mt-6 grid gap-4 sm:grid-cols-3">
          {previewPhotos.map((photo) => (
            <li key={photo.id}>
              <Link
                href="/gallery"
                className="group block overflow-hidden rounded-3xl border border-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-400"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <span className="block bg-forest-800 px-4 py-3 text-sm text-sand-100">
                  {photo.place}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
