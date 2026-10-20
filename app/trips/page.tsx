import type { Metadata } from "next";
import Link from "next/link";
import { Play, Route } from "lucide-react";
import { createSupabaseClient, type TripRow } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Trips",
  description:
    "Motorcycle trips across Pakistan, with routes, distances, and YouTube links.",
};

export const dynamic = "force-dynamic";

function youtubeHref(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    if (url.protocol === "https:" || url.protocol === "http:") {
      return url.toString();
    }
  } catch {
    return null;
  }

  return null;
}

async function loadTrips(): Promise<
  | { status: "ready"; trips: TripRow[] }
  | { status: "missing" }
  | { status: "error" }
> {
  const supabase = createSupabaseClient();

  if (!supabase) {
    return { status: "missing" };
  }

  const { data, error } = await supabase
    .from("trips")
    .select("id, title, route, distance_km, description, youtube_url")
    .order("created_at", { ascending: false });

  if (error) {
    return { status: "error" };
  }

  return { status: "ready", trips: (data ?? []) as TripRow[] };
}

export default async function TripsPage() {
  const result = await loadTrips();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ember-400">
        The road
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-sand-50 sm:text-5xl">
        Trips
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-sand-300">
        Rides from across Pakistan, with the route, the distance, and a YouTube
        link for each.{" "}
        <Link
          href="/distance"
          className="font-medium text-ember-400 hover:text-ember-300"
        >
          Add up the distances
        </Link>
        .
      </p>

      {result.status === "missing" ? (
        <p className="mt-10 rounded-3xl border border-white/10 bg-forest-800 px-6 py-5 text-sm leading-relaxed text-sand-300">
          Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to
          .env.local, then restart the dev server.
        </p>
      ) : null}

      {result.status === "error" ? (
        <p className="mt-10 rounded-3xl border border-white/10 bg-forest-800 px-6 py-5 text-sm leading-relaxed text-sand-300">
          Trips could not be loaded. Check the trips table and the anon key.
        </p>
      ) : null}

      {result.status === "ready" && result.trips.length === 0 ? (
        <p className="mt-10 rounded-3xl border border-white/10 bg-forest-800 px-6 py-5 text-sm leading-relaxed text-sand-300">
          No trips yet. Add a row in the trips table and it will show up here.
        </p>
      ) : null}

      {result.status === "ready" && result.trips.length > 0 ? (
        <ul className="mt-10 grid gap-5 md:grid-cols-2">
          {result.trips.map((trip) => {
            const videoUrl = youtubeHref(trip.youtube_url);

            return (
              <li key={trip.id}>
                <article className="flex h-full flex-col rounded-3xl border border-white/10 bg-forest-800 p-6 sm:p-7">
                  <p className="text-sm font-semibold tracking-wide text-ember-400">
                    {trip.distance_km.toLocaleString("en-PK")} km
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-sand-50">
                    {trip.title}
                  </h2>

                  <p className="mt-4 flex items-start gap-2.5 text-sm text-sand-100">
                    <Route
                      className="mt-0.5 h-4 w-4 shrink-0 text-ember-400"
                      aria-hidden="true"
                    />
                    <span>
                      <span className="sr-only">Route: </span>
                      {trip.route}
                    </span>
                  </p>

                  <p className="mt-4 flex-1 text-sm leading-relaxed text-sand-300">
                    {trip.description}
                  </p>

                  {videoUrl ? (
                    <a
                      href={videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ember-500 px-5 py-3 text-sm font-semibold text-forest-950 transition-colors hover:bg-ember-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-300 sm:w-fit"
                    >
                      <Play className="h-4 w-4" aria-hidden="true" />
                      Watch on YouTube
                    </a>
                  ) : null}
                </article>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
