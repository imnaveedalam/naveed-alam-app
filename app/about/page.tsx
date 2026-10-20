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
    <div className="page-shell">
      <p className="kicker">The traveler</p>
      <h1 className="page-title max-w-3xl">About Naveed Alam</h1>
      <p className="mt-6 max-w-2xl border-l-2 border-ember-500 pl-4 text-lg leading-relaxed text-sand-100 sm:pl-5">
        A motorcycle traveler who has spent the last three years riding across
        Pakistan.
      </p>

      <div className="mt-9 max-w-2xl space-y-5 text-base leading-relaxed text-sand-300">
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

      <div className="mt-9 flex max-w-2xl flex-col gap-3 sm:flex-row sm:items-center">
        <Link href="/trips" className="btn-ember">
          View trips
        </Link>
        <Link href="/gallery" className="btn-ghost">
          Open the gallery
        </Link>
      </div>

      <section className="mt-16 sm:mt-20" aria-labelledby="about-gallery-heading">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="kicker">From the road</p>
            <h2 id="about-gallery-heading" className="section-title">
              Gallery
            </h2>
          </div>
          <Link href="/gallery" className="text-link w-fit text-sm">
            See all
          </Link>
        </div>

        <ul className="mt-7 grid gap-4 sm:grid-cols-3 sm:gap-5">
          {previewPhotos.map((photo) => (
            <li key={photo.id}>
              <Link
                href="/gallery"
                className="panel panel-hover group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-400"
              >
                <span className="block overflow-hidden rounded-t-2xl">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="aspect-[4/3] w-full object-cover transition duration-500 ease-out group-hover:scale-[1.05]"
                  />
                </span>
                <span className="block border-t border-white/10 px-4 py-4 text-sm font-medium text-sand-100">
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
