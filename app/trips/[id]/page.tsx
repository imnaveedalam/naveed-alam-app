import type { Metadata } from "next";
import nextDynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPinned, Motorbike, Play, Route } from "lucide-react";
import { routeStops } from "@/lib/places";
import { createSupabaseClient, type TripRow } from "@/lib/supabase";
import { youtubeEmbedSrc, youtubeHref } from "@/lib/youtube";

const TripMap = nextDynamic(
  () => import("@/components/trip-map").then((module) => module.TripMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[280px] items-center justify-center bg-forest-900 text-sm text-sand-300 sm:h-[420px]">
        Loading map…
      </div>
    ),
  },
);

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

type TripPageProps = {
  params: { id: string };
};

async function loadTrip(id: string): Promise<TripRow | null> {
  const supabase = createSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("trips")
    .select("id, title, route, distance_km, description, youtube_url")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as TripRow;
}

export async function generateMetadata({
  params,
}: TripPageProps): Promise<Metadata> {
  const trip = await loadTrip(params.id);

  if (!trip) {
    return { title: "Trip" };
  }

  const description =
    trip.description.slice(0, 155) ||
    `${trip.route} · ${Number(trip.distance_km).toLocaleString("en-PK")} km`;

  return {
    title: trip.title,
    description,
    openGraph: {
      title: `${trip.title} · Naveed Alam`,
      description,
    },
  };
}

export default async function TripDetailPage({ params }: TripPageProps) {
  const trip = await loadTrip(params.id);

  if (!trip) {
    notFound();
  }

  const videoUrl = youtubeHref(trip.youtube_url);
  const embedSrc = youtubeEmbedSrc(trip.youtube_url);
  const stops = routeStops(trip.route);
  const points = stops
    .map((stop) => stop.point)
    .filter((point): point is [number, number] => point !== null);
  const mapReady = points.length >= 2;

  return (
    <div className="page-shell">
      <Link
        href="/trips"
        className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-sand-300 transition-colors duration-200 hover:text-ember-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-400"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        All trips
      </Link>

      <p className="kicker mt-8 inline-flex items-center gap-2">
        <Motorbike className="h-4 w-4" aria-hidden="true" />
        Trip
      </p>
      <h1 className="page-title max-w-4xl">{trip.title}</h1>

      <div className="mt-6 flex flex-wrap gap-3">
        <p className="chip">
          <Route className="h-3.5 w-3.5" aria-hidden="true" />
          {Number(trip.distance_km).toLocaleString("en-PK")} km
        </p>
        <p className="inline-flex min-h-9 max-w-full items-center gap-2 border border-white/10 bg-forest-900/70 px-3 py-1.5 text-sm text-sand-100">
          <MapPinned className="h-3.5 w-3.5 shrink-0 text-ember-400" aria-hidden="true" />
          <span className="min-w-0 break-words">{trip.route}</span>
        </p>
      </div>

      <p className="mt-8 max-w-3xl text-base leading-relaxed text-sand-300 sm:text-lg">
        {trip.description}
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {videoUrl ? (
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ember"
          >
            <Play className="h-4 w-4" aria-hidden="true" />
            Watch on YouTube
          </a>
        ) : null}
        <Link href="/distance" className="btn-ghost">
          Distance calculator
        </Link>
        <Link href="/ask-question" className="btn-ghost">
          Ask about this road
        </Link>
      </div>

      {embedSrc ? (
        <section className="mt-12" aria-labelledby="trip-video-heading">
          <h2 id="trip-video-heading" className="section-title">
            Ride video
          </h2>
          <div className="panel mt-5 overflow-hidden p-0">
            <div className="aspect-video w-full bg-forest-950">
              <iframe
                src={embedSrc}
                title={`${trip.title} on YouTube`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>
        </section>
      ) : null}

      <section className="mt-12" aria-labelledby="trip-map-heading">
        <h2 id="trip-map-heading" className="section-title">
          Route map
        </h2>
        <div className="panel relative z-0 mt-5 min-w-0 overflow-hidden">
          {mapReady ? (
            <TripMap
              lines={[
                {
                  id: trip.id,
                  title: trip.title,
                  points,
                },
              ]}
            />
          ) : (
            <div className="flex h-[240px] items-center justify-center px-5 text-center text-sm text-sand-300 sm:h-[320px]">
              This route is not drawn on the map yet. Stored distance is still{" "}
              {Number(trip.distance_km).toLocaleString("en-PK")} km.
            </div>
          )}
          {mapReady ? (
            <p className="border-t border-white/10 px-4 py-4 text-sm text-sand-300 sm:px-5">
              Stops: {stops.map((stop) => stop.name).join(" → ")}
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
