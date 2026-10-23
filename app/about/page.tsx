import type { Metadata } from "next";
import Link from "next/link";
import { MapPinned, Motorbike, Route } from "lucide-react";
import { loadGalleryAlbums } from "@/lib/gallery";
import { socialHandle, socialLinks } from "@/lib/site";
import { SocialIcon } from "@/components/social-icon";

export const metadata: Metadata = {
  title: "About",
  description:
    "Naveed Alam (@inaveedalam) is a motorcycle traveler documenting roads across Pakistan — from the Makran coast to the Karakoram.",
  openGraph: {
    title: "About · Naveed Alam",
    description:
      "Meet Naveed Alam — motorcycle traveler documenting Pakistan from the Makran coast to the Karakoram.",
  },
};

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const journeyBeats = [
  {
    title: "The south",
    detail:
      "Makran Coastal Highway — heat, empty horizon, and the Arabian Sea running beside the bike toward Gwadar.",
  },
  {
    title: "The plains",
    detail:
      "Punjab and Sindh — long straight miles, river towns, farmland, and the quiet stretch between cities.",
  },
  {
    title: "The north",
    detail:
      "Karakoram Highway, Neelum Valley, Lowari to Chitral — cold air, mountain walls, and roads that ask for patience.",
  },
] as const;

export default async function AboutPage() {
  const gallery = await loadGalleryAlbums();
  const previewAlbums =
    gallery.status === "ready" ? gallery.albums.slice(0, 3) : [];

  return (
    <div className="page-shell">
      <p className="kicker inline-flex items-center gap-2">
        <Motorbike className="h-4 w-4" aria-hidden="true" />
        The traveler
      </p>
      <h1 className="page-title max-w-3xl">About Naveed Alam</h1>
      <p className="mt-6 max-w-2xl border-l-2 border-ember-500 pl-4 text-lg leading-relaxed text-sand-100 sm:pl-5">
        Motorcycle traveler. Road storyteller. Three years of Pakistan on two
        wheels — under the handle {socialHandle}.
      </p>

      <div className="mt-9 max-w-2xl space-y-5 text-base leading-relaxed text-sand-300">
        <p>
          Naveed Alam did not set out to collect famous viewpoints. He set out
          to ride. The bike became the way he reads Pakistan: not as a map of
          destinations, but as a chain of roads — some crowded, some empty, all
          of them honest about weather, distance, and time.
        </p>
        <p>
          Over the last three years those rides have crossed Balochistan, Sindh,
          Punjab, Khyber Pakhtunkhwa, Azad Kashmir, and Gilgit Baltistan. There
          is no single grand tour. There are seasons chosen carefully, nights
          planned loosely, and mornings that begin before the sun hits the
          asphalt.
        </p>
        <p>
          On the Makran coast the road stays close to the sea and the desert at
          once. Across the plains the miles open wide — Indus towns, farmland,
          and highways that stay straight long enough to quiet the mind. Then
          the country rises. The Karakoram Highway climbs from the lowlands
          toward Khunjerab. Neelum Valley tightens between the river and the
          hills. Lowari Pass drops from Dir into Chitral, where the air thins
          and every corner asks for attention.
        </p>
        <p>
          This website is the logbook of that riding: routes, distances, photo
          albums, and a place to ask about a road before you take it yourself.
          If the journey lives anywhere else, it lives on social under{" "}
          {socialHandle} — same roads, same bike, same long way around.
        </p>
      </div>

      <section className="mt-14 max-w-3xl" aria-labelledby="journey-heading">
        <p className="kicker inline-flex items-center gap-2">
          <Route className="h-3.5 w-3.5" aria-hidden="true" />
          The ride
        </p>
        <h2 id="journey-heading" className="section-title">
          A country in three chapters
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {journeyBeats.map((beat) => (
            <li key={beat.title} className="panel p-5 sm:p-6">
              <p className="font-display text-lg tracking-[0.06em] text-ember-400">
                {beat.title}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-sand-300">
                {beat.detail}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14 max-w-2xl" aria-labelledby="follow-heading">
        <p className="kicker inline-flex items-center gap-2">
          <MapPinned className="h-3.5 w-3.5" aria-hidden="true" />
          Follow the road
        </p>
        <h2 id="follow-heading" className="section-title">
          {socialHandle}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-sand-300">
          Ride clips, trip notes, and the next stretch of highway — on YouTube,
          Instagram, Facebook, TikTok, and WhatsApp.
        </p>
        <ul className="mt-6 flex flex-wrap gap-2.5">
          {socialLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${link.label} ${socialHandle}`}
                className="inline-flex min-h-11 items-center gap-2 border border-white/10 bg-forest-900/80 px-4 py-2.5 text-sm font-semibold text-sand-100 transition duration-200 hover:border-ember-400 hover:text-ember-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-400"
              >
                <SocialIcon name={link.label} />
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row sm:items-center">
        <Link href="/trips" className="btn-ember">
          View trips
        </Link>
        <Link href="/gallery" className="btn-ghost">
          Open the gallery
        </Link>
      </div>

      {previewAlbums.length > 0 ? (
        <section
          className="mt-16 sm:mt-20"
          aria-labelledby="about-gallery-heading"
        >
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
            {previewAlbums.map((album) => (
              <li key={album.id}>
                <Link
                  href={`/gallery/${album.id}`}
                  className="panel panel-hover group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-400"
                >
                  <span className="block overflow-hidden">
                    <img
                      src={album.coverSrc}
                      alt={`${album.title} cover`}
                      className="aspect-[4/3] w-full object-cover transition duration-500 ease-out group-hover:scale-[1.05]"
                    />
                  </span>
                  <span className="block border-t border-white/10 px-4 py-4">
                    <span className="block font-display text-lg tracking-[0.04em] text-sand-50">
                      {album.title}
                    </span>
                    {album.place ? (
                      <span className="mt-1 block text-sm text-sand-300">
                        {album.place}
                      </span>
                    ) : null}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
